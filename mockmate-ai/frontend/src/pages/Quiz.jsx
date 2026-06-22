import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ChevronRight, 
  Layers, 
  RotateCcw, 
  Loader2, 
  BookOpen, 
  BrainCircuit, 
  Compass, 
  BookOpenCheck 
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { CacheManager } from '../utils/cacheManager';

const PLACEMENT_TOPICS = {
  "Quantitative Aptitude": [
    "Number System",
    "Percentages",
    "Profit & Loss",
    "Ratio & Proportion",
    "Time & Work",
    "Time, Speed & Distance",
    "Averages & Ages",
    "Simple & Compound Interest",
    "Mixture & Allegation",
    "Probability",
    "Permutation & Combination",
    "Geometry & Mensuration",
    "Data Interpretation"
  ],
  "Logical Reasoning": [
    "Blood Relations",
    "Direction Sense",
    "Coding-Decoding",
    "Seating Arrangement",
    "Puzzles",
    "Syllogism",
    "Series & Patterns",
    "Clock & Calendar",
    "Venn Diagrams"
  ],
  "Verbal & Advanced": [
    "Reading Comprehension",
    "Sentence Correction",
    "Error Detection",
    "Critical Reasoning",
    "Analytical Reasoning"
  ]
};

const TAB_ICONS = {
  "Quantitative Aptitude": <Compass size={18} className="text-emerald-400" />,
  "Logical Reasoning": <BrainCircuit size={18} className="text-violet-400" />,
  "Verbal & Advanced": <BookOpen size={18} className="text-amber-400" />
};

