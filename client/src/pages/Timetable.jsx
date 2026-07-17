import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Plus, Trash2, Save, Bell, BellOff, Volume2, VolumeX, 
  ChevronDown, ChevronUp, Settings, Monitor, MapPin, Building2, 
  User, BookOpen, FlaskConical, Presentation, CheckCircle2, 
  Timer, Calendar, ExternalLink, X, AlarmClock, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// ─── Default Timetable Schedule ────────────────────────────────────────
const DEFAULT_SCHEDULE = [
  // Lectures (editable)
  { id: 1, subject: 'Lecture 1', type: 'Lecture', day: 'Monday', startTime: '09:00', endTime: '10:00', room: 'Room 101', building: 'Block A', faculty: '', color: SUBJECT_COLORS[0], isOnline: false, onlineLink: '', locked: false },
  { id: 2, subject: 'Lecture 2', type: 'Lecture', day: 'Monday', startTime: '10:00', endTime: '11:00', room: 'Room 101', building: 'Block A', faculty: '', color: SUBJECT_COLORS[1], isOnline: false, onlineLink: '', locked: false },
  // Short Break (locked)
  { id: 3, subject: 'Short Break', type: 'Break', day: 'Monday', startTime: '11:00', endTime: '11:15', room: '', building: '', faculty: '', color: '#555555', isOnline: false, onlineLink: '', locked: true },
  // Lectures continued
  { id: 4, subject: 'Lecture 3', type: 'Lecture', day: 'Monday', startTime: '11:15', endTime: '12:15', room: 'Room 101', building: 'Block A', faculty: '', color: SUBJECT_COLORS[2], isOnline: false, onlineLink: '', locked: false },
  { id: 5, subject: 'Lecture 4', type: 'Lecture', day: 'Monday', startTime: '12:15', endTime: '13:15', room: 'Room 101', building: 'Block A', faculty: '', color: SUBJECT_COLORS[3], isOnline: false, onlineLink: '', locked: false },
  // Lunch Break (locked)
  { id: 6, subject: 'Lunch Break', type: 'Lunch', day: 'Monday', startTime: '13:15', endTime: '14:00', room: '', building: '', faculty: '', color: '#777777', isOnline: false, onlineLink: '', locked: true },
  // Lab / Practical (editable, 2h)
  { id: 7, subject: 'Lab / Practical', type: 'Lab', day: 'Monday', startTime: '14:00', endTime: '16:00', room: 'Lab A', building: 'Block B', faculty: '', color: SUBJECT_COLORS[4], isOnline: false, onlineLink: '', locked: false },
];
import { useReminder, SUBJECT_COLORS, formatTime12, migrateEntry, timeToMinutes, DAY_NAMES } from '../context/ReminderContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

