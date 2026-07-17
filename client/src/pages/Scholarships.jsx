import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, GraduationCap, Calendar, ShieldAlert, Bookmark, BookmarkCheck,
  DollarSign, Clock, Star, Share2, CheckCircle, FileText, Filter,
  X, ChevronDown, Flame, Sparkles, AlertCircle, ExternalLink,
  BookOpen, Users, Award, TrendingUp, Bell, BadgeCheck, Info
} from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const EDUCATION_LEVELS = [
  { id: 'all', label: 'All Levels' },
  { id: 'Undergraduate', label: 'Undergraduate' },
  { id: 'Postgraduate / PhD', label: 'Postgraduate / PhD' },
  { id: 'Undergraduate / MBA', label: 'MBA' },
  { id: '10th to Postgraduate', label: '10th–PG' },
];

const SCHOL_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'Merit-based', label: 'Merit-Based' },
  { id: 'Need-based', label: 'Need-Based' },
  { id: 'Merit-cum-Means', label: 'Merit-cum-Means' },
  { id: 'Research Fellowship', label: 'Fellowship' },
];

const AMOUNT_RANGES = [
  { id: 'all', label: 'Any Amount' },
  { id: 'low', label: 'Up to ₹25K' },
  { id: 'mid', label: '₹25K – ₹1L' },
  { id: 'high', label: '₹1L+' },
];

const SORT_OPTIONS = [
  { id: 'deadline', label: 'Deadline (Soonest)' },
  { id: 'amount', label: 'Amount (Highest)' },
  { id: 'recent', label: 'Recently Added' },
];

