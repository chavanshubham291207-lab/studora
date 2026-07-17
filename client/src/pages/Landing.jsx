import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Code, GraduationCap, FileText, Calendar, 
  ChevronDown, ArrowRight, CheckCircle2, MessageSquare, BookOpen 
} from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

const Landing = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { number: "25k+", label: "Active Students" },
    { number: "1,200+", label: "Hackathons Tracked" },
    { number: "4.8/5", label: "AI Resume Success" },
    { number: "$10M+", label: "Scholarships Listed" }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI Study Hub",
      description: "Get instant doubt support, summarize complex PDFs, construct custom study quizzes, and generate roadmap pathways.",
      color: "text-violet-400 bg-violet-950/40 border-violet-800/30"
    },
    {
      icon: Code,
      title: "Hackathon Finder",
      description: "Search and filter hackathons globally. Track team openings, application deadlines, and direct registration links.",
      color: "text-cyan-400 bg-cyan-950/40 border-cyan-800/30"
    },
    {
      icon: GraduationCap,
      title: "Scholarships & Jobs",
      description: "Browse curated scholarships, job opportunities, and internships matching your eligibility criteria and profile.",
      color: "text-pink-400 bg-pink-950/40 border-pink-800/30"
    },
    {
      icon: FileText,
      title: "ATS Resume Builder",
      description: "Construct professional, resume-scanner-friendly resumes. Get instant score rating reviews and direct PDF exports.",
      color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/30"
    },
    {
      icon: Calendar,
      title: "Events & Calendars",
      description: "Register for technical workshops and university calendar activities. Track deadlines and save RSVPs easily.",
      color: "text-amber-400 bg-amber-950/40 border-amber-800/30"
    },
    {
      icon: BookOpen,
      title: "Study Resources",
      description: "Share and access semester notes, previous year question papers (PYQs), course syllabi, and reference playlists.",
      color: "text-indigo-400 bg-indigo-950/40 border-indigo-800/30"
    }
  ];

  const faqs = [
    {
      q: "What is Studora?",
      a: "Studora is an all-in-one productivity and career dashboard built specifically for university students. It combines job and hackathon boards, academic trackers, AI study helpers, and resume creation into a premium glassmorphic interface."
    },
    {
      q: "How does the AI Study Assistant work?",
      a: "The AI Study Assistant utilizes the Google Gemini API to analyze study notes, summarize long PDFs, construct mock questions, and answer questions. If an API key is not configured, it runs on our built-in interactive simulator."
    },
    {
      q: "Is Studora free to use?",
      a: "Yes! Studora is 100% free for students to track their studies, search opportunities, build portfolios, and manage their daily timetables."
    },
    {
      q: "How does the resume exporter work?",
      a: "Our resume builder uses optimized CSS print stylesheets to generate highly professional, single-page, selectable-text PDFs. This design ensures maximum ATS readability compared to image-based resume exports."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-hidden">
      {/* Header */}
      <nav className="h-20 px-8 border-b border-white/5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center font-display font-extrabold text-base text-white">
            S
          </span>
          <span className="font-display font-extrabold text-xl">Studora</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-all">Sign In</Link>
          <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-violet-950/30 border border-violet-800/40 px-4 py-2 rounded-full text-sm text-violet-300 font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
          <span>The Next Gen Student Ecosystem is Here</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6"
        >
          Elevate Your College Journey with{' '}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400 bg-clip-text text-transparent">
            Studora
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg max-w-2xl mb-10 font-sans"
        >
          Unify your coding tracking, career boards, academic notes, GPA goals, and AI-powered interview assistance inside one beautiful, glassmorphic SaaS dashboard.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="primary" size="lg" onClick={() => navigate('/register')} className="px-8">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/login')} className="px-8">
            Login to Dashboard
          </Button>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <section className="py-12 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="glass-panel p-6 rounded-2xl border border-white/5 text-center"
            >
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                {stat.number}
              </h2>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-4">
            Everything You Need, in One Desktop Tab
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Say goodbye to 20 open browser bookmarks. Studora consolidates all critical student tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={feature.title} delay={idx * 0.05} className="flex flex-col gap-4">
                <div className={`p-3 rounded-xl border w-fit ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-200">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-6xl mx-auto px-6 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-4">
            Loved by Tech Students Globally
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            See how undergraduates are landing internships and managing coursework with Studora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="flex flex-col gap-4 border border-violet-500/10">
            <p className="text-sm text-slate-300 italic">
              "The AI resume rating and detailed feedback helped me rewrite my projects section. I pinned my GitHub stats, and actually landed my software dev internship at GitHub!"
            </p>
            <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
              <div className="h-10 w-10 rounded-full bg-violet-850 flex items-center justify-center font-display font-bold text-sm">
                AR
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-200">Aarav Roy</h4>
                <p className="text-[10px] text-slate-400">CS Junior, IIT Bombay</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4 border border-cyan-500/10">
            <p className="text-sm text-slate-300 italic">
              "The coding contest tracker compiles Codeforces, LeetCode, and CodeChef lists. I check upcoming times on my dashboard, and plan my weekly study timetable directly around them."
            </p>
            <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
              <div className="h-10 w-10 rounded-full bg-cyan-950 flex items-center justify-center font-display font-bold text-sm">
                LC
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-200">Lisa Chen</h4>
                <p className="text-[10px] text-slate-400">Software Sophomore, Stanford</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4 border border-pink-500/10">
            <p className="text-sm text-slate-300 italic">
              "Our group was searching for teammate designers for the Google Solution Challenge. We posted on Studora's Community board, found a partner within a day, and registered successfully."
            </p>
            <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
              <div className="h-10 w-10 rounded-full bg-pink-950 flex items-center justify-center font-display font-bold text-sm">
                KD
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-200">Kamil Diallo</h4>
                <p className="text-[10px] text-slate-400">Information Senior, MIT</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-4xl mx-auto px-6 border-t border-white/5">
        <h2 className="font-display font-extrabold text-3xl text-center mb-12">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full py-5 px-6 flex items-center justify-between text-left font-display font-bold text-slate-200 hover:text-white cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              {activeFaq === idx && (
                <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-transparent to-violet-950/20 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none"></div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-6">Ready to Supercharge Your Academic Career?</h2>
        <p className="text-slate-400 max-w-lg mx-auto mb-10">
          Create your Studora profile today. It takes less than two minutes and is completely free.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/register')} className="px-10 mx-auto">
          Start Your Journey Now <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="mt-16 text-xs text-slate-500">
          © {new Date().getFullYear()} Studora. Designed for elite developers and students.
        </div>
      </section>
    </div>
  );
};

export default Landing;