// ─── Notification Popup Component ────────────────────────────────────────────
const ReminderPopup = () => {
  const { activeReminder, dismissReminder, snoozeReminder, settings } = useReminder();
  const [closing, setClosing] = useState(false);
  const [liveCountdown, setLiveCountdown] = useState(null);

  useEffect(() => {
    if (!activeReminder) { setClosing(false); return; }
    const startMins = timeToMinutes(activeReminder.startTime);
    
    const tick = () => {
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const diffSec = (startMins - nowMins) * 60 - now.getSeconds();
      setLiveCountdown(Math.max(0, diffSec));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeReminder]);

  if (!activeReminder) return null;

  const handleDismiss = () => {
    setClosing(true);
    setTimeout(() => { dismissReminder(); setClosing(false); }, 300);
  };

  const handleSnooze = () => {
    setClosing(true);
    setTimeout(() => { snoozeReminder(5); setClosing(false); }, 300);
  };

  const mins = liveCountdown !== null ? Math.floor(liveCountdown / 60) : activeReminder.minutesUntil;
  const secs = liveCountdown !== null ? liveCountdown % 60 : 0;

  const isCompact = settings.popupStyle === 'compact';
  const typeIcon = activeReminder.type === 'Practical' ? FlaskConical : activeReminder.type === 'Tutorial' ? Presentation : BookOpen;
  const TypeIcon = typeIcon;

  return (
    <div className={`fixed top-20 right-6 z-[9999] w-[380px] max-w-[calc(100vw-2rem)] ${closing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
      <div className="glass-panel rounded-2xl border border-violet-500/30 shadow-[0_8px_40px_rgba(139,92,246,0.25)] overflow-hidden">
        {/* Header gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-violet-500 via-cyan-500 to-pink-500" />
        
        <div className="p-5">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/30">
                <AlarmClock className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Upcoming Class Reminder</p>
                <h3 className="font-display font-extrabold text-lg text-white leading-tight mt-0.5">
                  {activeReminder.subject}
                </h3>
              </div>
            </div>
            <button onClick={handleDismiss} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Class details */}
          {!isCompact && (
            <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-white/5">
                <TypeIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-slate-300">{activeReminder.type || 'Lecture'}</span>
              </div>
              {activeReminder.faculty && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-white/5">
                  <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-slate-300 truncate">{activeReminder.faculty}</span>
                </div>
              )}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-white/5">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300">{formatTime12(activeReminder.startTime)} – {formatTime12(activeReminder.endTime)}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-white/5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="text-slate-300 truncate">{activeReminder.room || 'TBA'}</span>
              </div>
              {activeReminder.building && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-white/5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-slate-300 truncate">{activeReminder.building}</span>
                </div>
              )}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-white/5">
                <Calendar className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span className="text-slate-300">{activeReminder.day}</span>
              </div>
            </div>
          )}

          {/* Countdown badge */}
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-500/20 mb-4 animate-countdown-shimmer">
            <Timer className="w-5 h-5 text-violet-400" />
            <span className="font-display font-extrabold text-base text-white">
              Starts in {mins > 0 ? `${mins}m ` : ''}{String(secs).padStart(2, '0')}s
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {activeReminder.isOnline && activeReminder.onlineLink && (
              <a
                href={activeReminder.onlineLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Join Class
              </a>
            )}
            <button
              onClick={handleSnooze}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <AlarmClock className="w-3.5 h-3.5" /> Snooze 5m
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Timetable Page ─────────────────────────────────────────────────────
const Timetable = () => {
  const { user, updateTimetable } = useAuth();
  const { currentClass, nextClass, todayClasses, countdownSeconds, settings, updateSettings, requestNotificationPermission } = useReminder();

  // ── Migrate + load classes ────────────────────────────────────────────────
  const [classes, setClasses] = useState(() => {
    // If user has a saved timetable, migrate it; otherwise initialise with default schedule
    if (user?.timetable && user.timetable.length > 0) {
      return user.timetable.map((e, i) => migrateEntry(e, i));
    }
    // Clone DEFAULT_SCHEDULE to avoid mutating the constant
    return DEFAULT_SCHEDULE.map(entry => ({ ...entry }));
  });

  // ── Form states ───────────────────────────────────────────────────────────
  const [subName, setSubName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');
  const [building, setBuilding] = useState('');
  const [classType, setClassType] = useState('Lecture');
  const [selectedColor, setSelectedColor] = useState(SUBJECT_COLORS[0]);
  const [isOnline, setIsOnline] = useState(false);
  const [onlineLink, setOnlineLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const classTypes = ['Lecture', 'Practical', 'Tutorial'];

  // ── Unique time slots from classes for the grid ───────────────────────────
  const timeSlots = useMemo(() => {
    const slots = new Set();
    classes.forEach(c => {
      slots.add(`${c.startTime}-${c.endTime}`);
    });
    // Add default slots if empty
    if (slots.size === 0) {
      ['09:00-10:30', '11:00-12:30', '14:00-15:30', '16:00-17:30'].forEach(s => slots.add(s));
    }
    return Array.from(slots).sort((a, b) => {
      const aStart = timeToMinutes(a.split('-')[0]);
      const bStart = timeToMinutes(b.split('-')[0]);
      return aStart - bStart;
    });
  }, [classes]);

  // ── Status helpers ────────────────────────────────────────────────────────
  const now = new Date();
  const todayName = DAY_NAMES[now.getDay()];
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const getClassStatus = (cls) => {
    if (cls.day !== todayName) return 'inactive';
    const start = timeToMinutes(cls.startTime);
    const end = timeToMinutes(cls.endTime);
    if (nowMins >= start && nowMins < end) return 'current';
    if (nowMins < start) {
      // Check if this is the next upcoming class
      if (nextClass && cls.subject === nextClass.subject && cls.startTime === nextClass.startTime) return 'next';
      return 'upcoming';
    }
    return 'completed';
  };

  // ── Countdown format ──────────────────────────────────────────────────────
  const formatCountdown = (totalSec) => {
    if (totalSec === null || totalSec === undefined) return null;
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`;
    return `${s}s`;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddClass = (e) => {
    e.preventDefault();
    if (!subName.trim()) return;

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);
    if (newEnd <= newStart) {
      alert('End time must be after start time!');
      return;
    }

    // Check overlap
    const conflict = classes.some(c => {
      if (c.day !== day) return false;
      const cStart = timeToMinutes(c.startTime);
      const cEnd = timeToMinutes(c.endTime);
      return newStart < cEnd && newEnd > cStart;
    });

    if (conflict) {
      alert('This time slot overlaps with an existing class!');
      return;
    }

    setClasses([
      ...classes,
      {
        subject: subName.trim(),
        faculty: faculty.trim(),
        day,
        startTime,
        endTime,
        room: room.trim() || 'TBA',
        building: building.trim(),
        type: classType,
        color: selectedColor,
        isOnline,
        onlineLink: onlineLink.trim(),
      }
    ]);

    // Reset form
    setSubName('');
    setFaculty('');
    setRoom('');
    setBuilding('');
    setOnlineLink('');
    setIsOnline(false);
  };

  const handleRemoveClass = (index) => {
    setClasses(classes.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateTimetable(classes);
    setSaving(false);
  };

  const getClassAt = (targetDay, slotKey) => {
    const [slotStart, slotEnd] = slotKey.split('-');
    return classes.find(c => c.day === targetDay && c.startTime === slotStart && c.endTime === slotEnd);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'current':
        return 'border-emerald-500/60 bg-emerald-950/30 animate-pulse-ring';
      case 'next':
        return 'border-amber-500/50 bg-amber-950/20 animate-pulse-amber';
      case 'completed':
        return 'opacity-50 border-white/5 bg-slate-950/30';
      default:
        return 'border-white/5';
    }
  };

  // Type icon helper
  const TypeIcon = ({ type, className }) => {
    if (type === 'Practical') return <FlaskConical className={className} />;
    if (type === 'Tutorial') return <Presentation className={className} />;
    return <BookOpen className={className} />;
  };

  // ── Input style constant ──────────────────────────────────────────────────
  const inputClass = "px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500 w-full";
  const selectClass = "px-3 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500 w-full";
  const labelClass = "text-slate-450 font-semibold uppercase text-[10px]";

  return (
    <div className="space-y-6 text-left">
      {/* Notification Popup (rendered globally at top-right) */}
      <ReminderPopup />

      {/* ═══ Page Header ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-violet-400" /> Timetable Planner
          </h1>
          <p className="text-sm text-slate-400">Map out your lecture schedule with smart reminders and live class tracking.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4" /> {showSettings ? 'Hide' : 'Reminder'} Settings
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" /> Save Timetable
          </Button>
        </div>
      </div>

      {/* ═══ Today's Schedule Strip + Countdown ═══ */}
      {todayClasses.length > 0 && (
        <div className="animate-fade-in">
          <GlassCard className="border border-white/5 !p-4" hover={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                <h3 className="font-display font-bold text-sm text-slate-200">Today's Schedule — {todayName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-violet-950/40 text-violet-400 text-[10px] font-bold border border-violet-800/30">
                  {todayClasses.length} {todayClasses.length === 1 ? 'class' : 'classes'}
                </span>
              </div>
              {nextClass && countdownSeconds !== null && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-500/20 animate-countdown-shimmer">
                  <Timer className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-bold text-white">
                    Next: <span className="text-violet-300">{nextClass.subject}</span> in {formatCountdown(countdownSeconds)}
                  </span>
                </div>
              )}
            </div>

            {/* Horizontal scrollable class cards */}
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
              {todayClasses.map((cls, i) => {
                const status = getClassStatus(cls);
                return (
                  <div
                    key={i}
                    className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all min-w-[240px] ${
                      status === 'current'
                        ? 'bg-emerald-950/30 border-emerald-500/40 animate-pulse-ring'
                        : status === 'next'
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : status === 'completed'
                        ? 'bg-slate-950/30 border-white/5 opacity-50'
                        : 'bg-slate-900/30 border-white/5'
                    }`}
                  >
                    <div className="w-1.5 h-10 rounded-full shrink-0" style={{ backgroundColor: cls.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xs text-slate-200 truncate">{cls.subject}</p>
                        {status === 'current' && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] uppercase font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">Live</span>
                        )}
                        {status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatTime12(cls.startTime)} – {formatTime12(cls.endTime)} • {cls.room}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ═══ Reminder Settings Panel (collapsible) ═══ */}
      {showSettings && (
        <div className="animate-fade-in">
          <GlassCard className="border border-violet-500/20 !p-5" hover={false}>
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <Bell className="w-4 h-4 text-violet-400" />
              <h3 className="font-display font-bold text-sm text-slate-200">Smart Reminder Settings</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5">
                <div className="flex items-center gap-2">
                  {settings.enabled ? <Bell className="w-4 h-4 text-emerald-400" /> : <BellOff className="w-4 h-4 text-slate-500" />}
                  <span className="text-slate-300 font-semibold">Notifications</span>
                </div>
                <button
                  onClick={() => updateSettings({ enabled: !settings.enabled })}
                  className={`w-10 h-5 rounded-full transition-all cursor-pointer relative ${settings.enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${settings.enabled ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Reminder Timing */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5">
                <div className="flex items-center gap-2">
                  <AlarmClock className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300 font-semibold">Remind Before</span>
                </div>
                <select
                  value={settings.reminderMinutes}
                  onChange={(e) => updateSettings({ reminderMinutes: Number(e.target.value) })}
                  className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  {[5, 10, 15, 30, 60].map(m => (
                    <option key={m} value={m}>{m} min</option>
                  ))}
                </select>
              </div>

              {/* Sound */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  <span className="text-slate-300 font-semibold">Sound</span>
                </div>
                <button
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-10 h-5 rounded-full transition-all cursor-pointer relative ${settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${settings.soundEnabled ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Browser Notifications */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-300 font-semibold">Browser Push</span>
                </div>
                <button
                  onClick={async () => {
                    if (!settings.browserNotifications) {
                      const granted = await requestNotificationPermission();
                      if (granted) updateSettings({ browserNotifications: true });
                    } else {
                      updateSettings({ browserNotifications: false });
                    }
                  }}
                  className={`w-10 h-5 rounded-full transition-all cursor-pointer relative ${settings.browserNotifications ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${settings.browserNotifications ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Popup Style */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5">
                <div className="flex items-center gap-2">
                  {settings.popupStyle === 'detailed' ? <Eye className="w-4 h-4 text-pink-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                  <span className="text-slate-300 font-semibold">Popup Style</span>
                </div>
                <select
                  value={settings.popupStyle}
                  onChange={(e) => updateSettings({ popupStyle: e.target.value })}
                  className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="detailed">Detailed</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ═══ Main Layout: Form + Grid ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

        {/* ── Left: Add Class Form ─────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-1">
          <GlassCard className="border border-white/5 flex flex-col gap-4" hover={false}>
            <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-2">
              <Plus className="w-4 h-4 text-violet-400" /> Schedule New Class
            </h3>

            <form onSubmit={handleAddClass} className="space-y-3 text-xs">
              {/* Subject */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Subject Name *</label>
                <input type="text" placeholder="e.g. Data Structures" value={subName}
                  onChange={e => setSubName(e.target.value)} className={inputClass} required />
              </div>

              {/* Faculty */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Faculty Name</label>
                <input type="text" placeholder="e.g. Prof. Sharma" value={faculty}
                  onChange={e => setFaculty(e.target.value)} className={inputClass} />
              </div>

              {/* Day */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Day of the Week</label>
                <select value={day} onChange={e => setDay(e.target.value)} className={selectClass}>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Start / End Time */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Start Time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>End Time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Room + Building */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Room / Lab</label>
                  <input type="text" placeholder="C-302" value={room}
                    onChange={e => setRoom(e.target.value)} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Building</label>
                  <input type="text" placeholder="Block C" value={building}
                    onChange={e => setBuilding(e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Type */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Class Type</label>
                <select value={classType} onChange={e => setClassType(e.target.value)} className={selectClass}>
                  {classTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Color picker swatches */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Subject Color</label>
                <div className="flex gap-2 flex-wrap">
                  {SUBJECT_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedColor === color
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Online toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/30 border border-white/5">
                <span className="text-slate-300 font-semibold text-[10px] uppercase">Online Class?</span>
                <button
                  type="button"
                  onClick={() => setIsOnline(!isOnline)}
                  className={`w-9 h-4.5 rounded-full transition-all cursor-pointer relative ${isOnline ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${isOnline ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>

              {isOnline && (
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Meeting Link</label>
                  <input type="url" placeholder="https://meet.google.com/..." value={onlineLink}
                    onChange={e => setOnlineLink(e.target.value)} className={inputClass} />
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full py-2.5">
                <Plus className="w-4 h-4" /> Schedule Class
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* ── Right: Timetable Grid ────────────────────────────────────────── */}
        <div className="lg:col-span-3 overflow-x-auto">
          <div className="min-w-[800px] border border-white/10 rounded-2xl overflow-hidden glass-panel">
            {/* Header: Days */}
            <div className="grid border-b border-white/10 bg-slate-950/40 py-3.5 text-center font-display font-bold text-xs text-slate-350"
              style={{ gridTemplateColumns: `100px repeat(${days.length}, 1fr)` }}>
              <div>Time Slot</div>
              {days.map(d => (
                <div key={d} className={`${d === todayName ? 'text-violet-400' : ''}`}>
                  {d.slice(0, 3)}
                  {d === todayName && (
                    <span className="ml-1 px-1 py-0.5 rounded text-[8px] bg-violet-500/20 text-violet-400 border border-violet-500/30">Today</span>
                  )}
                </div>
              ))}
            </div>

            {/* Timetable Rows */}
            {timeSlots.map((slotKey, rowIdx) => {
              const [slotStart, slotEnd] = slotKey.split('-');
              return (
                <div key={rowIdx} className="grid border-b border-white/5 items-stretch min-h-24"
                  style={{ gridTemplateColumns: `100px repeat(${days.length}, 1fr)` }}>
                  {/* Time Indicator */}
                  <div className="flex flex-col items-center justify-center border-r border-white/5 text-[10px] text-slate-450 font-bold bg-slate-950/20 font-display px-2 gap-0.5">
                    <span>{formatTime12(slotStart)}</span>
                    <span className="text-slate-600">to</span>
                    <span>{formatTime12(slotEnd)}</span>
                  </div>

                  {/* Daily slots */}
                  {days.map((targetDay, colIdx) => {
                    const classItem = getClassAt(targetDay, slotKey);
                    const flatIndex = classes.findIndex(c => c.day === targetDay && c.startTime === slotStart && c.endTime === slotEnd);
                    const status = classItem ? getClassStatus(classItem) : 'inactive';

                    return (
                      <div
                        key={colIdx}
                        className={`border-r border-white/5 p-1.5 flex flex-col justify-center items-center group relative text-center min-h-24 transition-all ${
                          targetDay === todayName ? 'bg-violet-950/5' : 'bg-slate-900/10'
                        } hover:bg-slate-800/20`}
                      >
                        {classItem ? (
                          <div
                            className={`p-2 w-full h-full rounded-xl border flex flex-col justify-center text-xs relative overflow-hidden ${getStatusStyles(status)}`}
                            style={{
                              backgroundColor: `${classItem.color}10`,
                              borderColor: status === 'current' || status === 'next' ? undefined : `${classItem.color}30`,
                              opacity: classItem.locked ? 0.6 : 1,
                            }}
                          >
                            {/* Color accent bar */}
                            {classItem.locked && (
                              <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl" style={{ backgroundColor: '#888888' }} />
                            )}

                            <p className="font-bold leading-snug line-clamp-2 mt-1" style={{ color: classItem.color }}>
                              {classItem.subject}
                            </p>
                            {classItem.faculty && (
                              <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{classItem.faculty}</p>
                            )}
                            <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1 flex items-center justify-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" /> {classItem.room}
                            </p>

                            {/* Status badges */}
                            {status === 'current' && (
                              <span className="mt-1 self-center px-1.5 py-0.5 rounded text-[8px] uppercase font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                🔴 Live Now
                              </span>
                            )}
                            {status === 'next' && (
                              <span className="mt-1 self-center px-1.5 py-0.5 rounded text-[8px] uppercase font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                ⏳ Up Next
                              </span>
                            )}
                            {status === 'completed' && (
                              <span className="mt-1 self-center flex items-center gap-0.5 text-[8px] text-slate-500">
                                <CheckCircle2 className="w-3 h-3" /> Done
                              </span>
                            )}

                            {/* Delete button */}
                            {classItem.locked ? null : (
                              <button
                                onClick={() => handleRemoveClass(flatIndex)}
                                className="absolute top-1.5 right-1.5 p-1 bg-rose-950 border border-rose-800/40 text-rose-450 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Delete Slot"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">—</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
