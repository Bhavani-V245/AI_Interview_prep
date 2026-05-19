import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Globe, User, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp && !name.trim()) {
      return toast.error('Please enter your name');
    }
    if (email && password) {
      const userName = isSignUp ? name : email.split('@')[0];
      localStorage.setItem('user', JSON.stringify({ email, name: userName }));
      toast.success(isSignUp ? 'Account created! Welcome to MockMate AI!' : 'Welcome back to MockMate AI!');
      navigate('/dashboard');
    } else {
      toast.error('Please enter valid credentials');
    }
  };

  const handleOAuthLogin = (provider) => {
    const mockUsers = {
      Google: { email: 'google.dev@gmail.com', name: 'Google Developer' },
      GitHub: { email: 'github.coder@github.com', name: 'GitHub Coder' }
    };
    
    const user = mockUsers[provider];
    localStorage.setItem('user', JSON.stringify(user));
    toast.success(`Welcome to MockMate AI! Logged in successfully via ${provider}.`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#030712]">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md p-10 glass rounded-[32px] border border-white/10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-gray-400">{isSignUp ? 'Start your journey to interview mastery' : 'Continue your journey to success'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 py-4">
            {isSignUp ? <><UserPlus size={20} /> Create Account</> : <><LogIn size={20} /> Sign In</>}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0b0e14] px-4 text-gray-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => handleOAuthLogin('GitHub')}
              className="btn-secondary py-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Globe size={20} /> Github
            </button>
            <button 
              type="button"
              onClick={() => handleOAuthLogin('Google')}
              className="btn-secondary py-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google
            </button>
          </div>
        </div>

        <p className="text-center mt-10 text-gray-500 text-sm">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-indigo-400 cursor-pointer hover:underline font-bold"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
