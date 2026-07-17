import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const ReminderContext = createContext();

// ─── Constants ───────────────────────────────────────────────────────────────
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const SUBJECT_COLORS = [
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#f43f5e', // rose
  '#6366f1', // indigo
  '#14b8a6', // teal
];

const DEFAULT_SETTINGS = {
  enabled: true,
  reminderMinutes: 15,
  soundEnabled: true,
  browserNotifications: false,
  popupStyle: 'detailed', // 'compact' | 'detailed'
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert "HH:MM" to minutes since midnight */
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
};

/** Format minutes since midnight back to "HH:MM" */
const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/** Format time to 12h display */
const formatTime12 = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
};

/** Migrate old format { time: "09:00 - 10:30" } → { startTime, endTime } */
const migrateEntry = (entry, index) => {
  if (entry.startTime && entry.endTime) return entry; // already new format

  let startTime = '09:00';
  let endTime = '10:00';

  if (entry.time) {
    const parts = entry.time.split('-').map(s => s.trim());
    if (parts.length === 2) {
      startTime = parts[0];
      endTime = parts[1];
    }
  }

  return {
    subject: entry.subject || 'Untitled',
    faculty: entry.faculty || '',
    day: entry.day || 'Monday',
    startTime,
    endTime,
    room: entry.room || '',
    building: entry.building || '',
    type: entry.type || 'Lecture',
    color: entry.color || SUBJECT_COLORS[index % SUBJECT_COLORS.length],
    isOnline: entry.isOnline || false,
    onlineLink: entry.onlineLink || '',
  };
};

/** Play a pleasant chime using Web Audio API */
const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(523.25, now, 0.2);       // C5
    playTone(659.25, now + 0.15, 0.2); // E5
    playTone(783.99, now + 0.3, 0.3);  // G5

    // Try vibration on mobile
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch (e) {
    console.warn('Could not play notification sound:', e);
  }
};

/** Send browser notification */
const sendBrowserNotification = (classItem, minutesUntil) => {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    const notification = new Notification(`📚 ${classItem.subject} — ${classItem.type}`, {
      body: `Starts in ${minutesUntil} min • ${classItem.room}${classItem.building ? ' • ' + classItem.building : ''}\n${formatTime12(classItem.startTime)} – ${formatTime12(classItem.endTime)}`,
      icon: '📚',
      tag: `class-reminder-${classItem.subject}-${classItem.day}-${classItem.startTime}`,
      requireInteraction: true,
    });

    setTimeout(() => notification.close(), 30000);
  } catch (e) {
    console.warn('Browser notification failed:', e);
  }
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const ReminderProvider = ({ children }) => {
  const { user } = useAuth();

  // Settings (persisted in localStorage)
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('studora_reminder_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Live state
  const [currentClass, setCurrentClass] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  const [todayClasses, setTodayClasses] = useState([]);
  const [activeReminder, setActiveReminder] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(null);

  // Refs to track what we already notified about (prevent re-firing)
  const notifiedRef = useRef(new Set());
  const snoozedRef = useRef(new Map()); // key → snooze-until timestamp

  // Persist settings
  useEffect(() => {
    localStorage.setItem('studora_reminder_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((patch) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const dismissReminder = useCallback(() => {
    setActiveReminder(null);
  }, []);

  const snoozeReminder = useCallback((minutes = 5) => {
    if (activeReminder) {
      const key = `${activeReminder.subject}-${activeReminder.day}-${activeReminder.startTime}`;
      snoozedRef.current.set(key, Date.now() + minutes * 60 * 1000);
      notifiedRef.current.delete(key);
    }
    setActiveReminder(null);
  }, [activeReminder]);

  // Request browser notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }, []);

  // ─── Main tick: runs every 30 seconds ──────────────────────────────────────
  useEffect(() => {
    if (!user?.timetable || user.timetable.length === 0) {
      setCurrentClass(null);
      setNextClass(null);
      setTodayClasses([]);
      setCountdownSeconds(null);
      return;
    }

    // Migrate all entries
    const allClasses = user.timetable.map((e, i) => migrateEntry(e, i));

    const tick = () => {
      const now = new Date();
      const todayName = DAY_NAMES[now.getDay()];
      const nowMins = now.getHours() * 60 + now.getMinutes();

      // Today's classes sorted by start time
      const today = allClasses
        .filter(c => c.day === todayName)
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

      setTodayClasses(today);

      // Find current class (happening right now)
      const current = today.find(c => {
        const start = timeToMinutes(c.startTime);
        const end = timeToMinutes(c.endTime);
        return nowMins >= start && nowMins < end;
      });
      setCurrentClass(current || null);

      // Find next upcoming class
      const upcoming = today.filter(c => timeToMinutes(c.startTime) > nowMins);
      const next = upcoming.length > 0 ? upcoming[0] : null;
      setNextClass(next || null);

      // Countdown to next class
      if (next) {
        const nextStartMins = timeToMinutes(next.startTime);
        const diffSec = (nextStartMins - nowMins) * 60 - now.getSeconds();
        setCountdownSeconds(Math.max(0, diffSec));
      } else {
        setCountdownSeconds(null);
      }

      // ── Reminder logic ────────────────────────────────────────────────────
      if (!settings.enabled) return;

      today.forEach(cls => {
        const startMins = timeToMinutes(cls.startTime);
        const minsUntil = startMins - nowMins;
        const key = `${cls.subject}-${cls.day}-${cls.startTime}`;

        // Check snooze
        const snoozeUntil = snoozedRef.current.get(key);
        if (snoozeUntil && Date.now() < snoozeUntil) return;
        if (snoozeUntil && Date.now() >= snoozeUntil) {
          snoozedRef.current.delete(key);
        }

        // Fire reminder if within the window
        if (minsUntil > 0 && minsUntil <= settings.reminderMinutes && !notifiedRef.current.has(key)) {
          notifiedRef.current.add(key);

          // In-app popup
          setActiveReminder({ ...cls, minutesUntil: minsUntil });

          // Sound
          if (settings.soundEnabled) {
            playNotificationSound();
          }

          // Browser push
          if (settings.browserNotifications) {
            sendBrowserNotification(cls, minsUntil);
          }
        }
      });

      // Clean up old notification keys at midnight
      if (nowMins === 0) {
        notifiedRef.current.clear();
      }
    };

    tick(); // run immediately
    const interval = setInterval(tick, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, [user?.timetable, settings]);

  // ─── Countdown ticker (every second for smooth display) ────────────────────
  useEffect(() => {
    if (countdownSeconds === null || countdownSeconds <= 0) return;

    const interval = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev === null || prev <= 0) return null;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownSeconds !== null]);

  return (
    <ReminderContext.Provider value={{
      currentClass,
      nextClass,
      todayClasses,
      activeReminder,
      countdownSeconds,
      settings,
      updateSettings,
      dismissReminder,
      snoozeReminder,
      requestNotificationPermission,
      SUBJECT_COLORS,
      formatTime12,
      migrateEntry,
      timeToMinutes,
    }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminder = () => useContext(ReminderContext);
export { SUBJECT_COLORS, formatTime12, migrateEntry, timeToMinutes, DAY_NAMES };
