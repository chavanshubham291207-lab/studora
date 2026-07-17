import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Award, Code, GraduationCap, Briefcase, 
  ArrowRight, Plus, PlusCircle, CheckSquare, Target, BookOpen, Timer, Calendar, Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, 
  AreaChart, Area, BarChart, Bar, CartesianGrid 
} from 'recharts';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useReminder, formatTime12, timeToMinutes } from '../context/ReminderContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentClass, nextClass, todayClasses, countdownSeconds } = useReminder();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scholStats, setScholStats] = useState({ active: 0, closing: 0, bookmarked: 0, recommended: 0 });

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem('studora_token');
        const res = await fetch(`${API_BASE}/opportunities?sort=latest`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Filter out top 4 opportunities to display as daily feed
          setOpportunities(data.slice(0, 4));

          const schols = data.filter(opp => opp.type === 'scholarship');
          setScholStats({
            active: schols.length,
            closing: schols.filter(s => {
              const diff = new Date(s.deadline).getTime() - Date.now();
              return diff > 0 && diff <= 7 * 86400000;
            }).length,
            bookmarked: schols.filter(s => user?.bookmarks?.includes(s._id)).length,
            recommended: schols.filter(s => {
              const isMeritEligible = (user?.cgpa?.cgpa || 8.0) >= 8.0;
              if (isMeritEligible) return s.isFeatured || (s.scholarshipType && s.scholarshipType.toLowerCase().includes('merit'));
              return s.isFeatured;
            }).length
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, [user]);

  // 1. Prepare CGPA chart data
  const cgpaData = (user?.cgpa?.semesters && user.cgpa.semesters.length > 0) 
    ? user.cgpa.semesters.map(sem => ({ name: `Sem ${sem.semester}`, GPA: sem.sgpa }))
    : [
        { name: 'Sem 1', GPA: 8.2 },
        { name: 'Sem 2', GPA: 8.4 },
        { name: 'Sem 3', GPA: 8.1 },
        { name: 'Sem 4', GPA: 8.7 }
      ];

  // 2. Prepare Attendance chart data
  const attendanceData = (user?.attendance && user.attendance.length > 0)
    ? user.attendance.map(sub => ({ 
        subject: sub.name, 
        Percentage: Math.round((sub.attended / sub.total) * 100) || 0 
      }))
    : [
        { subject: 'Math', Percentage: 85 },
        { subject: 'OS', Percentage: 72 },
        { subject: 'DBMS', Percentage: 90 },
        { subject: 'Networks', Percentage: 68 }
      ];

  // Calculate overall attendance
  const totalAttended = user?.attendance?.reduce((acc, curr) => acc + curr.attended, 0) || 315;
  const totalClasses = user?.attendance?.reduce((acc, curr) => acc + curr.total, 0) || 400;
  const overallAttendancePercent = Math.round((totalAttended / totalClasses) * 100) || 78;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4"
      >
        <div className="text-left">
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-slate-100 flex items-center gap-2">
            Hey, {user?.name || 'Student'} 👋
          </h1>
          <p className="text-sm text-slate-400">Welcome to your dashboard. Here's your status overview for today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/ai-assistant')}>
            <Sparkles className="w-4 h-4" /> Ask Studora AI
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/timetable')}>
            <Plus className="w-4 h-4" /> Plan Timetable
          </Button>
        </div>
      </motion.div>

      {/* Main KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex items-center gap-4 bg-gradient-to-br from-[#111c3a]/50 to-[#0e162f]/50">
          <div className="p-3 bg-violet-650/20 text-violet-400 rounded-2xl border border-violet-800/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Overall CGPA</p>
            <h3 className="text-2xl font-display font-extrabold text-slate-100">{user?.cgpa?.cgpa || '8.35'}</h3>
            <span className="text-[10px] text-emerald-400 font-medium">Target: 9.0 GPA</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 bg-gradient-to-br from-[#12283a]/30 to-[#0c1e2e]/30">
          <div className="p-3 bg-cyan-650/20 text-cyan-400 rounded-2xl border border-cyan-800/20">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Attendance</p>
            <h3 className="text-2xl font-display font-extrabold text-slate-100">{overallAttendancePercent}%</h3>
            <span className={`text-[10px] font-medium ${overallAttendancePercent >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {overallAttendancePercent >= 75 ? 'Safe (Above 75%)' : 'Warning: Below 75%'}
            </span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="p-3 bg-pink-650/20 text-pink-400 rounded-2xl border border-pink-800/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Bookmarks</p>
            <h3 className="text-2xl font-display font-extrabold text-slate-100">{user?.bookmarks?.length || 0}</h3>
            <span className="text-[10px] text-slate-400">Opportunities saved</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="p-3 bg-amber-650/20 text-amber-400 rounded-2xl border border-amber-800/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tasks Complete</p>
            <h3 className="text-2xl font-display font-extrabold text-slate-100">{user?.progress?.profileComplete || '35'}%</h3>
            <span className="text-[10px] text-slate-400">Profile completion</span>
          </div>
        </GlassCard>
      </div>

      {/* Grid of Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <GlassCard className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="font-display font-bold text-base text-slate-200">CGPA Tracker Timeline</h3>
            <Link to="/cgpa-calculator" className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1">
              Calculator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cgpaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="GPA" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  activeDot={{ r: 6 }} 
                  dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#0b0f19' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Subject Attendance Bar Chart */}
        <GlassCard className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="font-display font-bold text-base text-slate-200">Attendance by Course</h3>
            <Link to="/attendance" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="Percentage" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Today's Timetable Widget */}
      {todayClasses && todayClasses.length > 0 && (
        <GlassCard className="flex flex-col gap-4 bg-gradient-to-r from-[#111c3a]/50 to-[#0e162f]/50 border-violet-500/20">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              <h3 className="font-display font-bold text-lg text-slate-200">Today's Timetable</h3>
            </div>
            <Link to="/timetable" className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1">
              View Full <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Class */}
            <div className={`p-4 rounded-xl border ${currentClass ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-900/30 border-white/5'}`}>
              <p className="text-xs font-semibold text-slate-400 mb-1">Right Now</p>
              {currentClass ? (
                <>
                  <h4 className="font-bold text-emerald-400 text-lg mb-0.5">{currentClass.subject}</h4>
                  <p className="text-[10px] text-slate-300">{formatTime12(currentClass.startTime)} - {formatTime12(currentClass.endTime)} • {currentClass.room}</p>
                </>
              ) : (
                <p className="text-sm font-semibold text-slate-500 mt-2">No ongoing class</p>
              )}
            </div>

            {/* Next Class */}
            <div className={`p-4 rounded-xl border ${nextClass ? 'bg-amber-950/20 border-amber-500/30' : 'bg-slate-900/30 border-white/5'}`}>
              <p className="text-xs font-semibold text-slate-400 mb-1">Up Next</p>
              {nextClass ? (
                <>
                  <h4 className="font-bold text-amber-400 text-lg mb-0.5">{nextClass.subject}</h4>
                  <p className="text-[10px] text-slate-300">{formatTime12(nextClass.startTime)} - {formatTime12(nextClass.endTime)} • {nextClass.room}</p>
                </>
              ) : (
                <p className="text-sm font-semibold text-slate-500 mt-2">No upcoming classes today</p>
              )}
            </div>

            {/* Countdown / Stats */}
            <div className="p-4 rounded-xl border bg-slate-900/30 border-white/5 flex flex-col justify-center">
               {countdownSeconds !== null && countdownSeconds > 0 ? (
                 <>
                   <p className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1"><Timer className="w-3.5 h-3.5 text-violet-400"/> Starts In</p>
                   <h4 className="font-display font-extrabold text-2xl text-white">
                     {Math.floor(countdownSeconds / 60)}m {countdownSeconds % 60}s
                   </h4>
                 </>
               ) : (
                 <>
                   <p className="text-xs font-semibold text-slate-400 mb-1">Remaining Today</p>
                   <h4 className="font-display font-extrabold text-2xl text-white">
                     {(() => {
                        const now = new Date();
                        const nowMins = now.getHours() * 60 + now.getMinutes();
                        return todayClasses.filter(c => timeToMinutes(c.endTime) > nowMins).length;
                     })()} Classes
                   </h4>
                 </>
               )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Opportunities & Profile Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily opportunities feed (hackathons/scholarships/internships) */}
        <GlassCard className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div>
              <h3 className="font-display font-bold text-base text-slate-200">Daily Opportunity Feed</h3>
              <p className="text-xs text-slate-400">Curated opportunities updating in real-time</p>
            </div>
            <Link to="/hackathons" className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1">
              Explore All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {opportunities.map(opp => (
                <div 
                  key={opp._id}
                  className="p-4 rounded-2xl glass-panel bg-slate-900/20 border border-white/5 flex gap-3 items-start"
                >
                  <img 
                    src={opp.logo} 
                    alt={opp.company}
                    className="w-10 h-10 rounded-xl bg-slate-950 shrink-0 border border-white/10"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wide ${
                      opp.type === 'hackathon' ? 'bg-violet-950/40 text-violet-400 border border-violet-800/30' :
                      opp.type === 'scholarship' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/30' :
                      'bg-pink-950/40 text-pink-400 border border-pink-800/30'
                    }`}>
                      {opp.type}
                    </span>
                    <h4 className="font-bold text-xs text-slate-200 mt-2 line-clamp-1">{opp.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{opp.company}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[10px] text-slate-500 font-semibold">Till: {opp.deadline}</span>
                      <a 
                        href={opp.applyLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-violet-400 hover:text-violet-300 font-bold flex items-center gap-0.5"
                      >
                        Apply <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <div className="flex flex-col gap-6">
          {/* Scholarship Tracker Widget */}
          <GlassCard className="flex flex-col gap-4 bg-gradient-to-br from-[#0c182c]/40 to-[#0e162f]/40 border-cyan-500/15">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-sm text-slate-200">Scholarship Tracker</h3>
              </div>
              <Link to="/scholarships" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5">
                Go to Portal <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Total Active</p>
                <h4 className="text-base font-display font-extrabold text-cyan-400 mt-0.5">{scholStats.active}</h4>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Closing Soon</p>
                <h4 className="text-base font-display font-extrabold text-rose-400 mt-0.5">{scholStats.closing}</h4>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Bookmarked</p>
                <h4 className="text-base font-display font-extrabold text-amber-400 mt-0.5">{scholStats.bookmarked}</h4>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Recommended</p>
                <h4 className="text-base font-display font-extrabold text-emerald-400 mt-0.5">{scholStats.recommended}</h4>
              </div>
            </div>
          </GlassCard>

          {/* Profile completion check lists */}
          <GlassCard className="flex flex-col gap-4">
            <div className="border-b border-white/5 pb-2">
              <h3 className="font-display font-bold text-base text-slate-200 font-display">Academic Checklist</h3>
              <p className="text-xs text-slate-400">Complete items to optimize your profile score</p>
            </div>
            
            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/30 border border-white/5">
                <input 
                  type="checkbox" 
                  checked={user?.cgpa?.semesters && user.cgpa.semesters.length > 0} 
                  readOnly
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500" 
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">Fill CGPA Details</p>
                  <p className="text-[10px] text-slate-400">Add semesters in CGPA page</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/30 border border-white/5">
                <input 
                  type="checkbox" 
                  checked={user?.attendance && user.attendance.length > 0} 
                  readOnly
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500" 
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">Log Subject Attendance</p>
                  <p className="text-[10px] text-slate-400">Keep subjects above 75% target</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/30 border border-white/5">
                <input 
                  type="checkbox" 
                  checked={user?.timetable && user.timetable.length > 0} 
                  readOnly
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500" 
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">Map Class Timetable</p>
                  <p className="text-[10px] text-slate-400">Define timetable slots</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/30 border border-white/5">
                <input 
                  type="checkbox" 
                  checked={user?.achievements && user.achievements.length > 0} 
                  readOnly
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500" 
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">Add Achievements & Skills</p>
                  <p className="text-[10px] text-slate-400">Populate profile achievements list</p>
                </div>
              </div>
            </div>
            
            <Button variant="secondary" size="md" onClick={() => navigate('/profile')} className="w-full mt-2">
              View Student Profile
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
