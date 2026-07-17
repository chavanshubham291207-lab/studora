import React, { useState, useEffect } from 'react';
import { 
  Search, Award, BookOpen, Flame, CheckCircle, Bookmark, Share2, 
  Compass, Brain, PlusCircle, AlertCircle, ExternalLink, Filter, 
  X, RefreshCw, ChevronRight, CheckSquare, BookmarkCheck, Heart, Sparkles
} from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const FreeCertifications = () => {
  const { user } = useAuth();
  
  // Courses state
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalCompanies: 0,
    certificatesCompleted: 0,
    coursesBookmarked: 0,
    learningStreak: 0,
    progressPercentage: 0
  });

  // User tracking overrides (to keep state in sync immediately on click)
  const [userBookmarks, setUserBookmarks] = useState(user?.bookmarkedCourses || []);
  const [userCompleted, setUserCompleted] = useState(user?.completedCourses || []);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore', 'bookmarked', 'completed', 'recommended'
  
  // Modals state
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSkills, setAiSkills] = useState('');
  const [aiGoal, setAiGoal] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('request'); // 'request', 'broken_link'
  const [reqTitle, setReqTitle] = useState('');
  const [reqProvider, setReqProvider] = useState('');
  const [reqLink, setReqLink] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [requestMsg, setRequestMsg] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  const [shareMsg, setShareMsg] = useState('');

  // Fetch courses and user stats
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('studora_token');
      
      // Build query string
      let query = `${API_BASE}/certifications?`;
      if (searchTerm) query += `search=${encodeURIComponent(searchTerm)}&`;
      selectedProvider.forEach(p => query += `provider=${encodeURIComponent(p)}&`);
      selectedCompany.forEach(c => query += `companyName=${encodeURIComponent(c)}&`);
      selectedCategory.forEach(cat => query += `category=${encodeURIComponent(cat)}&`);
      selectedDifficulty.forEach(d => query += `difficulty=${encodeURIComponent(d)}&`);
      selectedDuration.forEach(dur => query += `duration=${encodeURIComponent(dur)}&`);

      const res = await fetch(query, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/certifications/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedProvider, selectedCompany, selectedCategory, selectedDifficulty, selectedDuration]);

  useEffect(() => {
    fetchStats();
    if (user) {
      setUserBookmarks(user.bookmarkedCourses || []);
      setUserCompleted(user.completedCourses || []);
    }
  }, [user]);

  // Sync state helpers
  const handleToggleBookmark = async (courseId) => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/certifications/${courseId}/bookmark`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserBookmarks(data.bookmarkedCourses);
        fetchStats();
      }
    } catch (err) {
      console.error('Error bookmarking course:', err);
    }
  };

  const handleToggleComplete = async (courseId) => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/certifications/${courseId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserCompleted(data.completedCourses);
        if (data.learningStreak) {
          setStats(prev => ({ ...prev, learningStreak: data.learningStreak }));
        }
        fetchStats();
      }
    } catch (err) {
      console.error('Error completing course:', err);
    }
  };

  const handleTrackView = async (courseId, link) => {
    try {
      await fetch(`${API_BASE}/certifications/${courseId}/view`, { method: 'POST' });
    } catch (err) {
      console.error('Error logging course view:', err);
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleShare = (course) => {
    const text = `Check out this 100% free certification program! 🎓\nCourse: "${course.title}" from ${course.companyName} (${course.provider}).\nStart here: ${course.courseLink}`;
    navigator.clipboard.writeText(text);
    setShareMsg(`Copied share link for "${course.title}"!`);
    setTimeout(() => setShareMsg(''), 3000);
  };

  // Submit course request / broken link report
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!reqTitle) return;

    setRequestLoading(true);
    setRequestMsg('');

    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/certifications/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: requestType,
          courseTitle: reqTitle,
          provider: reqProvider,
          courseUrl: reqLink,
          description: reqDesc
        })
      });

      if (res.ok) {
        setRequestMsg(requestType === 'request' ? 'Course request submitted successfully! ✓' : 'Broken link report submitted successfully! ✓');
        // Reset
        setReqTitle('');
        setReqProvider('');
        setReqLink('');
        setReqDesc('');
        setTimeout(() => {
          setShowRequestModal(false);
          setRequestMsg('');
        }, 2000);
      } else {
        setRequestMsg('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setRequestMsg('Network error submitting request.');
    } finally {
      setRequestLoading(false);
    }
  };

  // AI Course Recommendation trigger
  const handleAIRecommendations = async (e) => {
    e.preventDefault();
    if (!aiSkills && !aiGoal) return;

    setAiLoading(true);
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/certifications/recommend-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          skills: aiSkills,
          careerGoal: aiGoal
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiRecommendations(data);
        setActiveTab('recommended');
        setShowAIModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Quick helper to clear all filters
  const handleClearFilters = () => {
    setSelectedProvider([]);
    setSelectedCompany([]);
    setSelectedCategory([]);
    setSelectedDifficulty([]);
    setSelectedDuration([]);
    setSearchTerm('');
    setSelectedSkill('');
    setShowOnlyFeatured(false);
  };

  // Provider options
  const providersList = [
    'The Forage', 'Google', 'Microsoft', 'AWS', 'freeCodeCamp', 'IBM', 
    'Cisco', 'Oracle', 'Salesforce', 'LinkedIn Learning (Free)', 'Kaggle', 
    'HP LIFE', 'Great Learning Academy', 'Simplilearn SkillUp', 
    'Infosys Springboard', 'NPTEL', 'SWAYAM', 'FutureLearn (Free)', 'OpenLearn'
  ];

  // Company options
  const companiesList = [
    'Tata Group', 'Deloitte', 'JPMorgan Chase & Co.', 'Accenture', 'PwC', 
    'BCG', 'KPMG', 'Electronic Arts (EA)', 'Mastercard', 'Google', 'Microsoft', 
    'AWS', 'freeCodeCamp', 'Commonwealth Bank', 'Citi', 'Red Bull', 'Lyft', 
    'Visa', 'PepsiCo', 'GE Aerospace', 'AIG', 'SAP', 'Intel'
  ];

  const categoriesList = [
    'Software Engineering', 'Data Analytics', 'Consulting', 'Cybersecurity', 
    'Cloud Computing', 'Artificial Intelligence'
  ];

  // Filter local courses based on active tab and featured flag
  let displayedCourses = [...courses];
  
  if (showOnlyFeatured) {
    displayedCourses = displayedCourses.filter(c => c.isFeatured);
  }

  if (activeTab === 'bookmarked') {
    displayedCourses = displayedCourses.filter(c => userBookmarks.includes(c._id));
  } else if (activeTab === 'completed') {
    displayedCourses = displayedCourses.filter(c => userCompleted.includes(c._id));
  } else if (activeTab === 'recommended') {
    displayedCourses = aiRecommendations.length > 0 ? aiRecommendations : displayedCourses.filter(c => c.isFeatured);
  }

  // Filter by skills if custom selected
  if (selectedSkill) {
    displayedCourses = displayedCourses.filter(c => 
      c.skills && c.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()))
    );
  }

  // Extract forage courses specifically for The Forage showcase section
  const forageFeaturedCourses = courses.filter(c => c.provider === 'The Forage');

  return (
    <div className="space-y-6 text-left relative">
      {/* Toast Alert for Share */}
      {shareMsg && (
        <div className="fixed top-20 right-6 z-50 py-3 px-5 bg-violet-950/90 border border-violet-500/30 text-violet-200 text-xs font-semibold rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{shareMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <Compass className="w-7 h-7 text-violet-400" /> Free Certifications & Virtual Experience
          </h1>
          <p className="text-sm text-slate-400">Boost your resume with 100% free certifications and virtual job simulations from top platforms.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowAIModal(true)} className="flex items-center gap-1.5 cursor-pointer">
            <Brain className="w-4 h-4 text-cyan-400 animate-pulse" /> AI Course Finder
          </Button>
          <Button variant="primary" size="sm" onClick={() => { setRequestType('request'); setShowRequestModal(true); }} className="flex items-center gap-1.5 cursor-pointer">
            <PlusCircle className="w-4 h-4" /> Request / Submit Link
          </Button>
        </div>
      </div>

      {/* Dashboard Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <GlassCard className="p-4 flex items-center gap-3.5 bg-gradient-to-br from-violet-950/20 to-slate-900/20 border-violet-900/20">
          <div className="p-2.5 bg-violet-650/15 text-violet-400 rounded-xl border border-violet-850/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Free Courses</p>
            <h3 className="text-lg font-display font-extrabold text-slate-100">{stats.totalCourses}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3.5 bg-gradient-to-br from-cyan-950/20 to-slate-900/20 border-cyan-900/20">
          <div className="p-2.5 bg-cyan-650/15 text-cyan-400 rounded-xl border border-cyan-850/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Companies</p>
            <h3 className="text-lg font-display font-extrabold text-slate-100">{stats.totalCompanies}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3.5 bg-gradient-to-br from-emerald-950/20 to-slate-900/20 border-emerald-900/20">
          <div className="p-2.5 bg-emerald-650/15 text-emerald-400 rounded-xl border border-emerald-850/20">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Completed</p>
            <h3 className="text-lg font-display font-extrabold text-slate-100">{stats.certificatesCompleted}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3.5 bg-gradient-to-br from-pink-950/20 to-slate-900/20 border-pink-900/20">
          <div className="p-2.5 bg-pink-650/15 text-pink-400 rounded-xl border border-pink-850/20">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Bookmarked</p>
            <h3 className="text-lg font-display font-extrabold text-slate-100">{stats.coursesBookmarked}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3.5 bg-gradient-to-br from-amber-950/20 to-slate-900/20 border-amber-900/20">
          <div className="p-2.5 bg-amber-650/15 text-amber-400 rounded-xl border border-amber-850/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Streak</p>
            <h3 className="text-lg font-display font-extrabold text-slate-100">{stats.learningStreak} days</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-center bg-gradient-to-br from-indigo-950/20 to-slate-900/20 border-indigo-900/20 text-left">
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Overall Progress</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 bg-slate-950/50 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full transition-all duration-500" 
                style={{ width: `${stats.progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-bold text-slate-200">{stats.progressPercentage}%</span>
          </div>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 pb-2 gap-2 mt-2">
        <button
          onClick={() => setActiveTab('explore')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
            activeTab === 'explore' ? 'bg-violet-650/20 text-violet-400 border border-violet-800/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Explore Catalog
        </button>
        <button
          onClick={() => setActiveTab('bookmarked')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'bookmarked' ? 'bg-violet-650/20 text-violet-400 border border-violet-800/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Bookmarks ({stats.coursesBookmarked})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'completed' ? 'bg-violet-650/20 text-violet-400 border border-violet-800/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Completed Certifications ({stats.certificatesCompleted})
        </button>
        {aiRecommendations.length > 0 && (
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'recommended' ? 'bg-cyan-950/20 text-cyan-400 border border-cyan-800/40 animate-pulse' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Recommendations
          </button>
        )}
      </div>

      {/* Featured Forage Slider - Only visible in Explore Tab */}
      {activeTab === 'explore' && forageFeaturedCourses.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-100 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-orange-650/20 text-orange-450 border border-orange-500/20 text-2xs uppercase tracking-wide">Featured Provider</span> 
                The Forage Virtual Simulations
              </h3>
              <p className="text-xs text-slate-400">Pre-internship programs simulated by Fortune 500 companies. Add these to your LinkedIn.</p>
            </div>
            <span className="text-[10px] text-slate-500 font-bold">Scroll horizontally →</span>
          </div>

          {/* Horizontal list */}
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-slate-800">
            {forageFeaturedCourses.map(course => {
              const isBookmarked = userBookmarks.includes(course._id);
              const isCompleted = userCompleted.includes(course._id);
              return (
                <div 
                  key={course._id} 
                  className="w-80 shrink-0 glass-panel border border-white/5 rounded-2xl p-4 flex flex-col justify-between bg-slate-900/30 hover:border-white/10 hover:bg-slate-900/40 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <img 
                        src={course.companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${course.companyName}`} 
                        alt={course.companyName} 
                        className="w-11 h-11 rounded-xl bg-slate-950 shrink-0 border border-white/10 p-1"
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleBookmark(course._id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            isBookmarked 
                              ? 'bg-violet-950/40 border-violet-500/30 text-violet-400' 
                              : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white'
                          }`}
                          title="Save for Later"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleShare(course)}
                          className="p-1.5 rounded-lg bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 text-left">
                      <span className="px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wide bg-orange-950/40 text-orange-400 border border-orange-800/30">
                        {course.provider}
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-200 mt-2 line-clamp-1 leading-snug group-hover:text-violet-400 transition-colors">{course.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{course.companyName} • {course.category}</p>
                      <p className="text-xs text-slate-350 mt-2.5 line-clamp-2 leading-relaxed">{course.description}</p>
                    </div>

                    {/* Skills list */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {course.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-950/40 border border-white/5 rounded text-[9px] text-slate-400 font-medium">
                          {skill}
                        </span>
                      ))}
                      {course.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-slate-950/40 border border-white/5 rounded text-[9px] text-slate-500 font-semibold">
                          +{course.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex gap-2 items-center">
                    <button
                      onClick={() => handleToggleComplete(course._id)}
                      className={`flex-1 py-1.5 rounded-lg text-2xs font-bold font-display border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-450'
                          : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Completed ✓' : 'Mark Done'}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleTrackView(course._id, course.courseLink)}
                      className="py-1.5 px-3 rounded-lg bg-violet-650 hover:bg-violet-700 text-white text-2xs font-bold font-display transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Start</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <GlassCard className="p-4 border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="font-display font-extrabold text-sm text-slate-200 flex items-center gap-1.5">
              <Filter className="w-4.5 h-4.5 text-violet-400" /> Filters
            </h3>
            <button 
              onClick={handleClearFilters}
              className="text-[10px] text-slate-400 hover:text-white transition-all cursor-pointer font-bold"
            >
              Reset All
            </button>
          </div>

          {/* Search inside catalog */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input 
              type="text" 
              placeholder="Search courses, skills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-500 text-slate-250"
            />
          </div>

          {/* Quick Skill filter */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Skill Search</label>
            <input 
              type="text" 
              placeholder="e.g. Python, SQL, Tableau" 
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-500 text-slate-250"
            />
          </div>

          {/* Featured Only Toggle */}
          <div className="flex items-center justify-between py-1 border-b border-white/5 pb-2">
            <span className="text-xs text-slate-350 font-semibold">Featured Programs Only</span>
            <input 
              type="checkbox" 
              checked={showOnlyFeatured}
              onChange={() => setShowOnlyFeatured(!showOnlyFeatured)}
              className="accent-violet-550 h-3.5 w-3.5 rounded border-white/10 bg-slate-950 cursor-pointer"
            />
          </div>

          {/* Provider Multi-select */}
          <div className="space-y-1.5 text-left border-b border-white/5 pb-3">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Providers</label>
            <div className="max-h-28 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {providersList.map(prov => (
                <label key={prov} className="flex items-center gap-2 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedProvider.includes(prov)}
                    onChange={() => {
                      if (selectedProvider.includes(prov)) {
                        setSelectedProvider(selectedProvider.filter(p => p !== prov));
                      } else {
                        setSelectedProvider([...selectedProvider, prov]);
                      }
                    }}
                    className="accent-violet-550 h-3 w-3 rounded border-white/10 bg-slate-950"
                  />
                  <span>{prov}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Company Multi-select */}
          <div className="space-y-1.5 text-left border-b border-white/5 pb-3">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Company Partners</label>
            <div className="max-h-28 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {companiesList.map(comp => (
                <label key={comp} className="flex items-center gap-2 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedCompany.includes(comp)}
                    onChange={() => {
                      if (selectedCompany.includes(comp)) {
                        setSelectedCompany(selectedCompany.filter(c => c !== comp));
                      } else {
                        setSelectedCompany([...selectedCompany, comp]);
                      }
                    }}
                    className="accent-violet-550 h-3 w-3 rounded border-white/10 bg-slate-950"
                  />
                  <span>{comp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Multi-select */}
          <div className="space-y-1.5 text-left border-b border-white/5 pb-3">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Categories</label>
            <div className="space-y-1">
              {categoriesList.map(cat => (
                <label key={cat} className="flex items-center gap-2 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedCategory.includes(cat)}
                    onChange={() => {
                      if (selectedCategory.includes(cat)) {
                        setSelectedCategory(selectedCategory.filter(c => c !== cat));
                      } else {
                        setSelectedCategory([...selectedCategory, cat]);
                      }
                    }}
                    className="accent-violet-550 h-3 w-3 rounded border-white/10 bg-slate-950"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Multi-select */}
          <div className="space-y-1.5 text-left border-b border-white/5 pb-3">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience Level</label>
            <div className="space-y-1">
              {['Beginner', 'Intermediate', 'Advanced'].map(diff => (
                <label key={diff} className="flex items-center gap-2 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedDifficulty.includes(diff)}
                    onChange={() => {
                      if (selectedDifficulty.includes(diff)) {
                        setSelectedDifficulty(selectedDifficulty.filter(d => d !== diff));
                      } else {
                        setSelectedDifficulty([...selectedDifficulty, diff]);
                      }
                    }}
                    className="accent-violet-550 h-3 w-3 rounded border-white/10 bg-slate-950"
                  />
                  <span>{diff}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration Multi-select */}
          <div className="space-y-1.5 text-left pb-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Duration</label>
            <div className="space-y-1">
              {['Short (< 2 hrs)', 'Medium (2-10 hrs)', 'Long (> 10 hrs)'].map(dur => (
                <label key={dur} className="flex items-center gap-2 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedDuration.includes(dur)}
                    onChange={() => {
                      if (selectedDuration.includes(dur)) {
                        setSelectedDuration(selectedDuration.filter(d => d !== dur));
                      } else {
                        setSelectedDuration([...selectedDuration, dur]);
                      }
                    }}
                    className="accent-violet-550 h-3 w-3 rounded border-white/10 bg-slate-950"
                  />
                  <span>{dur}</span>
                </label>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Main Courses Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <span className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : displayedCourses.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/10 border border-white/5 rounded-2xl">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
              <p className="text-slate-400 font-medium mt-4">No certification courses found matching your criteria.</p>
              <button 
                onClick={handleClearFilters}
                className="mt-3 text-xs text-violet-400 hover:text-violet-300 font-bold underline cursor-pointer"
              >
                Clear all filters and search terms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedCourses.map(course => {
                const isBookmarked = userBookmarks.includes(course._id);
                const isCompleted = userCompleted.includes(course._id);
                return (
                  <GlassCard key={course._id} className="flex flex-col justify-between bg-slate-900/20 hover:border-white/10 hover:bg-slate-900/30 transition-all duration-300 group">
                    <div>
                      {/* Top Action Header */}
                      <div className="flex justify-between items-start gap-4">
                        <img 
                          src={course.companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${course.companyName}`} 
                          alt={course.companyName} 
                          className="w-12 h-12 rounded-xl bg-slate-950 shrink-0 border border-white/10 p-1"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleBookmark(course._id)}
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                              isBookmarked 
                                ? 'bg-violet-950/40 border-violet-500/30 text-violet-400' 
                                : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white'
                            }`}
                            title={isBookmarked ? "Saved for Later" : "Save for Later"}
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-5 h-5 text-violet-400" />
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleShare(course)}
                            className="p-1.5 rounded-xl bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                            title="Share"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="mt-4 text-left space-y-2">
                        {/* Badges Container */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wide bg-violet-950/40 text-violet-400 border border-violet-800/30">
                            {course.provider}
                          </span>
                          
                          {course.isFreeCertificate && (
                            <span className="px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wide bg-emerald-950/40 text-emerald-400 border border-emerald-850/30 flex items-center gap-0.5">
                              Free Cert
                            </span>
                          )}

                          {course.isVirtualExperience && (
                            <span className="px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wide bg-cyan-950/40 text-cyan-400 border border-cyan-850/30">
                              Virtual Experience
                            </span>
                          )}

                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wide border ${
                            course.difficulty === 'Beginner' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/20' :
                            course.difficulty === 'Intermediate' ? 'bg-amber-950/20 text-amber-400 border-amber-900/20' :
                            'bg-rose-950/20 text-rose-450 border-rose-900/20'
                          }`}>
                            {course.difficulty}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-base text-slate-200 mt-2 line-clamp-2 leading-snug group-hover:text-violet-400 transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-400 font-semibold">
                          {course.companyName} • {course.category}
                        </p>

                        <p className="text-xs text-slate-350 leading-relaxed line-clamp-3">
                          {course.description}
                        </p>
                      </div>

                      {/* Skills Acquired */}
                      <div className="mt-4 space-y-1 text-left">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Skills You'll Learn:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {course.skills.map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-slate-950/40 border border-white/5 rounded text-[10px] text-slate-400 font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer controls */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex gap-3 items-center">
                      <span className="text-[10px] text-slate-500 font-bold text-left flex-1">
                        Est. Time: {course.duration || 'Self-paced'}
                      </span>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleComplete(course._id)}
                          className={`py-1.5 px-3.5 rounded-xl text-xs font-bold font-display border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isCompleted
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-450'
                              : 'bg-slate-900/20 border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          <CheckSquare className="w-4 h-4" />
                          <span>{isCompleted ? 'Completed ✓' : 'Mark Completed'}</span>
                        </button>
                        
                        <button 
                          onClick={() => handleTrackView(course._id, course.courseLink)}
                          className="py-1.5 px-4 rounded-xl bg-violet-650 hover:bg-violet-700 text-white text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <span>Start Course</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* AI RECOMMENDATION MODAL */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md border border-white/10 relative p-6 bg-slate-950/80 animate-in fade-in zoom-in-95 duration-250">
            <button 
              onClick={() => setShowAIModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Brain className="w-6 h-6 text-cyan-400" />
                <h3 className="font-display font-extrabold text-base text-slate-200">AI Course Recommendations</h3>
              </div>
              <p className="text-xs text-slate-450">Tell us what you want to achieve. Studora AI will scan the entire catalog and recommend the best 3 courses for you.</p>
              
              <form onSubmit={handleAIRecommendations} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-semibold">What skills do you want to learn?</label>
                  <input 
                    type="text"
                    placeholder="e.g. Python, cloud migration, data visualization..."
                    value={aiSkills}
                    onChange={e => setAiSkills(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500 w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-semibold">What is your dream job/career goal?</label>
                  <input 
                    type="text"
                    placeholder="e.g. Software Engineer at Google, Consultant at Deloitte..."
                    value={aiGoal}
                    onChange={e => setAiGoal(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500 w-full"
                    required
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full py-3" loading={aiLoading}>
                  <Sparkles className="w-4 h-4 inline mr-1" /> Find Best Courses
                </Button>
              </form>
            </div>
          </GlassCard>
        </div>
      )}

      {/* REQUEST COURSE / REPORT LINK MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <GlassCard className="w-full max-w-lg border border-white/10 relative p-6 bg-slate-950/80 animate-in fade-in zoom-in-95 duration-250">
            <button 
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <PlusCircle className="w-6 h-6 text-violet-400" />
                <h3 className="font-display font-extrabold text-base text-slate-200">
                  {requestType === 'request' ? 'Request New Course' : 'Report Broken Link'}
                </h3>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-slate-950/30 border border-white/10 p-1 rounded-xl w-fit">
                <button
                  onClick={() => { setRequestType('request'); setRequestMsg(''); }}
                  className={`px-3.5 py-1.5 rounded-lg text-2xs font-bold font-display transition-all cursor-pointer ${
                    requestType === 'request' ? 'bg-violet-650 text-white' : 'text-slate-400'
                  }`}
                >
                  Request Course
                </button>
                <button
                  onClick={() => { setRequestType('broken_link'); setRequestMsg(''); }}
                  className={`px-3.5 py-1.5 rounded-lg text-2xs font-bold font-display transition-all cursor-pointer ${
                    requestType === 'broken_link' ? 'bg-violet-650 text-white' : 'text-slate-400'
                  }`}
                >
                  Report Broken Link
                </button>
              </div>

              {requestMsg && (
                <p className="text-xs font-semibold py-2 px-4 bg-violet-950/20 border border-violet-900/40 rounded-xl text-violet-300 w-fit">{requestMsg}</p>
              )}

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Course Title</label>
                    <input 
                      type="text"
                      placeholder="e.g. AWS Cloud Practitioner"
                      value={reqTitle}
                      onChange={e => setReqTitle(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500 w-full"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Provider / Company</label>
                    <input 
                      type="text"
                      placeholder="e.g. AWS / Amazon"
                      value={reqProvider}
                      onChange={e => setReqProvider(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Course URL (optional)</label>
                  <input 
                    type="url"
                    placeholder="https://..."
                    value={reqLink}
                    onChange={e => setReqLink(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Comments / Details</label>
                  <textarea 
                    rows={3}
                    placeholder={requestType === 'request' ? "Why should we add this course? Mention if it offers a free certificate." : "Describe which link is broken or what issue you encountered..."}
                    value={reqDesc}
                    onChange={e => setReqDesc(e.target.value)}
                    className="p-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none resize-none font-sans"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full py-3" loading={requestLoading}>
                  Submit Details
                </Button>
              </form>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default FreeCertifications;
