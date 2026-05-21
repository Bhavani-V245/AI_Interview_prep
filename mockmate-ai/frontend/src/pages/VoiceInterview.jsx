import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Square, Loader2, Brain, CheckCircle2, RefreshCcw, ChevronRight, Sparkles, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'UI/UX Designer', 'Data Analyst', 'Cloud Architect'];
const TOPICS = ['React', 'Node.js', 'Python', 'System Design', 'SQL', 'Machine Learning', 'Docker/Kubernetes', 'JavaScript', 'REST APIs', 'Behavioral/HR', 'Leadership', 'Communication', 'Problem Solving'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const VoiceInterview = () => {
  const [step, setStep] = useState('setup'); // setup | interview
  const [config, setConfig] = useState({ role: 'Software Engineer', topic: 'Behavioral/HR', difficulty: 'Intermediate' });
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
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

  // ─── Auto-speak every question (including Q1 on first load) ─────────
  useEffect(() => {
    const timer = setTimeout(() => {
      doSpeak(questions[currentIdx]);
    }, 600);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  // ─── Check SpeechRecognition support ────────────────────────────────
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicSupported(false);
      toast.error('Voice input requires Chrome or Edge browser.');
    }
  }, []);

  // ─── Generate fresh questions from AI ────────────────────────────────
  const generateQuestions = async () => {
    setGenerating(true);
    try {
      const res = await axios.post('/api/interview/generate', {
        role: config.role,
        topic: config.topic,
        difficulty: config.difficulty,
        num_questions: 10
      });
      const qs = res.data?.questions;
      if (Array.isArray(qs) && qs.length > 0) {
        setQuestions(qs);
        setCurrentIdx(0);
        setTranscript('');
        transcriptRef.current = '';
        setFeedback(null);
        setStep('interview');
        toast.success(`${qs.length} unique questions ready!`);
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      toast.error('Could not generate questions. Check your internet connection.');
      console.error('Generate questions error:', err);
    } finally {
      setGenerating(false);
    }
  };

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

  // ─── Core TTS logic (shared by button + auto-speak) ─────────────────
  const doSpeak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const preferred =
      voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
      voices.find(v => v.lang === 'en-US') ||
      voices.find(v => v.lang.startsWith('en')) ||
      null;
    if (preferred) utterance.voice = preferred;

    const keepAlive = setInterval(() => {
      if (!window.speechSynthesis.speaking) { clearInterval(keepAlive); return; }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10000);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); clearInterval(keepAlive); };
    utterance.onerror = (e) => {
      setIsSpeaking(false);
      clearInterval(keepAlive);
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        toast.error('Speaker error. Check if your browser tab is muted.');
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // ─── Speak button click ──────────────────────────────────────────────
  const speakQuestion = () => {
    if (!window.speechSynthesis) {
      toast.error('Text-to-speech not supported in this browser.');
      return;
    }
    doSpeak(questions[currentIdx]);
  };

  // ─── Auto-read feedback after analysis ───────────────────────────────
  const speakFeedback = (feedbackData) => {
    const score = Number(feedbackData.score || 0).toFixed(1);
    const strengths = typeof feedbackData.strengths === 'string'
      ? feedbackData.strengths
      : (feedbackData.feedback || '');
    const improvements = typeof feedbackData.areas_for_improvement === 'string'
      ? feedbackData.areas_for_improvement
      : (feedbackData.improvement || '');

    const text = `Your score is ${score} out of 10. 
      Strengths: ${strengths.slice(0, 300)}. 
      Areas for improvement: ${improvements.slice(0, 300)}.`;

    setTimeout(() => doSpeak(text), 800);
  };


  // ─── Submit answer for AI feedback ──────────────────────────────────
  const submitVoiceAnswer = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }

    const rawAnswer = transcriptRef.current.trim() || transcript.trim();
    // Allow empty answers — AI will explain how to answer the question
    const finalAnswer = rawAnswer || '[No answer provided. Please explain what a great answer to this question would look like, including a full STAR-method model answer.]';
    const isSkipped = !rawAnswer;

    if (isSkipped) {
      toast.info('No answer recorded — AI will show you how to answer this question!');
    }

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
      speakFeedback(res.data);
    } catch (err) {
      console.warn('Feedback API failed, using local analysis:', err);
      const words = finalAnswer.toLowerCase().split(/\s+/);
      const wordCount = words.length;
      const hasTechKeywords = words.some(w => ['because', 'implemented', 'designed', 'result', 'impact', 'led', 'solved', 'built', 'optimized'].includes(w));

      const score = wordCount < 10 ? 4.0 : hasTechKeywords ? 7.5 : 6.0;
      const localFeedback = {
        score,
        technical_score: Math.max(1, score - 0.5),
        soft_skills_score: Math.min(10, score + 0.5),
        strengths: wordCount < 10 ? 'Attempted to answer the question.' : 'Good attempt with relevant details.',
        areas_for_improvement: 'Use the STAR method: Situation, Task, Action, Result with specific metrics.',
        communication_feedback: 'Structure your answer with clear context and outcome.',
        model_answer: `For "${questions[currentIdx]}" — A great answer covers: (S) the situation/context, (T) your specific role/task, (A) exact steps you took, (R) measurable result achieved.`
      };
      setFeedback(localFeedback);
      toast.success('Analysis complete (offline mode).');
      speakFeedback(localFeedback);
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
    setIsTyping(false);
    setTranscript('');
    transcriptRef.current = '';
    setFeedback(null);
    hasInteracted.current = true; // unlock auto-speak for next question
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      toast.success('🎉 All questions completed!');
    }
  };


  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">

      {/* ── SETUP SCREEN ─────────────────────────────────────────────── */}
      {step === 'setup' && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          <div className="text-center">
            <h1 className="text-5xl font-black mb-4 flex items-center justify-center gap-3">
              <Mic className="text-indigo-500" /> Voice <span className="text-gradient">Interview</span>
            </h1>
            <p className="text-gray-400 text-lg">Configure your session — AI generates 10 unique questions every time.</p>
          </div>

          <div className="glass p-8 rounded-[40px] border border-white/10 space-y-6">
            {/* Role */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">Your Role</label>
              <div className="relative">
                <select
                  value={config.role}
                  onChange={e => setConfig(c => ({ ...c, role: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-semibold appearance-none focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                >
                  {ROLES.map(r => <option key={r} value={r} className="bg-gray-900">{r}</option>)}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Focus Topic</label>
              <div className="relative">
                <select
                  value={config.topic}
                  onChange={e => setConfig(c => ({ ...c, topic: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-semibold appearance-none focus:outline-none focus:border-violet-500/50 cursor-pointer"
                >
                  {TOPICS.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Difficulty</label>
              <div className="flex gap-3 flex-wrap">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => setConfig(c => ({ ...c, difficulty: d }))}
                    className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${config.difficulty === d ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >{d}</button>
                ))}
              </div>
            </div>

            <button
              onClick={generateQuestions}
              disabled={generating}
              className="w-full btn-vibrant py-4 text-lg flex items-center justify-center gap-3 mt-4"
            >
              {generating
                ? <><Loader2 className="animate-spin" size={22} /> Generating 10 unique questions...</>
                : <><Sparkles size={22} /> Start Voice Interview</>
              }
            </button>
          </div>
        </motion.div>
      )}

      {/* ── INTERVIEW SCREEN ─────────────────────────────────────────── */}
      {step === 'interview' && (
      <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Mic className="text-indigo-500" /> Voice <span className="text-gradient">Interview</span>
        </h1>
        <p className="text-gray-500 text-sm">{config.role} · {config.topic} · {config.difficulty}</p>
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
            
            {isTyping ? (
              <textarea
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  transcriptRef.current = e.target.value;
                }}
                placeholder="Type your answer here..."
                className="w-full h-32 bg-transparent text-white placeholder-gray-500 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500 resize-none"
              />
            ) : transcript ? (
              <p className="text-gray-300 italic text-base leading-relaxed">"{transcript}"</p>
            ) : (
              <p className="text-gray-600 text-sm">
                {isListening ? 'Speak now — your words will appear here...' : 'Press the mic button below and speak your answer, or click "Type Answer" below.'}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-6">
            {!isTyping && (
              <>
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
              </>
            )}

            {/* Action buttons */}
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => setIsTyping(!isTyping)}
                className="btn-secondary py-3 px-6 rounded-2xl font-bold flex items-center gap-2 text-sm"
              >
                {isTyping ? 'Use Microphone' : '⌨️ Type Answer'}
              </button>
              
              {(transcript || isTyping) && !isListening && (

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

      {/* Start New Session */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            window.speechSynthesis.cancel();
            if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
            setStep('setup');
            setCurrentIdx(0);
            setTranscript('');
            transcriptRef.current = '';
            setFeedback(null);
            setIsListening(false);
          }}
          className="btn-secondary px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 mx-auto"
        >
          <RefreshCcw size={16} /> New Session (Different Questions)
        </button>
      </div>

      </div>
      )}
    </div>
  );
};

export default VoiceInterview;
