import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Calendar, Globe, Bookmark, BookmarkCheck,
  Trophy, Users, MapPin, Clock, Zap, Star, Share2, Bell,
  TrendingUp, Sparkles, X, Plus, ChevronDown, LayoutGrid, CalendarDays,
  ExternalLink, ArrowRight, MessageCircle, ThumbsUp, Award, Flame,
  AlertCircle, CheckCircle, Lock, Upload, Cpu, Code2, Layers,
  Shield, Bot, Wifi, Rocket, Lightbulb, Palette, BookOpen, BellRing
} from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'AI & Machine Learning', label: 'AI & ML', icon: Bot },
  { id: 'Web Development', label: 'Web Dev', icon: Code2 },
  { id: 'App Development', label: 'App Dev', icon: Layers },
  { id: 'Cyber Security', label: 'Cyber Security', icon: Shield },
  { id: 'Blockchain', label: 'Blockchain', icon: Cpu },
  { id: 'IoT', label: 'IoT', icon: Wifi },
  { id: 'Robotics', label: 'Robotics', icon: Rocket },
  { id: 'Open Innovation', label: 'Open Innovation', icon: Lightbulb },
  { id: 'Startup Competitions', label: 'Startup', icon: Zap },
  { id: 'College Hackathons', label: 'College', icon: BookOpen },
  { id: 'National Hackathons', label: 'National', icon: Globe },
  { id: 'International Hackathons', label: 'International', icon: Globe },
  { id: 'Design Challenges', label: 'Design', icon: Palette },
  { id: 'Coding Contests', label: 'Coding', icon: Trophy },
  { id: 'Case Study Competitions', label: 'Case Study', icon: Award },
];

const MODE_COLORS = {
  online: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/30', dot: 'bg-emerald-400' },
  offline: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/30', dot: 'bg-amber-400' },
  hybrid: { bg: 'bg-violet-950/40', text: 'text-violet-400', border: 'border-violet-800/30', dot: 'bg-violet-400' },
};

