import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  Bell,
  Search,
  Activity,
  Brain,
  Plus,
  Loader2,
  Check,
  MessageSquare
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Developer"}');
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Interview Recommendation', desc: 'Try Voice Mode to practice seamless real-time speech delivery!', read: false, time: '2m ago' },
    { id: 2, title: 'Resume Analyzed', desc: 'Your parsed resume ATS score matches 85% of standard tech requirements!', read: false, time: '1h ago' },
    { id: 3, title: 'New Coding Challenge', desc: 'Solve "Merge Intervals" to practice array merge logic!', read: false, time: '3h ago' }
  ]);

  const hasUnread = notifications.some(n => !n.read);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const userEmail = userStr ? JSON.parse(userStr).email : null;
    axios.get(`/api/interview/history?email=${encodeURIComponent(userEmail || '')}`)
      .then(res => {
        setHistoryData(res.data);
        const fetchedSessions = res.data.sessions || [];
        
        // Base onboarding guidelines with dynamic completed/unread states based on actual user sessions
        const initialNotifs = [
          { 
            id: 101, 
            title: '💬 AI Interview Pending', 
            desc: 'Generate custom technical or behavioral interview questions to test your presentation skill!', 
            read: fetchedSessions.some(s => s.type === 'interview' || s.type === 'voice'), 
            time: 'Placement Core' 
          },
          { 
            id: 102, 
            title: '💻 Monaco Coding Practice Recommended', 
            desc: 'Open the Monaco IDE sandbox to practice solving complex placement coding challenges!', 
            read: fetchedSessions.some(s => s.type === 'coding'), 
            time: 'Algorithms' 
          },
          { 
            id: 103, 
            title: '🏆 Practice Placement Aptitude', 
            desc: 'Take logical reasoning and quantitative aptitude quizzes to test and master critical concepts!', 
            read: fetchedSessions.some(s => s.type === 'quiz'), 
            time: 'Aptitude' 
          },
          { 
            id: 104, 
            title: '👥 Group Discussion simulator', 
            desc: 'Practice Group Discussions on AI-drawn surprise placement topics with realistic peer avatars!', 
            read: fetchedSessions.some(s => s.type === 'group_discussion'), 
            time: 'GD Sandbox' 
          }
        ];
        
        // Dynamic notifications mapped from completed sessions
        const activeNotifs = fetchedSessions.slice(-3).reverse().map((sess, idx) => {
          let title = 'Activity Completed';
          let desc = `You completed a session on ${sess.date}.`;
          if (sess.type === 'interview' || sess.type === 'voice') {
            title = sess.type === 'voice' ? '🎙️ Voice Interview Finished' : '💬 AI Mock Interview Done';
            desc = `Role: ${sess.role || 'Developer'} (${sess.topic || 'General'}). Score: ${sess.score}/10!`;
          } else if (sess.type === 'coding') {
            title = '💻 Code Evaluation Complete';
            desc = `Successfully processed: "${sess.topic || 'Algorithms'}". Score: ${sess.score}/10!`;
          } else if (sess.type === 'quiz') {
            title = '🏆 Aptitude Quiz Completed';
            desc = `Evaluated: ${sess.topic || 'General CS'} Quiz. Accuracy: ${sess.score}%!`;
          } else if (sess.type === 'group_discussion') {
            title = '👥 Group Discussion Finished';
            desc = `Simulated discussion on "${sess.topic}". Evaluation scorecard saved!`;
          }
          
          const timeVal = sess.date ? sess.date.split(' ')[1] : 'Today';
          
          return {
            id: idx + 1,
            title,
            desc,
            read: false,
            time: timeVal
          };
        });
        
        // Merge onboarding items and active completed items
        setNotifications([...activeNotifs, ...initialNotifs]);
      })
      .catch(() => {
        setHistoryData({ sessions: [], stats: { total_sessions: 0, avg_score: 0, total_time_hours: 0, total_questions: 0 } });
      })
      .finally(() => setLoading(false));
  }, []);

  const sessions = historyData?.sessions || [];
  const statsData = historyData?.stats || { total_sessions: 0, avg_score: 0, total_time_hours: 0, total_questions: 0 };

  const calculateReadiness = () => {
    if (sessions.length === 0) return { score: 0, completed: 0, advice: "Begin taking Technical Interviews, Aptitude Quizzes, Monaco Coding Rounds, and Group Discussions to calculate your job readiness.", domains: { interview: 0, coding: 0, quiz: 0, gd: 0 }, nextStep: { label: "Technical Mock", desc: "Start behavioral/technical mock", path: "/interview" } };
    
    const domains = {
      interview: sessions.filter(s => s.type === 'interview' || s.type === 'voice').length,
      coding: sessions.filter(s => s.type === 'coding').length,
      quiz: sessions.filter(s => s.type === 'quiz').length,
      gd: sessions.filter(s => s.type === 'group_discussion').length
    };
    
    let domainPoints = 0;
    let completedCount = 0;
    if (domains.interview > 0) { domainPoints += 7.5; completedCount++; }
    if (domains.coding > 0) { domainPoints += 7.5; completedCount++; }
    if (domains.quiz > 0) { domainPoints += 7.5; completedCount++; }
    if (domains.gd > 0) { domainPoints += 7.5; completedCount++; }
    
    const consistencyPoints = Math.min(20, sessions.length * 2);
    const avgScore = statsData.avg_score || 0;
    const scorePoints = Math.min(50, (avgScore / 100) * 50); // 50% weight on actual analyzed grades (scaled out of 100)
    
    const finalScore = Math.min(100, Math.round(domainPoints + consistencyPoints + scorePoints));
    
    let advice = "";
    let nextStep = { label: "System Design Mock", desc: "Focus: Scalability", path: "/interview" };
    
    if (domains.interview === 0) {
      advice = "Technical Mock: Complete your first mock session to unlock coding and communication metrics.";
      nextStep = { label: "Technical Interview", desc: "Start behavioral/technical mock", path: "/interview" };
    } else if (domains.coding === 0) {
      advice = "Monaco Coding Sandbox: Complete a coding challenge. Competitive companies filter by auto-code rounds.";
      nextStep = { label: "Monaco Coding Sandbox", desc: "Solve algorithm challenges", path: "/coding" };
    } else if (domains.quiz === 0) {
      advice = "Aptitude Assessment: Standard aptitude screening. Practice Profit & Loss, Time & Work quizzes.";
      nextStep = { label: "Aptitude Quiz", desc: "Practice quantitative topics", path: "/quiz" };
    } else if (domains.gd === 0) {
      advice = "Group Discussion: Start a simulation to check vocabulary and peer interaction scoring.";
      nextStep = { label: "Group Discussion Prep", desc: "Draw blind placement topics", path: "/gd" };
    } else {
      advice = "Outstanding profile! You have active coverage across all campus selection domains!";
      nextStep = { label: "Advanced System Design", desc: "Focus: High Availability", path: "/interview" };
    }
    
    return {
      score: finalScore,
      completed: completedCount,
      domains,
      advice,
      nextStep
    };
  };

  const readinessData = calculateReadiness();

  const stats = historyData ? [
    { label: 'Sessions', value: String(historyData.stats.total_sessions), icon: <Trophy size={18} />, trend: `+${Math.min(historyData.stats.total_sessions, 5)}`, color: 'text-amber-400', bg: 'bg-amber-400/10', glow: 'shadow-amber-400/20' },
    { label: 'Avg Score', value: String(historyData.stats.avg_score), icon: <Target size={18} />, trend: '+0.5', color: 'text-emerald-400', bg: 'bg-emerald-400/10', glow: 'shadow-emerald-400/20' },
    { label: 'Job Readiness', value: `${readinessData.score}%`, icon: <Activity size={18} />, trend: `AI Prediction`, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', glow: 'shadow-fuchsia-400/20' },
    { label: 'Questions Done', value: String(historyData.stats.total_questions), icon: <Zap size={18} />, trend: `+${historyData.stats.total_questions}`, color: 'text-indigo-400', bg: 'bg-indigo-400/10', glow: 'shadow-indigo-400/20' },
  ] : [];

  const recentSessions = historyData?.sessions?.slice(-3).reverse() || [];

  return (
    <div className="min-h-screen text-slate-300 selection:bg-purple-500/20">
      
      <div className="w-full">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 sticky top-0 glass z-40 rounded-b-[40px] shadow-[0_10px_30px_rgba(168,85,247,0.1)]">
          <div className="relative w-full max-w-lg hidden sm:block">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400" size={16} />
            <input 
              type="text" 
              placeholder="Search intelligence labs, interview topics, or career paths..."
              className="w-full bg-[#0f0b29]/50 border border-purple-500/20 rounded-2xl py-3 pl-14 pr-6 text-xs font-bold uppercase tracking-widest focus:border-purple-400/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] outline-none transition-all placeholder:text-slate-500 text-white"
            />
          </div>
          <div className="flex items-center gap-8">
            <div className="relative">
              <div 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 text-slate-400 hover:text-white transition-colors cursor-pointer relative group"
              >
                <Bell size={24} />
                {hasUnread && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-fuchsia-500 rounded-full border-2 border-[#030014] group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(217,70,239,0.8)]"></div>
                )}
              </div>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 neon-glass rounded-3xl p-5 shadow-[0_10px_40px_rgba(168,85,247,0.25)] border border-purple-500/20 z-50 text-left"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-purple-500/10 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                        <Bell size={12} className="text-fuchsia-400" /> Notifications
                      </span>
                      {hasUnread && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-[10px] font-bold text-fuchsia-400 hover:text-white transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-500 font-medium">
                          No notifications yet!
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-3 rounded-2xl border transition-all duration-300 relative group/item ${
                              notif.read 
                                ? 'bg-white/[0.01] border-white/5 text-slate-400' 
                                : 'bg-purple-500/5 border-purple-500/10 text-slate-200 shadow-[0_0_10px_rgba(168,85,247,0.05)]'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <span className="font-bold text-[11px]">{notif.title}</span>
                              <span className="text-[9px] text-slate-500 font-semibold">{notif.time}</span>
                            </div>
                            <p className="text-[10px] leading-relaxed mb-2">{notif.desc}</p>
                            <div className="flex justify-end gap-2">
                              {!notif.read && (
                                <button
                                  onClick={() => {
                                    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                  }}
                                  className="text-[9px] font-bold text-purple-400 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                  <Check size={10} /> Mark Read
                                </button>
                              )}
                              <button
                                onClick={() => clearNotification(notif.id)}
                                className="text-[9px] font-bold text-slate-500 hover:text-rose-400 transition-colors"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/interview" className="btn-vibrant py-3.5 px-8 text-xs flex items-center gap-2">
              <Plus size={16} /> NEW SESSION
            </Link>
          </div>
        </header>

        <div className="p-12 max-w-[1400px] mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-fuchsia-400 mb-4">
              <Sparkles size={16} className="animate-pulse" /> Welcome back, {user.name}
            </div>
            <h1 className="text-5xl font-black vibrant-text tracking-tighter">Command Center.</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-indigo-500" /></div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="neon-glass p-8 rounded-[40px] group cursor-default"
                  >
                    <div className="flex justify-between items-center mb-8">
                      <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} border border-white/5 group-hover:scale-110 transition-transform shadow-lg ${stat.glow}`}>
                        {stat.icon}
                      </div>
                      <div className="text-[11px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 tracking-widest">
                        {stat.trend}
                      </div>
                    </div>
                    <div className="text-4xl font-black text-white tracking-tighter mb-2">{stat.value}</div>
                    <div className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-12 gap-10">
                {/* Recent Activity */}
                <div className="lg:col-span-8 space-y-10">
                  <div className="neon-glass rounded-[48px] overflow-hidden">
                    <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                      <h3 className="font-black text-white text-xl tracking-tighter flex items-center gap-3">
                        <Activity size={20} className="text-indigo-500" /> Session History
                      </h3>
                      <button onClick={() => navigate('/analytics')} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">View All</button>
                    </div>
                    <div className="divide-y divide-white/5">
                      {recentSessions.length === 0 ? (
                        <div className="p-12 text-center text-zinc-700">
                          <Brain size={40} className="mx-auto mb-4 text-zinc-800" />
                          <p className="text-sm font-bold">No sessions yet. Start your first interview!</p>
                        </div>
                      ) : recentSessions.map((session, i) => (
                        <div 
                          key={i} 
                          onClick={() => navigate(session.type === 'coding' ? '/coding' : '/interview')}
                          className="p-8 flex items-center justify-between hover:bg-white/[0.03] transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/50 transition-colors">
                              <Brain size={24} className="text-zinc-400 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                              <div className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{session.role || session.topic}</div>
                              <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mt-1">{session.type} • {session.topic} • {session.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-12">
                            <div className="text-right">
                              <div className={`text-2xl font-black ${session.score >= 80 ? 'vibrant-text' : 'text-white'}`}>{session.score}/100</div>
                              <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${session.score >= 80 ? 'text-emerald-500' : session.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                                {session.score >= 80 ? 'Excellent' : session.score >= 60 ? 'Good' : 'Needs Work'}
                              </div>
                            </div>
                            <ArrowRight size={20} className="text-zinc-800 group-hover:text-white group-hover:translate-x-2 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="lg:col-span-4 space-y-10">
                  <div className="neon-glass p-10 rounded-[48px] relative overflow-hidden group animated-border">
                    <h3 className="text-xs font-black text-white tracking-[0.3em] uppercase mb-10 flex items-center gap-3">
                      <Sparkles size={18} className="text-indigo-400" /> Quick Actions
                    </h3>
                    <div className="space-y-4 relative z-10">
                      {[
                        { label: 'AI Interview', path: '/interview', color: 'from-indigo-500 to-cyan-400' },
                        { label: 'Coding Round', path: '/coding', color: 'from-violet-500 to-pink-500' },
                        { label: 'Coding Practice', path: '/coding-practice', color: 'from-indigo-500 to-pink-500' },
                        { label: 'Aptitude Quiz', path: '/quiz', color: 'from-emerald-400 to-cyan-400' },
                        { label: 'Resume Analysis', path: '/resume', color: 'from-amber-400 to-orange-500' },
                      ].map((item, i) => (
                        <button key={i} onClick={() => navigate(item.path)} className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-left hover:bg-white/10 transition-all group/btn flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{item.label}</span>
                          <ArrowRight size={16} className="text-zinc-700 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="neon-glass p-10 rounded-[48px]">
                    <h3 className="text-xs font-black text-white tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
                      <Calendar size={18} className="text-zinc-600" /> Suggested Next
                    </h3>
                    <div className="space-y-6">
                      <Link to={readinessData.nextStep.path} className="p-6 rounded-[32px] bg-[#8b5cf6]/5 border border-[#8b5cf6]/10 hover:border-[#8b5cf6]/30 transition-all cursor-pointer group block">
                        <div className="text-[11px] font-black text-fuchsia-400 uppercase tracking-widest mb-2">🎓 Recommended</div>
                        <div className="text-lg font-black text-white group-hover:text-fuchsia-400 transition-colors tracking-tight">{readinessData.nextStep.label}</div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase mt-2 tracking-wide leading-relaxed">{readinessData.nextStep.desc}</div>
                      </Link>
                      
                      <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 text-[11px] leading-relaxed text-slate-500 font-semibold italic">
                        💡 <span className="text-purple-300 not-italic">AI Insight:</span> {readinessData.advice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