const QUICK_TABS = [
  { id: 'all', label: 'All Scholarships', icon: GraduationCap },
  { id: 'closing', label: 'Closing Soon', icon: Flame },
  { id: 'recommended', label: 'Recommended', icon: Sparkles },
  { id: 'merit', label: 'Merit-Based', icon: Star },
  { id: 'need', label: 'Need-Based', icon: Users },
];

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
    closed: 'text-slate-500 bg-slate-900/40 border-slate-700/30',
    critical: 'text-rose-400 bg-rose-950/30 border-rose-800/30 animate-pulse',
    warning: 'text-amber-400 bg-amber-950/30 border-amber-800/30',
    normal: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/30',
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorMap[urgency]}`}>
      <Clock className="w-3 h-3" />
      {timeLeft}
    </span>
  );
};

// ─────────────────────────────────────────────
// Amount Badge
// ─────────────────────────────────────────────
const AmountBadge = ({ amount }) => {
  if (!amount) return null;
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-green-950/60 border border-emerald-700/40 text-emerald-300 font-bold text-xs">
      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
      <span>{amount}</span>
    </div>
  );
};

// ─────────────────────────────────────────────
// Scholarship Detail Modal
// ─────────────────────────────────────────────
const ScholarshipModal = ({ schol, onClose, user, onBookmark }) => {
  const [shareSuccess, setShareSuccess] = useState(false);
  const [docsExpanded, setDocsExpanded] = useState(true);
  const isBookmarked = user?.bookmarks?.includes(schol._id);

  const handleShare = () => {
    const url = schol.applyLink || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      });
    }
  };

  const typeColors = {
    'Merit-based': 'text-amber-400 bg-amber-950/30 border-amber-700/30',
    'Need-based': 'text-cyan-400 bg-cyan-950/30 border-cyan-700/30',
    'Merit-cum-Means': 'text-violet-400 bg-violet-950/30 border-violet-700/30',
    'Research Fellowship': 'text-pink-400 bg-pink-950/30 border-pink-700/30',
    'Need-based / Crisis': 'text-rose-400 bg-rose-950/30 border-rose-700/30',
    'Need-based (Reserved Category)': 'text-orange-400 bg-orange-950/30 border-orange-700/30',
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
              src={schol.banner || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop'}
              alt={schol.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-[#0e1628]/40 to-transparent" />
            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={handleShare} className="p-2 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-white hover:bg-black/60 transition-all" title="Copy link">
                {shareSuccess ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button onClick={onClose} className="p-2 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-white hover:bg-red-500/30 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Logo + Title */}
            <div className="absolute bottom-4 left-4 flex items-end gap-3">
              <img
                src={schol.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${schol.company}`}
                alt={schol.company}
                className="w-14 h-14 rounded-xl bg-slate-950 border border-white/20 p-1 shadow-lg"
                onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${schol.company}`; }}
              />
              <div className="text-left">
                <h2 className="font-display font-extrabold text-lg text-white leading-tight drop-shadow-lg line-clamp-2">{schol.title}</h2>
                <p className="text-sm text-slate-300 font-semibold">{schol.provider || schol.company}</p>
              </div>
            </div>
          </div>

          {/* Meta badges */}
          <div className="px-6 py-4 flex flex-wrap gap-2">
            {schol.scholarshipType && (
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${typeColors[schol.scholarshipType] || 'text-slate-400 bg-slate-800/40 border-white/10'}`}>
                {schol.scholarshipType}
              </span>
            )}
            {schol.educationLevel && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border bg-violet-950/30 border-violet-700/30 text-violet-300">
                <BookOpen className="w-3 h-3" />{schol.educationLevel}
              </span>
            )}
            {schol.amount && <AmountBadge amount={schol.amount} />}
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4 text-left">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About this Scholarship</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{schol.description}</p>
            </div>

            {schol.eligibility && (
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex gap-2 items-start">
                <ShieldAlert className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide mb-1">Eligibility Criteria</p>
                  <p className="text-xs text-slate-300">{schol.eligibility}</p>
                </div>
              </div>
            )}

            {/* Deadline */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Last Date to Apply</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-xs text-slate-200 font-semibold">{schol.deadline}</span>
                </div>
                <div className="mt-1">
                  <DeadlineCountdown deadline={schol.deadline} />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount</p>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-300 font-semibold">{schol.amount || 'See portal'}</span>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            {schol.documents && schol.documents.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/10 border border-amber-800/20">
                <button
                  onClick={() => setDocsExpanded(v => !v)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Required Documents ({schol.documents.length})
                  </p>
                  <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${docsExpanded ? 'rotate-180' : ''}`} />
                </button>
                {docsExpanded && (
                  <ul className="mt-2 space-y-1">
                    {schol.documents.map((doc, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3 h-3 text-amber-400 shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Tags */}
            {schol.tags && schol.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {schol.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-900/60 border border-white/5 rounded-lg text-[10px] text-slate-400 font-medium">#{tag}</span>
                ))}
              </div>
            )}

            {/* Apply */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onBookmark(schol._id)}
                className={`p-2.5 rounded-xl border transition-all ${isBookmarked ? 'bg-violet-950/40 border-violet-700/30 text-violet-400' : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white'}`}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <a href={schol.applyLink} target="_blank" rel="noreferrer" className="flex-1">
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
// Scholarship Card
// ─────────────────────────────────────────────
const ScholarshipCard = ({ schol, user, onBookmark, onOpen, delay = 0 }) => {
  const [shareSuccess, setShareSuccess] = useState(false);
  const isBookmarked = user?.bookmarks?.includes(schol._id);

  const daysLeft = (() => {
    const diff = new Date(schol.deadline).getTime() - Date.now();
    return Math.floor(diff / 86400000);
  })();

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(schol.applyLink || window.location.href).then(() => {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      });
    }
  };

  const typeColors = {
    'Merit-based': 'text-amber-400 bg-amber-950/30 border-amber-700/30',
    'Need-based': 'text-cyan-400 bg-cyan-950/30 border-cyan-700/30',
    'Merit-cum-Means': 'text-violet-400 bg-violet-950/30 border-violet-700/30',
    'Research Fellowship': 'text-pink-400 bg-pink-950/30 border-pink-700/30',
    'Need-based / Crisis': 'text-rose-400 bg-rose-950/30 border-rose-700/30',
    'Need-based (Reserved Category)': 'text-orange-400 bg-orange-950/30 border-orange-700/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.05 }}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col glass-card-hover cursor-pointer group"
      onClick={() => onOpen(schol)}
    >
      {/* Banner */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={schol.banner || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop'}
          alt={schol.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-transparent to-transparent" />
        {daysLeft <= 10 && daysLeft >= 0 && (
          <div className="absolute top-2 left-2">
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300">
              <Flame className="w-2.5 h-2.5" /> Closing Soon
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button
            onClick={e => { e.stopPropagation(); onBookmark(schol._id); }}
            className="p-1.5 rounded-xl bg-black/50 backdrop-blur border border-white/10 text-white hover:bg-black/70 transition-all"
          >
            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-violet-400" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
          <button onClick={handleShare} className="p-1.5 rounded-xl bg-black/50 backdrop-blur border border-white/10 text-white hover:bg-black/70 transition-all">
            {shareSuccess ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Logo + Provider */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={schol.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${schol.company}`}
            alt={schol.company}
            className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 p-0.5 shrink-0"
            onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${schol.company}`; }}
          />
          <div className="text-left min-w-0">
            <p className="text-xs text-slate-400 font-semibold truncate">{schol.provider || schol.company}</p>
          </div>
        </div>

        <h3 className="font-display font-bold text-sm text-slate-100 line-clamp-2 leading-snug text-left mb-3">{schol.title}</h3>

        {/* Type + Education Level */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {schol.scholarshipType && (
            <span className={`text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded border ${typeColors[schol.scholarshipType] || 'text-slate-400 bg-slate-800 border-white/5'}`}>
              {schol.scholarshipType}
            </span>
          )}
          {schol.educationLevel && (
            <span className="text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded border text-violet-400 bg-violet-950/30 border-violet-700/30">
              {schol.educationLevel}
            </span>
          )}
        </div>

        {/* Amount Banner */}
        {schol.amount && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-950/40 to-green-950/40 border border-emerald-800/30 mb-3">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-emerald-300">{schol.amount}</span>
          </div>
        )}

        {/* Eligibility */}
        <div className="p-2.5 rounded-xl bg-cyan-950/15 border border-cyan-800/20 mb-3 flex gap-2 items-start">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-slate-400 line-clamp-2 text-left">{schol.eligibility}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(schol.tags || []).slice(0, 3).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 bg-slate-900 border border-white/5 rounded text-[9px] text-slate-400 font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-semibold">{schol.deadline}</span>
            </div>
            <DeadlineCountdown deadline={schol.deadline} />
          </div>
          <a
            href={schol.applyLink}
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
// Main Scholarships Page
// ─────────────────────────────────────────────
const Scholarships = () => {
  const { user, toggleBookmark } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [educationFilter, setEducationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSchol, setSelectedSchol] = useState(null);
  const [stateFilter, setStateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [govPrivateFilter, setGovPrivateFilter] = useState('all'); // all | government | private

  const fetchScholarships = useCallback(async () => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities?type=scholarship`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setScholarships(data);
      }
    } catch (err) {
      console.error('Error fetching scholarships:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchScholarships(); }, [fetchScholarships]);

  // Filter & sort
  const filtered = scholarships.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.company && s.company.toLowerCase().includes(q)) ||
      (s.provider && s.provider.toLowerCase().includes(q)) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.tags && s.tags.some(t => t.toLowerCase().includes(q)));

    const matchesEducation = educationFilter === 'all' ||
      (s.educationLevel && s.educationLevel.includes(educationFilter));

    const matchesType = typeFilter === 'all' ||
      (s.scholarshipType && s.scholarshipType.includes(typeFilter));

    const matchesAmount = (() => {
      if (amountFilter === 'all') return true;
      const amt = (s.amount || '').replace(/[₹,\s]/g, '').toLowerCase();
      if (amountFilter === 'low') return /\d/.test(amt) && parseInt(amt) <= 25000;
      if (amountFilter === 'mid') {
        const num = parseInt(amt);
        return num > 25000 && num <= 100000;
      }
      if (amountFilter === 'high') return parseInt(amt) > 100000;
      return true;
    })();

    const matchesState = stateFilter === 'all' ||
      !s.state ||
      s.state.toLowerCase() === 'all india' ||
      s.state.toLowerCase() === stateFilter.toLowerCase();

    const matchesCategory = categoryFilter === 'all' ||
      (s.category && s.category.toLowerCase().includes(categoryFilter.toLowerCase())) ||
      (s.tags && s.tags.some(t => t.toLowerCase() === categoryFilter.toLowerCase()));

    const matchesGovPrivate = govPrivateFilter === 'all' ||
      (govPrivateFilter === 'government' && s.isGovernment) ||
      (govPrivateFilter === 'private' && !s.isGovernment);

    // Quick tab
    const daysLeft = Math.floor((new Date(s.deadline).getTime() - Date.now()) / 86400000);
    const matchesTab = (() => {
      if (activeTab === 'all') return true;
      if (activeTab === 'closing') return daysLeft >= 0 && daysLeft <= 30;
      if (activeTab === 'recommended') {
        const isMeritEligible = (user?.cgpa?.cgpa || 8.0) >= 8.0;
        if (isMeritEligible) {
          return s.isFeatured || (s.scholarshipType && s.scholarshipType.toLowerCase().includes('merit'));
        }
        return s.isFeatured;
      }
      if (activeTab === 'merit') return s.scholarshipType && s.scholarshipType.toLowerCase().includes('merit');
      if (activeTab === 'need') return s.scholarshipType && s.scholarshipType.toLowerCase().includes('need');
      return true;
    })();

    return matchesSearch && matchesEducation && matchesType && matchesAmount && matchesState && matchesCategory && matchesGovPrivate && matchesTab;
  }).sort((a, b) => {
    if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
    if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'amount') {
      const parseVal = (str) => {
        if (!str) return 0;
        const cleaned = str.replace(/[^0-9]/g, '');
        return parseInt(cleaned, 10) || 0;
      };
      return parseVal(b.amount) - parseVal(a.amount);
    }
    return 0;
  });

  const closingSoon = scholarships.filter(s => {
    const d = Math.floor((new Date(s.deadline).getTime() - Date.now()) / 86400000);
    return d >= 0 && d <= 7;
  });

  const recommended = scholarships.filter(s => {
    const isMeritEligible = (user?.cgpa?.cgpa || 8.0) >= 8.0;
    if (isMeritEligible) return s.isFeatured || (s.scholarshipType && s.scholarshipType.toLowerCase().includes('merit'));
    return s.isFeatured;
  });

  const activeFiltersCount = [
    educationFilter !== 'all',
    typeFilter !== 'all',
    amountFilter !== 'all',
    stateFilter !== 'all',
    categoryFilter !== 'all',
    govPrivateFilter !== 'all',
    sortBy !== 'deadline'
  ].filter(Boolean).length;

  const bookmarkedCount = scholarships.filter(s => user?.bookmarks?.includes(s._id)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="text-left">
          <h1 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-violet-400" />
            Scholarship Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover verified scholarships from NSP, AICTE, UGC, Reliance, Tata, and more.
          </p>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-3 bg-gradient-to-br from-violet-950/20 to-slate-900/30 border-white/5 text-left">
          <div className="p-2.5 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Scholarships</p>
            <h3 className="text-xl font-display font-extrabold text-slate-100 mt-0.5">{scholarships.length}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3 bg-gradient-to-br from-rose-950/20 to-slate-900/30 border-white/5 text-left">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Closing This Week</p>
            <h3 className="text-xl font-display font-extrabold text-slate-100 mt-0.5">{closingSoon.length}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3 bg-gradient-to-br from-amber-950/20 to-slate-900/30 border-white/5 text-left">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bookmarked</p>
            <h3 className="text-xl font-display font-extrabold text-slate-100 mt-0.5">{bookmarkedCount}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3 bg-gradient-to-br from-emerald-950/20 to-slate-900/30 border-white/5 text-left">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Recommended</p>
            <h3 className="text-xl font-display font-extrabold text-slate-100 mt-0.5">{recommended.length}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Quick Tabs */}
      <div className="flex gap-2 flex-wrap">
        {QUICK_TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]'
                  : 'glass-panel text-slate-400 hover:text-white hover:border-violet-500/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.id === 'closing' && closingSoon.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">{closingSoon.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search scholarships by name, provider, tags..."
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
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2.5 bg-slate-950/40 border border-white/10 rounded-2xl text-sm text-slate-300 focus:outline-none focus:border-violet-500 cursor-pointer"
        >
          {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>

      {/* Advanced Filters Panel */}
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
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Education Level</label>
                <div className="flex flex-wrap gap-1.5">
                  {EDUCATION_LEVELS.map(el => (
                    <button
                      key={el.id}
                      onClick={() => setEducationFilter(el.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${educationFilter === el.id ? 'bg-violet-600 text-white' : 'glass-panel text-slate-400 hover:text-white'}`}
                    >
                      {el.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Scholarship Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {SCHOL_TYPES.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setTypeFilter(st.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${typeFilter === st.id ? 'bg-violet-600 text-white' : 'glass-panel text-slate-400 hover:text-white'}`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Amount Range</label>
                <div className="flex flex-wrap gap-1.5">
                  {AMOUNT_RANGES.map(ar => (
                    <button
                      key={ar.id}
                      onClick={() => setAmountFilter(ar.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${amountFilter === ar.id ? 'bg-emerald-600 text-white' : 'glass-panel text-slate-400 hover:text-white'}`}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 border-t border-white/5 pt-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block">Government / Private</label>
                <div className="relative">
                  <select value={govPrivateFilter} onChange={e => setGovPrivateFilter(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="all">All Sponsorships</option>
                    <option value="government">Government Sponsored</option>
                    <option value="private">Private Trusts / Companies</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block">State / Region</label>
                <div className="relative">
                  <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="all">All States</option>
                    <option value="All India">All India</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block">Category</label>
                <div className="relative">
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full appearance-none bg-slate-950/50 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 cursor-pointer">
                    <option value="all">All Categories</option>
                    <option value="General">General</option>
                    <option value="SC/ST/OBC">SC / ST / OBC</option>
                    <option value="Minority">Minority</option>
                    <option value="WomenInTech">Women in STEM</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setEducationFilter('all'); setTypeFilter('all'); setAmountFilter('all');
                  setStateFilter('all'); setCategoryFilter('all'); setGovPrivateFilter('all');
                  setSortBy('deadline');
                }}
                className="mt-4 text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" /> Clear All Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Closing Soon Section */}
      {activeTab === 'all' && !searchTerm && closingSoon.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <h2 className="font-display font-bold text-sm text-rose-300 uppercase tracking-wide">Closing Soon — Apply Before It's Too Late!</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {closingSoon.slice(0, 3).map((s, i) => (
              <ScholarshipCard
                key={s._id}
                schol={s}
                user={user}
                onBookmark={toggleBookmark}
                onOpen={setSelectedSchol}
                delay={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Section */}
      {activeTab === 'all' && !searchTerm && recommended.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h2 className="font-display font-bold text-sm text-violet-300 uppercase tracking-wide">Recommended Scholarships</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.slice(0, 3).map((s, i) => (
              <ScholarshipCard
                key={s._id}
                schol={s}
                user={user}
                onBookmark={toggleBookmark}
                onOpen={setSelectedSchol}
                delay={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-400" />
            <h2 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wide">
              {activeTab === 'all' ? 'All Scholarships' : QUICK_TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <span className="text-xs text-slate-500 font-semibold">({filtered.length} results)</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-panel rounded-2xl"
          >
            <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-semibold text-lg">No scholarships found</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms</p>
            <button
              onClick={() => { setSearchTerm(''); setEducationFilter('all'); setTypeFilter('all'); setAmountFilter('all'); setActiveTab('all'); }}
              className="mt-4 px-4 py-2 bg-violet-600/20 border border-violet-500/30 text-violet-400 rounded-xl text-xs font-semibold hover:bg-violet-600/30 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <ScholarshipCard
                key={s._id}
                schol={s}
                user={user}
                onBookmark={toggleBookmark}
                onOpen={setSelectedSchol}
                delay={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/20 flex gap-3 items-start">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
        <div className="text-left">
          <p className="text-xs font-bold text-blue-300 mb-1">Disclaimer</p>
          <p className="text-[11px] text-slate-400">
            All scholarship information is sourced from official government portals and trusted organizations. Always verify details on the official website before applying. Deadlines may change — visit the provider's portal for the latest information.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedSchol && (
          <ScholarshipModal
            schol={selectedSchol}
            user={user}
            onClose={() => setSelectedSchol(null)}
            onBookmark={toggleBookmark}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scholarships;
