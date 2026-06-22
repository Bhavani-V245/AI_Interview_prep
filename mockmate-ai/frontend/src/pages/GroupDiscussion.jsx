import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ChevronRight, 
  Send, 
  Mic, 
  MicOff, 
  Award, 
  Sparkles, 
  RotateCcw,
  CheckCircle2,
  Loader2,
  Shuffle
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { CacheManager } from '../utils/cacheManager';

const GD_CATEGORIES = [
  { id: 1, name: "Technology & AI", icon: "🚀", desc: "AI ethics, developer automation, tech monopolization, and smart cities." },
  { id: 2, name: "Finance & Economy", icon: "📈", desc: "Crypto fiat, Gig economy benefits, trade policies, and digital currencies." },
  { id: 3, name: "Society & Ethics", icon: "⚖️", desc: "Social media isolation, online public boycotts, genetic research, and ethics." },
  { id: 4, name: "Corporate & Workplace", icon: "🏢", desc: "WFH productivity, 4-day work weeks, diversity criteria, and leadership." },
  { id: 5, name: "Global & Geopolitical", icon: "🌍", desc: "Climate change mandates, space exploration vs poverty, and supply chain trade." }
];

const PEERS = [
  { name: "Aarav", role: "Tech Enthusiast", glow: "border-purple-500/30 text-purple-400 bg-purple-500/5", avatar: "👨‍💻" },
  { name: "Sarah", role: "Business Analyst", glow: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5", avatar: "👩‍💼" },
  { name: "David", role: "Ethics Advocate", glow: "border-amber-500/30 text-amber-400 bg-amber-500/5", avatar: "👨‍⚖️" }
];

const GroupDiscussion = () => {
  const [topic, setTopic] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState("Moderator");
  const [peerSpeakingState, setPeerSpeakingState] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [ending, setEnding] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [generatingCategory, setGeneratingCategory] = useState("");
  
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const speakMessage = (text, sender) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[.*?\]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (sender === "Aarav") {
      utterance.pitch = 0.95;
      utterance.rate = 1.05;
    } else if (sender === "Sarah") {
      utterance.pitch = 1.15;
      utterance.rate = 1.0;
    } else if (sender === "David") {
      utterance.pitch = 0.8;
      utterance.rate = 0.95;
    } else {
      utterance.pitch = 1.05;
      utterance.rate = 1.02;
    }
    window.speechSynthesis.speak(utterance);
  };

  // Auto-scroll to bottom of discussion & clean up speech on unmount
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, peerSpeakingState]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInputText(prev => prev + " " + transcript);
        setIsRecording(false);
        toast.success("Voice capture successful!");
      };

      rec.onerror = () => {
        setIsRecording(false);
        toast.error("Speech recognition error.");
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.warning("Speech recognition is not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
      toast.info("Listening... Speak your point clearly.");
    }
  };

  const startGDSession = async (categoryName) => {
    setLoadingTopic(true);
    setGeneratingCategory(categoryName);
    toast.info(`Moderator is compiling a blind placement topic for ${categoryName}...`);
    
    // 1. Check Cache
    const cachedTopics = CacheManager.getCache('gd', categoryName);
    if (cachedTopics && cachedTopics.length > 0) {
      console.log(`[DEBUG] Cache HIT for GD (${categoryName}). Popping 1 topic.`);
      const currentTopic = cachedTopics[0];
      const remainingTopics = cachedTopics.slice(1);
      CacheManager.setCache('gd', categoryName, remainingTopics);
      
      setupSession(currentTopic);
      setLoadingTopic(false);
      setGeneratingCategory("");
      return;
    }

    try {
      const solved = CacheManager.getSolved('gd', categoryName);
      const batchSize = CacheManager.getBatchSize('gd', 20);

      const startTime = Date.now();
      const res = await axios.post('/api/interview/gd/generate-topic', {
        category: categoryName,
        solved_topics: solved,
        batch_size: batchSize
      });
      const elapsedMs = Date.now() - startTime;
      
      CacheManager.adjustBatchSize('gd', 20, elapsedMs);

      // res.data should be an array of topics now
      const topics = Array.isArray(res.data) ? res.data : [res.data];
      if (topics && topics.length > 0) {
        const currentTopic = topics[0];
        const remainingTopics = topics.slice(1);
        CacheManager.setCache('gd', categoryName, remainingTopics);
        
        setupSession(currentTopic);
      } else {
        throw new Error("Failed to generate a blind topic.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating mystery topic from AI.");
    } finally {
      setLoadingTopic(false);
      setGeneratingCategory("");
    }
  };

  const setupSession = (generatedTopic) => {
    setTopic(generatedTopic);
    setSessionStarted(true);
    setChatLog([]);
    setEvaluation(null);
    setEnding(false);
    
    // Add to solved
    CacheManager.addSolved('gd', generatingCategory, generatedTopic.topic);
        
        // Moderator introduces the blind topic
        setActiveSpeaker("Moderator");
        setPeerSpeakingState("Moderator is speaking...");
        
        const initialModMessage = {
          sender: "Moderator",
          role: "AI Moderator",
          content: `Welcome candidates to the Group Discussion. Today's surprise blind topic is: "${generatedTopic.topic}". ${generatedTopic.description} I invite participants to share their opening arguments. Please start.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setTimeout(() => {
          setChatLog([initialModMessage]);
          setPeerSpeakingState("");
          speakMessage(initialModMessage.content, "Moderator");
          // Trigger Aarav to speak first
          simulatePeerResponse("Aarav", [initialModMessage], generatedTopic.topic);
        }, 1500);
  };

  const startRandomSurpriseSession = () => {
    const randomCategory = GD_CATEGORIES[Math.floor(Math.random() * GD_CATEGORIES.length)].name;
    startGDSession(randomCategory);
  };

  const simulatePeerResponse = async (targetPeer, currentLog, activeTopicOverride = null) => {
    const speakPeer = PEERS.find(p => p.name === targetPeer) || PEERS[0];
    setActiveSpeaker(speakPeer.name);
    setPeerSpeakingState(`${speakPeer.name} is preparing statement...`);
    
    // Format history
    const history = currentLog.map(msg => ({
      role: msg.sender === "You" ? "user" : "model",
      content: `[${msg.sender} (${msg.role})]: ${msg.content}`
    }));

    const activeTopic = activeTopicOverride || (topic && topic.topic) || "AI Revolution";

    try {
      const res = await axios.post('/api/interview/gd/simulate', {
        topic: activeTopic,
        history: history
      });

      if (res.data && res.data.content) {
        const peerName = res.data.peerName || speakPeer.name;
        const content = res.data.content;
        setChatLog(prev => [...prev, {
          sender: peerName,
          role: res.data.role || speakPeer.role,
          content: content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        speakMessage(content, peerName);
      }
    } catch (err) {
      console.error(err);
      const fallbackContent = `I think this is a highly complex issue. Looking at the current trends, there are both positives and negatives that we must balance carefully.`;
      setChatLog(prev => [...prev, {
        sender: speakPeer.name,
        role: speakPeer.role,
        content: fallbackContent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      speakMessage(fallbackContent, speakPeer.name);
    } finally {
      setPeerSpeakingState("");
      setActiveSpeaker("You");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: "You",
      role: "Candidate",
      content: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedLog = [...chatLog, userMsg];
    setChatLog(updatedLog);
    setInputText("");
    setActiveSpeaker("You");

    // Pick simulated peer to speak next
    let nextPeer = "Sarah";
    const lastSpoken = chatLog[chatLog.length - 1]?.sender;
    if (lastSpoken === "Aarav") nextPeer = "Sarah";
    else if (lastSpoken === "Sarah") nextPeer = "David";
    else nextPeer = "Aarav";

    setTimeout(() => {
      simulatePeerResponse(nextPeer, updatedLog);
    }, 1500);
  };

  const finishDiscussion = async () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setEnding(true);
    toast.info("Moderator is compiling overall performance reports...");
    
    const history = chatLog.map(msg => ({
      role: msg.sender === "You" ? "user" : "model",
      content: `[${msg.sender} (${msg.role})]: ${msg.content}`
    }));

    try {
      const res = await axios.post('/api/interview/gd/evaluate', {
        topic: topic.topic,
        history: history
      });

      if (res.data) {
        setEvaluation(res.data);
        
        // Save session statistics
        const userStr = localStorage.getItem('user');
        const userEmail = userStr ? JSON.parse(userStr).email : null;
        await axios.post('/api/interview/save-session', {
          email: userEmail,
          type: 'group_discussion',
          role: 'GD Prep',
          topic: topic.topic,
          score: Math.round(res.data.overall_score * 10),
          questions_count: chatLog.filter(m => m.sender === 'You').length,
          duration_seconds: 300
        });

        toast.success("Moderator Assessment Completed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate complete report.");
    } finally {
      setEnding(false);
    }
  };

  // Loading Screen for mystery blind topic draw
  if (loadingTopic) {
    return (
      <div className="p-8 max-w-4xl mx-auto min-h-screen flex flex-col justify-center items-center">
        <div className="glass p-12 rounded-[40px] text-center border border-purple-500/10 space-y-6 max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-transparent opacity-50" />
          <div className="relative">
            <Loader2 size={64} className="animate-spin text-purple-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white tracking-tight">Drawing Blind Topic</h2>
            <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
              Moderator is drawing a completely unknown, placement-grade surprise topic for <span className="text-purple-400 font-bold">{generatingCategory}</span>.
            </p>
            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest mt-6 text-zinc-400 w-fit mx-auto">
              <Sparkles size={12} className="text-purple-400 animate-pulse" /> Blind GD Challenge
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!sessionStarted ? (
          // Topics selection layout (Blind Selection)
          <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-12">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Users size={14} /> Campus Recruitment Simulation
              </div>
              <h1 className="text-5xl font-black mb-4 tracking-tighter">Blind <span className="vibrant-text">GD Arena</span></h1>
              <p className="text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed">
                MockMate simulates real-world campus recruitment where you **do not know the topic beforehand**. Pick a category below to draw a completely unique surprise topic generated by the AI!
              </p>
            </div>

            {/* Random blind generator bar */}
            <div className="flex justify-center mb-4">
              <button
                onClick={startRandomSurpriseSession}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all text-sm uppercase tracking-wider"
              >
                <Shuffle size={16} /> Draw Pure Random Blind Topic
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GD_CATEGORIES.map((c) => (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.03, translateY: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startGDSession(c.name)}
                  className="neon-glass p-8 rounded-[32px] text-left group border border-white/5 relative overflow-hidden transition-all flex flex-col justify-between min-h-[220px]"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                  <div>
                    <span className="text-3xl mb-4 block">{c.icon}</span>
                    <h3 className="text-lg font-bold text-white leading-relaxed mb-2 group-hover:text-purple-400 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-6 font-medium">
                      {c.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-purple-400 font-bold uppercase tracking-wider">
                    Draw Surprise Topic <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : !evaluation ? (
          // GD Chat Room Arena
          <motion.div key="arena" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-4 gap-6 h-[80vh]">
            {/* Simulated participants sidebar */}
            <div className="glass-dark p-6 rounded-[32px] border border-white/10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Session Topic</span>
                  <p className="text-xs font-bold text-white leading-relaxed">{topic.topic}</p>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Active Speaker Circle</span>
                  
                  {/* Moderator Card */}
                  <div className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${activeSpeaker === "Moderator" ? 'border-purple-500/50 bg-purple-500/10 shadow-lg' : 'border-white/5 bg-white/5 opacity-60'}`}>
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm">🤖</div>
                    <div>
                      <h4 className="text-xs font-black text-white">AI Moderator</h4>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Observer</span>
                    </div>
                  </div>

                  {/* Peer cards */}
                  {PEERS.map(p => (
                    <div key={p.name} className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${activeSpeaker === p.name ? 'border-indigo-500/50 bg-indigo-500/10 shadow-lg' : 'border-white/5 bg-white/5 opacity-60'}`}>
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">{p.avatar}</div>
                      <div>
                        <h4 className="text-xs font-black text-white">{p.name}</h4>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">{p.role}</span>
                      </div>
                    </div>
                  ))}

                  {/* User card */}
                  <div className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${activeSpeaker === "You" ? 'border-emerald-500/50 bg-emerald-500/10 shadow-lg' : 'border-white/5 bg-white/5 opacity-60'}`}>
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">🎓</div>
                    <div>
                      <h4 className="text-xs font-black text-white">You (Candidate)</h4>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Active Speaker</span>
                    </div>
                  </div>

                </div>
              </div>

              <button
                onClick={finishDiscussion}
                disabled={ending}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 transition-all disabled:opacity-50"
              >
                {ending ? <Loader2 size={14} className="animate-spin text-white" /> : <CheckCircle2 size={14} />}
                End and Evaluate
              </button>
            </div>

            {/* Conversation Feed */}
            <div className="md:col-span-3 glass-dark rounded-[32px] border border-white/10 flex flex-col overflow-hidden relative">
              <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-black/20">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Conversation Thread</span>
                {peerSpeakingState && (
                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-2">
                    <Loader2 size={10} className="animate-spin" /> {peerSpeakingState}
                  </span>
                )}
              </div>

              {/* Chat Log View */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatLog.map((msg, i) => (
                  <div key={i} className={`flex gap-4 ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                    {msg.sender !== "You" && (
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-lg self-start shrink-0">
                        {msg.sender === "Moderator" ? "🤖" : PEERS.find(p => p.name === msg.sender)?.avatar}
                      </div>
                    )}
                    <div className={`max-w-[70%] p-5 rounded-2xl border text-sm leading-relaxed space-y-1.5 ${
                      msg.sender === "You" 
                        ? "bg-indigo-600 border-indigo-500/30 text-white rounded-tr-none shadow-lg shadow-indigo-600/10"
                        : msg.sender === "Moderator"
                        ? "bg-purple-950/20 border-purple-500/10 text-purple-200 rounded-tl-none"
                        : "bg-white/5 border-white/10 text-zinc-300 rounded-tl-none"
                    }`}>
                      <div className="flex items-center justify-between gap-6 text-[10px] font-black uppercase tracking-wider opacity-60">
                        <span>{msg.sender} ({msg.role})</span>
                        <span>{msg.time}</span>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                    {msg.sender === "You" && (
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm self-start shrink-0">
                        🎓
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/30 flex gap-3 items-center">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-4 rounded-2xl border flex items-center justify-center transition-all ${isRecording ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white'}`}
                  title="Speech to Text"
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={activeSpeaker === "You" ? "Contribute your point to the discussion..." : "Please wait, others are formulating points..."}
                  disabled={activeSpeaker !== "You"}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={activeSpeaker !== "You" || !inputText.trim()}
                  className="p-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 transition-all"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          // Comprehensive GD evaluation report view
          <motion.div key="report" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-600/20 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={40} />
              </div>
              <h1 className="text-4xl font-black">Moderator Assessment Report</h1>
              <p className="text-zinc-500 text-lg leading-relaxed">
                Overall score compiled across communication metrics, contextual arguments, and peer dynamics.
              </p>
            </div>

            {/* Performance Card Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "Communication Score", val: evaluation.communication_score, color: "text-emerald-400 border-emerald-500/10 bg-emerald-500/5" },
                { label: "Content Structure", val: evaluation.content_score, color: "text-indigo-400 border-indigo-500/10 bg-indigo-500/5" },
                { label: "Peer Dynamics", val: evaluation.teamwork_score, color: "text-amber-400 border-amber-500/10 bg-amber-500/5" },
                { label: "Overall Grade", val: evaluation.overall_score, color: "text-purple-400 border-purple-500/10 bg-purple-500/5" }
              ].map((m, idx) => (
                <div key={idx} className={`p-6 rounded-[24px] border text-center relative overflow-hidden ${m.color}`}>
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">{m.label}</h3>
                  <div className="text-3xl font-black">{m.val}<span className="text-xs text-zinc-600">/10</span></div>
                </div>
              ))}
            </div>

            {/* Evaluation Insights */}
            <div className="glass p-8 rounded-[36px] border border-white/5 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Key Strengths</span>
                <p className="text-sm text-zinc-300 leading-relaxed">{evaluation.strengths}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Areas for Improvement</span>
                <p className="text-sm text-zinc-300 leading-relaxed">{evaluation.weaknesses}</p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5"><Sparkles size={12} fill="indigo" /> HR Expert Advice</span>
                <p className="text-sm text-zinc-300 leading-relaxed">{evaluation.advice}</p>
              </div>
            </div>

            {/* Control actions */}
            <div className="flex justify-center gap-4 pt-4">
              <button 
                onClick={() => setSessionStarted(false)} 
                className="btn-primary py-4 px-10 rounded-2xl text-base font-bold flex items-center gap-2"
              >
                <RotateCcw size={18} /> Select New Category
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupDiscussion;
