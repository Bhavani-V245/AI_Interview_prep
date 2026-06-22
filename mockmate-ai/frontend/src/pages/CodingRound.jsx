import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Clock, 
  Code2,
  Terminal,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Award,
  Zap,
  Target,
  Send,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { CacheManager } from '../utils/cacheManager';

const PROBLEMS = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9.' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6.' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      javascript: '// Two Sum\nfunction twoSum(nums, target) {\n  // Your solution here\n  \n}\n\n// Test\nconsole.log(twoSum([2,7,11,15], 9));',
      python: '# Two Sum\ndef two_sum(nums, target):\n    # Your solution here\n    pass\n\n# Test\nprint(two_sum([2,7,11,15], 9))',
    }
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    starterCode: {
      javascript: '// Longest Substring Without Repeating Characters\nfunction lengthOfLongestSubstring(s) {\n  // Your solution here\n  \n}\n\n// Test\nconsole.log(lengthOfLongestSubstring("abcabcbb"));',
      python: '# Longest Substring Without Repeating Characters\ndef length_of_longest_substring(s):\n    # Your solution here\n    pass\n\n# Test\nprint(length_of_longest_substring("abcabcbb"))',
    }
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.",
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'Simple matching pair.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All brackets match.' },
      { input: 's = "(]"', output: 'false', explanation: 'Mismatched brackets.' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only.'],
    starterCode: {
      javascript: '// Valid Parentheses\nfunction isValid(s) {\n  // Your solution here\n  \n}\n\n// Test\nconsole.log(isValid("()[]{}"));',
      python: '# Valid Parentheses\ndef is_valid(s):\n    # Your solution here\n    pass\n\n# Test\nprint(is_valid("()[]{}") )',
    }
  },
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list. Implement the solution iteratively.",
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed the linked list.' },
      { input: 'head = [1,2]', output: '[2,1]', explanation: 'Swapped two nodes.' }
    ],
    constraints: ['The number of nodes in the list is in range [0, 5000].'],
    starterCode: {
      javascript: '// Reverse Linked List\nfunction reverseList(head) {\n  // Your solution here\n  let prev = null;\n  let current = head;\n  \n}\n\n// Note: Implement the reversal logic',
      python: '# Reverse Linked List\ndef reverse_list(head):\n    # Your solution here\n    prev = None\n    current = head\n    pass',
    }
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum. Use Kadane's algorithm for optimal O(n) solution.",
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum = 6.' },
      { input: 'nums = [5,4,-1,7,8]', output: '23', explanation: 'The entire array has the largest sum.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      javascript: '// Maximum Subarray (Kadane\'s Algorithm)\nfunction maxSubArray(nums) {\n  // Your solution here\n  \n}\n\n// Test\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));',
      python: '# Maximum Subarray (Kadane\'s Algorithm)\ndef max_sub_array(nums):\n    # Your solution here\n    pass\n\n# Test\nprint(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))',
    }
  }
];

