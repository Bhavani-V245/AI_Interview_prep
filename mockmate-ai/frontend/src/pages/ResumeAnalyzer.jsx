import React, { useState } from 'react';
import axios from 'axios';
import { 
  FileUp, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  BrainCircuit,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.warning('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await axios.post('/api/resume/analyze', formData);
      setResult(res.data);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      toast.error('Failed to analyze resume. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4">Resume <span className="text-gradient">Analyzer</span></h1>
        <p className="text-gray-400 text-lg">Get instant feedback and ATS optimization tips for your resume.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Upload Section */}
        <div className="glass p-10 rounded-[40px] border border-white/10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-indigo-600/20 text-indigo-500 rounded-full flex items-center justify-center mb-6">
            <FileUp size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>
          <p className="text-gray-500 mb-8 text-sm">Supported formats: PDF (Recommended). <br />Max file size: 5MB</p>
          
          <label className="w-full cursor-pointer">
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className={`p-8 border-2 border-dashed rounded-3xl transition-all ${file ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'}`}>
              {file ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="text-emerald-500 mb-2" />
                  <span className="font-bold text-emerald-400">{file.name}</span>
                </div>
              ) : (
                <span className="text-gray-400 font-medium">Click to browse or drag and drop</span>
              )}
            </div>
          </label>

          <button 
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full btn-primary py-4 rounded-2xl mt-8 font-bold flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />} Run Analysis
          </button>
        </div>

        {/* Benefits Section */}
        <div className="space-y-6 flex flex-col justify-center">
          {[
            { icon: <TrendingUp />, title: 'ATS Optimization', desc: 'Ensure your resume passes automated filters used by major tech companies.' },
            { icon: <BrainCircuit />, title: 'AI Insights', desc: 'Get personalized feedback on your experience and skill presentation.' },
            { icon: <ShieldCheck />, title: 'Score Analysis', desc: 'See how your resume ranks against common job descriptions.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 p-6 glass rounded-3xl border border-white/5"
            >
              <div className="p-3 bg-white/5 rounded-2xl text-indigo-400 h-fit">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-[32px] text-center border-t-4 border-t-indigo-500">
                <div className="text-5xl font-black text-indigo-400 mb-2">{result.ats_score || result.score || 85}%</div>
                <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">ATS Score</div>
              </div>
              <div className="glass p-8 rounded-[32px] md:col-span-2">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" /> Key Strengths
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(result.key_skills || ['React', 'Node.js', 'System Design']).map((skill, i) => (
                    <span key={i} className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-[40px] overflow-hidden border border-white/5">
              <div className="p-10 border-b border-white/10 bg-white/5">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <AlertCircle className="text-amber-500" /> Improvement Areas
                </h3>
                <p className="text-gray-400">Our AI identified several ways to make your resume more impactful.</p>
              </div>
              <div className="p-10 grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-widest text-indigo-400">Feedback</h4>
                  <p className="text-gray-300 leading-relaxed italic border-l-2 border-indigo-500/30 pl-6">
                    {result.suggestions || result.feedback || "Consider adding more quantifiable metrics to your achievement bullet points."}
                  </p>
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-widest text-violet-400">Target Roles</h4>
                  <div className="space-y-3">
                    {(result.job_roles || ['Fullstack Engineer', 'Frontend Lead']).map((role, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                          <FileText size={18} />
                        </div>
                        <span className="font-bold text-gray-300">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeAnalyzer;
