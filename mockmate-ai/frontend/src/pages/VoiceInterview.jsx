import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Play, Square, Loader2, Brain, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const VoiceInterview = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [questions, setQuestions] = useState([
    "Tell me about a complex project you've worked on recently.",
    "What is your approach to resolving conflict within a team?",
    "Where do you see yourself in five years?"
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + event.results[i][0].transcript + ' ');
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    } else {
      toast.error('Browser does not support Speech Recognition');
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(questions[currentIdx]);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const submitVoiceAnswer = async () => {
    if (!transcript.trim()) return toast.warning('No answer detected');
    setLoading(true);
    try {
      const res = await axios.post('/api/interview/feedback', {
        question: questions[currentIdx],
        answer: transcript
      });
      setFeedback(res.data);
      toast.success('Feedback received!');
    } catch (err) {
      toast.error('Failed to analyze voice answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Mic className="text-indigo-500" /> Voice <span className="text-gradient">Interview Mode</span>
        </h1>
        <p className="text-gray-400">Speak naturally and improve your verbal communication skills.</p>
      </div>

      <div className="glass p-10 rounded-[40px] border border-white/10 relative overflow-hidden">
        {/* Background Animation */}
        {isListening && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full animate-ping"></div>
          </div>
        )}

        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-center">
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm font-bold text-gray-400">
              QUESTION {currentIdx + 1} OF {questions.length}
            </div>
            <button 
              onClick={speakQuestion}
              className={`p-3 rounded-full transition-all ${isSpeaking ? 'bg-indigo-600 animate-pulse' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
            >
              <Volume2 size={24} />
            </button>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center leading-tight min-h-[80px]">
            {questions[currentIdx]}
          </h2>

          <div className="p-6 bg-black/20 rounded-2xl border border-white/5 min-h-[150px] flex flex-col items-center justify-center text-center">
            {transcript ? (
              <p className="text-gray-300 italic">"{transcript}"</p>
            ) : (
              <p className="text-gray-600">Your transcribed answer will appear here...</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
                isListening 
                ? 'bg-red-500 shadow-red-500/40' 
                : 'bg-indigo-600 shadow-indigo-600/40 hover:scale-110'
              }`}
            >
              {isListening ? <Square className="text-white" fill="white" size={28} /> : <Mic className="text-white" size={32} />}
            </button>

            <div className="flex gap-4">
              <button 
                onClick={submitVoiceAnswer}
                disabled={loading || !transcript}
                className="btn-primary py-3 px-8 rounded-2xl flex items-center gap-2 font-bold disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Brain size={20} />} Analyze Answer
              </button>
              <button 
                onClick={() => {
                  if (currentIdx < questions.length - 1) {
                    setCurrentIdx(prev => prev + 1);
                    setTranscript('');
                    setFeedback(null);
                  }
                }}
                className="btn-secondary py-3 px-8 rounded-2xl font-bold"
              >
                Next Question
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 p-8 glass rounded-[32px] border border-emerald-500/20 bg-emerald-500/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-emerald-500" />
              <h3 className="text-xl font-bold text-emerald-400">Analysis Result: {feedback.score}/10</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div>
                <h4 className="font-bold mb-2 text-indigo-400">Strengths</h4>
                <p className="text-gray-400 leading-relaxed">{feedback.strengths || feedback.feedback}</p>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-violet-400">Suggested Improvement</h4>
                <p className="text-gray-400 leading-relaxed">{feedback.areas_for_improvement || feedback.improvement}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInterview;