const Quiz = () => {
  const [activeTab, setActiveTab] = useState("Quantitative Aptitude");
  const [topic, setTopic] = useState(null);
  const [solvedQuestions, setSolvedQuestions] = useState(() => {
    return JSON.parse(localStorage.getItem('solved_questions') || '{}');
  });
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const startQuiz = async (topicName) => {
    setLoading(true);
    setTopic(topicName);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuestions([]);
    setUserAnswers({});

    console.log(`[DEBUG] Selected Category: ${activeTab}`);
    console.log(`[DEBUG] Selected Topic: ${topicName}`);
    
    // 1. Check Cache
    const cachedQs = CacheManager.getCache('quiz', topicName);
    if (cachedQs && cachedQs.length >= 5) {
      console.log(`[DEBUG] Cache HIT for ${topicName}. Popping 5 questions from cache of ${cachedQs.length}.`);
      const newQs = cachedQs.slice(0, 5);
      const remainingQs = cachedQs.slice(5);
      CacheManager.setCache('quiz', topicName, remainingQs);
      setQuestions(newQs);
      setLoading(false);
      return;
    }
    
    console.log(`[DEBUG] Cache MISS for ${topicName}. Fetching from AI...`);

    const solvedForTopic = CacheManager.getSolved('quiz', topicName);
    const targetBatchSize = CacheManager.getBatchSize('quiz', 25);

    try {
      const startTime = Date.now();
      const res = await axios.post('/api/interview/generate-quiz', {
        category: activeTab,
        topic: topicName,
        solved_questions: solvedForTopic,
        batch_size: targetBatchSize
      });
      const elapsedMs = Date.now() - startTime;
      
      CacheManager.adjustBatchSize('quiz', 25, elapsedMs);

      if (res.data && res.data.questions && res.data.questions.length >= 5) {
        const fetchedQs = res.data.questions;
        const newQs = fetchedQs.slice(0, 5);
        const remainingQs = fetchedQs.slice(5);
        CacheManager.setCache('quiz', topicName, remainingQs);
        setQuestions(newQs);
      } else {
        throw new Error("Invalid AI format or insufficient questions returned.");
      }
    } catch (err) {
      console.error("[DEBUG] API Error:", err.response?.data || err.message);
      toast.error(`Error reaching AI Quiz engine: ${err.message}. Using topic-specific fallback.`);
      
      // Dynamic emergency fallback generation based on topic
      const topicFallback = [];
      const mathQs = [
        { q: "If 20% of a = b, then b% of 20 is the same as:", o: ["4% of a", "5% of a", "20% of a", "None"], a: 0, e: "20% of a = 0.2a. b% of 20 = (0.2a / 100) * 20 = 0.04a = 4% of a." },
        { q: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", o: ["120 metres", "180 metres", "324 metres", "150 metres"], a: 3, e: "Speed = 60 * 5/18 = 50/3 m/sec. Distance = (50/3) * 9 = 150 m." },
        { q: "The sum of ages of 5 children born at the intervals of 3 years each is 50 years. What is the age of the youngest child?", o: ["4 years", "8 years", "10 years", "None"], a: 0, e: "x + (x+3) + (x+6) + (x+9) + (x+12) = 50. 5x + 30 = 50. x = 4." }
      ];
      const logicQs = [
        { q: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?", o: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"], a: 1, e: "This is a simple division series; each number is one-half of the previous number." },
        { q: "SCD, TEF, UGH, ____, WKL", o: ["CMN", "UJI", "VIJ", "IJT"], a: 2, e: "The first letters are alphabetical: S, T, U, V, W. The second and third letters are alphabetical pairs: CD, EF, GH, IJ, KL." }
      ];
      
      const pool = (activeTab === "Logical Reasoning" || activeTab === "Verbal & Advanced") ? logicQs : mathQs;
      
      for(let i=0; i<5; i++) {
         const q = pool[i % pool.length];
         topicFallback.push({
            question: `[Emergency Fallback - ${topicName}] ${q.q}`,
            options: q.o,
            answer: q.a,
            explanation: q.e
         });
      }
      setQuestions(topicFallback);
    } finally {
      setLoading(false);
    }
  };


  const handleOptionSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    setUserAnswers(prev => ({ ...prev, [currentIdx]: idx }));
    if (idx === questions[currentIdx].answer) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      
      // Update solved questions in local storage
      const newSolved = { ...solvedQuestions };
      if (!newSolved[topic]) newSolved[topic] = [];
      
      let added = false;
      Object.keys(userAnswers).forEach(idx => {
        const numIdx = parseInt(idx);
        if (userAnswers[numIdx] === questions[numIdx].answer) {
           const qHash = questions[numIdx].question;
           if (!newSolved[topic].includes(qHash)) {
              newSolved[topic].push(qHash);
              added = true;
           }
        }
      });
      
      if (added) {
         console.log(`[DEBUG] Updating solved questions for ${topic}:`, newSolved[topic]);
         setSolvedQuestions(newSolved);
         localStorage.setItem('solved_questions', JSON.stringify(newSolved));
      }
    }
  };

  // Save quiz result to profile history
  useEffect(() => {
    if (showResult && topic && questions.length > 0) {
      const userStr = localStorage.getItem('user');
      const userEmail = userStr ? JSON.parse(userStr).email : null;
      axios.post('/api/interview/save-session', {
        email: userEmail,
        type: 'quiz',
        role: activeTab,
        topic: topic,
        score: pct,
        questions_count: questions.length,
        duration_seconds: 240
      }).then(() => {
        toast.success("Aptitude Score saved to profile statistics!");
      }).catch(err => console.error("Error saving session statistics", err));
    }
  }, [showResult]);

  // Loading Screen
  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto min-h-screen flex flex-col justify-center items-center">
        <div className="glass p-12 rounded-[40px] text-center border border-indigo-500/10 space-y-6 max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-transparent opacity-50" />
          <div className="relative">
            <Loader2 size={64} className="animate-spin text-indigo-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white tracking-tight">Crafting Quiz</h2>
            <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
              MockMate's AI is generating 5 unique, high-fidelity placement questions for <span className="text-indigo-400 font-bold">{topic}</span>.
            </p>
            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest mt-6 text-zinc-400 w-fit mx-auto">
              <BrainCircuit size={12} className="text-violet-400 animate-pulse" /> Non-Repetitive AI Engine
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Categories Selector Screen
  if (!topic) {
    return (
      <div className="p-8 max-w-5xl mx-auto min-h-screen flex flex-col justify-center">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <BookOpenCheck size={14} /> Comprehensive Placement Analytics
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tighter">Aptitude & Logical <span className="vibrant-text">Quiz</span></h1>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            Choose a topic. MockMate AI generates highly specialized, placement-grade numeric, logical, and verbal questions with zero repetition.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit mx-auto">
          {Object.keys(PLACEMENT_TOPICS).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {TAB_ICONS[tab]}
              {tab}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 gap-4">
          {PLACEMENT_TOPICS[activeTab].map((topic) => (
            <motion.button
              key={topic}
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startQuiz(topic)}
              className="neon-glass p-6 rounded-[24px] text-left group cursor-pointer hover:border-indigo-500/20 transition-all border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                {topic}
                <ChevronRight size={16} className="text-zinc-600 group-hover:text-indigo-400 transition-colors group-hover:translate-x-1" />
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Placement Track</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Quiz Playing Screen
  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!showResult ? (
          questions.length > 0 && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <HelpCircle className="text-indigo-500" /> <span className="text-gradient">{topic}</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="glass px-4 py-2 rounded-xl text-sm font-bold border border-white/10">
                    {currentIdx + 1} / {questions.length}
                  </div>
                  <button onClick={() => setTopic(null)} className="text-xs text-zinc-600 hover:text-white transition-colors font-bold uppercase tracking-widest">Change Topic</button>
                </div>
              </div>

              <div className="glass p-10 rounded-[40px] border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 to-transparent opacity-30 pointer-events-none" />
                <h2 className="text-xl font-bold mb-10 leading-relaxed relative z-10">{questions[currentIdx].question}</h2>
                <div className="grid gap-4 relative z-10">
                  {questions[currentIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      className={`p-5 rounded-2xl border text-left transition-all text-base font-medium flex justify-between items-center ${
                        isAnswered
                          ? i === questions[currentIdx].answer
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/5'
                            : i === selectedOption
                            ? 'bg-red-500/10 border-red-500 text-red-400'
                            : 'border-white/5 opacity-40'
                          : 'border-white/10 hover:border-indigo-500 hover:bg-white/5 hover:translate-x-1'
                      }`}
                    >
                      {opt}
                      {isAnswered && i === questions[currentIdx].answer && <CheckCircle2 size={20} className="text-emerald-400" />}
                      {isAnswered && i === selectedOption && i !== questions[currentIdx].answer && <XCircle size={20} className="text-red-400" />}
                    </button>
                  ))}
                </div>
                {isAnswered && (
                  <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={nextQuestion} className="w-full btn-primary py-4 rounded-2xl mt-8 font-bold flex items-center justify-center gap-2">
                    {currentIdx === questions.length - 1 ? 'Show Results' : 'Next Question'} <ChevronRight size={20} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-600/20 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={40} />
              </div>
              <h1 className="text-4xl font-black">Evaluation Finished</h1>
              <p className="text-zinc-500 text-lg">
                Category: <span className="text-indigo-400 font-bold">{topic}</span> • Score: <span className="text-white font-black">{score} / {questions.length}</span> ({Math.round((score / questions.length) * 100)}%)
              </p>
            </div>

            {/* Questions review & answers list */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Review Questions & Corrections</h3>
              {questions.map((q, idx) => {
                const userChoice = userAnswers[idx];
                const isCorrect = userChoice === q.answer;
                return (
                  <div key={idx} className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                    <h4 className="text-sm font-bold text-white flex gap-2">
                      <span className="text-indigo-400 font-black">Q{idx + 1}.</span> {q.question}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <span className="text-zinc-500 font-black uppercase tracking-wider block mb-1">Correct Option:</span>
                        <span className="text-emerald-400 font-bold">{q.options[q.answer]}</span>
                      </div>
                      <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                        <span className="text-zinc-500 font-black uppercase tracking-wider block mb-1">Your Selection:</span>
                        <span className="font-bold">{userChoice !== undefined ? q.options[userChoice] : "No answer submitted"}</span>
                      </div>
                    </div>
                    {q.explanation && (
                      <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-xs">
                        <span className="text-indigo-400 font-black uppercase tracking-wider block mb-1">💡 Step-by-Step Walkthrough:</span>
                        <p className="text-zinc-300 font-medium leading-relaxed mt-1">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 pt-8">
              <button onClick={() => startQuiz(topic)} className="btn-primary py-4 px-10 rounded-2xl text-base font-bold flex items-center gap-2">
                <RotateCcw size={18} /> Test Again
              </button>
              <button onClick={() => setTopic(null)} className="btn-secondary py-4 px-10 rounded-2xl text-base font-bold">
                Select Another Track
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
