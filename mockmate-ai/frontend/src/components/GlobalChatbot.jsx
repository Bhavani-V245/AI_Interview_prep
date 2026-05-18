import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, AlertCircle, Compass, HelpCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const GlobalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hello! I am **MockMate Companion**, your AI guide. How can I help you master your interviews today? Click below for quick tips or type a question!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend = input) => {
    const text = textToSend.trim();
    if (!text) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/interview/assistant', {
        history: newMessages
      });
      setMessages([...newMessages, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "❌ Sorry, I had trouble connecting to my AI brain. Please check your network or try again shortly!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionType) => {
    if (actionType === 'recommend') {
      handleSendMessage("Recommend a feature or challenge for me to try out based on MockMate AI's modules.");
    } else if (actionType === 'help') {
      handleSendMessage("How do I use MockMate AI? Please summarize the steps to get started.");
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-96 h-[500px] mb-6 neon-glass rounded-[32px] overflow-hidden flex flex-col shadow-[0_10px_40px_rgba(168,85,247,0.3)] border border-purple-500/20"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-purple-900/60 to-blue-900/60 border-b border-purple-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    <Sparkles size={18} className="animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0f0b29] shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                </div>
                <div>
                  <h3 className="font-black text-sm text-white tracking-wide">MockMate Companion</h3>
                  <p className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">AI Guide & Advisor</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-none shadow-md border border-white/10'
                        : 'bg-[#181145]/60 text-slate-200 border border-purple-500/15 rounded-tl-none'
                    }`}
                  >
                    {msg.content.split('\n').map((line, lIdx) => {
                      // Process basic markdown bold strings
                      const parts = line.split('**');
                      return (
                        <p key={lIdx} className={lIdx > 0 ? 'mt-2' : ''}>
                          {parts.map((part, pIdx) => 
                            pIdx % 2 === 1 ? <strong key={pIdx} className="text-purple-300 font-bold">{part}</strong> : part
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#181145]/60 border border-purple-500/15 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-purple-400" />
                    <span className="text-xs text-purple-300 font-medium">Consulting interface core...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-6 pb-2 flex gap-2">
                <button
                  onClick={() => handleQuickAction('recommend')}
                  className="flex-1 py-2 px-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl text-[10px] font-bold text-purple-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Compass size={12} /> Suggest Feature
                </button>
                <button
                  onClick={() => handleQuickAction('help')}
                  className="flex-1 py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-[10px] font-bold text-blue-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <HelpCircle size={12} /> How to Use
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-4 border-t border-purple-500/10 bg-[#0b0722]/50 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Ask how to use the app or get a recommendation..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={loading}
                className="flex-1 bg-[#140e3a]/60 border border-purple-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-purple-400/50 outline-none transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !input.trim()}
                className="p-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-40 transition-all flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Bubble */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] cursor-pointer"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};

export default GlobalChatbot;
