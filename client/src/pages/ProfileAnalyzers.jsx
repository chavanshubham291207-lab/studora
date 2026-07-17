import React, { useState } from 'react';
import { Search, Github, Linkedin, Sparkles, RefreshCw, Star, GitFork, BookOpen, AlertCircle, Award } from 'lucide-react';
import { API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const ProfileAnalyzers = () => {
  // Tab control: 'github', 'linkedin'
  const [activeTab, setActiveTab] = useState('github');

  // GitHub states
  const [ghUser, setGhUser] = useState('');
  const [ghStats, setGhStats] = useState(null);
  const [ghAnalysis, setGhAnalysis] = useState('');
  const [ghLoading, setGhLoading] = useState(false);

  // LinkedIn states
  const [liText, setLiText] = useState('');
  const [liReview, setLiReview] = useState('');
  const [liLoading, setLiLoading] = useState(false);

  const handleGitHubSubmit = async (e) => {
    e.preventDefault();
    if (!ghUser.trim()) return;

    setGhLoading(true);
    setGhStats(null);
    setGhAnalysis('');

    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/ai/github-analyze/${ghUser.trim()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setGhStats(data.stats);
        setGhAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGhLoading(false);
    }
  };

  const handleLinkedInSubmit = async (e) => {
    e.preventDefault();
    if (!liText.trim()) return;

    setLiLoading(true);
    setLiReview('');

    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/ai/linkedin-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profileText: liText })
      });
      if (res.ok) {
        const data = await res.json();
        setLiReview(data.review);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLiLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <Search className="w-6 h-6 text-violet-400" /> Career Profile Reviews
          </h1>
          <p className="text-sm text-slate-400 font-display">Audit your developer GitHub profile statistics and paste your LinkedIn description for AI-driven improvement reviews.</p>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('github')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-2 border transition-all cursor-pointer ${
            activeTab === 'github' 
              ? 'bg-violet-650/20 text-violet-400 border-violet-800/40' 
              : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800/20'
          }`}
        >
          <Github className="w-4 h-4" /> GitHub Analyzer
        </button>
        <button
          onClick={() => setActiveTab('linkedin')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-2 border transition-all cursor-pointer ${
            activeTab === 'linkedin' 
              ? 'bg-violet-650/20 text-violet-400 border-violet-800/40' 
              : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800/20'
          }`}
        >
          <Linkedin className="w-4 h-4" /> LinkedIn Optimizer
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {/* GITHUB PANEL */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            <GlassCard className="border border-white/5 max-w-xl">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-3">Analyze GitHub Repositories</h3>
              <form onSubmit={handleGitHubSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Github className="w-4.5 h-4.5" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Enter GitHub Username (e.g. torvalds)"
                    value={ghUser}
                    onChange={e => setGhUser(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200"
                  />
                </div>
                <Button type="submit" variant="primary" size="sm" loading={ghLoading}>
                  Analyze Profile
                </Button>
              </form>
            </GlassCard>

            {ghStats && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Profile Card & Language usage */}
                <div className="space-y-6">
                  {/* Stats card */}
                  <GlassCard className="border border-white/5 flex flex-col items-center text-center gap-4">
                    <img 
                      src={ghStats.avatar} 
                      alt={ghStats.name} 
                      className="w-20 h-20 rounded-2xl border border-white/10"
                    />
                    <div>
                      <h4 className="font-display font-extrabold text-base text-slate-200">{ghStats.name}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">@{ghStats.username}</p>
                      <p className="text-xs text-slate-400 mt-2 font-sans italic leading-relaxed">"{ghStats.bio}"</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 w-full border-t border-white/5 pt-4 text-xs font-display">
                      <div>
                        <p className="font-extrabold text-slate-200">{ghStats.publicRepos}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-semibold">Repos</p>
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-200">{ghStats.starsCount}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-semibold">Stars</p>
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-200">{ghStats.followers}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-semibold">Followers</p>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Top languages card */}
                  <GlassCard className="border border-white/5 flex flex-col gap-4 text-left">
                    <h4 className="font-display font-bold text-xs text-slate-200 uppercase tracking-wider">Top Languages</h4>
                    <div className="flex flex-col gap-3">
                      {Object.entries(ghStats.languages || {}).map(([lang, count]) => (
                        <div key={lang} className="text-xs">
                          <div className="flex justify-between font-semibold text-slate-300 mb-1">
                            <span>{lang}</span>
                            <span>{count} Repos</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-650 rounded-full" style={{ width: `${Math.min(100, count * 15)}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* AI Review Markdown analysis details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Recent Repos */}
                  <GlassCard className="border border-white/5 flex flex-col gap-4">
                    <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-1.5">
                      <BookOpen className="w-4.5 h-4.5 text-violet-400" /> Recent Projects
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ghStats.recentProjects?.map((proj) => (
                        <div 
                          key={proj.name}
                          className="p-3.5 rounded-2xl glass-panel bg-slate-900/10 border border-white/5 flex flex-col justify-between"
                        >
                          <div className="text-left">
                            <h4 className="font-bold text-xs text-slate-200">{proj.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{proj.description}</p>
                          </div>
                          <div className="flex justify-between items-center mt-4 text-[10px] text-slate-500 font-semibold font-display">
                            <span className="text-violet-400">{proj.language}</span>
                            <div className="flex gap-2">
                              <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {proj.stars}</span>
                              <span className="flex items-center gap-0.5"><GitFork className="w-3 h-3 text-slate-400" /> {proj.forks}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* AI Analysis Markdown card */}
                  <GlassCard className="border border-white/5">
                    <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-2 mb-3">
                      <Sparkles className="w-4.5 h-4.5 text-violet-400" /> AI Portfolio Feedback
                    </h3>
                    <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                      {ghAnalysis}
                    </div>
                  </GlassCard>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LINKEDIN PANEL */}
        {activeTab === 'linkedin' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <GlassCard className="border border-white/5">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-3">Paste Profile Description</h3>
              <form onSubmit={handleLinkedInSubmit} className="space-y-4">
                <textarea 
                  rows={10}
                  placeholder="Paste your LinkedIn headline, 'About' summary, or work descriptions to review..."
                  value={liText}
                  onChange={e => setLiText(e.target.value)}
                  className="w-full p-3.5 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-all resize-none placeholder:text-slate-600 font-sans"
                ></textarea>
                <Button type="submit" variant="primary" className="w-full py-3" loading={liLoading}>
                  Optimize LinkedIn Profile
                </Button>
              </form>
            </GlassCard>

            <GlassCard className="border border-white/5 flex flex-col">
              <h3 className="font-display font-bold text-sm text-slate-200 border-b border-white/5 pb-2">AI Optimization Audit</h3>
              <div className="flex-1 py-4 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {liReview ? (
                  liReview
                ) : (
                  <p className="text-slate-500 italic py-12 text-center">LinkedIn review feedback will show here once submitted.</p>
                )}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAnalyzers;
