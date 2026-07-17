import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Award, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const Calendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = async (id) => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/events/${id}/rsvp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchEvents(); // refresh list
      }
    } catch (err) {
      console.error('Error toggling RSVP:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="text-left">
          <h1 className="font-display font-extrabold text-2xl text-slate-100 font-display">College Events & Workshops</h1>
          <p className="text-sm text-slate-400 font-display">Keep track of technical bootcamps, code sprints, placement prep workshops, and RSVPs.</p>
        </div>
      </div>

      {/* Grid of Calendar Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : events.length === 0 ? (
        <p className="text-slate-400 text-center py-12">No workshops are currently scheduled. Check back later!</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => {
            const hasRSVP = event.rsvps?.includes(user?.id);
            return (
              <GlassCard key={event._id} className="flex flex-col justify-between h-full relative overflow-hidden">
                {/* Visual glow on RSVP */}
                {hasRSVP && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-xl pointer-events-none"></div>
                )}
                
                <div className="text-left">
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <span className="px-2.5 py-1 bg-violet-950/40 border border-violet-850 text-violet-300 font-bold rounded-xl text-[10px] flex items-center gap-1.5 font-display">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      Workshop
                    </span>
                    
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-950/30 px-2 py-0.5 rounded border border-white/5 font-display">
                      {event.rsvps?.length || 0} Attending
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-200 mt-4 leading-snug">{event.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Led by: <span className="font-bold text-slate-300">{event.speaker}</span></p>
                  
                  <p className="text-xs text-slate-300 mt-4 leading-relaxed">{event.description}</p>

                  {/* Metadata coordinates */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <CalendarIcon className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {event.tags?.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-[10px] text-slate-400 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3 items-center">
                  <Button 
                    variant={hasRSVP ? 'secondary' : 'outline'} 
                    size="sm"
                    onClick={() => handleRSVP(event._id)}
                    className="flex-1 font-display justify-center"
                  >
                    <Users className="w-4 h-4" />
                    {hasRSVP ? 'Attending ✓' : 'RSVP to Event'}
                  </Button>
                  
                  {event.registrationLink && (
                    <a 
                      href={event.registrationLink} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <Button variant="primary" size="sm">
                        Details <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
