import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BrainCircuit, 
  Sparkles,
  Play,
  Layers,
  Cpu,
  BarChart,
  Zap,
  ShieldCheck,
  Star
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-[#050505] text-white selection:bg-indigo-500/30 overflow-x-hidden min-h-screen">
      {/* Mesh Gradient Background */}
      <div className="vibrant-bg"></div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-violet-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <span className="font-black tracking-tighter text-2xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">MockMate.</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {[
              { label: 'Intelligence', path: '/interview' },
              { label: 'Methodology', path: '/quiz' },
              { label: 'Analytics', path: '/analytics' },
              { label: 'Resume', path: '/resume' }
            ].map(item => (
              <Link key={item.label} to={item.path} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all relative group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">Log in</Link>
            <Link to="/login" className="btn-vibrant">
              Join the Alpha
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-56 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-12 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>The Future of Professional Prep</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-[120px] font-black tracking-tighter mb-12 leading-[0.85] vibrant-text"
          >
            BECOME <br />
            UNSTOPPABLE.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium"
          >
            The world's most vibrant AI interview coach. Master technical rounds with deep-learning feedback, real-time code analysis, and behavioral insights.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/login" className="btn-vibrant px-12 py-5 text-xl">
              Start Practice <ArrowRight size={24} />
            </Link>
            <button 
              onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-vibrant-secondary px-12 py-5 text-xl flex items-center gap-3"
            >
              <Play size={20} className="fill-white" /> Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Demo Video Showcase */}
      <section id="demo-video" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-pink-500/20 bg-pink-500/5 text-pink-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Play size={14} className="fill-pink-400" /> Platform Walkthrough
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">See It In <span className="vibrant-text">Action.</span></h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Watch how MockMate AI transforms your interview preparation with neural feedback, voice analysis, and real-time coaching.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="neon-glass rounded-[48px] p-3 border-indigo-500/20 shadow-2xl shadow-indigo-500/10 animated-border"
          >
            <div className="rounded-[40px] overflow-hidden bg-black relative">
              <video
                src="/demo.mp4"
                poster="/demo.png"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto rounded-[40px]"
                onError={(e) => {
                  // If video fails to load (e.g. not present), fallback gracefully to image only
                  e.target.style.display = 'none';
                  const img = document.createElement('img');
                  img.src = '/demo.png';
                  img.className = 'w-full h-auto rounded-[40px]';
                  e.target.parentNode.insertBefore(img, e.target);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[40px] pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Success Rate', val: '98%' },
            { label: 'Questions', val: '50k+' },
            { label: 'Active Users', val: '12k+' },
            { label: 'Top Offers', val: '5k+' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-white mb-2">{stat.val}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 auto-rows-[350px]">
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 neon-glass p-12 flex flex-col justify-end group rounded-[40px] animated-border"
            >
              <div className="absolute top-12 right-12 text-indigo-500/20 group-hover:text-indigo-500/40 transition-all">
                <Cpu size={180} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                  <Zap className="text-indigo-400" size={24} />
                </div>
                <h3 className="text-5xl font-black mb-4 tracking-tighter">AI Neural Feedback.</h3>
                <p className="text-zinc-400 text-lg max-w-md">Our specialized models listen to your tone, analyze your logic, and predict your performance at FAANG companies.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 neon-glass p-12 flex flex-col items-center justify-center text-center rounded-[40px]"
            >
              <div className="w-20 h-20 bg-pink-500/10 rounded-3xl flex items-center justify-center mb-8 border border-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                <Layers className="text-pink-500" size={40} />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter">Systems Design</h3>
              <p className="text-zinc-500 font-medium">Master the architecture of distributed systems with AI coaching.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 neon-glass p-12 flex flex-col items-center justify-center text-center rounded-[40px]"
            >
              <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mb-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <BarChart className="text-cyan-500" size={40} />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter">Ready Score</h3>
              <p className="text-zinc-500 font-medium">Daily intelligence updates on your market readiness and skill gaps.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 neon-glass p-12 flex flex-col justify-end group rounded-[40px] bg-gradient-to-br from-violet-900/10 to-transparent"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-6 border border-violet-500/20">
                  <Star className="text-violet-400" size={24} />
                </div>
                <h3 className="text-5xl font-black mb-4 tracking-tighter">The Career Lab.</h3>
                <p className="text-zinc-400 text-lg max-w-md">Join a community of elite developers and get direct referrals via our AI-matched network.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-48 px-8">
        <div className="max-w-5xl mx-auto neon-glass p-24 text-center rounded-[60px] relative overflow-hidden border-indigo-500/30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/10 via-transparent to-pink-600/10"></div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 relative z-10">Ready to <span className="vibrant-text">Level Up?</span></h2>
          <p className="text-zinc-400 text-2xl mb-16 relative z-10 max-w-2xl mx-auto">Stop guessing. Start practicing with the platform that actually lands jobs.</p>
          <Link to="/login" className="btn-vibrant px-16 py-6 text-2xl relative z-10">
            Access The Lab Now
          </Link>
        </div>
      </section>

      <footer className="py-20 px-8 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <BrainCircuit className="text-black" size={18} />
            </div>
            <span className="font-black text-xl tracking-tighter">MockMate.</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            {['Security', 'Privacy', 'Legal', 'Press'].map(item => (
              <span key={item} className="hover:text-white cursor-pointer transition-colors">{item}</span>
            ))}
          </div>
          <div className="text-zinc-700 text-xs font-medium">© 2026 MockMate AI Intelligence Group.</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
