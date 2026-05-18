import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, Award, ChevronRight, Layers, RotateCcw } from 'lucide-react';

const QUESTION_BANK = {
  "Web Dev": [
    { question: "Which of the following is not a valid CSS unit?", options: ["rem", "em", "vh", "ptx"], answer: 3 },
    { question: "What is the result of 2 + '2' in JavaScript?", options: ["4", "'22'", "undefined", "NaN"], answer: 1 },
    { question: "Which company developed React?", options: ["Google", "Microsoft", "Meta", "Twitter"], answer: 2 },
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tabular Markup Language", "None of these"], answer: 0 },
    { question: "Which method serializes an object into a JSON string?", options: ["JSON.parse()", "JSON.stringify()", "JSON.serialize()", "JSON.object()"], answer: 1 },
    { question: "What is the correct syntax for referring to an external script?", options: ["<script href='app.js'>", "<script name='app.js'>", "<script src='app.js'>", "<script file='app.js'>"], answer: 2 },
    { question: "How do you declare a CSS variable?", options: ["$var: value;", "var-name: value;", "--var-name: value;", "@var: value;"], answer: 2 },
    { question: "Which is a valid React hook?", options: ["useFetch", "useState", "useData", "useStore"], answer: 1 },
    { question: "What is the output of typeof null?", options: ["'null'", "'object'", "'undefined'", "'number'"], answer: 1 },
    { question: "Which HTTP status code means 'Not Found'?", options: ["200", "403", "404", "500"], answer: 2 },
  ],
  "Data Structures": [
    { question: "Which data structure uses FIFO ordering?", options: ["Stack", "Queue", "Tree", "Graph"], answer: 1 },
    { question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: 1 },
    { question: "Which array method adds elements to the end?", options: ["pop()", "shift()", "push()", "unshift()"], answer: 2 },
    { question: "A balanced BST has height of?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: 1 },
    { question: "Which data structure is best for undo functionality?", options: ["Queue", "Array", "Stack", "Linked List"], answer: 2 },
    { question: "Hash table average lookup time is?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: 3 },
    { question: "Which traversal visits root first?", options: ["Inorder", "Preorder", "Postorder", "Level-order"], answer: 1 },
    { question: "DFS uses which data structure internally?", options: ["Queue", "Stack", "Heap", "Array"], answer: 1 },
    { question: "Minimum spanning tree algorithm?", options: ["Dijkstra", "Bellman-Ford", "Kruskal", "Floyd-Warshall"], answer: 2 },
    { question: "Worst case of quicksort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], answer: 2 },
  ],
  "System Design": [
    { question: "Which pattern distributes load across servers?", options: ["Singleton", "Load Balancer", "Factory", "Observer"], answer: 1 },
    { question: "CAP theorem states you can have at most how many?", options: ["1 of 3", "2 of 3", "All 3", "None"], answer: 1 },
    { question: "What does CDN stand for?", options: ["Central Data Network", "Content Delivery Network", "Cloud Data Node", "Content Direct Network"], answer: 1 },
    { question: "Which database type is best for social graphs?", options: ["Relational", "Document", "Graph", "Key-Value"], answer: 2 },
    { question: "Microservices communicate via?", options: ["Shared memory", "APIs/Messages", "Direct DB", "File system"], answer: 1 },
    { question: "What provides eventual consistency?", options: ["ACID", "BASE", "CAP", "REST"], answer: 1 },
    { question: "Rate limiting protects against?", options: ["SQL injection", "DDoS/abuse", "XSS", "CSRF"], answer: 1 },
    { question: "Horizontal scaling means?", options: ["Bigger server", "More servers", "Faster CPU", "More RAM"], answer: 1 },
  ],
  "General CS": [
    { question: "What does API stand for?", options: ["Application Programming Interface", "Applied Program Integration", "Application Process Interface", "Applied Programming Integration"], answer: 0 },
    { question: "In React, data is passed to components via?", options: ["setState", "render args", "props", "PropTypes"], answer: 2 },
    { question: "Git command to create a new branch?", options: ["git new", "git branch", "git create", "git init"], answer: 1 },
    { question: "Which protocol is stateless?", options: ["FTP", "HTTP", "TCP", "SMTP"], answer: 1 },
    { question: "What is the purpose of DNS?", options: ["Encrypt data", "Resolve domain names", "Transfer files", "Send emails"], answer: 1 },
    { question: "Which is NOT an HTTP method?", options: ["GET", "POST", "SAVE", "DELETE"], answer: 2 },
    { question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Language", "Standard Query Logic", "Structured Question Language"], answer: 0 },
    { question: "OAuth is used for?", options: ["Encryption", "Authentication/Authorization", "Compression", "Caching"], answer: 1 },
  ]
};

const CATEGORIES = Object.keys(QUESTION_BANK);

const Quiz = () => {
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const startQuiz = (cat) => {
    const pool = QUESTION_BANK[cat];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setCategory(cat);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleOptionSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === questions[currentIdx].answer) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (!category) {
    return (
      <div className="p-8 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Layers size={14} /> Select Category
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tighter">Aptitude <span className="vibrant-text">Quiz</span></h1>
          <p className="text-zinc-500 text-lg">Choose a category to test your knowledge.</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => startQuiz(cat)}
              className="neon-glass p-10 rounded-[32px] text-center group cursor-pointer hover:border-indigo-500/30 transition-all"
            >
              <div className="text-2xl font-black text-white mb-2 group-hover:text-indigo-400 transition-colors">{cat}</div>
              <div className="text-xs text-zinc-600 font-bold uppercase tracking-widest">{QUESTION_BANK[cat].length} Questions</div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <HelpCircle className="text-indigo-500" /> <span className="text-gradient">{category}</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className="glass px-4 py-2 rounded-xl text-sm font-bold border border-white/10">
                  {currentIdx + 1} / {questions.length}
                </div>
                <button onClick={() => setCategory(null)} className="text-xs text-zinc-600 hover:text-white transition-colors font-bold uppercase tracking-widest">Change Topic</button>
              </div>
            </div>

            <div className="glass p-10 rounded-[40px] border border-white/10">
              <h2 className="text-2xl font-bold mb-10 leading-tight">{questions[currentIdx].question}</h2>
              <div className="grid gap-4">
                {questions[currentIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(i)}
                    className={`p-6 rounded-2xl border text-left transition-all text-lg font-medium flex justify-between items-center ${
                      isAnswered
                        ? i === questions[currentIdx].answer
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : i === selectedOption
                          ? 'bg-red-500/10 border-red-500 text-red-400'
                          : 'border-white/5 opacity-50'
                        : 'border-white/10 hover:border-indigo-500 hover:bg-white/5'
                    }`}
                  >
                    {opt}
                    {isAnswered && i === questions[currentIdx].answer && <CheckCircle2 size={20} />}
                    {isAnswered && i === selectedOption && i !== questions[currentIdx].answer && <XCircle size={20} />}
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
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
            <div className="w-24 h-24 bg-indigo-600/20 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={48} />
            </div>
            <h1 className="text-5xl font-black mb-2">Quiz Complete!</h1>
            <p className="text-gray-400 text-xl">You scored <span className="text-white font-black">{score} out of {questions.length}</span> in <span className="text-indigo-400 font-bold">{category}</span></p>
            <div className="flex justify-center gap-4 pt-8">
              <button onClick={() => startQuiz(category)} className="btn-primary py-4 px-12 rounded-2xl text-lg font-bold flex items-center gap-2">
                <RotateCcw size={20} /> Try Again
              </button>
              <button onClick={() => setCategory(null)} className="btn-secondary py-4 px-12 rounded-2xl text-lg font-bold">
                Change Topic
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