const PLATFORM_COLORS = {
  unstop: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/30' },
  devpost: { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-800/30' },
  devfolio: { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-800/30' },
  hackerearth: { bg: 'bg-indigo-950/40', text: 'text-indigo-400', border: 'border-indigo-800/30' },
  'hack club': { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/30' },
};

const getPlatformStyle = (platform) => {
  const p = (platform || 'Unstop').toLowerCase();
  return PLATFORM_COLORS[p] || { bg: 'bg-slate-950/40', text: 'text-slate-400', border: 'border-slate-800/30' };
};

const getRegStatus = (deadline) => {
  if (!deadline) return { label: 'Open', color: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/30' };
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { label: 'Closed', color: 'bg-slate-950/40 text-slate-400 border-slate-800/30' };
  if (diff <= 3 * 86400000) return { label: 'Closing Soon', color: 'bg-rose-950/40 text-rose-400 border-rose-800/30' };
  return { label: 'Open', color: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/30' };
};

const DIFFICULTY_COLORS = {
  Beginner: 'text-emerald-400',
  Intermediate: 'text-amber-400',
  Advanced: 'text-rose-400',
};

// ─────────────────────────────────────────────
// Countdown Timer Component
// ─────────────────────────────────────────────
const DeadlineCountdown = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgency, setUrgency] = useState('normal');

  useEffect(() => {
    const calc = () => {
      const end = new Date(deadline).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) { setTimeLeft('Closed'); setUrgency('closed'); return; }

      const days = Math.floor(diff / 86400000);
      const hrs = Math.floor((diff % 86400000) / 3600000);

      if (days <= 3) setUrgency('critical');
      else if (days <= 10) setUrgency('warning');
      else setUrgency('normal');

      setTimeLeft(days > 0 ? `${days}d ${hrs}h left` : `${hrs}h left`);
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [deadline]);

  const colorMap = {
    closed: 'text-slate-500',
    critical: 'text-rose-400 animate-pulse',
    warning: 'text-amber-400',
    normal: 'text-emerald-400',
  };

  return <span className={`text-[11px] font-bold ${colorMap[urgency]}`}>{timeLeft}</span>;
};

// ─────────────────────────────────────────────
// Star Rating Component
// ─────────────────────────────────────────────
const StarRating = ({ rating, interactive = false, onRate }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          className={`transition-colors ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          disabled={!interactive}
        >
          <Star
            className={`w-4 h-4 ${(hover || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
          />
        </button>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// Opportunity Detail Modal
// ─────────────────────────────────────────────
const OpportunityModal = ({ opp, onClose, user, onBookmark, onRegister, onWin, onReminder }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [discussionText, setDiscussionText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [teamSkills, setTeamSkills] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localOpp, setLocalOpp] = useState(opp);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [calSuccess, setCalSuccess] = useState(false);

  const isBookmarked = user?.bookmarks?.includes(opp._id);
  const isRegistered = user?.registeredEvents?.includes(opp._id);
  const hasWon = user?.wonCompetitions?.includes(opp._id);
  const isReminded = user?.reminders?.includes(opp._id);

  const handleDiscussion = async () => {
    if (!discussionText.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/${opp._id}/discussion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ comment: discussionText })
      });
      if (res.ok) {
        const data = await res.json();
        setLocalOpp(prev => ({ ...prev, discussions: data.discussions }));
        setDiscussionText('');
      }
    } finally { setSubmitting(false); }
  };

  const handleReview = async () => {
    if (!reviewRating) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/${opp._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, comment: reviewText })
      });
      if (res.ok) {
        const data = await res.json();
        setLocalOpp(prev => ({ ...prev, reviews: data.reviews }));
        setReviewText('');
        setReviewRating(0);
      }
    } finally { setSubmitting(false); }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/${opp._id}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'create', teamName, description: teamDesc, requiredSkills: teamSkills.split(',').map(s => s.trim()).filter(Boolean) })
      });
      if (res.ok) {
        const data = await res.json();
        setLocalOpp(prev => ({ ...prev, teamFinder: data.teamFinder }));
        setTeamName(''); setTeamDesc(''); setTeamSkills('');
      }
    } finally { setSubmitting(false); }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/${opp._id}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'join', teamId })
      });
      if (res.ok) {
        const data = await res.json();
        setLocalOpp(prev => ({ ...prev, teamFinder: data.teamFinder }));
      }
    } catch {}
  };

  const handleShare = () => {
    const url = opp.applyLink || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => { setShareSuccess(true); setTimeout(() => setShareSuccess(false), 2000); });
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(opp.title);
    const details = encodeURIComponent(opp.description || '');
    const location = encodeURIComponent(opp.location || '');
    const deadlineDate = new Date(opp.deadline);
    const dateStr = deadlineDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const url = `https://calendar.google.com/calendar/r/eventedit?text=${title}&details=${details}&location=${location}&dates=${dateStr}/${dateStr}`;
    window.open(url, '_blank');
    setCalSuccess(true);
    setTimeout(() => setCalSuccess(false), 2000);
  };

  const avgRating = localOpp.reviews?.length
    ? (localOpp.reviews.reduce((sum, r) => sum + r.rating, 0) / localOpp.reviews.length).toFixed(1)
    : null;

  const modeStyle = MODE_COLORS[localOpp.mode] || MODE_COLORS.online;

  const TABS = [
    { id: 'details', label: 'Details', icon: Layers },
    { id: 'team', label: `Team Finder (${(localOpp.teamFinder || []).length})`, icon: Users },
    { id: 'discussion', label: `Discussion (${(localOpp.discussions || []).length})`, icon: MessageCircle },
    { id: 'reviews', label: `Reviews (${(localOpp.reviews || []).length})`, icon: Star },
  ];

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
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0e1628] border border-white/10 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Banner */}
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <img
              src={localOpp.banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop'}
              alt={localOpp.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-[#0e1628]/40 to-transparent" />

            {/* Top controls */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button 
                onClick={() => onReminder(opp._id)} 
                className={`p-2 rounded-xl backdrop-blur border transition-all ${isReminded ? 'bg-amber-600/30 border-amber-500/40 text-amber-300' : 'bg-black/40 border-white/10 text-white hover:bg-black/60'}`}
                title="Toggle Reminders"
              >
                <Bell className={`w-4 h-4 ${isReminded ? 'fill-amber-300' : ''}`} />
              </button>
              <button onClick={handleShare} className="p-2 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-white hover:bg-black/60 transition-all" title="Copy link">
                {shareSuccess ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button onClick={onClose} className="p-2 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-white hover:bg-red-500/30 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status badges */}
            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {localOpp.isFeatured && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300" /> Featured
                </span>
              )}
              {localOpp.isTrending && (
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Trending
                </span>
              )}
            </div>

            {/* Logo + Title */}
            <div className="absolute bottom-4 left-4 flex items-end gap-3">
              <img
                src={localOpp.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${localOpp.company}`}
                alt={localOpp.company}
                className="w-14 h-14 rounded-xl bg-slate-950 border border-white/20 p-1 shadow-lg"
                onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${localOpp.company}`; }}
              />
              <div className="text-left">
                <h2 className="font-display font-extrabold text-xl text-white leading-tight drop-shadow-lg">{localOpp.title}</h2>
                <p className="text-sm text-slate-300 font-semibold">{localOpp.company}</p>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="px-6 pt-4 pb-2 flex flex-wrap gap-3">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${getPlatformStyle(localOpp.platform).bg} ${getPlatformStyle(localOpp.platform).text} ${getPlatformStyle(localOpp.platform).border}`}>
              {localOpp.platform || 'Unstop'}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${getRegStatus(localOpp.deadline).color}`}>
              {getRegStatus(localOpp.deadline).label}
            </span>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${modeStyle.bg} ${modeStyle.text} ${modeStyle.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${modeStyle.dot}`} />
              {(localOpp.mode || 'online').charAt(0).toUpperCase() + (localOpp.mode || 'online').slice(1)}
            </span>
            {localOpp.prizePool && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/40 border border-emerald-800/30 text-emerald-400">
                <Trophy className="w-3 h-3" /> {localOpp.prizePool}
              </span>
            )}
            {localOpp.teamSize && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-950/40 border border-cyan-800/30 text-cyan-400">
                <Users className="w-3 h-3" /> {localOpp.teamSize}
              </span>
            )}
            {localOpp.regFee && (
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${localOpp.regFee === 'free' ? 'bg-violet-950/40 border border-violet-800/30 text-violet-400' : 'bg-rose-950/40 border border-rose-800/30 text-rose-400'}`}>
                {localOpp.regFee === 'free' ? '🎟 Free' : `💸 ₹${localOpp.regFeeAmount || 'Paid'}`}
              </span>
            )}
            {localOpp.difficulty && (
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800/60 border border-white/5 ${DIFFICULTY_COLORS[localOpp.difficulty] || 'text-slate-400'}`}>
                {localOpp.difficulty}
              </span>
            )}
            {avgRating && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/40 border border-amber-800/30 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" /> {avgRating}
              </span>
            )}
          </div>

          {/* Key Info Grid */}
          <div className="px-6 py-3 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-left">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Registration Deadline</p>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-xs text-slate-200 font-semibold">{localOpp.deadline}</span>
                <DeadlineCountdown deadline={localOpp.deadline} />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-left">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Event Dates</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs text-slate-200 font-semibold">{localOpp.eventDates || 'TBD'}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-left">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Location / Venue</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-slate-200 font-semibold truncate">{localOpp.location || 'Online'}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-left">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Category & Track</p>
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs text-slate-200 font-semibold">{localOpp.category || 'General'}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 mt-2">
            <div className="flex gap-1 bg-slate-950/50 rounded-xl p-1 border border-white/5">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <tab.icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-4">
            {/* DETAILS TAB */}
            {activeTab === 'details' && (
              <div className="space-y-4 text-left">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About this Opportunity</h4>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{localOpp.description}</p>
                </div>
                {localOpp.eligibility && (
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Eligibility Criteria</h4>
                    <p className="text-sm text-slate-300">{localOpp.eligibility}</p>
                  </div>
                )}
                {localOpp.technologies && localOpp.technologies.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {localOpp.technologies.map(tech => (
                        <span key={tech} className="px-2.5 py-1 bg-cyan-950/30 border border-cyan-800/30 rounded-lg text-xs text-cyan-300 font-medium">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
                {localOpp.tags && localOpp.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tags & Metadata</h4>
                    <div className="flex flex-wrap gap-2">
                      {localOpp.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-900/60 border border-white/5 rounded-lg text-xs text-slate-400 font-medium">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Calendar & Google Sync */}
                <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calendar Integrations</h4>
                  <p className="text-[10px] text-slate-500">Sync this opportunity deadline directly into your personal calendar to receive automatic notifications and email reminders.</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={handleAddToCalendar}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${calSuccess ? 'bg-emerald-950/40 border-emerald-800/30 text-emerald-400' : 'bg-slate-800/40 border-white/10 text-slate-300 hover:bg-slate-700/40'}`}
                    >
                      <CalendarDays className="w-4 h-4" />
                      {calSuccess ? 'Synced to Google Calendar!' : 'Add to Google Calendar'}
                    </button>
                    <button 
                      onClick={() => onReminder(opp._id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${isReminded ? 'bg-amber-950/40 border-amber-800/30 text-amber-400' : 'bg-slate-800/40 border-white/10 text-slate-300 hover:bg-slate-700/40'}`}
                    >
                      <BellRing className="w-4 h-4" />
                      {isReminded ? 'Email Reminder Set' : 'Email Me 24h Before'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TEAM FINDER TAB */}
            {activeTab === 'team' && (
              <div className="space-y-4 text-left">
                <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-800/30">
                  <h4 className="text-sm font-bold text-violet-300 mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Create a Team Listing</h4>
                  <div className="space-y-2">
                    <input
                      placeholder="Team name..."
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                    />
                    <input
                      placeholder="Brief description of what you're building..."
                      value={teamDesc}
                      onChange={e => setTeamDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                    />
                    <input
                      placeholder="Required skills (comma separated, e.g. React, Python)..."
                      value={teamSkills}
                      onChange={e => setTeamSkills(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                    />
                    <button
                      onClick={handleCreateTeam}
                      disabled={!teamName.trim() || submitting}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      {submitting ? 'Creating...' : 'Create Team Listing'}
                    </button>
                  </div>
                </div>

                {(localOpp.teamFinder || []).length === 0 ? (
                  <p className="text-center text-slate-500 py-4 text-sm">No team listings yet. Be the first to create one!</p>
                ) : (
                  <div className="space-y-3">
                    {(localOpp.teamFinder || []).map(team => (
                      <div key={team.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <img src={team.leaderAvatar} alt={team.leaderName} className="w-8 h-8 rounded-full border border-white/10" onError={e => { e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${team.leaderName}`; }} />
                            <div>
                              <p className="text-sm font-bold text-slate-200">{team.teamName}</p>
                              <p className="text-xs text-slate-400">Lead: {team.leaderName}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleJoinTeam(team.id)}
                            className="px-3 py-1.5 bg-cyan-600/20 border border-cyan-600/30 text-cyan-400 text-xs font-bold rounded-xl hover:bg-cyan-600/30 transition-all"
                          >
                            Request to Join
                          </button>
                        </div>
                        {team.description && <p className="text-xs text-slate-400 mt-2">{team.description}</p>}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(team.requiredSkills || []).map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-cyan-950/30 border border-cyan-800/30 rounded text-[10px] text-cyan-400 font-medium">{skill}</span>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">{team.members?.length || 1} member{(team.members?.length || 1) !== 1 ? 's' : ''}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DISCUSSION TAB */}
            {activeTab === 'discussion' && (
              <div className="space-y-4 text-left">
                <div className="flex gap-2">
                  <img src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`} alt={user?.name} className="w-8 h-8 rounded-full border border-white/10 shrink-0" />
                  <div className="flex-1 flex gap-2">
                    <input
                      placeholder="Ask a question or share something..."
                      value={discussionText}
                      onChange={e => setDiscussionText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleDiscussion()}
                      className="flex-1 px-3 py-2 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                    />
                    <button
                      onClick={handleDiscussion}
                      disabled={!discussionText.trim() || submitting}
                      className="px-3 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Post
                    </button>
                  </div>
                </div>

                {(localOpp.discussions || []).length === 0 ? (
                  <p className="text-center text-slate-500 py-4 text-sm">No discussions yet. Start the conversation!</p>
                ) : (
                  <div className="space-y-3">
                    {[...(localOpp.discussions || [])].reverse().map((d, i) => (
                      <div key={d.id || i} className="p-3 rounded-xl bg-slate-900/30 border border-white/5 flex gap-3">
                        <img src={d.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${d.userName}`} alt={d.userName} className="w-7 h-7 rounded-full border border-white/10 shrink-0" onError={e => { e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${d.userName}`; }} />
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-200">{d.userName}</p>
                            <p className="text-[10px] text-slate-500">{new Date(d.date).toLocaleDateString()}</p>
                          </div>
                          <p className="text-sm text-slate-300 mt-1 leading-relaxed">{d.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 text-left">
                <div className="p-4 rounded-xl bg-amber-950/10 border border-amber-800/20">
                  <h4 className="text-sm font-bold text-amber-300 mb-3">Write a Review</h4>
                  <div className="flex items-center gap-3 mb-3">
                    <StarRating rating={reviewRating} interactive onRate={setReviewRating} />
                    <span className="text-xs text-slate-400">{reviewRating > 0 ? `${reviewRating}/5` : 'Select rating'}</span>
                  </div>
                  <textarea
                    placeholder="Share your experience with this hackathon..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                  <button
                    onClick={handleReview}
                    disabled={!reviewRating || submitting}
                    className="mt-2 px-4 py-2 bg-amber-600/80 hover:bg-amber-500/80 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Submit Review
                  </button>
                </div>

                {(localOpp.reviews || []).length === 0 ? (
                  <p className="text-center text-slate-500 py-4 text-sm">No reviews yet. Be the first!</p>
                ) : (
                  <div className="space-y-3">
                    {(localOpp.reviews || []).map((rev, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900/30 border border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-slate-200">{rev.userName}</p>
                          <div className="flex items-center gap-2">
                            <StarRating rating={rev.rating} />
                            <p className="text-[10px] text-slate-500">{new Date(rev.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {rev.comment && <p className="text-sm text-slate-300 leading-relaxed">{rev.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 px-6 py-4 bg-[#0e1628]/95 backdrop-blur border-t border-white/5 flex gap-3 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => onBookmark(opp._id)}
                className={`p-2.5 rounded-xl border transition-all ${isBookmarked ? 'bg-violet-950/40 border-violet-800/30 text-violet-400' : 'bg-slate-800/40 border-white/10 text-slate-400 hover:text-white'}`}
                title="Bookmark Event"
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <button
                onClick={() => onWin(opp._id)}
                title="Mark as Won"
                className={`p-2.5 rounded-xl border transition-all ${hasWon ? 'bg-amber-950/40 border-amber-800/30 text-amber-400' : 'bg-slate-800/40 border-white/10 text-slate-400 hover:text-amber-400'}`}
              >
                <Trophy className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onRegister(opp._id)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${isRegistered ? 'bg-emerald-950/40 border-emerald-800/30 text-emerald-400' : 'bg-slate-800/40 border-white/10 text-slate-300 hover:bg-slate-700/40'}`}
              >
                {isRegistered ? <><CheckCircle className="w-4 h-4 inline mr-1.5" />Registered</> : 'Save & Track'}
              </button>
              <a href={opp.applyLink} target="_blank" rel="noreferrer">
                <button className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-900/30 transition-all flex items-center gap-2">
                  Apply Now <ExternalLink className="w-4 h-4" />
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────
// Opportunity Card
// ─────────────────────────────────────────────
const OpportunityCard = ({ opp, user, onBookmark, onReminder, onClick }) => {
  const isBookmarked = user?.bookmarks?.includes(opp._id);
  const isRegistered = user?.registeredEvents?.includes(opp._id);
  const isReminded = user?.reminders?.includes(opp._id);
  const modeStyle = MODE_COLORS[opp.mode] || MODE_COLORS.online;
  const avgRating = opp.reviews?.length
    ? (opp.reviews.reduce((sum, r) => sum + r.rating, 0) / opp.reviews.length).toFixed(1)
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative bg-[#0e1628]/80 border border-white/8 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:border-violet-600/40 hover:shadow-violet-900/20 hover:shadow-xl transition-all duration-300"
      onClick={() => onClick(opp)}
    >
      {/* Banner */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={opp.banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop'}
          alt={opp.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-[#0e1628]/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          {opp.isFeatured && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold">⭐ Featured</span>
          )}
          {opp.isTrending && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[9px] font-bold flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" /> Hot</span>
          )}
          {isRegistered && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold">✓ Registered</span>
          )}
        </div>

        {/* Action Buttons Top Right */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            className={`p-1.5 rounded-xl backdrop-blur border transition-all ${isReminded ? 'bg-amber-600/30 border-amber-500/40 text-amber-300' : 'bg-black/30 border-white/10 text-white/60 hover:text-white'}`}
            onClick={e => { e.stopPropagation(); onReminder(opp._id); }}
            title="Toggle reminders"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button
            className={`p-1.5 rounded-xl backdrop-blur border transition-all ${isBookmarked ? 'bg-violet-600/30 border-violet-500/40 text-violet-300' : 'bg-black/30 border-white/10 text-white/60 hover:text-white'}`}
            onClick={e => { e.stopPropagation(); onBookmark(opp._id); }}
          >
            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Logo */}
        <div className="absolute bottom-2 left-3">
          <img
            src={opp.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${opp.company}`}
            alt={opp.company}
            className="w-10 h-10 rounded-xl bg-slate-950 border border-white/20 p-0.5 shadow"
            onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${opp.company}`; }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 pt-2 flex flex-col gap-2 text-left">
        <div>
          <h3 className="font-display font-bold text-sm text-slate-100 line-clamp-2 leading-snug mt-1">{opp.title}</h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">{opp.company}</p>
        </div>

        {/* Platform + Status + Mode + Prize */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getPlatformStyle(opp.platform).bg} ${getPlatformStyle(opp.platform).text} ${getPlatformStyle(opp.platform).border}`}>
            {opp.platform || 'Unstop'}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRegStatus(opp.deadline).color}`}>
            {getRegStatus(opp.deadline).label}
          </span>
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${modeStyle.bg} ${modeStyle.text} ${modeStyle.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${modeStyle.dot}`} />
            {(opp.mode || 'online').charAt(0).toUpperCase() + (opp.mode || 'online').slice(1)}
          </span>
          {opp.prizePool && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/40 border border-emerald-800/30 text-emerald-400">
              <Trophy className="w-2.5 h-2.5" /> {opp.prizePool}
            </span>
          )}
        </div>

        {/* Team + Location */}
        <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
          {opp.teamSize && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{opp.teamSize}</span>}
          {opp.location && <span className="flex items-center gap-1 truncate max-w-[150px]"><MapPin className="w-3 h-3 shrink-0" />{opp.location}</span>}
          {avgRating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{avgRating}</span>}
        </div>

        {/* Technologies */}
        {opp.technologies && opp.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {opp.technologies.slice(0, 3).map(tech => (
              <span key={tech} className="px-1.5 py-0.5 bg-slate-900 border border-white/5 rounded text-[9px] text-slate-400 font-medium">{tech}</span>
            ))}
            {opp.technologies.length > 3 && (
              <span className="px-1.5 py-0.5 bg-slate-900 border border-white/5 rounded text-[9px] text-slate-500">+{opp.technologies.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-rose-400" />
            <DeadlineCountdown deadline={opp.deadline} />
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{opp.deadline}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Calendar View Component
// ─────────────────────────────────────────────
const CalendarView = ({ hackathons }) => {
  const [month, setMonth] = useState(new Date());

  const year = month.getFullYear();
  const mon = month.getMonth();
  const firstDay = new Date(year, mon, 1).getDay();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();

  const today = new Date();

  const eventsByDate = {};
  hackathons.forEach(h => {
    if (!h.deadline) return;
    const d = new Date(h.deadline);
    if (d.getFullYear() === year && d.getMonth() === mon) {
      const key = d.getDate();
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push(h);
    }
  });

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-slate-200">
          {monthNames[mon]} {year}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setMonth(new Date(year, mon - 1, 1))} className="p-2 rounded-xl bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer">
            ‹
          </button>
          <button onClick={() => setMonth(new Date(year, mon + 1, 1))} className="p-2 rounded-xl bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer">
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-500 py-2">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const events = eventsByDate[day] || [];
          const isToday = today.getDate() === day && today.getMonth() === mon && today.getFullYear() === year;
          return (
            <div
              key={day}
              className={`min-h-[56px] p-1.5 rounded-xl border transition-all ${isToday ? 'bg-violet-950/40 border-violet-700/40' : 'bg-slate-900/20 border-white/5'}`}
            >
              <p className={`text-[11px] font-bold mb-1 ${isToday ? 'text-violet-400' : 'text-slate-400'}`}>{day}</p>
              {events.slice(0, 2).map((ev, idx) => (
                <div key={idx} className="truncate text-[9px] px-1 py-0.5 bg-violet-600/30 border border-violet-700/30 rounded text-violet-300 mb-0.5 leading-tight">
                  {ev.title}
                </div>
              ))}
              {events.length > 2 && <div className="text-[9px] text-slate-500 mt-0.5">+{events.length - 2} more</div>}
            </div>
          );
        })}
      </div>

      {/* Upcoming events list */}
      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Month&apos;s Deadlines</h4>
        {Object.entries(eventsByDate).sort(([a], [b]) => Number(a) - Number(b)).map(([day, events]) =>
          events.map((ev, i) => (
            <div key={`${day}-${i}`} className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-violet-950/40 border border-violet-800/30 flex flex-col items-center justify-center shrink-0">
                <span className="text-xs font-bold text-violet-400">{day}</span>
                <span className="text-[9px] text-slate-500">{monthNames[mon].slice(0,3)}</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-slate-200 truncate">{ev.title}</p>
                <p className="text-[10px] text-slate-400">{ev.company} · {ev.prizePool || 'Prizes'}</p>
              </div>
              <a href={ev.applyLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                <ArrowRight className="w-4 h-4 text-violet-400 animate-pulse" />
              </a>
            </div>
          ))
        )}
        {Object.keys(eventsByDate).length === 0 && (
          <p className="text-center text-slate-500 py-6 text-sm">No deadlines this month.</p>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// User Event Submission Form Modal
// ─────────────────────────────────────────────
const SubmitOpportunityModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('AI & Machine Learning');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('Open to all students');
  const [deadline, setDeadline] = useState('');
  const [eventDates, setEventDates] = useState('');
  const [mode, setMode] = useState('online');
  const [location, setLocation] = useState('Online');
  const [prizePool, setPrizePool] = useState('');
  const [teamSize, setTeamSize] = useState('1-4 Members');
  const [regFee, setRegFee] = useState('free');
  const [regFeeAmount, setRegFeeAmount] = useState(0);
  const [technologies, setTechnologies] = useState('');
  const [country, setCountry] = useState('Global');
  const [state, setState] = useState('');
  const [college, setCollege] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !company || !deadline || !applyLink) {
      setErrorMsg('Please fill in Name, Organizer, Deadline, and Registration Link');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      const techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
      const res = await onSubmit({
        title, company, type: 'hackathon', category, description, eligibility, deadline, eventDates,
        mode, location, prizePool, teamSize, regFee, regFeeAmount: Number(regFeeAmount),
        technologies: techArray, country, state, college, applyLink
      });
      if (res.ok) {
        onClose();
      } else {
        const d = await res.json();
        setErrorMsg(d.message || 'Error submitting opportunity');
      }
    } catch {
      setErrorMsg('Connection error submitting event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0e1628] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl text-left"
      >
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <h3 className="font-display font-extrabold text-lg text-slate-100 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-violet-400" /> Submit New Opportunity
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && <p className="p-3 bg-rose-950/30 border border-rose-900/40 text-rose-400 rounded-xl text-xs font-semibold mb-4">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Event Name *</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Smart India Hackathon" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Organizer / Host *</label>
              <input required value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Ministry of Education" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Category Track *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200">
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => <option key={cat.id} value={cat.id}>{cat.id}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Official Registration Link *</label>
              <input required value={applyLink} onChange={e => setApplyLink(e.target.value)} placeholder="https://example.com/apply" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Short Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief introduction, themes, goals..." rows={3} className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200 resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Deadline *</label>
              <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Event Dates</label>
              <input value={eventDates} onChange={e => setEventDates(e.target.value)} placeholder="e.g. Aug 15 - Aug 18" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Team Size</label>
              <input value={teamSize} onChange={e => setTeamSize(e.target.value)} placeholder="e.g. 2-4 Members" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Mode *</label>
              <select value={mode} onChange={e => setMode(e.target.value)} className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Location Details</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Bangalore / Online" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Prize Pool</label>
              <input value={prizePool} onChange={e => setPrizePool(e.target.value)} placeholder="e.g. ₹5,00,000" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Registration Fee</label>
              <select value={regFee} onChange={e => setRegFee(e.target.value)} className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200">
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Fee Amount (if Paid)</label>
              <input type="number" disabled={regFee === 'free'} value={regFeeAmount} onChange={e => setRegFeeAmount(e.target.value)} placeholder="e.g. 500" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200 disabled:opacity-50" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Technologies (comma separated)</label>
              <input value={technologies} onChange={e => setTechnologies(e.target.value)} placeholder="React, Node.js, Python" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Country</label>
              <input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. India" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">State (if India)</label>
              <input value={state} onChange={e => setState(e.target.value)} placeholder="e.g. Karnataka" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">College Host (if university event)</label>
              <input value={college} onChange={e => setCollege(e.target.value)} placeholder="e.g. IIT Madras" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Eligibility</label>
            <input value={eligibility} onChange={e => setEligibility(e.target.value)} placeholder="e.g. Engineering students pursuing UG/PG" className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200" />
          </div>

          <div className="flex justify-end gap-2 border-t border-white/5 pt-3 mt-4">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit to Admin Review'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Hackathons Page Component
// ─────────────────────────────────────────────
const Hackathons = () => {
  const { user, toggleBookmark, reloadProfile } = useAuth();

  const [allHackathons, setAllHackathons] = useState([]);
  const [filteredHackathons, setFilteredHackathons] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | all | featured | trending | recommended | mine | calendar
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterMode, setFilterMode] = useState('all');
  const [filterFee, setFilterFee] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterPrize, setFilterPrize] = useState('all'); // all | under10k | 10kto50k | above50k
  const [filterStatus, setFilterStatus] = useState('all'); // all | open | closing_soon | closing_soon_7d | closed
  const [filterState, setFilterState] = useState('all');
  const [filterCollege, setFilterCollege] = useState('all');
  const [filterTechnology, setFilterTechnology] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');

  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  // Stats for Dashboard tab
  const totalActive = allHackathons.filter(h => h.type === 'hackathon').length;
  const closingSoon = allHackathons.filter(h => {
    const diff = new Date(h.deadline).getTime() - Date.now();
    return diff > 0 && diff <= 3 * 86400000; // 3 days
  }).length;
  const registeredCount = allHackathons.filter(h => user?.registeredEvents?.includes(h._id)).length;
  const savedCount = allHackathons.filter(h => user?.bookmarks?.includes(h._id)).length;
  const wonCount = (user?.wonCompetitions || []).length;
  
  const upcomingCount = allHackathons.filter(h => {
    const diff = new Date(h.deadline).getTime() - Date.now();
    return diff > 0;
  }).length;

  const fetchHackathons = useCallback(async () => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities?type=hackathon&sort=${sortBy}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAllHackathons(data);
      }
    } catch (err) {
      console.error('Error fetching hackathons:', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const fetchRecommended = useCallback(async () => {
    setRecLoading(true);
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRecommended(data);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setRecLoading(false);
    }
  }, []);

  useEffect(() => { fetchHackathons(); }, [fetchHackathons]);

  useEffect(() => {
    if (activeTab === 'recommended' && recommended.length === 0) {
      fetchRecommended();
    }
  }, [activeTab, recommended.length, fetchRecommended]);

  // Filters & search processing
  useEffect(() => {
    let result = [...allHackathons];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(h =>
        h.title?.toLowerCase().includes(q) ||
        h.company?.toLowerCase().includes(q) ||
        h.description?.toLowerCase().includes(q) ||
        h.tags?.some(t => t.toLowerCase().includes(q)) ||
        h.technologies?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== 'all') result = result.filter(h => h.category === selectedCategory);
    if (filterMode !== 'all') result = result.filter(h => h.mode === filterMode);
    if (filterFee !== 'all') result = result.filter(h => h.regFee === filterFee);
    if (filterDifficulty !== 'all') result = result.filter(h => h.difficulty === filterDifficulty);
    if (filterCountry !== 'all') result = result.filter(h => h.country === filterCountry);
    if (filterState !== 'all') result = result.filter(h => h.state === filterState);
    if (filterCollege !== 'all') result = result.filter(h => h.college === filterCollege);
    if (filterTechnology !== 'all') {
      const tLower = filterTechnology.toLowerCase();
      result = result.filter(h => h.technologies && h.technologies.some(tech => tech.toLowerCase() === tLower));
    }

    // Filter by Prize Pool Ranges (normalize USD/INR)
    if (filterPrize !== 'all') {
      const parseVal = (str) => {
        if (!str) return 0;
        const cleaned = str.replace(/[^0-9]/g, '');
        return parseInt(cleaned, 10) || 0;
      };
      result = result.filter(h => {
        const val = parseVal(h.prizePool);
        const isUSD = h.prizePool && h.prizePool.includes('$');
        const normalized = isUSD ? val * 85 : val; // Estimate $1 = ₹85
        if (filterPrize === 'under10k') return normalized > 0 && normalized < 10000;
        if (filterPrize === '10kto50k') return normalized >= 10000 && normalized <= 50000;
        if (filterPrize === 'above50k') return normalized > 50000;
        return true;
      });
    }

    // Filter by registration status
    if (filterStatus !== 'all') {
      const now = Date.now();
      result = result.filter(h => {
        if (!h.deadline) return filterStatus === 'open'; // default open if no deadline
        const end = new Date(h.deadline).getTime();
        const diff = end - now;
        if (filterStatus === 'closed') return diff <= 0;
        if (filterStatus === 'closing_soon') return diff > 0 && diff <= 3 * 86400000;
        if (filterStatus === 'closing_soon_7d') return diff > 0 && diff <= 7 * 86400000;
        if (filterStatus === 'open') return diff > 0;
        return true;
      });
    }

    // Filter by platform
    if (filterPlatform !== 'all') {
      result = result.filter(h => (h.platform || 'Unstop').toLowerCase() === filterPlatform.toLowerCase());
    }

    if (activeTab === 'featured') result = result.filter(h => h.isFeatured);
    if (activeTab === 'trending') result = result.filter(h => h.isTrending);
    if (activeTab === 'mine') result = result.filter(h => user?.registeredEvents?.includes(h._id) || user?.bookmarks?.includes(h._id));

    // Sort
    if (sortBy === 'latest') result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else if (sortBy === 'deadline') result.sort((a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'));
    else if (sortBy === 'prize') {
      const parseVal = (str) => {
        if (!str) return 0;
        const cleaned = str.replace(/[^0-9]/g, '');
        return parseInt(cleaned, 10) || 0;
      };
      result.sort((a, b) => {
        const vA = parseVal(a.prizePool) * (a.prizePool?.includes('$') ? 85 : 1);
        const vB = parseVal(b.prizePool) * (b.prizePool?.includes('$') ? 85 : 1);
        return vB - vA;
      });
    }

    setFilteredHackathons(result);
  }, [allHackathons, searchTerm, selectedCategory, filterMode, filterFee, filterDifficulty, filterCountry, filterPrize, filterStatus, filterState, filterCollege, filterTechnology, filterPlatform, sortBy, activeTab, user]);

  const handleRegister = async (id) => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/${id}/register`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await reloadProfile();
      }
    } catch {}
  };

  const handleWin = async (id) => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/${id}/win`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await reloadProfile();
      }
    } catch {}
  };

  const handleToggleReminder = async (id) => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/${id}/reminder`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await reloadProfile();
      }
    } catch {}
  };

  const handleUserOpportunitySubmit = async (formData) => {
    const token = localStorage.getItem('studora_token');
    const res = await fetch(`${API_BASE}/opportunities/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setSubmitMsg('✓ Event submitted successfully! Waiting for Admin approval.');
      setTimeout(() => setSubmitMsg(''), 5000);
      fetchHackathons();
    }
    return res;
  };

  // Derive unique dropdown elements
  const countries = [...new Set(allHackathons.map(h => h.country).filter(Boolean))].sort();
  const states = [...new Set(allHackathons.map(h => h.state).filter(Boolean))].sort();
  const colleges = [...new Set(allHackathons.map(h => h.college).filter(Boolean))].sort();
  const technologies = [...new Set(allHackathons.flatMap(h => h.technologies || []).filter(Boolean))].sort();

  const displayList = activeTab === 'recommended' ? recommended : filteredHackathons;

  const MAIN_TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'all', label: 'All Events', icon: BookOpen },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'recommended', label: 'For You (AI)', icon: Sparkles },
    { id: 'mine', label: 'My Events', icon: Bookmark },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-xl bg-violet-600/20 border border-violet-700/30">
              <Rocket className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Opportunity Platform</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100">Hackathons & Competitions</h1>
          <p className="text-sm text-slate-400">Discover and participate in hundreds of hackathons, coding contests, and design challenges.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="primary" size="sm" onClick={() => setShowSubmitModal(true)}>
            <Plus className="w-4 h-4 mr-1 inline" /> Submit Opportunity
          </Button>
        </div>
      </motion.div>

      {submitMsg && <p className="text-xs font-bold py-2.5 px-4 bg-emerald-950/30 border border-emerald-900/40 rounded-xl text-emerald-400 text-left w-fit">{submitMsg}</p>}

      {/* ── Main Navigation Tabs ── */}
      <div className="flex gap-1 bg-slate-950/40 rounded-2xl p-1 border border-white/5 overflow-x-auto scrollbar-none">
        {MAIN_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedCategory('all'); }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────
          DASHBOARD VIEW SUB-TAB
          ───────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Dashboard Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Active', value: totalActive, color: 'text-violet-400', icon: Zap, bg: 'bg-violet-950/20' },
              { label: 'Closing Soon', value: closingSoon, color: 'text-rose-400', icon: Flame, bg: 'bg-rose-950/20' },
              { label: 'Upcoming', value: upcomingCount, color: 'text-cyan-400', icon: Calendar, bg: 'bg-cyan-950/20' },
              { label: 'Registered', value: registeredCount, color: 'text-emerald-400', icon: CheckCircle, bg: 'bg-emerald-950/20' },
              { label: 'Saved Later', value: savedCount, color: 'text-pink-400', icon: Bookmark, bg: 'bg-pink-950/20' },
              { label: 'Won Events', value: wonCount, color: 'text-amber-400', icon: Trophy, bg: 'bg-amber-950/20' },
            ].map(stat => (
              <div key={stat.label} className={`p-4 rounded-2xl border border-white/5 ${stat.bg} flex flex-col items-start gap-2 text-left`}>
                <div className={`p-2 rounded-xl bg-black/20 ${stat.color} w-fit`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-display font-extrabold mt-0.5 ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Deadlines Closing Soon & Trophy Wall */}
            <div className="lg:col-span-7 space-y-6">
              {/* Closing Soon deadlines list */}
              <GlassCard className="flex flex-col gap-4 text-left">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="font-display font-bold text-base text-slate-200 flex items-center gap-2"><Clock className="w-4 h-4 text-rose-400" /> Closing Soon (Next 7 Days)</h3>
                  <p className="text-xs text-slate-400">Apply quickly before registrations close.</p>
                </div>
                <div className="space-y-3">
                  {allHackathons.filter(h => {
                    const diff = new Date(h.deadline).getTime() - Date.now();
                    return diff > 0 && diff <= 7 * 86400000;
                  }).slice(0, 4).map(opp => {
                    const daysLeft = Math.max(1, Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86400000));
                    return (
                      <div key={opp._id} onClick={() => setSelectedOpp(opp)} className="p-3 bg-slate-900/30 rounded-xl border border-white/5 hover:border-violet-500/20 cursor-pointer flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={opp.logo} alt={opp.company} className="w-9 h-9 rounded-xl bg-slate-950 border border-white/10 shrink-0" onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${opp.company}`; }} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-200 truncate">{opp.title}</p>
                            <p className="text-[10px] text-slate-400">{opp.company} · {opp.prizePool}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-950/40 text-rose-400 border border-rose-900/30 rounded-full animate-pulse block w-fit ml-auto mb-1">
                            {daysLeft} day{daysLeft > 1 ? 's' : ''} left
                          </span>
                          <span className="text-[9px] text-slate-500">{opp.deadline}</span>
                        </div>
                      </div>
                    );
                  })}
                  {allHackathons.filter(h => {
                    const diff = new Date(h.deadline).getTime() - Date.now();
                    return diff > 0 && diff <= 7 * 86400000;
                  }).length === 0 && (
                    <p className="text-center text-slate-500 text-xs py-4">No events closing in the next 7 days.</p>
                  )}
                </div>
              </GlassCard>

              {/* Trophy Wall */}
              <GlassCard className="flex flex-col gap-4 text-left bg-gradient-to-br from-amber-950/10 to-slate-950/20 border-amber-800/10">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="font-display font-bold text-base text-slate-200 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-400" /> Trophy Wall & Won Competitions</h3>
                  <p className="text-xs text-slate-400">Your competitive programming and innovation milestones.</p>
                </div>
                <div className="space-y-3">
                  {allHackathons.filter(h => user?.wonCompetitions?.includes(h._id)).map(opp => (
                    <div key={opp._id} className="p-4 bg-amber-950/5 border border-amber-800/20 rounded-xl flex items-center gap-3.5 justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{opp.title}</p>
                          <p className="text-[10px] text-slate-400">Organizer: {opp.company} · Prize Pool: {opp.prizePool}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 px-2 py-0.5 rounded-lg">Champion</span>
                      </div>
                    </div>
                  ))}
                  {(user?.wonCompetitions || []).length === 0 && (
                    <div className="text-center py-6 text-slate-500 text-xs flex flex-col items-center gap-2">
                      <Trophy className="w-8 h-8 text-slate-700" />
                      <p>You haven&apos;t marked any competitions as won yet.</p>
                      <p className="text-[10px] text-slate-600">Track and mark won events inside details panel.</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Right Column: My Schedule (Registered Events) & Saved Later */}
            <div className="lg:col-span-5 space-y-6">
              {/* Registered Schedule */}
              <GlassCard className="flex flex-col gap-4 text-left">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="font-display font-bold text-base text-slate-200 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> My Registered Events</h3>
                  <p className="text-xs text-slate-400">Manage and track your active registrations.</p>
                </div>
                <div className="space-y-3">
                  {allHackathons.filter(h => user?.registeredEvents?.includes(h._id)).slice(0, 4).map(opp => (
                    <div key={opp._id} onClick={() => setSelectedOpp(opp)} className="p-3 bg-slate-900/30 rounded-xl border border-white/5 hover:border-violet-500/20 cursor-pointer flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex items-start gap-2">
                          <img src={opp.logo} alt={opp.company} className="w-8 h-8 rounded-lg bg-slate-950 border border-white/10 shrink-0 mt-0.5" onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${opp.company}`; }} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-200 truncate">{opp.title}</p>
                            <p className="text-[10px] text-slate-400">{opp.company}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded">Registered</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-1.5 mt-0.5">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-rose-400" />Deadline: {opp.deadline}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const title = encodeURIComponent(opp.title);
                            const dates = new Date(opp.deadline).toISOString().replace(/-|:|\.\d\d\d/g, '');
                            window.open(`https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${dates}/${dates}`, '_blank');
                          }}
                          className="text-violet-400 hover:underline flex items-center gap-0.5"
                        >
                          <CalendarDays className="w-3 h-3" /> Sync Google
                        </button>
                      </div>
                    </div>
                  ))}
                  {allHackathons.filter(h => user?.registeredEvents?.includes(h._id)).length === 0 && (
                    <p className="text-center text-slate-500 text-xs py-6">You aren&apos;t registered for any active events.</p>
                  )}
                </div>
              </GlassCard>

              {/* Saved for Later */}
              <GlassCard className="flex flex-col gap-4 text-left">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="font-display font-bold text-base text-slate-200 flex items-center gap-2"><Bookmark className="w-4 h-4 text-pink-400" /> Bookmarked / Saved Events</h3>
                  <p className="text-xs text-slate-400">Events saved to review later.</p>
                </div>
                <div className="space-y-3">
                  {allHackathons.filter(h => user?.bookmarks?.includes(h._id)).slice(0, 4).map(opp => (
                    <div key={opp._id} onClick={() => setSelectedOpp(opp)} className="p-3 bg-slate-900/30 rounded-xl border border-white/5 hover:border-violet-500/20 cursor-pointer flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={opp.logo} alt={opp.company} className="w-8 h-8 rounded-lg bg-slate-950 border border-white/10 shrink-0" onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${opp.company}`; }} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate">{opp.title}</p>
                          <p className="text-[10px] text-slate-400">{opp.company}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </div>
                  ))}
                  {allHackathons.filter(h => user?.bookmarks?.includes(h._id)).length === 0 && (
                    <p className="text-center text-slate-500 text-xs py-6">No saved opportunities.</p>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          EXPLORE OPPORTUNITIES VIEW (ALL OTHER TABS)
          ───────────────────────────────────────────── */}
      {activeTab !== 'dashboard' && (
        <div className="space-y-6">
          {/* ── Search + Filter Triggers ── */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, technologies, hosts, tags..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/40 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-500 text-slate-200"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-slate-950/40 border border-white/10 text-slate-300 text-sm rounded-2xl px-4 py-2.5 pr-8 focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="latest">Sort by: Latest</option>
                <option value="deadline">Sort by: Deadline</option>
                <option value="prize">Sort by: Prize Pool</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Filter Tray Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${showFilters ? 'bg-violet-600/20 border-violet-700/40 text-violet-400' : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-white'}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filterMode !== 'all' || filterFee !== 'all' || filterDifficulty !== 'all' || filterCountry !== 'all' || filterPrize !== 'all' || filterStatus !== 'all' || filterState !== 'all' || filterCollege !== 'all' || filterTechnology !== 'all' || filterPlatform !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-violet-400" />
              )}
            </button>
          </div>

          {/* ── Advanced Filters Drawer ── */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 bg-slate-900/40 border border-white/8 rounded-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
                  {/* Mode */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Mode</label>
                    <div className="relative">
                      <select value={filterMode} onChange={e => setFilterMode(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                        <option value="all">All Modes</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Prize pool range */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Prize Pool</label>
                    <div className="relative">
                      <select value={filterPrize} onChange={e => setFilterPrize(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                        <option value="all">Any Prize Pool</option>
                        <option value="under10k">Under ₹10k / $120</option>
                        <option value="10kto50k">₹10k - ₹50k</option>
                        <option value="above50k">Above ₹50k / $600</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Registration Status / Deadline Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Registration Status</label>
                    <div className="relative">
                      <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                        <option value="all">All Statuses</option>
                        <option value="open">Open (Active)</option>
                        <option value="closing_soon">Closing Soon (&lt;3d)</option>
                        <option value="closing_soon_7d">Closing Soon (&lt;7d)</option>
                        <option value="closed">Closed / Ended</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Difficulty</label>
                    <div className="relative">
                      <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                        <option value="all">All Difficulty Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Fee */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Fee</label>
                    <div className="relative">
                      <select value={filterFee} onChange={e => setFilterFee(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                        <option value="all">Any Fee</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Country</label>
                    <div className="relative">
                      <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                        <option value="all">All Countries</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">State (India)</label>
                    <div className="relative">
                      <select value={filterState} onChange={e => setFilterState(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                        <option value="all">All States</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* College */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">College</label>
                    <div className="relative">
                      <select value={filterCollege} onChange={e => setFilterCollege(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                        <option value="all">All Colleges</option>
                        {colleges.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Technology */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Technology</label>
                    <div className="relative">
                      <select value={filterTechnology} onChange={e => setFilterTechnology(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                        <option value="all">All Tech Stack</option>
                        {technologies.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Platform */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Platform</label>
                    <div className="relative">
                      <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                        <option value="all">All Platforms</option>
                        <option value="Unstop">Unstop</option>
                        <option value="Devpost">Devpost</option>
                        <option value="Devfolio">Devfolio</option>
                        <option value="HackerEarth">HackerEarth</option>
                        <option value="Hack Club">Hack Club</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Reset Actions */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilterMode('all'); setFilterFee('all'); setFilterDifficulty('all');
                        setFilterCountry('all'); setFilterPrize('all'); setFilterStatus('all');
                        setFilterState('all'); setFilterCollege('all'); setFilterTechnology('all');
                        setFilterPlatform('all');
                        setSelectedCategory('all');
                      }}
                      className="w-full px-3 py-2 text-xs font-bold text-rose-400 border border-rose-800/30 bg-rose-950/20 rounded-xl hover:bg-rose-950/40 transition-all cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Category Horizontal Chips ── */}
          {activeTab !== 'calendar' && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-violet-800/30 scrollbar-track-transparent">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${selectedCategory === cat.id ? 'bg-violet-600 border-violet-500 text-white' : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white hover:border-white/10'}`}
                >
                  <cat.icon className="w-3 h-3" />
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Calendar View ── */}
          {activeTab === 'calendar' ? (
            <GlassCard>
              <CalendarView hackathons={allHackathons} />
            </GlassCard>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 text-sm animate-pulse">Loading opportunities...</p>
            </div>
          ) : activeTab === 'recommended' && recLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="h-12 w-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 text-sm animate-pulse">Generating personalized AI matches...</p>
            </div>
          ) : displayList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5">
                <Search className="w-10 h-10 text-slate-600" />
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-semibold">No opportunities match your filters</p>
                <p className="text-slate-500 text-xs mt-1">Try resetting selected search queries or filter attributes.</p>
              </div>
              <button 
                onClick={() => {
                  setSearchTerm(''); setSelectedCategory('all'); setFilterMode('all');
                  setFilterFee('all'); setFilterDifficulty('all'); setFilterCountry('all');
                  setFilterPrize('all'); setFilterStatus('all'); setFilterState('all');
                  setFilterCollege('all'); setFilterTechnology('all');
                }}
                className="px-4 py-2 bg-violet-600/20 border border-violet-700/30 text-violet-400 text-sm font-bold rounded-xl hover:bg-violet-600/30 transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div>
              {/* Count details */}
              <div className="flex items-center justify-between mb-4 text-left">
                <p className="text-xs text-slate-400">
                  {activeTab === 'recommended' ? (
                    <><Sparkles className="w-4 h-4 inline mr-1 text-pink-400" /><span className="text-pink-400 font-bold">AI Recommended</span> — {displayList.length} customized picks for your profile</>
                  ) : (
                    <><span className="text-slate-200 font-bold">{displayList.length}</span> active opportunities loaded</>
                  )}
                </p>
              </div>

              {/* AI Details message */}
              {activeTab === 'recommended' && recommended.length > 0 && (
                <div className="mb-4 p-3.5 rounded-xl bg-pink-950/20 border border-pink-800/30 flex items-start gap-2.5 text-left">
                  <Sparkles className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-pink-300">Studora AI has analyzed your achievements, profile certifications, and course path tags to tailor these recommendations specifically for you.</p>
                </div>
              )}

              {/* Opportunities list layout */}
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence>
                  {displayList.map(opp => (
                    <OpportunityCard
                      key={opp._id}
                      opp={opp}
                      user={user}
                      onBookmark={toggleBookmark}
                      onReminder={handleToggleReminder}
                      onClick={setSelectedOpp}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* Submission Modal */}
      {showSubmitModal && (
        <SubmitOpportunityModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleUserOpportunitySubmit}
        />
      )}

      {/* Details Modal */}
      {selectedOpp && (
        <OpportunityModal
          opp={selectedOpp}
          onClose={() => setSelectedOpp(null)}
          user={user}
          onBookmark={toggleBookmark}
          onRegister={handleRegister}
          onWin={handleWin}
          onReminder={handleToggleReminder}
        />
      )}
    </div>
  );
};

export default Hackathons;