const CodingRound = () => {
  const [problemList, setProblemList] = useState(PROBLEMS);
  const [problemIdx, setProblemIdx] = useState(0);
  const [language, setLanguage] = useState('javascript');
  const [timeLeft, setTimeLeft] = useState(1800);
  const [code, setCode] = useState(PROBLEMS[0].starterCode.javascript);
  const [consoleOutput, setConsoleOutput] = useState('> Ready. Write your solution and click Run Code.');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [generatingProblem, setGeneratingProblem] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [isExpanded, setIsExpanded] = useState(false);

  const problem = problemList[problemIdx] || PROBLEMS[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (problem) {
      let newCode = problem.starterCode?.[language];
      if (!newCode) {
        if (language === 'cpp') {
          newCode = `// ${problem.title}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    \n    return 0;\n}`;
        } else if (language === 'java') {
          newCode = `// ${problem.title}\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n        \n    }\n}`;
        } else if (language === 'python') {
          newCode = `# ${problem.title}\ndef solution():\n    # Write your Python solution here\n    pass`;
        } else {
          newCode = `// ${problem.title}\nfunction solution() {\n  // Write your JavaScript solution here\n\n}`;
        }
      }
      setCode(newCode);
    }
    setConsoleOutput('> Ready. Write your solution and click Run Code.');
    setEvaluation(null);
    setIsExpanded(false);
  }, [problemIdx, language, problemList]);

  const generateCustomProblem = async () => {
    setGeneratingProblem(true);

    const cacheTopic = `coding_${selectedDifficulty}`;

    // 1. Check Cache
    const cachedQs = CacheManager.getCache('coding', cacheTopic);
    if (cachedQs && cachedQs.length > 0) {
      console.log(`[DEBUG] Cache HIT for Coding (${selectedDifficulty}). Popping 1 question.`);
      const currentQ = cachedQs[0];
      const remainingQs = cachedQs.slice(1);
      CacheManager.setCache('coding', cacheTopic, remainingQs);
      
      setProblemList([...problemList, currentQ]);
      setProblemIdx(problemList.length);
      CacheManager.addSolved('coding', cacheTopic, currentQ.title);
      toast.success(`Generated: "${currentQ.title}"!`);
      setGeneratingProblem(false);
      return;
    }

    toast.info("Generating a completely unique AI coding challenge...");
    try {
      const solved = CacheManager.getSolved('coding', cacheTopic);
      const batchSize = CacheManager.getBatchSize('coding', 15);

      const startTime = Date.now();
      const res = await axios.post('/api/interview/generate-coding-problem', {
        difficulty: selectedDifficulty,
        solved_questions: solved,
        batch_size: batchSize
      });
      const elapsedMs = Date.now() - startTime;
      
      CacheManager.adjustBatchSize('coding', 15, elapsedMs);

      const qs = Array.isArray(res.data) ? res.data : [res.data];
      
      if (qs && qs.length > 0) {
        qs.forEach(q => {
          if (!q.starterCode) {
            q.starterCode = {
              javascript: `// ${q.title}\nfunction solution() {\n  // Write code here\n}`,
              python: `# ${q.title}\ndef solution():\n    pass`
            };
          }
        });

        const currentQ = qs[0];
        const remainingQs = qs.slice(1);
        CacheManager.setCache('coding', cacheTopic, remainingQs);

        setProblemList([...problemList, currentQ]);
        setProblemIdx(problemList.length);
        CacheManager.addSolved('coding', cacheTopic, currentQ.title);
        toast.success(`Generated: "${currentQ.title}"!`);
      } else {
        toast.error("Failed to generate problem. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating coding challenge.");
    } finally {
      setGeneratingProblem(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const runCode = async () => {
    if (language !== 'javascript') {
      setConsoleOutput(`> Compiling and running ${language} code...`);
      try {
        const res = await axios.post('/api/interview/run-code', { code, language });
        setConsoleOutput(`> Output:\n${res.data.output}`);
      } catch (err) {
        setConsoleOutput(`> Execution failed. Ensure backend is running.`);
      }
      return;
    }
    setEvaluation(null); // Instantly flip back to console output view!
    const logs = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => logs.push(args.map(String).join(' '));
    console.error = (...args) => logs.push(`[Error] ` + args.map(String).join(' '));
    console.warn = (...args) => logs.push(`[Warning] ` + args.map(String).join(' '));

    try {
      // Execute user code
      const fn = new Function(code);
      fn();
      
      // Restore standard console immediately
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;

      setConsoleOutput(
        logs.length > 0 
          ? logs.join('\n') 
          : `> Code executed successfully (0 errors).\n> Warning: No logs detected in console.\n> Tip: Ensure you call your function and wrap it in console.log() at the bottom of the editor to print local test outputs, e.g.:\n  console.log(myFunction(testValue));`
      );
      toast.success('Code executed!');
    } catch (err) {
      // Restore standard console immediately
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;

      setConsoleOutput(`> Runtime Error:\n${err.message}`);
      toast.error('Runtime error in your code.');
    }
  };

  const submitCode = async () => {
    setSubmitting(true);
    setConsoleOutput('> Submitting to AI evaluator...');
    try {
      const res = await axios.post('/api/interview/evaluate-code', {
        title: problem.title,
        description: problem.description,
        code: code,
        language: language
      });
      setEvaluation(res.data);
      let outputStr = `> AI Evaluation Complete!\n> Overall Score: ${res.data.overall_score}/10\n> Time Complexity: ${res.data.time_complexity}\n> Space Complexity: ${res.data.space_complexity}\n\n> AI Analysis:\n${res.data.feedback}`;
      if (res.data.suggestions && res.data.suggestions.length > 0) {
        outputStr += `\n\n> Suggestions:\n` + res.data.suggestions.map(s => `  - ${s}`).join('\n');
      }
      setConsoleOutput(outputStr);
      toast.success(`Score: ${res.data.overall_score}/10`);

      // Save session
      const userStr = localStorage.getItem('user');
      const userEmail = userStr ? JSON.parse(userStr).email : null;
      await axios.post('/api/interview/save-session', {
        email: userEmail,
        type: 'coding',
        role: 'Developer',
        topic: problem.title,
        score: Math.round(res.data.overall_score * 10), // Scale to 100-point system
        questions_count: 1,
        duration_seconds: 1800 - timeLeft
      });
    } catch {
      setConsoleOutput('> Evaluation failed. Check your connection.');
      toast.error('Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetCode = () => {
    setCode(problem.starterCode[language] || problem.starterCode.javascript);
    setConsoleOutput('> Code reset to starter template.');
    setEvaluation(null);
    toast.info('Code reset.');
  };

  const diffColors = { Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', Hard: 'text-red-400 bg-red-500/10 border-red-500/20' };

  return (
    <div className="flex h-screen overflow-hidden bg-[#030712]">
      {/* Left Panel */}
      <div className="w-[38%] h-full border-r border-white/10 flex flex-col glass-dark overflow-y-auto">
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2">
            <Code2 className="text-indigo-400" size={18} />
            <h1 className="font-bold uppercase tracking-wider text-[10px] text-gray-500">Problem {problemIdx + 1} / {problemList.length}</h1>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-black tracking-wider text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
            <Target size={10} className="text-indigo-400" /> Target: 8.0+
          </div>
        </div>

        {/* AI Generator Box */}
        <div className="p-5 border-b border-white/5 bg-indigo-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">AI Coding Lab</span>
            <span className="text-[9px] text-zinc-500 font-medium">Bypass repetitive tasks</span>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="bg-white/5 border border-white/10 text-xs rounded-xl px-3 py-2 flex-1 focus:outline-none text-gray-300 font-bold"
            >
              <option value="Easy">Easy Level</option>
              <option value="Medium">Medium Level</option>
              <option value="Hard">Hard Level</option>
            </select>
            <button
              onClick={generateCustomProblem}
              disabled={generatingProblem}
              className="btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {generatingProblem ? (
                <Loader2 size={12} className="animate-spin text-white" />
              ) : (
                <Zap size={12} fill="white" />
              )}
              Generate
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">{problem.title}</h2>
              <span className={`px-2.5 py-0.5 text-[9px] font-black tracking-wider rounded-md uppercase border ${diffColors[problem.difficulty || 'Medium']}`}>
                {problem.difficulty || 'Medium'}
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">{problem.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-sm"><CheckCircle2 size={14} className="text-indigo-400" /> Examples</h3>
            {problem.examples && problem.examples.map((ex, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1">
                <div className="flex gap-2"><span className="text-indigo-400 font-bold">Input:</span> <span className="text-gray-300 font-mono">{ex.input}</span></div>
                <div className="flex gap-2"><span className="text-emerald-400 font-bold">Output:</span> <span className="text-gray-300 font-mono">{ex.output}</span></div>
                {ex.explanation && <p className="text-[10px] text-gray-500 italic mt-1">{ex.explanation}</p>}
              </div>
            ))}
          </div>

          {problem.constraints && (
            <div className="p-4 glass rounded-2xl border border-white/5">
              <h3 className="font-bold mb-2 text-indigo-400 text-xs">Constraints:</h3>
              <ul className="text-[11px] text-gray-500 list-disc list-inside space-y-1">
                {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Problem navigation */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <button 
            onClick={() => setProblemIdx(Math.max(0, problemIdx - 1))} 
            disabled={problemIdx === 0}
            className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <div className="flex gap-1 overflow-x-auto max-w-[150px] scrollbar-none">
            {problemList.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setProblemIdx(i)} 
                className={`w-7 h-7 shrink-0 rounded-lg text-[10px] font-bold transition-all ${i === problemIdx ? 'bg-indigo-600 text-white' : 'bg-white/5 text-zinc-600 hover:bg-white/10'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setProblemIdx(Math.min(problemList.length - 1, problemIdx + 1))} 
            disabled={problemIdx === problemList.length - 1}
            className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-white disabled:opacity-30 transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 h-full flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-5 bg-black/20">
          <div className="flex items-center gap-4">
            <select 
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-white/5 border border-white/10 text-xs rounded-lg px-3 py-1.5 focus:outline-none text-gray-300"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
              <Clock size={14} /> {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={resetCode} className="p-2 text-gray-500 hover:text-white transition-colors" title="Reset Code">
              <RotateCcw size={18} />
            </button>
            <button onClick={runCode} className="btn-primary py-1.5 px-5 rounded-xl flex items-center gap-2 text-xs font-bold">
              <Play size={14} fill="white" /> Run
            </button>
            <button 
              onClick={submitCode} 
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 px-5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Submit
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0 relative">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={setCode}
            options={{
              fontSize: 15,
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              minimap: { enabled: false },
              padding: { top: 16 },
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              scrollbar: { verticalScrollbarSize: 8 }
            }}
          />
        </div>

        {/* Console + Evaluation */}
        <div className={`border-t border-white/10 glass-dark flex flex-col transition-all duration-300 ${
          evaluation 
            ? isExpanded ? 'h-[60vh]' : 'h-[35vh]' 
            : 'h-40'
        }`}>
          <div className="h-9 px-5 border-b border-white/10 flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-black/40">
            <div className="flex items-center gap-2">
              <Terminal size={12} /> {evaluation ? 'AI Evaluation Analysis' : 'Console Output'}
            </div>
            {evaluation && (
              <button
                type="button"
                onClick={() => setIsExpanded(prev => !prev)}
                className="text-[9px] font-black text-indigo-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider"
              >
                {isExpanded ? (
                  <>Collapse <Minimize2 size={10} /></>
                ) : (
                  <>Expand <Maximize2 size={10} /></>
                )}
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {evaluation ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Correctness', val: evaluation.correctness, icon: <CheckCircle2 size={12} /> },
                    { label: 'Efficiency', val: evaluation.efficiency, icon: <Zap size={12} /> },
                    { label: 'Quality', val: evaluation.code_quality, icon: <Award size={12} /> },
                    { label: 'Overall', val: evaluation.overall_score, icon: <Target size={12} /> },
                  ].map((m, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                      <div className="text-lg font-black text-white">{m.val}<span className="text-xs text-zinc-600">/10</span></div>
                      <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-1 mt-1">{m.icon} {m.label}</div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Detailed Feedback:</span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-semibold">{evaluation.feedback}</p>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">💡 Suggested Actions to Improve:</span>
                  <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 mt-1 font-medium">
                    {evaluation.suggestions ? (
                      Array.isArray(evaluation.suggestions) ? (
                        evaluation.suggestions.map((sug, idx) => (
                          <li key={idx} className="leading-relaxed">{sug}</li>
                        ))
                      ) : typeof evaluation.suggestions === 'string' ? (
                        evaluation.suggestions.split('\n').filter(Boolean).map((sug, idx) => (
                          <li key={idx} className="leading-relaxed">{sug.replace(/^-\s*/, '')}</li>
                        ))
                      ) : (
                        <li className="leading-relaxed">Verify complexity limits and optimize standard recursion overhead.</li>
                      )
                    ) : (
                      <>
                        <li className="leading-relaxed">Ensure all edge cases (such as null/empty arrays and maximum boundaries) are handled.</li>
                        <li className="leading-relaxed">Refactor nested loops to optimize execution time complexity to its theoretical lower bound.</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="flex gap-3 text-[10px] pt-1">
                  <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 font-bold">Time: {evaluation.time_complexity}</span>
                  <span className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/20 font-bold">Space: {evaluation.space_complexity}</span>
                </div>
              </div>
            ) : (
              <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap">{consoleOutput}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingRound;
