import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Briefcase, Calendar, MapPin, Bookmark, BookmarkCheck,
  Clock, DollarSign, Filter, X, Share2, CheckCircle, ExternalLink,
  Star, Flame, Sparkles, Users, Code2, Monitor, Building2,
  TrendingUp, Wifi, ChevronDown, Globe, Info, BadgeCheck, Zap, UserPlus
} from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const MODE_CONFIG = {
  online: { label: 'Remote', color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-800/30', dot: 'bg-emerald-400', icon: Wifi },
  offline: { label: 'Onsite', color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/30', dot: 'bg-amber-400', icon: Building2 },
  hybrid: { label: 'Hybrid', color: 'text-violet-400', bg: 'bg-violet-950/40', border: 'border-violet-800/30', dot: 'bg-violet-400', icon: Monitor },
};

const SKILL_FILTERS = [
  { id: 'all', label: 'All Skills' },
  { id: 'Python', label: 'Python' },
  { id: 'Java', label: 'Java' },
  { id: 'React', label: 'React' },
  { id: 'Cloud', label: 'Cloud / AWS' },
  { id: 'ML', label: 'ML / AI' },
  { id: 'DSA', label: 'DSA' },
  { id: 'SQL', label: 'SQL' },
];

const STIPEND_RANGES = [
  { id: 'all', label: 'Any Stipend' },
  { id: 'paid', label: 'Paid' },
  { id: 'unpaid', label: 'Unpaid' },
  { id: 'low', label: 'Up to ₹20K' },
  { id: 'mid', label: '₹20K – ₹50K' },
  { id: 'high', label: '₹50K+' },
];

const TRENDING_COMPANIES = [
  { name: 'Google', color: '#4285F4', seed: 'Google' },
  { name: 'Microsoft', color: '#0078D4', seed: 'Microsoft' },
  { name: 'Amazon', color: '#FF9900', seed: 'Amazon' },
  { name: 'Deloitte', color: '#86BC25', seed: 'Deloitte' },
  { name: 'Infosys', color: '#007CC3', seed: 'Infosys' },
  { name: 'TCS', color: '#E91C24', seed: 'TCS' },
  { name: 'IBM', color: '#054ADA', seed: 'IBM' },
  { name: 'Accenture', color: '#A100FF', seed: 'Accenture' },
];

// ─────────────────────────────────────────────
// Countdown Timer
// ─────────────────────────────────────────────
const DeadlineCountdown = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgency, setUrgency] = useState('normal');

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Closed'); setUrgency('closed'); return; }
      const days = Math.floor(diff / 86400000);
      const hrs = Math.floor((diff % 86400000) / 3600000);
      if (days <= 3) setUrgency('critical');
      else if (days <= 14) setUrgency('warning');
      else setUrgency('normal');
      setTimeLeft(days > 0 ? `${days}d left` : `${hrs}h left`);
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [deadline]);

  const styleMap = {
    closed: 'text-slate-500 bg-slate-900/40 border-slate-700/30',
    critical: 'text-rose-400 bg-rose-950/30 border-rose-800/30 animate-pulse',
    warning: 'text-amber-400 bg-amber-950/30 border-amber-800/30',
    normal: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/30',
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${styleMap[urgency]}`}>
      <Clock className="w-2.5 h-2.5" />{timeLeft}
    </span>
  );
};

// ─────────────────────────────────────────────
// Internship Detail Modal
// ─────────────────────────────────────────────
const InternshipModal = ({ intern, onClose, user, onBookmark }) => {
  const [shareSuccess, setShareSuccess] = useState(false);
  const isBookmarked = user?.bookmarks?.includes(intern._id);
  const mode = MODE_CONFIG[intern.mode] || MODE_CONFIG.hybrid;
  const ModeIcon = mode.icon;

  const handleShare = () => {
    const url = intern.applyLink || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0e1628] border border-white/10 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Banner */}
          <div className="relative h-40 overflow-hidden rounded-t-2xl">
            <img
              src={intern.banner || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop'}
              alt={intern.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-[#0e1628]/40 to-transparent" />
            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={handleShare} className="p-2 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-white hover:bg-black/60 transition-all">
                {shareSuccess ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button onClick={onClose} className="p-2 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-white hover:bg-red-500/30 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 flex items-end gap-3">
              <img
                src={intern.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${intern.company}`}
                alt={intern.company}
                className="w-14 h-14 rounded-xl bg-slate-950 border border-white/20 p-1 shadow-lg"
                onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${intern.company}`; }}
              />
              <div className="text-left">
                <h2 className="font-display font-extrabold text-lg text-white leading-tight drop-shadow-lg">{intern.title}</h2>
                <p className="text-sm text-slate-300 font-semibold">{intern.company}</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="px-6 py-4 flex flex-wrap gap-2">
            {intern.category && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-950/40 border border-violet-800/30 text-violet-400">
                {intern.category}
              </span>
            )}
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${mode.bg} ${mode.color} ${mode.border}`}>
              <ModeIcon className="w-3 h-3" />{mode.label}
            </span>
            {intern.stipend && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/40 border border-emerald-800/30 text-emerald-400">
                <DollarSign className="w-3 h-3" />{intern.stipend}
              </span>
            )}
            {intern.duration && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-950/40 border border-cyan-800/30 text-cyan-400">
                <Clock className="w-3 h-3" />{intern.duration}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4 text-left">
            {intern.website && (
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-900/40 border border-white/5 px-3 py-1.5 rounded-lg w-fit">
                <span className="font-bold text-slate-500">Official Website:</span>
                <a href={intern.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-0.5">
                  {intern.website} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About this Internship</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{intern.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Last Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-xs text-slate-200 font-semibold">{intern.deadline}</span>
                </div>
                <div className="mt-1"><DeadlineCountdown deadline={intern.deadline} /></div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs text-slate-200 font-semibold truncate">{intern.location || 'See portal'}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Openings</p>
                <div className="flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-slate-200 font-semibold truncate">{intern.openings || 1} positions</span>
                </div>
              </div>
            </div>

            {intern.eligibility && (
              <div className="p-3 rounded-xl bg-amber-950/10 border border-amber-800/20 flex gap-2 items-start">
                <BadgeCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wide mb-1">Eligibility</p>
                  <p className="text-xs text-slate-300">{intern.eligibility}</p>
                </div>
              </div>
            )}

            {intern.skills && intern.skills.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-violet-400" /> Skills Required
                </h4>
                <div className="flex flex-wrap gap-2">
                  {intern.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-violet-950/30 border border-violet-800/30 rounded-lg text-xs text-violet-300 font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {intern.tags && intern.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {intern.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-900/60 border border-white/5 rounded-lg text-[10px] text-slate-400 font-medium">#{tag}</span>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onBookmark(intern._id)}
                className={`p-2.5 rounded-xl border transition-all ${isBookmarked ? 'bg-violet-950/40 border-violet-700/30 text-violet-400' : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white'}`}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <a href={intern.applyLink} target="_blank" rel="noreferrer" className="flex-1">
                <Button variant="primary" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Apply Now — Official Portal
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────
// Internship Card
// ─────────────────────────────────────────────
const InternshipCard = ({ intern, user, onBookmark, onOpen, delay = 0 }) => {
  const [shareSuccess, setShareSuccess] = useState(false);
  const isBookmarked = user?.bookmarks?.includes(intern._id);
  const mode = MODE_CONFIG[intern.mode] || MODE_CONFIG.hybrid;
  const ModeIcon = mode.icon;

  const daysLeft = Math.floor((new Date(intern.deadline).getTime() - Date.now()) / 86400000);

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(intern.applyLink || window.location.href).then(() => {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.05 }}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col glass-card-hover cursor-pointer group"
      onClick={() => onOpen(intern)}
    >
      {/* Banner */}
      <div className="relative h-28 overflow-hidden">
        <img
          src={intern.banner || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop'}
          alt={intern.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-transparent to-transparent" />
        {daysLeft >= 0 && daysLeft <= 14 && (
          <div className="absolute top-2 left-2">
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300">
              <Flame className="w-2.5 h-2.5" /> Hot
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button
            onClick={e => { e.stopPropagation(); onBookmark(intern._id); }}
            className="p-1.5 rounded-xl bg-black/50 backdrop-blur border border-white/10 text-white hover:bg-black/70 transition-all"
          >
            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-violet-400" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
          <button onClick={handleShare} className="p-1.5 rounded-xl bg-black/50 backdrop-blur border border-white/10 text-white hover:bg-black/70 transition-all">
            {shareSuccess ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Logo + Company */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={intern.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${intern.company}`}
            alt={intern.company}
            className="w-11 h-11 rounded-xl bg-slate-950 border border-white/10 p-0.5 shrink-0"
            onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${intern.company}`; }}
          />
          <div className="text-left min-w-0">
            <p className="text-xs font-bold text-slate-300 truncate">{intern.company}</p>
            {intern.location && (
              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-2.5 h-2.5" />{intern.location}
              </p>
            )}
          </div>
        </div>

        <h3 className="font-display font-bold text-sm text-slate-100 line-clamp-2 leading-snug text-left mb-3">{intern.title}</h3>

        {/* Category + Mode + Duration badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {intern.category && (
            <span className="px-2 py-0.5 bg-violet-950/40 text-violet-400 border border-violet-800/30 rounded text-[9px] font-extrabold uppercase tracking-wide">
              {intern.category}
            </span>
          )}
          <span className={`flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded border ${mode.bg} ${mode.color} ${mode.border}`}>
            <ModeIcon className="w-2.5 h-2.5" />{mode.label}
          </span>
          {intern.duration && (
            <span className="text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded border text-cyan-400 bg-cyan-950/30 border-cyan-700/30">
              <Clock className="w-2.5 h-2.5 inline mr-0.5" />{intern.duration}
            </span>
          )}
        </div>

        {/* Stipend */}
        {intern.stipend && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-950/40 to-green-950/40 border border-emerald-800/30 mb-3">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-emerald-300">{intern.stipend}</span>
          </div>
        )}

        {/* Eligibility + Openings */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-[10px] text-slate-400 text-left">
          {intern.eligibility && (
            <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5 truncate">
              <span className="font-bold text-slate-350 block mb-0.5">Eligibility</span>
              <span className="truncate block" title={intern.eligibility}>{intern.eligibility}</span>
            </div>
          )}
          {intern.openings !== undefined && (
            <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5">
              <span className="font-bold text-slate-350 block mb-0.5">Openings</span>
              <span>{intern.openings} positions</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {intern.skills && intern.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {intern.skills.slice(0, 4).map(skill => (
              <span key={skill} className="px-1.5 py-0.5 bg-violet-950/30 border border-violet-800/30 rounded text-[9px] text-violet-300 font-medium">
                {skill}
              </span>
            ))}
            {intern.skills.length > 4 && (
              <span className="px-1.5 py-0.5 bg-slate-900 border border-white/5 rounded text-[9px] text-slate-500 font-medium">+{intern.skills.length - 4}</span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-[10px] text-slate-400 line-clamp-2 text-left leading-relaxed mb-3">{intern.description}</p>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-semibold text-[10px]">Apply by {intern.deadline}</span>
            </div>
            <DeadlineCountdown deadline={intern.deadline} />
          </div>
          <a
            href={intern.applyLink}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="block"
          >
            <Button variant="primary" size="sm" className="w-full gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Apply Now
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Job Card (Full-time)
// ─────────────────────────────────────────────
const JobCard = ({ job, user, onBookmark, delay = 0 }) => {
  const [shareSuccess, setShareSuccess] = useState(false);
  const isBookmarked = user?.bookmarks?.includes(job._id);

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(job.applyLink || window.location.href).then(() => {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.05 }}
    >
      <GlassCard className="flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-start gap-4">
            <img
              src={job.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${job.company}`}
              alt={job.company}
              className="w-12 h-12 rounded-2xl bg-slate-950 shrink-0 border border-white/10 p-1"
              onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${job.company}`; }}
            />
            <div className="flex gap-2">
              <button onClick={handleShare} className="p-1.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/40 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer">
                {shareSuccess ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button onClick={() => onBookmark(job._id)} className="p-1.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/40 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer">
                {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-violet-400" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mt-4 text-left">
            <span className="px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wide border bg-emerald-950/40 text-emerald-400 border-emerald-800/30">
              Full-Time
            </span>
            <h3 className="font-display font-bold text-base text-slate-200 mt-2 line-clamp-2 leading-snug">{job.title}</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">{job.company}</p>
            <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">{job.description}</p>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-slate-950/30 border border-white/5 text-left text-[11px] text-slate-400">
            <span className="font-bold text-slate-300">Eligibility: </span>{job.eligibility}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {(job.tags || []).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-[10px] text-slate-400 font-medium">{tag}</span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex gap-3 items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 text-left flex-1 font-semibold">
            <Calendar className="w-4 h-4 shrink-0 text-slate-500" />
            <span>Apply before: {job.deadline}</span>
          </div>
          <a href={job.applyLink} target="_blank" rel="noreferrer" className="shrink-0">
            <Button variant="primary" size="sm">Apply Now</Button>
          </a>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Main Jobs & Internships Page
// ─────────────────────────────────────────────
const Jobs = () => {
  const { user, toggleBookmark } = useAuth();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('internship'); // 'all', 'internship', 'job'
  const [modeFilter, setModeFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [stipendFilter, setStipendFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [companyFilter, setCompanyFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities?search=${encodeURIComponent(searchTerm)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.filter(i => i.type === 'internship' || i.type === 'job'));
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const internships = items.filter(i => i.type === 'internship');
  const jobs = items.filter(i => i.type === 'job');

  const filteredInternships = internships.filter(i => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      (i.title && i.title.toLowerCase().includes(q)) ||
      (i.company && i.company.toLowerCase().includes(q)) ||
      (i.description && i.description.toLowerCase().includes(q)) ||
      (i.tags && i.tags.some(t => t.toLowerCase().includes(q))) ||
      (i.skills && i.skills.some(s => s.toLowerCase().includes(q))) ||
      (i.category && i.category.toLowerCase().includes(q));

    const matchMode = modeFilter === 'all' || i.mode === modeFilter;

    const matchSkill = skillFilter === 'all' || (() => {
      const skillLower = skillFilter.toLowerCase();
      return (i.skills && i.skills.some(s => s.toLowerCase().includes(skillLower))) ||
        (i.tags && i.tags.some(t => t.toLowerCase().includes(skillLower)));
    })();

    const matchStipend = stipendFilter === 'all' || (() => {
      const isUnpaid = (i.stipend || '').toLowerCase().includes('unpaid') || !i.stipend;
      if (stipendFilter === 'unpaid') return isUnpaid;
      if (stipendFilter === 'paid') return !isUnpaid;
      
      const raw = (i.stipend || '').replace(/[₹,\s]/g, '').split('–')[0].split('-')[0];
      const num = parseInt(raw.replace(/[^0-9]/g, '')) || 0;
      if (stipendFilter === 'low') return !isUnpaid && num <= 20000;
      if (stipendFilter === 'mid') return !isUnpaid && num > 20000 && num <= 50000;
      if (stipendFilter === 'high') return !isUnpaid && num > 50000;
      return true;
    })();

    const matchCompany = companyFilter === 'all' || (i.company && i.company.toLowerCase() === companyFilter.toLowerCase());

    const matchDuration = durationFilter === 'all' || (() => {
      const months = parseInt((i.duration || '').replace(/[^0-9]/g, '')) || 0;
      if (durationFilter === 'short') return months <= 3;
      if (durationFilter === 'medium') return months > 3 && months <= 6;
      if (durationFilter === 'long') return months > 6;
      return true;
    })();

    const matchCategory = categoryFilter === 'all' || (i.category && i.category.toLowerCase().includes(categoryFilter.toLowerCase()));

    return matchSearch && matchMode && matchSkill && matchStipend && matchCompany && matchDuration && matchCategory;
  }).sort((a, b) => {
    if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
    if (sortBy === 'latest') return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
    return 0;
  });

  const activeFiltersCount = [
    modeFilter !== 'all',
    skillFilter !== 'all',
    stipendFilter !== 'all',
    companyFilter !== 'all',
    durationFilter !== 'all',
    categoryFilter !== 'all',
    sortBy !== 'latest'
  ].filter(Boolean).length;

  const trendingInterns = internships.filter(i => {
    const isHighRank = (user?.cgpa?.cgpa || 8.0) >= 8.0;
    if (isHighRank) return i.isFeatured || ['Google', 'Microsoft', 'NVIDIA', 'Amazon'].includes(i.company);
    return i.isFeatured;
  });

  const remoteInterns = filteredInternships.filter(i => i.mode === 'online');
  const closingInterns = filteredInternships.filter(i => {
    const d = Math.floor((new Date(i.deadline).getTime() - Date.now()) / 86400000);
    return d >= 0 && d <= 14;
  });

  const paidCount = internships.filter(i => !(i.stipend || '').toLowerCase().includes('unpaid') && i.stipend).length;
  const savedCount = internships.filter(i => user?.bookmarks?.includes(i._id)).length;
  const recommendedCount = trendingInterns.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="text-left">
          <h1 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-cyan-400" />
            Jobs & Internships
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover verified internship and job opportunities from global tech companies and startups.
          </p>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <GlassCard className="p-3.5 flex flex-col justify-between bg-gradient-to-br from-cyan-950/20 to-slate-900/30 border-white/5 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Active</span>
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-display font-extrabold text-slate-100 mt-2">{internships.length}</h3>
        </GlassCard>

        <GlassCard className="p-3.5 flex flex-col justify-between bg-gradient-to-br from-emerald-950/20 to-slate-900/30 border-white/5 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Remote</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-display font-extrabold text-slate-100 mt-2">{internships.filter(i => i.mode === 'online').length}</h3>
        </GlassCard>

        <GlassCard className="p-3.5 flex flex-col justify-between bg-gradient-to-br from-violet-950/20 to-slate-900/30 border-white/5 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Paid Interns</span>
            <DollarSign className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <h3 className="text-lg font-display font-extrabold text-slate-100 mt-2">{paidCount}</h3>
        </GlassCard>

        <GlassCard className="p-3.5 flex flex-col justify-between bg-gradient-to-br from-rose-950/20 to-slate-900/30 border-white/5 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Closing Soon</span>
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-display font-extrabold text-slate-100 mt-2">{closingInterns.length}</h3>
        </GlassCard>

        <GlassCard className="p-3.5 flex flex-col justify-between bg-gradient-to-br from-amber-950/20 to-slate-900/30 border-white/5 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Saved</span>
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <h3 className="text-lg font-display font-extrabold text-slate-100 mt-2">{savedCount}</h3>
        </GlassCard>

        <GlassCard className="p-3.5 flex flex-col justify-between bg-gradient-to-br from-teal-950/20 to-slate-900/30 border-white/5 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">AI Recommended</span>
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <h3 className="text-lg font-display font-extrabold text-slate-100 mt-2">{recommendedCount}</h3>
        </GlassCard>
      </div>

      {/* Toggle tabs */}
      <div className="flex gap-2 bg-slate-950/30 border border-white/10 p-1 rounded-2xl w-fit">
        {[
          { id: 'internship', label: 'Internships', icon: Zap },
          { id: 'job', label: 'Full-Time Jobs', icon: Briefcase },
          { id: 'all', label: 'All Roles', icon: Globe },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFilterType(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
              filterType === id
                ? 'bg-violet-600 text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ─── INTERNSHIPS SECTION ─── */}
      {(filterType === 'internship' || filterType === 'all') && (
        <div className="space-y-6">
          {/* Trending Companies strip */}
          {filterType === 'internship' && (
            <div className="glass-panel rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Trending Companies Hiring Now</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {TRENDING_COMPANIES.map(co => (
                  <div key={co.name} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                    onClick={() => setSearchTerm(co.name)}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${co.seed}&backgroundColor=${co.color.slice(1)}`}
                      alt={co.name}
                      className="w-6 h-6 rounded-lg"
                    />
                    <span className="text-xs font-semibold text-slate-300">{co.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by company, role, skills..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-500"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${showFilters || activeFiltersCount > 0 ? 'bg-violet-600/20 border-violet-500/40 text-violet-300' : 'glass-panel text-slate-400 hover:text-white'}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-violet-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">{activeFiltersCount}</span>
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-panel rounded-2xl p-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Work Mode</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[{ id: 'all', label: 'All' }, { id: 'online', label: '🌐 Remote' }, { id: 'hybrid', label: '🔄 Hybrid' }, { id: 'offline', label: '🏢 Onsite' }].map(m => (
                        <button key={m.id} onClick={() => setModeFilter(m.id)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${modeFilter === m.id ? 'bg-violet-600 text-white' : 'glass-panel text-slate-400 hover:text-white'}`}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Skills</label>
                    <div className="flex flex-wrap gap-1.5">
                      {SKILL_FILTERS.map(sf => (
                        <button key={sf.id} onClick={() => setSkillFilter(sf.id)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${skillFilter === sf.id ? 'bg-cyan-600 text-white' : 'glass-panel text-slate-400 hover:text-white'}`}>
                          {sf.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Stipend Range</label>
                    <div className="flex flex-wrap gap-1.5">
                      {STIPEND_RANGES.map(sr => (
                        <button key={sr.id} onClick={() => setStipendFilter(sr.id)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${stipendFilter === sr.id ? 'bg-emerald-600 text-white' : 'glass-panel text-slate-400 hover:text-white'}`}>
                          {sr.label}
                        </button>
                      ))}
                    </div>
                  </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 border-t border-white/5 pt-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block">Company</label>
                <div className="relative">
                  <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-350 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="all">All Companies</option>
                    <option value="Google">Google</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Zoho">Zoho</option>
                    <option value="NVIDIA">NVIDIA</option>
                    <option value="Deloitte">Deloitte</option>
                    <option value="Cisco">Cisco</option>
                    <option value="TCS">TCS</option>
                    <option value="Wellfound Startups">Wellfound Startups</option>
                    <option value="Internshala">Internshala</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block">Duration</label>
                <div className="relative">
                  <select value={durationFilter} onChange={e => setDurationFilter(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-350 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="all">All Durations</option>
                    <option value="short">Short (≤ 3 Months)</option>
                    <option value="medium">Medium (3–6 Months)</option>
                    <option value="long">Long (6+ Months)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block">Category</label>
                <div className="relative">
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-350 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="all">All Categories</option>
                    <option value="Software Development">Software Development</option>
                    <option value="AI/ML">AI / Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Cloud">Cloud / DevOps</option>
                    <option value="UI/UX">UI / UX Design</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block">Sort By</label>
                <div className="relative">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-350 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="latest">Latest Added</option>
                    <option value="deadline">Apply Deadline</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setModeFilter('all'); setSkillFilter('all'); setStipendFilter('all');
                  setCompanyFilter('all'); setDurationFilter('all'); setCategoryFilter('all');
                  setSortBy('latest');
                }}
                className="mt-4 text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" /> Clear All Filters
              </button>
            )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recommended Internships */}
          {!searchTerm && filterType === 'internship' && trendingInterns.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h2 className="font-display font-bold text-sm text-violet-300 uppercase tracking-wide">Recommended Internships</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingInterns.map((intern, i) => (
                  <InternshipCard key={intern._id} intern={intern} user={user} onBookmark={toggleBookmark} onOpen={setSelectedIntern} delay={i} />
                ))}
              </div>
            </div>
          )}

          {/* Remote Internships */}
          {!searchTerm && filterType === 'internship' && remoteInterns.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <h2 className="font-display font-bold text-sm text-emerald-300 uppercase tracking-wide">100% Remote Internships</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {remoteInterns.slice(0, 3).map((intern, i) => (
                  <InternshipCard key={intern._id} intern={intern} user={user} onBookmark={toggleBookmark} onOpen={setSelectedIntern} delay={i} />
                ))}
              </div>
            </div>
          )}

          {/* All Internships */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h2 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wide">
                {filterType === 'internship' ? 'All Internships' : 'Internships'} ({filteredInternships.length})
              </h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredInternships.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 glass-panel rounded-2xl">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-semibold text-lg">No internships found</p>
                <p className="text-slate-500 text-sm mt-1">Try adjusting filters or search query</p>
                <button onClick={() => { setSearchTerm(''); setModeFilter('all'); setSkillFilter('all'); setStipendFilter('all'); }} className="mt-4 px-4 py-2 bg-violet-600/20 border border-violet-500/30 text-violet-400 rounded-xl text-xs font-semibold hover:bg-violet-600/30 transition-all cursor-pointer">
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.map((intern, i) => (
                  <InternshipCard key={intern._id} intern={intern} user={user} onBookmark={toggleBookmark} onOpen={setSelectedIntern} delay={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── FULL-TIME JOBS SECTION ─── */}
      {(filterType === 'job' || filterType === 'all') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <h2 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wide">Full-Time Roles ({jobs.length})</h2>
          </div>
          {filterType === 'job' && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search by company, role, keywords..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-500" />
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-slate-400 text-center py-12">No full-time roles found matching your search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, i) => (
                <JobCard key={job._id} job={job} user={user} onBookmark={toggleBookmark} delay={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/20 flex gap-3 items-start">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
        <div className="text-left">
          <p className="text-xs font-bold text-blue-300 mb-1">Disclaimer</p>
          <p className="text-[11px] text-slate-400">
            Internship listings are sourced from official company portals, Internshala, Wellfound, and LinkedIn. Always verify roles on the official website before applying. Stipend figures are approximate and may vary.
          </p>
        </div>
      </div>

      {/* Internship Modal */}
      <AnimatePresence>
        {selectedIntern && (
          <InternshipModal
            intern={selectedIntern}
            user={user}
            onClose={() => setSelectedIntern(null)}
            onBookmark={toggleBookmark}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;
