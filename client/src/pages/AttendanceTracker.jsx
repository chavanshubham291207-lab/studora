import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Save, Check, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const AttendanceTracker = () => {
  const { user, updateAttendance } = useAuth();
  
  // Subjects list: [{ name: 'Discrete Math', attended: 24, total: 30 }]
  const [subjects, setSubjects] = useState(() => {
    if (user?.attendance && user.attendance.length > 0) {
      return user.attendance;
    }
    return [
      { name: 'Computer Networks', attended: 26, total: 32 },
      { name: 'Database Management Systems', attended: 28, total: 30 },
      { name: 'Operating Systems', attended: 18, total: 25 }
    ];
  });

  const [newSubName, setNewSubName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    setSubjects([
      ...subjects,
      { name: newSubName.trim(), attended: 0, total: 0 }
    ]);
    setNewSubName('');
  };

  const handleRemoveSubject = (index) => {
    setSubjects(subjects.filter((_, idx) => idx !== index));
  };

  const handleUpdateCount = (index, type) => {
    const updated = [...subjects];
    if (type === 'attend') {
      updated[index].attended += 1;
      updated[index].total += 1;
    } else if (type === 'miss') {
      updated[index].total += 1;
    } else if (type === 'undo') {
      if (updated[index].total > 0) {
        if (updated[index].attended === updated[index].total) {
          updated[index].attended = Math.max(0, updated[index].attended - 1);
        }
        updated[index].total = Math.max(0, updated[index].total - 1);
      }
    }
    setSubjects(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateAttendance(subjects);
    setSaving(false);
    alert('Attendance metrics synced successfully!');
  };

  // Calculate target class stats
  const getSubjectStatus = (attended, total) => {
    if (total === 0) return { percent: 0, status: 'No classes yet', color: 'text-slate-400', urgent: false };
    const percent = Math.round((attended / total) * 100);
    
    if (percent < 75) {
      // Calculate how many consecutive classes are needed to reach 75%
      // Equation: (attended + X) / (total + X) >= 0.75 => X >= 3 * total - 4 * attended
      const classesNeeded = Math.max(0, (3 * total) - (4 * attended));
      return {
        percent,
        status: `Below 75%! Need to attend next ${classesNeeded} classes consecutively.`,
        color: 'text-rose-450',
        urgent: true
      };
    } else {
      // Calculate how many classes can be missed without falling below 75%
      // Equation: attended / (total + Y) >= 0.75 => Y <= (attended / 0.75) - total
      const classesCanMiss = Math.floor((attended / 0.75) - total);
      return {
        percent,
        status: `Safe! You can miss next ${classesCanMiss >= 0 ? classesCanMiss : 0} classes.`,
        color: 'text-emerald-450',
        urgent: false
      };
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-violet-400" /> Attendance Tracker
          </h1>
          <p className="text-sm text-slate-400">Log class attendance. Track safety metrics to ensure you remain above the 75% requirement.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
          Save Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form: Add subject */}
        <div className="space-y-6">
          <GlassCard className="border border-white/5">
            <h3 className="font-display font-bold text-sm text-slate-200 mb-3">Add Subject</h3>
            <form onSubmit={handleAddSubject} className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Design & Analysis of Algorithms" 
                value={newSubName}
                onChange={e => setNewSubName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200"
              />
              <Button type="submit" variant="primary" size="sm">
                Add
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Right List: Subjects trackers */}
        <div className="lg:col-span-2 space-y-4">
          {subjects.length === 0 ? (
            <p className="text-slate-500 italic py-8 text-center">No subjects tracked yet. Add subjects to start logging attendance!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {subjects.map((sub, idx) => {
                const info = getSubjectStatus(sub.attended, sub.total);
                return (
                  <GlassCard key={idx} className="border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left flex-1">
                      <h4 className="font-display font-bold text-sm text-slate-200">{sub.name}</h4>
                      
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400 font-semibold font-display">
                        <span>Attended: <span className="text-slate-200 font-bold">{sub.attended}</span></span>
                        <span>Total: <span className="text-slate-200 font-bold">{sub.total}</span></span>
                        <span className={`font-bold ${info.color}`}>Percentage: {info.percent}%</span>
                      </div>
                      
                      {/* Safety advice */}
                      <p className={`text-[10px] mt-2 flex items-center gap-1 font-semibold ${info.urgent ? 'text-rose-450' : 'text-slate-400'}`}>
                        {info.urgent ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-450" />}
                        {info.status}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleUpdateCount(idx, 'attend')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950/20 hover:bg-emerald-900/40 border border-emerald-800/30 text-emerald-400 text-xs font-bold font-display flex items-center gap-1 cursor-pointer"
                        title="Mark Attended"
                      >
                        <Check className="w-4 h-4" /> Attended
                      </button>
                      <button
                        onClick={() => handleUpdateCount(idx, 'miss')}
                        className="px-3 py-1.5 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 border border-rose-800/30 text-rose-400 text-xs font-bold font-display flex items-center gap-1 cursor-pointer"
                        title="Mark Missed"
                      >
                        <X className="w-4 h-4" /> Missed
                      </button>
                      <button
                        onClick={() => handleUpdateCount(idx, 'undo')}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                        title="Undo"
                      >
                        Undo
                      </button>
                      <button
                        onClick={() => handleRemoveSubject(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
