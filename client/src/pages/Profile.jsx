import React, { useState, useEffect } from 'react';
import { User, Award, Shield, Bookmark, Plus, Trash2, AwardIcon, CheckSquare, Target } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const Profile = () => {
  const { user, updateProfile, toggleBookmark } = useAuth();
  
  // Achievements states
  const [newAchievement, setNewAchievement] = useState('');
  // Certificate states
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  
  // Bookmarks details fetch state
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  const fetchBookmarkedDetails = async () => {
    if (!user || !user.bookmarks || user.bookmarks.length === 0) {
      setBookmarkedItems([]);
      return;
    }

    setLoadingBookmarks(true);
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const bookmarked = data.filter(item => user.bookmarks.includes(item._id));
        setBookmarkedItems(bookmarked);
      }
    } catch (err) {
      console.error('Error loading bookmarked opportunities:', err);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedDetails();
  }, [user?.bookmarks]);

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    if (!newAchievement.trim()) return;

    const list = user.achievements || [];
    const updatedList = [...list, newAchievement.trim()];
    
    await updateProfile({ achievements: updatedList });
    setNewAchievement('');
  };

  const handleRemoveAchievement = async (index) => {
    const list = user.achievements || [];
    const updatedList = list.filter((_, idx) => idx !== index);
    await updateProfile({ achievements: updatedList });
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    if (!certName || !certIssuer) return;

    const list = user.certificates || [];
    const newCert = {
      name: certName.trim(),
      issuer: certIssuer.trim(),
      date: certDate || 'Recent'
    };

    const updatedList = [...list, newCert];
    await updateProfile({ certificates: updatedList });
    
    setCertName('');
    setCertIssuer('');
    setCertDate('');
  };

  const handleRemoveCertificate = async (index) => {
    const list = user.certificates || [];
    const updatedList = list.filter((_, idx) => idx !== index);
    await updateProfile({ certificates: updatedList });
  };

  // Calculate profile completion percentage
  let completeness = 20;
  if (user?.cgpa?.semesters?.length > 0) completeness += 20;
  if (user?.attendance?.length > 0) completeness += 20;
  if (user?.achievements?.length > 0) completeness += 20;
  if (user?.certificates?.length > 0) completeness += 20;

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100 font-display">Student Profile Portfolio</h1>
          <p className="text-sm text-slate-400">Manage certificates, track portfolio achievements, and review bookmarks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: User Info & Completeness Meter */}
        <div className="space-y-6">
          <GlassCard className="border border-white/5 flex flex-col items-center text-center gap-4">
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`} 
              alt="avatar" 
              className="w-24 h-24 rounded-full bg-violet-950 border border-violet-500/20"
            />
            <div>
              <h2 className="font-display font-extrabold text-lg text-slate-200">{user?.name}</h2>
              <p className="text-xs text-slate-400 font-medium">{user?.email}</p>
              <span className="inline-flex gap-1 items-center px-2.5 py-0.5 mt-3 rounded-full text-[10px] font-bold bg-violet-950 border border-violet-800 text-violet-300 font-display uppercase tracking-wide">
                <Shield className="w-3.5 h-3.5" />
                {user?.role} Workspace
              </span>
            </div>

            {/* Completion Gauge */}
            <div className="w-full mt-4 border-t border-white/5 pt-4">
              <div className="flex justify-between text-xs mb-1.5 font-bold">
                <span className="text-slate-350">Profile Completion</span>
                <span className="text-violet-400">{completeness}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-650 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Center/Right column: Achievements, Certifications, Bookmarks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Achievements */}
          <GlassCard className="border border-white/5 flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-violet-400" /> Key Skills & Achievements
            </h3>

            <form onSubmit={handleAddAchievement} className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Mastered React state managers, Won college hackathon" 
                value={newAchievement}
                onChange={e => setNewAchievement(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200"
              />
              <Button type="submit" variant="primary" size="sm">
                Add
              </Button>
            </form>

            {user?.achievements?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No achievements added yet. Start adding skills!</p>
            ) : (
              <div className="flex flex-col gap-2">
                {user?.achievements?.map((ach, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/30 border border-white/5 text-xs text-slate-300">
                    <span>{ach}</span>
                    <button 
                      onClick={() => handleRemoveAchievement(idx)} 
                      className="p-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Certifications */}
          <GlassCard className="border border-white/5 flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-2">
              <AwardIcon className="w-5 h-5 text-violet-400" /> Certificates & Accreditation
            </h3>

            <form onSubmit={handleAddCertificate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input 
                type="text" 
                placeholder="Certificate Name" 
                value={certName}
                onChange={e => setCertName(e.target.value)}
                className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-500"
              />
              <input 
                type="text" 
                placeholder="Issuing Authority" 
                value={certIssuer}
                onChange={e => setCertIssuer(e.target.value)}
                className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-500"
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Date (e.g. 2026)" 
                  value={certDate}
                  onChange={e => setCertDate(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                />
                <Button type="submit" variant="primary" size="sm">
                  Add
                </Button>
              </div>
            </form>

            {user?.certificates?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No certificates recorded. Upload your accomplishments!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.certificates?.map((cert, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/30 border border-white/5 flex justify-between items-start gap-4 text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{cert.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{cert.issuer} • Issued: {cert.date}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveCertificate(idx)} 
                      className="p-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Bookmarks */}
          <GlassCard className="border border-white/5 flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-violet-400" /> Bookmarked Opportunities ({user?.bookmarks?.length || 0})
            </h3>

            {loadingBookmarks ? (
              <div className="py-6 text-center">
                <span className="h-6 w-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin inline-block"></span>
              </div>
            ) : bookmarkedItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No opportunities bookmarked yet. Explore hackathons or scholarship pages.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookmarkedItems.map(item => (
                  <div 
                    key={item._id}
                    className="p-3 rounded-xl bg-slate-950/30 border border-white/5 flex justify-between items-center text-xs text-left"
                  >
                    <div>
                      <span className="text-[8px] bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded text-slate-400 uppercase font-semibold">
                        {item.type}
                      </span>
                      <p className="font-bold text-slate-200 mt-1 line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-slate-500">{item.company}</p>
                    </div>
                    <button 
                      onClick={() => toggleBookmark(item._id)} 
                      className="p-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;
