import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Award } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    // Fetch opportunities to calculate upcoming deadlines
    const fetchDeadlines = async () => {
      try {
        const token = localStorage.getItem('studora_token');
        const res = await fetch(`${API_BASE}/opportunities`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          
          // Calculate notifications based on upcoming deadlines (e.g. next 14 days)
          const now = new Date();
          const list = [];
          
          data.forEach(item => {
            if (!item.deadline || item.deadline === 'No Deadline') return;
            
            const deadlineDate = new Date(item.deadline);
            const diffTime = deadlineDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 0 && diffDays <= 14) {
              list.push({
                id: item._id,
                title: item.title,
                company: item.company,
                daysLeft: diffDays,
                type: item.type,
                deadline: item.deadline
              });
            }
          });
          
          // Sort by urgency
          list.sort((a, b) => a.daysLeft - b.daysLeft);
          setAlerts(list);
        }
      } catch (err) {
        console.error('Error calculating notification deadlines:', err);
      }
    };

    fetchDeadlines();
    // Poll every 5 minutes
    const interval = setInterval(fetchDeadlines, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/40 transition-all cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {alerts.length > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-xl z-50 text-left border border-white/10 max-h-96 overflow-y-auto">
            <h4 className="font-display font-bold text-sm text-slate-200 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
              <Bell className="w-4 h-4 text-violet-400" />
              Smart Deadlines Feed
            </h4>
            
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming deadlines in the next 14 days.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {alerts.map(alert => (
                  <div 
                    key={alert.id}
                    className={`p-2.5 rounded-xl text-xs flex flex-col gap-1 border ${
                      alert.daysLeft <= 3 
                        ? 'bg-rose-950/20 border-rose-800/40 text-rose-300' 
                        : 'bg-slate-900/40 border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold flex justify-between gap-1 items-start">
                      <span className="line-clamp-1">{alert.title}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap shrink-0 ${
                        alert.daysLeft <= 3 ? 'bg-rose-900/50 text-rose-200' : 'bg-violet-900/40 text-violet-300'
                      }`}>
                        {alert.daysLeft === 0 ? 'Today' : alert.daysLeft === 1 ? '1 day left' : `${alert.daysLeft} days left`}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      {alert.type === 'scholarship' ? (
                        <Award className="w-3 h-3 text-cyan-400" />
                      ) : (
                        <Calendar className="w-3 h-3 text-amber-400" />
                      )}
                      <span>{alert.company} • Deadline: {alert.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
