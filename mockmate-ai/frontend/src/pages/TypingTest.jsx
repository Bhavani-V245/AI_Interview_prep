import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, RotateCcw, Timer, Zap, Target } from 'lucide-react';

const PASSAGES = [
  "Technology is best when it brings people together. Our goal is to empower every person and every organization on the planet to achieve more. Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The best way to predict the future is to invent it. Software is eating the world. Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
  "First, solve the problem. Then, write the code. Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Programming is not about typing, it is about thinking. The most important property of a program is whether it accomplishes the intention of its user.",
  "Simplicity is the soul of efficiency. Make it work, make it right, make it fast. Code is like humor. When you have to explain it, it is bad.",
  "In software, the most beautiful code, the most beautiful functions, and the most beautiful programs are sometimes not there at all. Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
  "Talk is cheap. Show me the code. Given enough eyeballs, all bugs are shallow. The function of good software is to make the complex appear to be simple.",
  "A good programmer is someone who always looks both ways before crossing a one-way street. Debugging is twice as hard as writing the code in the first place."
];

const TypingTest = () => {
  const [text, setText] = useState(PASSAGES[Math.floor(Math.random() * PASSAGES.length)]);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef = useRef(null);

  useEffect(() => {
    if (startTime && !isFinished && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(t => t - 1);
        calculateWpm();
      }, 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [startTime, isFinished, timeLeft]);

  const calculateWpm = () => {
    const words = userInput.trim().split(/\s+/).length;
    const timeElapsed = (Date.now() - startTime) / 60000;
    if (timeElapsed > 0) {
      setWpm(Math.round(words / timeElapsed));
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    if (!startTime) setStartTime(Date.now());
    if (val.length <= text.length) {
      setUserInput(val);
      
      // Calculate accuracy
      let correct = 0;
      for (let i = 0; i < val.length; i++) {
        if (val[i] === text[i]) correct++;
      }
      setAccuracy(Math.round((correct / val.length) * 100) || 100);

      if (val === text) setIsFinished(true);
    }
  };

  const reset = () => {
    setText(PASSAGES[Math.floor(Math.random() * PASSAGES.length)]);
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setTimeLeft(60);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Keyboard className="text-indigo-500" /> Typing <span className="text-gradient">Speed Test</span>
        </h1>
        <p className="text-gray-400">Professional developers need speed. Test yours today.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Words Per Minute', value: wpm, icon: <Zap className="text-yellow-400" />, unit: 'WPM' },
          { label: 'Accuracy', value: accuracy, icon: <Target className="text-emerald-400" />, unit: '%' },
          { label: 'Time Remaining', value: timeLeft, icon: <Timer className="text-indigo-400" />, unit: 'Sec' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/5 text-center">
            <div className="p-2 bg-white/5 w-fit mx-auto rounded-xl mb-3">{stat.icon}</div>
            <div className="text-3xl font-black">{stat.value}<span className="text-sm font-medium text-gray-500 ml-1">{stat.unit}</span></div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glass p-10 rounded-[40px] border border-white/10 relative">
        <div className="text-xl leading-relaxed text-gray-500 font-mono mb-8 select-none whitespace-pre-wrap">
          {text.split("").map((char, i) => {
            let color = "text-gray-500";
            if (i < userInput.length) {
              color = userInput[i] === char ? "text-white" : "text-red-500 bg-red-500/20";
            }
            return <span key={i} className={color}>{char}</span>;
          })}
        </div>

        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInput}
          disabled={isFinished}
          placeholder="Start typing to begin..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-indigo-500 outline-none transition-all text-lg font-mono resize-none h-32"
        />

        {isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm rounded-[40px] flex flex-col items-center justify-center z-10"
          >
            <h2 className="text-4xl font-bold mb-2">Test Complete!</h2>
            <p className="text-gray-400 mb-8 text-xl">Final Score: <span className="text-white font-black">{wpm} WPM</span> with <span className="text-white font-black">{accuracy}% Accuracy</span></p>
            <button 
              onClick={reset}
              className="btn-primary py-4 px-12 rounded-2xl flex items-center gap-2 font-bold"
            >
              <RotateCcw size={20} /> Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TypingTest;
