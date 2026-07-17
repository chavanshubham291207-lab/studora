import React, { useState } from 'react';
import { Terminal, Calendar, Clock, ExternalLink, RefreshCw, Trophy, Medal } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const CodingContests = () => {
  const [leetcodeUser, setLeetcodeUser] = useState('');
  const [cfUser, setCfUser] = useState('');
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const mockContests = [
    {
      id: 1,
      title: "Codeforces Round 995 (Div. 3)",
      platform: "Codeforces",
      startTime: "2026-07-22 17:35 IST",
      duration: "2 hrs",
      link: "https://codeforces.com/contests",
      color: "border-rose-500/20 text-rose-400 bg-rose-950/20"
    },
    {
      id: 2,
      title: "LeetCode Weekly Contest 462",
      platform: "LeetCode",
      startTime: "2026-07-26 08:00 IST",
      duration: "1.5 hrs",
      link: "https://leetcode.com/contest",
      color: "border-amber-500/20 text-amber-400 bg-amber-950/20"
    },
    {
      id: 3,
      title: "CodeChef Starters 166 (Div. 1 & 2)",
      platform: "CodeChef",
      startTime: "2026-07-29 20:00 IST",
      duration: "2.5 hrs",
      link: "https://www.codechef.com/contests",
      color: "border-emerald-500/20 text-emerald-400 bg-emerald-950/20"
    },
    {
      id: 4,
      title: "LeetCode Biweekly Contest 148",
      platform: "LeetCode",
      startTime: "2026-08-01 22:30 IST",
      duration: "1.5 hrs",
      link: "https://leetcode.com/contest",
      color: "border-amber-500/20 text-amber-400 bg-amber-950/20"
    },
    {
      id: 5,
      title: "Codeforces Round 996 (Div. 2)",
      platform: "Codeforces",
      startTime: "2026-08-04 19:35 IST",
      duration: "2 hrs",
      link: "https://codeforces.com/contests",
      color: "border-rose-500/20 text-rose-400 bg-rose-950/20"
    }
  ];

  const handleFetchStats = (e) => {
    e.preventDefault();
    if (!leetcodeUser && !cfUser) return;
    setLoadingStats(true);
    setTimeout(() => {
      setLoadingStats(false);
      setStatsLoaded(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="text-left">
          <h1 className="font-display font-extrabold text-2xl text-slate-100">Coding Contest Tracker</h1>
          <p className="text-sm text-slate-400">Track upcoming competitive programming contests and monitor your profile rankings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Contests List */}
        <div className="lg:col-span-2 space-y-4 text-left">
          <h3 className="font-display font-bold text-base text-slate-200 mb-2">Upcoming Contest Schedule</h3>
          
          <div className="flex flex-col gap-4">
            {mockContests.map(contest => (
              <GlassCard key={contest.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-950/40 border border-white/5 rounded-2xl shrink-0">
                    <Terminal className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${contest.color}`}>
                      {contest.platform}
                    </span>
                    <h4 className="font-display font-bold text-slate-200 mt-2 text-sm">{contest.title}</h4>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {contest.startTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Duration: {contest.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <a 
                  href={contest.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="secondary" size="sm" className="w-full justify-center">
                    Enter Contest <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Profiles Aggregator Panel */}
        <div className="space-y-6 text-left">
          <GlassCard className="border border-white/5">
            <h3 className="font-display font-bold text-base text-slate-200 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-violet-400" />
              Coding Profile Center
            </h3>

            <form onSubmit={handleFetchStats} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">LeetCode Username</label>
                <input 
                  type="text"
                  placeholder="e.g. leet_coder"
                  value={leetcodeUser}
                  onChange={(e) => setLeetcodeUser(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 transition-all text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Codeforces Username</label>
                <input 
                  type="text"
                  placeholder="e.g. tourist"
                  value={cfUser}
                  onChange={(e) => setCfUser(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 transition-all text-slate-200"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full py-2.5 text-xs" loading={loadingStats}>
                <RefreshCw className="w-4 h-4" /> Load Coding Profiles
              </Button>
            </form>

            {statsLoaded && (
              <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                <div className="p-3 bg-violet-950/20 border border-violet-800/20 rounded-2xl flex gap-3 items-center">
                  <Medal className="w-8 h-8 text-amber-400 shrink-0" />
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-200">LeetCode Rating: 1784</p>
                    <p className="text-[10px] text-slate-400">Rank: Knight • 243 problems solved</p>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/20 border border-cyan-800/20 rounded-2xl flex gap-3 items-center">
                  <Medal className="w-8 h-8 text-slate-400 shrink-0" />
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-200">Codeforces Rating: 1420</p>
                    <p className="text-[10px] text-slate-400">Rank: Specialist • Max: 1485</p>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CodingContests;
