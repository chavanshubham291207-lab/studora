import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow backdrops */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-10 w-10 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center font-display font-extrabold text-lg text-white">
              S
            </span>
            <span className="font-display font-extrabold text-2xl tracking-wide">Studora</span>
          </Link>
          <p className="text-slate-400 text-sm mt-1">Log in to access your student workspace</p>
        </div>

        {/* Login Card */}
        <GlassCard className="border border-white/5" hover={false}>
          <h2 className="font-display font-bold text-xl text-slate-200 mb-6 text-center">Welcome Back</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/80 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold text-slate-400 font-display">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/80 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-2 py-3"
              loading={loading}
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Mock Credentials Info for testing convenience */}
          <div className="mt-6 border-t border-white/5 pt-4 text-center">
            <p className="text-[10px] text-slate-500">
              Tip: Register a student or admin profile to begin. The server automatically seeds sample credentials on boot.
            </p>
          </div>
        </GlassCard>

        {/* Footnote */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-all">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
