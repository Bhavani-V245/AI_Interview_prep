import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Square, Loader2, Brain, CheckCircle2, RefreshCcw, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const DEFAULT_QUESTIONS = [
  "Tell me about a complex project you've worked on recently.",
  "What is your approach to resolving conflict within a team?",
  "Where do you see yourself in five years?",
  "Describe a time you overcame a major technical challenge.",
  "How do you prioritize tasks when working under tight deadlines?"
];

const VoiceInterview = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [questions] = useState(DEFAULT_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const [micSupported, setMicSupported] = useState(true);

  const transcriptRef = useRef('');
  const recognitionRef = useRef(null);

  // ─── Load voices (Chrome loads them async) ───────────────────────────
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesReady(true);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // ─── Check SpeechRecognition support ────────────────────────────────
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicSupported(false);
      toast.error('Voice input requires Chrome or Edge browser.');
    }
  }, []);

  // ─── Create a fresh SpeechRecognition instance each time ─────────────
  const createRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + ' ';
        }
      }
      if (finalText) {
        transcriptRef.current += finalText;
        setTranscript(transcriptRef.current);
      }
    };

    rec.onerror = (event) => {
      setIsListening(false);
      recognitionRef.current = null;
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        toast.error('❌ Microphone blocked! Click the 🔒 icon in your browser address bar → Allow Microphone → Refresh page.');
      } else if (event.error === 'no-speech') {
        toast.info('No speech detected. Please speak and try again.');
      } else if (event.error === 'network') {
        toast.error('Network error. Voice recognition needs internet connection.');
      } else if (event.error === 'aborted') {
        // Normal stop - ignore
      } else {
        toast.error(`Mic error: "${event.error}". Try refreshing.`);
      }
    };

    rec.onend = () => {
      setIsListening(false);
    };

    return rec;
  }, []);

  // ─── Toggle mic on/off ────────────────────────────────────────────────
  const toggleListening = () => {
    if (!micSupported) {
      toast.error('Voice input requires Chrome or Edge browser.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      toast.info('🛑 Recording stopped.');
      return;
    }

    // Always create a fresh instance — Chrome can't reuse a stopped one
    const rec = createRecognition();
    if (!rec) return;

    recognitionRef.current = rec;
    transcriptRef.current = transcript; // Keep existing transcript

    try {
      rec.start();
      setIsListening(true);
      toast.success('🎤 Listening... Speak your answer now!');
    } catch (err) {
      recognitionRef.current = null;
      setIsListening(false);
      toast.error('Could not start microphone. Please allow access and refresh.');
      console.error('Recognition start error:', err);
    }
  };

  // ─── Speak question (with voice load wait) ───────────────────────────
  const speakQuestion = () => {
    if (!window.speechSynthesis) {
      toast.error('Text-to-speech not supported in this browser.');
      return;
    }

    // Cancel anything currently playing
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(questions[currentIdx]);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Pick a good English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v =>
        v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        setIsSpeaking(false);
        if (e.error !== 'interrupted') {
          toast.error('Speaker error. Please check your device volume.');
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    // If voices aren't loaded yet, wait for them
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoicesReady(true);
        speak();
      };
      toast.info('Loading voices...');
    } else {
      speak();
    }
  };

  // ─── Submit answer for AI feedback ──────────────────────────────────
  const submitVoiceAnswer = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }

    const finalAnswer = transcriptRef.current.trim() || transcript.trim();
    if (!finalAnswer) return toast.warning('No answer recorded. Please speak and try again.');

    setLoading(true);
    try {
      const res = await axios.post('/api/interview/feedback', {
        question: questions[currentIdx],
        answer: finalAnswer
      });

      if (!res.data || typeof res.data !== 'object' || res.data.score === undefined) {
        throw new Error('Invalid feedback response from server.');
      }

      setFeedback(res.data);
      toast.success('✅ Analysis complete!');
    } catch (err) {
      console.warn('Feedback API failed, using local analysis:', err);
      const words = finalAnswer.toLowerCase().split(/\s+/);
      const wordCount = words.length;
      const hasTechKeywords = words.some(w => ['because', 'implemented', 'designed', 'result', 'impact', 'led', 'solved', 'built', 'optimized'].includes(w));

      const score = wordCount < 10 ? 4.0 : hasTechKeywords ? 7.5 : 6.0;
      setFeedback({
        score,
        technical_score: Math.max(1, score - 0.5),
        soft_skills_score: Math.min(10, score + 0.5),
        strengths: wordCount < 10 ? 'Attempted to answer the question.' : 'Good attempt with relevant details.',
        areas_for_improvement: 'Use the STAR method: Situation, Task, Action, Result with specific metrics.',
        communication_feedback: 'Structure your answer with clear context and outcome.',
        model_answer: `For "${questions[currentIdx]}" — A great answer covers: (S) the situation/context, (T) your specific role/task, (A) exact steps you took, (R) measurable result achieved.`
      });
      toast.success('Analysis complete (offline mode).');
    } finally {
      setLoading(false);
    }
  };

  // ─── Move to next question ───────────────────────────────────────────
  const nextQuestion = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setTranscript('');
    transcriptRef.current = '';
    setFeedback(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      toast.success('🎉 All questions completed!');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
          <Mic className="text-indigo-500" /> Voice <span className="text-gradient">Interview Mode</span>
        </h1>
        <p className="text-gray-400">Speak naturally and improve your verbal communication skills.</p>
        {!micSupported && (
          <div className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-semibold">
            ⚠️ Voice input requires Chrome or Edge browser for full functionality.
          </div>
        )}
      </div>

      <div className="glass p-8 md:p-10 rounded-[40px] border border-white/10 relative overflow-hidden">
        {/* Listening pulse animation */}
        {isListening && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full animate-ping" />
          </div>
        )}

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm font-bold text-gray-400">
              QUESTION {currentIdx + 1} OF {questions.length}
            </div>
            <button
              onClick={speakQuestion}
              title="Read question aloud"
              className={`p-3 rounded-full transition-all flex items-center gap-2 text-sm font-bold ${
                isSpeaking
                  ? 'bg-indigo-600 text-white animate-pulse'
                  : 'bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Volume2 size={22} />
              {isSpeaking ? 'Speaking...' : 'Read Aloud'}
            </button>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-center leading-tight min-h-[80px]">
            {questions[currentIdx]}
          </h2>

          {/* Transcript box */}
          <div className={`p-6 rounded-2xl border min-h-[130px] flex flex-col items-center justify-center text-center transition-all ${
            isListening
              ? 'bg-indigo-500/10 border-indigo-500/40'
              : 'bg-black/20 border-white/5'
          }`}>
            {isListening && (
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Recording...
              </div>
            )}
            {transcript ? (
              <p className="text-gray-300 italic text-base leading-relaxed">"{transcript}"</p>
            ) : (
              <p className="text-gray-600 text-sm">
                {isListening ? 'Speak now — your words will appear here...' : 'Press the mic button below and speak your answer.'}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-6">
            {/* Big mic button */}
            <button
              onClick={toggleListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                isListening
                  ? 'bg-red-500 shadow-red-500/50 scale-110'
                  : 'bg-indigo-600 shadow-indigo-600/40 hover:scale-110 hover:bg-indigo-500'
              }`}
            >
              {isListening
                ? <Square className="text-white" fill="white" size={32} />
                : <Mic className="text-white" size={36} />
              }
            </button>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-widest">
              {isListening ? 'Tap to stop recording' : 'Tap to start recording'}
            </p>

            {/* Action buttons */}
            <div className="flex gap-4 flex-wrap justify-center">
              {transcript && !isListening && (
                <button
                  onClick={() => { setTranscript(''); transcriptRef.current = ''; }}
                  className="btn-secondary py-3 px-6 rounded-2xl font-bold flex items-center gap-2 text-sm"
                >
                  <RefreshCcw size={16} /> Clear
                </button>
              )}
              <button
                onClick={submitVoiceAnswer}
                disabled={loading || (!transcript && !transcriptRef.current)}
                className="btn-primary py-3 px-8 rounded-2xl flex items-center gap-2 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Brain size={20} />}
                {loading ? 'Analyzing...' : 'Analyze Answer'}
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentIdx >= questions.length - 1 && !feedback}
                className="btn-secondary py-3 px-6 rounded-2xl font-bold flex items-center gap-2 text-sm disabled:opacity-40"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Panel */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-8 p-8 glass rounded-[32px] border border-emerald-500/20 bg-emerald-500/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="text-emerald-500" size={24} />
              <h3 className="text-xl font-bold text-emerald-400">
                Analysis Score: <span className="text-white">{(feedback.score * 10).toFixed(0)}/100</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Overall', val: feedback.score, color: 'text-white' },
                { label: 'Technical', val: feedback.technical_score || feedback.score, color: 'text-emerald-400' },
                { label: 'Soft Skills', val: feedback.soft_skills_score || feedback.score, color: 'text-violet-400' },
              ].map(({ label, val, color }) => (
                <div key={label} className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                  <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{label}</div>
                  <div className={`text-3xl font-black ${color}`}>{Number(val).toFixed(1)}/10</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-bold mb-2 text-emerald-400 uppercase tracking-wider text-xs">✅ Strengths</h4>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {typeof feedback.strengths === 'string' ? feedback.strengths : (feedback.feedback || '')}
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-violet-400 uppercase tracking-wider text-xs">🔧 Improvements</h4>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {typeof feedback.areas_for_improvement === 'string' ? feedback.areas_for_improvement : (feedback.improvement || '')}
                </p>
              </div>
              {feedback.model_answer && (
                <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-white/5">
                  <h4 className="font-bold mb-3 text-cyan-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                    💡 Model Answer (STAR Method)
                  </h4>
                  <p className="text-gray-300 leading-relaxed italic whitespace-pre-line">
                    {typeof feedback.model_answer === 'string' ? feedback.model_answer : JSON.stringify(feedback.model_answer)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInterview;
