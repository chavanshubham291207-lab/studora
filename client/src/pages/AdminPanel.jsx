import React, { useState, useEffect } from 'react';
import { 
  Shield, PlusCircle, Calendar, Briefcase, FileText, Trash2, Edit2, 
  AlertCircle, Award, CheckCircle, Clock, Star, TrendingUp, Globe, 
  MapPin, Trophy, Users, Cpu, RefreshCw, Layers, Zap, X
} from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

// ─────────────────────────────────────────────
// Edit Opportunity Modal Component
// ─────────────────────────────────────────────
const EditOpportunityModal = ({ opp, onClose, onSave }) => {
  const [title, setTitle] = useState(opp.title || '');
  const [company, setCompany] = useState(opp.company || '');
  const [platform, setPlatform] = useState(opp.platform || 'Unstop');
  const [type, setType] = useState(opp.type || 'hackathon');
  const [description, setDescription] = useState(opp.description || '');
  const [eligibility, setEligibility] = useState(opp.eligibility || '');
  const [deadline, setDeadline] = useState(opp.deadline || '');
  const [applyLink, setApplyLink] = useState(opp.applyLink || '');
  const [logo, setLogo] = useState(opp.logo || '');
  const [tags, setTags] = useState(opp.tags ? opp.tags.join(', ') : '');
  const [banner, setBanner] = useState(opp.banner || '');
  const [mode, setMode] = useState(opp.mode || 'online');
  const [location, setLocation] = useState(opp.location || '');
  const [eventDates, setEventDates] = useState(opp.eventDates || '');
  const [prizePool, setPrizePool] = useState(opp.prizePool || '');
  const [teamSize, setTeamSize] = useState(opp.teamSize || '');
  const [regFee, setRegFee] = useState(opp.regFee || 'free');
  const [regFeeAmount, setRegFeeAmount] = useState(opp.regFeeAmount || 0);
  const [category, setCategory] = useState(opp.category || 'AI & Machine Learning');
  const [difficulty, setDifficulty] = useState(opp.difficulty || 'Intermediate');
  const [technologies, setTechnologies] = useState(opp.technologies ? opp.technologies.join(', ') : '');
  const [country, setCountry] = useState(opp.country || 'Global');
  const [state, setState] = useState(opp.state || '');
  const [college, setCollege] = useState(opp.college || '');
  const [isFeatured, setIsFeatured] = useState(opp.isFeatured || false);
  const [isTrending, setIsTrending] = useState(opp.isTrending || false);
  const [publishDate, setPublishDate] = useState(opp.publishDate || '');
  
  // Scholarship-specific fields
  const [provider, setProvider] = useState(opp.provider || '');
  const [amount, setAmount] = useState(opp.amount || '');
  const [educationLevel, setEducationLevel] = useState(opp.educationLevel || 'Undergraduate');
  const [documents, setDocuments] = useState(opp.documents ? opp.documents.join(', ') : '');
  const [isGovernment, setIsGovernment] = useState(opp.isGovernment || false);
  const [scholarshipType, setScholarshipType] = useState(opp.scholarshipType || 'Merit-based');

  // Internship-specific fields
  const [stipend, setStipend] = useState(opp.stipend || '');
  const [duration, setDuration] = useState(opp.duration || '');
  const [skills, setSkills] = useState(opp.skills ? opp.skills.join(', ') : '');
  const [openings, setOpenings] = useState(opp.openings || 1);
  const [website, setWebsite] = useState(opp.website || '');

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      const techList = technologies.split(',').map(t => t.trim()).filter(Boolean);
      const docList = documents.split(',').map(d => d.trim()).filter(Boolean);
      const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
      await onSave(opp._id, {
        title, company, platform, type, description, eligibility, deadline, applyLink, logo, tags: tagList,
        banner, mode, location, eventDates, prizePool, teamSize, regFee, regFeeAmount: Number(regFeeAmount),
        category, difficulty, technologies: techList, country, state, college, isFeatured, isTrending, publishDate,
        provider, amount, educationLevel, documents: docList, isGovernment, scholarshipType,
        stipend, duration, skills: skillList, openings: Number(openings), website
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1628] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl text-left">
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <h3 className="font-display font-extrabold text-base text-slate-100 flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-violet-400" /> Edit Opportunity Details
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Event Title *</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none" />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Organizer / Host</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none" />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs">
                <option value="Unstop">Unstop</option>
                <option value="Devpost">Devpost</option>
                <option value="Devfolio">Devfolio</option>
                <option value="HackerEarth">HackerEarth</option>
                <option value="Hack Club">Hack Club</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                <option value="hackathon">Hackathon</option>
                <option value="scholarship">Scholarship</option>
                <option value="internship">Internship</option>
                <option value="job">Job</option>
                <option value="course">Course</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Mode</label>
              <select value={mode} onChange={e => setMode(e.target.value)} className="w-full px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                {['AI & Machine Learning','Web Development','App Development','Cyber Security','Blockchain','IoT','Robotics','Open Innovation','Startup Competitions','College Hackathons','National Hackathons','International Hackathons','Design Challenges','Coding Contests','Case Study Competitions'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Registration Fee</label>
              <select value={regFee} onChange={e => setRegFee(e.target.value)} className="w-full px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Fee Amount (₹)</label>
              <input type="number" disabled={regFee === 'free'} value={regFeeAmount} onChange={e => setRegFeeAmount(e.target.value)} className="w-full px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none disabled:opacity-55" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Registration Deadline *</label>
              <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Event Dates (display text)</label>
              <input type="text" value={eventDates} onChange={e => setEventDates(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Prize Pool</label>
              <input type="text" value={prizePool} onChange={e => setPrizePool(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Team Size</label>
              <input type="text" value={teamSize} onChange={e => setTeamSize(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Country</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">State</label>
              <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Official Registration Link *</label>
              <input type="url" required value={applyLink} onChange={e => setApplyLink(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Logo URL</label>
              <input type="url" value={logo} onChange={e => setLogo(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
          </div>

          {type === 'scholarship' && (
            <div className="p-4 border border-violet-500/20 bg-violet-950/10 rounded-2xl space-y-4">
              <p className="text-violet-400 font-bold mb-2 text-xs text-left">Scholarship Portal Fields</p>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Scholarship Provider / Sponsor</label>
                  <input type="text" value={provider} onChange={e => setProvider(e.target.value)} placeholder="e.g. Tata Trusts" className="w-full px-3.5 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs" />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Scholarship Amount</label>
                  <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. ₹50,000 per year" className="w-full px-3.5 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-left">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Education Level</label>
                  <select value={educationLevel} onChange={e => setEducationLevel(e.target.value)} className="w-full px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs">
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate / PhD">Postgraduate / PhD</option>
                    <option value="Undergraduate / MBA">MBA / UG</option>
                    <option value="10th to Postgraduate">10th–PG</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Scholarship Type</label>
                  <select value={scholarshipType} onChange={e => setScholarshipType(e.target.value)} className="w-full px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs">
                    <option value="Merit-based">Merit-Based</option>
                    <option value="Need-based">Need-Based</option>
                    <option value="Merit-cum-Means">Merit-cum-Means</option>
                    <option value="Research Fellowship">Fellowship</option>
                  </select>
                </div>
                <div className="flex items-center pt-5 gap-2 text-slate-350">
                  <input type="checkbox" id="edit_isGov" checked={isGovernment} onChange={e => setIsGovernment(e.target.checked)} className="rounded bg-slate-950 border-white/10" />
                  <label htmlFor="edit_isGov" className="font-semibold cursor-pointer text-xs">Government Sponsored</label>
                </div>
              </div>
              <div className="text-left">
                <label className="text-slate-400 font-semibold block mb-1">Required Documents (comma-separated)</label>
                <input type="text" value={documents} onChange={e => setDocuments(e.target.value)} placeholder="e.g. Income Certificate, Mark Sheets, Aadhaar Card" className="w-full px-3.5 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs" />
              </div>
            </div>
          )}

          {type === 'internship' && (
            <div className="p-4 border border-cyan-500/20 bg-cyan-950/10 rounded-2xl space-y-4">
              <p className="text-cyan-400 font-bold mb-2 text-xs text-left">Internship Portal Fields</p>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Stipend</label>
                  <input type="text" value={stipend} onChange={e => setStipend(e.target.value)} placeholder="e.g. ₹25,000 / month or Unpaid" className="w-full px-3.5 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs" />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Duration</label>
                  <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 3 Months" className="w-full px-3.5 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-left">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Number of Openings</label>
                  <input type="number" value={openings} onChange={e => setOpenings(e.target.value)} placeholder="e.g. 5" className="w-full px-3.5 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs" />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-400 font-semibold block mb-1">Company Website</label>
                  <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="e.g. https://careers.google.com" className="w-full px-3.5 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs" />
                </div>
              </div>
              <div className="text-left">
                <label className="text-slate-400 font-semibold block mb-1">Required Skills (comma-separated)</label>
                <input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. React, Node.js, Python" className="w-full px-3.5 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs" />
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Banner Image URL</label>
            <input type="url" value={banner} onChange={e => setBanner(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Technologies (comma separated)</label>
              <input type="text" value={technologies} onChange={e => setTechnologies(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Tags (comma-separated)</label>
              <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Eligibility Criteria</label>
            <input type="text" value={eligibility} onChange={e => setEligibility(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Description</label>
            <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none resize-none font-sans" />
          </div>

          <div className="grid grid-cols-3 gap-4 p-3 bg-slate-900/40 rounded-xl border border-white/5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 rounded accent-amber-500" />
              <span className="text-amber-400 font-bold flex items-center gap-1"><Star className="w-3 h-3" /> Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={isTrending} onChange={e => setIsTrending(e.target.checked)} className="w-4 h-4 rounded accent-rose-500" />
              <span className="text-rose-400 font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Trending</span>
            </label>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Publish Date</label>
              <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} className="px-2 py-1 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-white/5 pt-3 mt-4">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Updates'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Admin Panel Component
// ─────────────────────────────────────────────
const AdminPanel = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [pendingOpps, setPendingOpps] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certsLoading, setCertsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list', 'pending', 'cert_list', 'add_opp', 'add_cert', 'add_event', 'api_sync', 'categories_organizers'

  // Sync state
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncLog, setSyncLog] = useState('');

  // Editing opportunity state
  const [editingOpp, setEditingOpp] = useState(null);

  // ── Core opportunity fields
  const [oppTitle, setOppTitle] = useState('');
  const [oppCompany, setOppCompany] = useState('');
  const [oppPlatform, setOppPlatform] = useState('Unstop');
  const [oppType, setOppType] = useState('hackathon');
  const [oppDesc, setOppDesc] = useState('');
  const [oppElig, setOppElig] = useState('');
  const [oppDeadline, setOppDeadline] = useState('');
  const [oppApplyLink, setOppApplyLink] = useState('');
  const [oppLogo, setOppLogo] = useState('');
  const [oppTags, setOppTags] = useState('');

  // ── Extended hackathon fields
  const [oppBanner, setOppBanner] = useState('');
  const [oppMode, setOppMode] = useState('online');
  const [oppLocation, setOppLocation] = useState('');
  const [oppEventDates, setOppEventDates] = useState('');
  const [oppPrizePool, setOppPrizePool] = useState('');
  const [oppTeamSize, setOppTeamSize] = useState('');
  const [oppRegFee, setOppRegFee] = useState('free');
  const [oppRegFeeAmount, setOppRegFeeAmount] = useState(0);
  const [oppCategory, setOppCategory] = useState('Open Innovation');
  const [oppDifficulty, setOppDifficulty] = useState('Intermediate');
  const [oppTechnologies, setOppTechnologies] = useState('');
  const [oppCountry, setOppCountry] = useState('India');
  const [oppState, setOppState] = useState('');
  const [oppCollege, setOppCollege] = useState('');
  const [oppIsFeatured, setOppIsFeatured] = useState(false);
  const [oppIsTrending, setOppIsTrending] = useState(false);
  const [oppPublishDate, setOppPublishDate] = useState('');

  // ── Scholarship fields
  const [oppProvider, setOppProvider] = useState('');
  const [oppAmount, setOppAmount] = useState('');
  const [oppEducationLevel, setOppEducationLevel] = useState('Undergraduate');
  const [oppDocuments, setOppDocuments] = useState('');
  const [oppIsGovernment, setOppIsGovernment] = useState(false);
  const [oppScholarshipType, setOppScholarshipType] = useState('Merit-based');

  // ── Internship fields
  const [oppStipend, setOppStipend] = useState('');
  const [oppDuration, setOppDuration] = useState('');
  const [oppSkills, setOppSkills] = useState('');
  const [oppOpenings, setOppOpenings] = useState(1);
  const [oppWebsite, setOppWebsite] = useState('');

  // Event form states
  const [evTitle, setEvTitle] = useState('');
  const [evDesc, setEvDesc] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evTime, setEvTime] = useState('');
  const [evVenue, setEvVenue] = useState('');
  const [evSpeaker, setEvSpeaker] = useState('');
  const [evRegLink, setEvRegLink] = useState('');
  const [evTags, setEvTags] = useState('');

  // Certification form states
  const [certTitle, setCertTitle] = useState('');
  const [certCompany, setCertCompany] = useState('');
  const [certLogo, setCertLogo] = useState('');
  const [certCategory, setCertCategory] = useState('Software Engineering');
  const [certSkills, setCertSkills] = useState('');
  const [certDuration, setCertDuration] = useState('');
  const [certDifficulty, setCertDifficulty] = useState('Beginner');
  const [certIsFreeCertificate, setCertIsFreeCertificate] = useState(true);
  const [certIsVirtualExperience, setCertIsVirtualExperience] = useState(false);
  const [certProvider, setCertProvider] = useState('The Forage');
  const [certCourseLink, setCertCourseLink] = useState('');
  const [certIsFeatured, setCertIsFeatured] = useState(false);
  const [certDesc, setCertDesc] = useState('');

  const [formMsg, setFormMsg] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchAllOpportunities = async () => {
    try {
      const token = localStorage.getItem('studora_token');
      // Pass bypass date validation headers/headers to fetch all including future dates
      const res = await fetch(`${API_BASE}/opportunities?status=pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const pendingData = await res.json();
      
      const res2 = await fetch(`${API_BASE}/opportunities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const approvedData = await res2.json();

      // Merge both to show complete control listings
      const allMerged = [...pendingData, ...approvedData];
      // filter out duplicates based on id
      const uniqueMap = {};
      allMerged.forEach(item => { uniqueMap[item._id] = item; });
      setOpportunities(Object.values(uniqueMap));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingOpportunities = async () => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities?status=pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingOpps(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllCertifications = async () => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/certifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCertifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCertsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllOpportunities();
      fetchAllCertifications();
      fetchPendingOpportunities();
    }
  }, [user]);

  const handleCreateOpp = async (e) => {
    e.preventDefault();
    if (!oppTitle || !oppDeadline) {
      setFormMsg('Please fill in Title and Deadline');
      return;
    }

    setSubmitLoading(true);
    setFormMsg('');
    const tagList = oppTags.split(',').map(t => t.trim()).filter(Boolean);
    const techList = oppTechnologies.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const token = localStorage.getItem('studora_token');
      const docList = oppDocuments.split(',').map(d => d.trim()).filter(Boolean);
      const skillList = oppSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch(`${API_BASE}/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: oppTitle, company: oppCompany, platform: oppPlatform, type: oppType,
          description: oppDesc, eligibility: oppElig, deadline: oppDeadline,
          applyLink: oppApplyLink, logo: oppLogo, tags: tagList,
          banner: oppBanner, mode: oppMode, location: oppLocation,
          eventDates: oppEventDates, prizePool: oppPrizePool, teamSize: oppTeamSize,
          regFee: oppRegFee, regFeeAmount: Number(oppRegFeeAmount),
          category: oppCategory, difficulty: oppDifficulty,
          technologies: techList, country: oppCountry, state: oppState,
          college: oppCollege, isFeatured: oppIsFeatured, isTrending: oppIsTrending,
          publishDate: oppPublishDate,
          provider: oppProvider, amount: oppAmount, educationLevel: oppEducationLevel,
          documents: docList, isGovernment: oppIsGovernment, scholarshipType: oppScholarshipType,
          stipend: oppStipend, duration: oppDuration, skills: skillList,
          openings: Number(oppOpenings), website: oppWebsite
        })
      });

      if (res.ok) {
        setFormMsg('✓ Opportunity published successfully!');
        // Reset all fields
        setOppTitle(''); setOppCompany(''); setOppPlatform('Unstop'); setOppDesc(''); setOppElig('');
        setOppDeadline(''); setOppApplyLink(''); setOppLogo(''); setOppTags('');
        setOppBanner(''); setOppMode('online'); setOppLocation(''); setOppEventDates('');
        setOppPrizePool(''); setOppTeamSize(''); setOppRegFee('free'); setOppRegFeeAmount(0);
        setOppCategory('Open Innovation'); setOppDifficulty('Intermediate');
        setOppTechnologies(''); setOppCountry('India'); setOppState(''); setOppCollege('');
        setOppIsFeatured(false); setOppIsTrending(false); setOppPublishDate('');
        setOppProvider(''); setOppAmount(''); setOppEducationLevel('Undergraduate');
        setOppDocuments(''); setOppIsGovernment(false); setOppScholarshipType('Merit-based');
        setOppStipend(''); setOppDuration(''); setOppSkills(''); setOppOpenings(1); setOppWebsite('');
        fetchAllOpportunities();
      } else {
        const errData = await res.json();
        setFormMsg(`Failed: ${errData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      setFormMsg('Connection error creating opportunity.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateOpp = async (id, updatedFields) => {
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        setFormMsg('✓ Opportunity updated successfully!');
        fetchAllOpportunities();
        fetchPendingOpportunities();
      } else {
        setFormMsg('Failed to save updates.');
      }
    } catch (err) {
      console.error(err);
      setFormMsg('Connection error saving details.');
    }
  };

  const handleApproveOpp = async (id) => {
    try {
      const token = localStorage.getItem('studora_token');
      await fetch(`${API_BASE}/opportunities/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPendingOpportunities();
      fetchAllOpportunities();
    } catch (err) { console.error(err); }
  };

  const handleToggleFeatured = async (opp) => {
    try {
      const token = localStorage.getItem('studora_token');
      await fetch(`${API_BASE}/opportunities/${opp._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isFeatured: !opp.isFeatured })
      });
      fetchAllOpportunities();
    } catch (err) { console.error(err); }
  };

  const handleToggleTrending = async (opp) => {
    try {
      const token = localStorage.getItem('studora_token');
      await fetch(`${API_BASE}/opportunities/${opp._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isTrending: !opp.isTrending })
      });
      fetchAllOpportunities();
    } catch (err) { console.error(err); }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!evTitle || !evDate || !evTime) {
      setFormMsg('Please enter Title, Date, and Time');
      return;
    }

    setSubmitLoading(true);
    setFormMsg('');
    const tagList = evTags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: evTitle, description: evDesc, date: evDate, time: evTime,
          venue: evVenue, speaker: evSpeaker, registrationLink: evRegLink, tags: tagList
        })
      });

      if (res.ok) {
        setFormMsg('Event workshop scheduled successfully! ✓');
        setEvTitle(''); setEvDesc(''); setEvDate(''); setEvTime('');
        setEvVenue(''); setEvSpeaker(''); setEvRegLink(''); setEvTags('');
      } else {
        setFormMsg('Failed to schedule event.');
      }
    } catch (err) {
      console.error(err);
      setFormMsg('Connection error creating event.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCreateCert = async (e) => {
    e.preventDefault();
    if (!certTitle || !certCompany || !certCategory || !certProvider || !certCourseLink) {
      setFormMsg('Please fill in Title, Company, Category, Provider, and Course Link');
      return;
    }

    setSubmitLoading(true);
    setFormMsg('');

    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/certifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: certTitle, companyName: certCompany, companyLogo: certLogo,
          category: certCategory, skills: certSkills.split(',').map(s => s.trim()).filter(Boolean),
          duration: certDuration, difficulty: certDifficulty, isFreeCertificate: certIsFreeCertificate,
          isVirtualExperience: certIsVirtualExperience, provider: certProvider, courseLink: certCourseLink,
          isFeatured: certIsFeatured, description: certDesc
        })
      });

      if (res.ok) {
        setFormMsg('Certification course added successfully! ✓');
        setCertTitle(''); setCertCompany(''); setCertLogo(''); setCertCategory('Software Engineering');
        setCertSkills(''); setCertDuration(''); setCertDifficulty('Beginner');
        setCertIsFreeCertificate(true); setCertIsVirtualExperience(false);
        setCertProvider('The Forage'); setCertCourseLink(''); setCertIsFeatured(false); setCertDesc('');
        fetchAllCertifications();
      } else {
        setFormMsg('Failed to create certification.');
      }
    } catch (err) {
      console.error(err);
      setFormMsg('Connection error creating certification.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteOpp = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAllOpportunities();
        fetchPendingOpportunities();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/certifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAllCertifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSyncApis = async () => {
    setSyncLoading(true);
    setSyncLog('Starting Sync from Devpost, Devfolio, MLH, gdg community, and academic sources...\nFetching public RSS feeds...\n');
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/opportunities/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSyncLog(prev => prev + `Success!\nAdded/Synced: ${data.countAdded} new professional events.\nPrevented duplicates based on URL matches.\n`);
        fetchAllOpportunities();
      } else {
        setSyncLog(prev => prev + `Sync failed: Status ${res.status}\n`);
      }
    } catch (err) {
      setSyncLog(prev => prev + `Error during synchronization: ${err.message}\n`);
    } finally {
      setSyncLoading(false);
    }
  };

  // Compute stats for Categories & Organizers tab
  const getCategoryStats = () => {
    const map = {};
    opportunities.forEach(opp => {
      const cat = opp.category || 'General';
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).sort((a,b) => b[1] - a[1]);
  };

  const getOrganizerStats = () => {
    const map = {};
    opportunities.forEach(opp => {
      const org = opp.company || 'Other';
      map[org] = (map[org] || 0) + 1;
    });
    return Object.entries(map).sort((a,b) => b[1] - a[1]);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="py-12 text-center text-rose-400 flex flex-col items-center gap-4">
        <AlertCircle className="w-12 h-12" />
        <h2 className="font-display font-extrabold text-lg">Access Prohibited</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          You must log in with an Administrator profile to view this management console.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-violet-400" /> Admin Management Panel
          </h1>
          <p className="text-sm text-slate-400">Manage discovery listings, approve submissions, trigger API synchronizations, and track stats.</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
        {[
          { id: 'list', label: 'All Listings' },
          { id: 'pending', label: `Pending Approvals ${pendingOpps.length > 0 ? `(${pendingOpps.length})` : ''}` },
          { id: 'cert_list', label: 'Certifications' },
          { id: 'add_opp', label: '+ Add Opportunity' },
          { id: 'add_cert', label: '+ Add Certification' },
          { id: 'add_event', label: '+ Schedule Workshop' },
          { id: 'api_sync', label: '🔌 API Sync Manager' },
          { id: 'categories_organizers', label: '📊 Categories & Hosts' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveSubTab(tab.id); setFormMsg(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === tab.id ? 'bg-violet-600/20 text-violet-400 border border-violet-800/40' : 'text-slate-400 hover:text-white border border-transparent'
            } ${tab.id === 'pending' && pendingOpps.length > 0 ? 'border-amber-800/40 text-amber-400' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {formMsg && (
        <p className="text-xs font-semibold py-2.5 px-4 bg-violet-950/20 border border-violet-900/40 rounded-xl text-violet-300 w-fit">{formMsg}</p>
      )}

      {/* SUB TAB BODIES */}
      <div>
        {/* ALL OPPORTUNITY LISTINGS TABLE */}
        {activeSubTab === 'list' && (
          <GlassCard className="border border-white/5">
            {loading ? (
              <div className="text-center py-8"><span className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
            ) : opportunities.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No opportunities listed in database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400">
                      <th className="py-2.5 font-bold uppercase text-[9px] w-20">Type</th>
                      <th className="py-2.5 font-bold uppercase text-[9px]">Title</th>
                      <th className="py-2.5 font-bold uppercase text-[9px]">Company / Host</th>
                      <th className="py-2.5 font-bold uppercase text-[9px]">Deadline</th>
                      <th className="py-2.5 font-bold uppercase text-[9px] text-center">Featured</th>
                      <th className="py-2.5 font-bold uppercase text-[9px] text-center">Trending</th>
                      <th className="py-2.5 font-bold uppercase text-[9px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.map(opp => (
                      <tr key={opp._id} className="border-b border-white/5 hover:bg-slate-900/20">
                        <td className="py-3 capitalize">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            opp.type === 'hackathon' ? 'bg-violet-950/40 text-violet-400' :
                            opp.type === 'scholarship' ? 'bg-cyan-950/40 text-cyan-400' :
                            'bg-pink-950/40 text-pink-400'
                          }`}>{opp.type}</span>
                        </td>
                        <td className="py-3 font-bold text-slate-200 max-w-[200px] truncate">{opp.title}</td>
                        <td className="py-3 text-slate-400">{opp.company}</td>
                        <td className="py-3 text-slate-400">{opp.deadline}</td>
                        <td className="py-3 text-center">
                          <button onClick={() => handleToggleFeatured(opp)} title="Toggle Featured" className={`p-1 rounded-lg transition-all cursor-pointer ${opp.isFeatured ? 'text-amber-400 bg-amber-950/30' : 'text-slate-600 hover:text-amber-400'}`}>
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-3 text-center">
                          <button onClick={() => handleToggleTrending(opp)} title="Toggle Trending" className={`p-1 rounded-lg transition-all cursor-pointer ${opp.isTrending ? 'text-rose-400 bg-rose-950/30' : 'text-slate-600 hover:text-rose-400'}`}>
                            <TrendingUp className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-3 text-right">
                          <button onClick={() => setEditingOpp(opp)} className="p-1.5 text-slate-500 hover:text-violet-400 transition-all cursor-pointer inline-block mr-2" title="Edit Opportunity">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteOpp(opp._id)} className="p-1.5 text-slate-500 hover:text-rose-450 transition-all cursor-pointer inline-block" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        )}

        {/* PENDING APPROVALS */}
        {activeSubTab === 'pending' && (
          <GlassCard className="border border-amber-800/20">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-bold text-base text-amber-300">User-Submitted Events Awaiting Approval</h3>
            </div>
            {pendingOpps.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">All caught up! No pending events to review.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOpps.map(opp => (
                  <div key={opp._id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-start gap-4">
                    <img src={opp.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${opp.company}`} alt={opp.company} className="w-10 h-10 rounded-xl border border-white/10 bg-slate-950 mt-0.5 shrink-0" onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${opp.company}`; }} />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-bold text-slate-200">{opp.title}</p>
                      <p className="text-xs text-slate-400">{opp.company} · {opp.type} · Deadline: {opp.deadline}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{opp.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleApproveOpp(opp._id)} className="px-3 py-1.5 bg-emerald-600/20 border border-emerald-700/30 text-emerald-400 text-xs font-bold rounded-xl hover:bg-emerald-600/30 transition-all flex items-center gap-1 cursor-pointer">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => handleDeleteOpp(opp._id)} className="px-3 py-1.5 bg-rose-600/20 border border-rose-700/30 text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-600/30 transition-all flex items-center gap-1 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}

        {/* CERTIFICATIONS LISTINGS */}
        {activeSubTab === 'cert_list' && (
          <GlassCard className="border border-white/5">
            {certsLoading ? (
              <div className="text-center py-8"><span className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
            ) : certifications.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No certifications listed in database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400">
                      <th className="py-2.5 font-bold uppercase text-[9px] w-20">Provider</th>
                      <th className="py-2.5 font-bold uppercase text-[9px]">Course Title</th>
                      <th className="py-2.5 font-bold uppercase text-[9px]">Company Partner</th>
                      <th className="py-2.5 font-bold uppercase text-[9px]">Category</th>
                      <th className="py-2.5 font-bold uppercase text-[9px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certifications.map(cert => (
                      <tr key={cert._id} className="border-b border-white/5 hover:bg-slate-900/20">
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-violet-950/40 text-violet-400 border border-violet-900/30">{cert.provider}</span>
                        </td>
                        <td className="py-3 font-bold text-slate-200">{cert.title}</td>
                        <td className="py-3 text-slate-400">{cert.companyName}</td>
                        <td className="py-3 text-slate-400">{cert.category}</td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleDeleteCert(cert._id)} className="p-1.5 text-slate-500 hover:text-rose-400 transition-all cursor-pointer inline-block" title="Delete Certification">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        )}

        {/* API SYNC TAB */}
        {activeSubTab === 'api_sync' && (
          <GlassCard className="border border-white/5 text-left max-w-xl flex flex-col gap-4">
            <h3 className="font-display font-bold text-base text-slate-200 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-violet-400" /> Automated API Sync Manager</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Import opportunities automatically from permitted channels and open-source calendars. This processes live events, normalizes category structures, and maps metadata variables.
            </p>
            <button
              onClick={handleSyncApis}
              disabled={syncLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 w-fit disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
              {syncLoading ? 'Syncing Opportunities...' : 'Sync Permitted RSS & API Feeds'}
            </button>

            {syncLog && (
              <div className="mt-2 p-4 bg-slate-950/70 border border-white/10 rounded-xl font-mono text-[10px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {syncLog}
              </div>
            )}
          </GlassCard>
        )}

        {/* CATEGORIES & ORGANIZERS STATS */}
        {activeSubTab === 'categories_organizers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="border border-white/5 text-left">
              <h3 className="font-display font-bold text-base text-slate-200 mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-pink-400" /> Categories Event Count</h3>
              <div className="space-y-2">
                {getCategoryStats().map(([cat, count]) => (
                  <div key={cat} className="flex justify-between items-center py-2 border-b border-white/5 text-xs">
                    <span className="text-slate-300 font-medium">{cat}</span>
                    <span className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-lg">{count} event{count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="border border-white/5 text-left">
              <h3 className="font-display font-bold text-base text-slate-200 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-cyan-400" /> Organizers Event Count</h3>
              <div className="space-y-2">
                {getOrganizerStats().map(([org, count]) => (
                  <div key={org} className="flex justify-between items-center py-2 border-b border-white/5 text-xs">
                    <span className="text-slate-300 font-medium">{org}</span>
                    <span className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-lg">{count} event{count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ADD OPPORTUNITY FORM */}
        {activeSubTab === 'add_opp' && (
          <GlassCard className="border border-white/5 max-w-3xl">
            <h3 className="font-display font-bold text-base text-slate-200 mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-violet-400" /> Add New Opportunity</h3>
            <form onSubmit={handleCreateOpp} className="space-y-4 text-xs text-left">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Event Title *</label>
                  <input type="text" placeholder="e.g. Google Solution Challenge" value={oppTitle} onChange={e => setOppTitle(e.target.value)} required className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Organizer / Host</label>
                  <input type="text" placeholder="e.g. Google" value={oppCompany} onChange={e => setOppCompany(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Platform</label>
                  <select value={oppPlatform} onChange={e => setOppPlatform(e.target.value)} className="px-3 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs">
                    <option value="Unstop">Unstop</option>
                    <option value="Devpost">Devpost</option>
                    <option value="Devfolio">Devfolio</option>
                    <option value="HackerEarth">HackerEarth</option>
                    <option value="Hack Club">Hack Club</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Type</label>
                  <select value={oppType} onChange={e => setOppType(e.target.value)} className="px-3 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                    <option value="hackathon">Hackathon</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="internship">Internship</option>
                    <option value="job">Job</option>
                    <option value="course">Course</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Mode</label>
                  <select value={oppMode} onChange={e => setOppMode(e.target.value)} className="px-3 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Category</label>
                  <select value={oppCategory} onChange={e => setOppCategory(e.target.value)} className="px-3 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                    {['AI & Machine Learning','Web Development','App Development','Cyber Security','Blockchain','IoT','Robotics','Open Innovation','Startup Competitions','College Hackathons','National Hackathons','International Hackathons','Design Challenges','Coding Contests','Case Study Competitions'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Difficulty</label>
                  <select value={oppDifficulty} onChange={e => setOppDifficulty(e.target.value)} className="px-3 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Registration Fee</label>
                  <select value={oppRegFee} onChange={e => setOppRegFee(e.target.value)} className="px-3 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold">Fee Amount (₹)</label>
                  <input type="number" disabled={oppRegFee === 'free'} value={oppRegFeeAmount} onChange={e => setOppRegFeeAmount(e.target.value)} className="w-full px-3 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none disabled:opacity-55" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Registration Deadline *</label>
                  <input type="date" value={oppDeadline} onChange={e => setOppDeadline(e.target.value)} required className="px-3.5 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Event Dates</label>
                  <input type="text" placeholder="e.g. Oct 10 - Oct 12" value={oppEventDates} onChange={e => setOppEventDates(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Prize Pool</label>
                  <input type="text" placeholder="e.g. $10,000" value={oppPrizePool} onChange={e => setOppPrizePool(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Team Size</label>
                  <input type="text" placeholder="e.g. 1-4 Members" value={oppTeamSize} onChange={e => setOppTeamSize(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Location</label>
                  <input type="text" placeholder="e.g. Online" value={oppLocation} onChange={e => setOppLocation(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Country</label>
                  <input type="text" placeholder="e.g. India" value={oppCountry} onChange={e => setOppCountry(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">State</label>
                  <input type="text" placeholder="e.g. Karnataka" value={oppState} onChange={e => setOppState(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Official Registration Link *</label>
                  <input type="url" required value={oppApplyLink} onChange={e => setOppApplyLink(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Logo URL</label>
                  <input type="url" value={oppLogo} onChange={e => setOppLogo(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              {oppType === 'scholarship' && (
                <div className="p-4 border border-violet-500/20 bg-violet-950/10 rounded-2xl space-y-4">
                  <p className="text-violet-400 font-bold mb-2 text-xs">Scholarship Portal Fields</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Scholarship Provider / Sponsor</label>
                      <input type="text" placeholder="e.g. Tata Trusts" value={oppProvider} onChange={e => setOppProvider(e.target.value)} className="px-3.5 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 text-xs" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Scholarship Amount</label>
                      <input type="text" placeholder="e.g. ₹50,000 per year" value={oppAmount} onChange={e => setOppAmount(e.target.value)} className="px-3.5 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Education Level</label>
                      <select value={oppEducationLevel} onChange={e => setOppEducationLevel(e.target.value)} className="px-3 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs">
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate / PhD">Postgraduate / PhD</option>
                        <option value="Undergraduate / MBA">MBA / UG</option>
                        <option value="10th to Postgraduate">10th–PG</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Scholarship Type</label>
                      <select value={oppScholarshipType} onChange={e => setOppScholarshipType(e.target.value)} className="px-3 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none text-xs">
                        <option value="Merit-based">Merit-Based</option>
                        <option value="Need-based">Need-Based</option>
                        <option value="Merit-cum-Means">Merit-cum-Means</option>
                        <option value="Research Fellowship">Fellowship</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-5 gap-2 text-slate-350">
                      <input type="checkbox" id="add_isGov" checked={oppIsGovernment} onChange={e => setOppIsGovernment(e.target.checked)} className="rounded bg-slate-950 border-white/10 w-4 h-4 accent-violet-500" />
                      <label htmlFor="add_isGov" className="font-semibold cursor-pointer text-xs">Government Sponsored</label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400 font-semibold">Required Documents (comma-separated)</label>
                    <input type="text" placeholder="e.g. Income Certificate, Mark Sheets, Aadhaar Card" value={oppDocuments} onChange={e => setOppDocuments(e.target.value)} className="px-3.5 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 text-xs" />
                  </div>
                </div>
              )}

              {oppType === 'internship' && (
                <div className="p-4 border border-cyan-500/20 bg-cyan-950/10 rounded-2xl space-y-4">
                  <p className="text-cyan-400 font-bold mb-2 text-xs">Internship Portal Fields</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Stipend</label>
                      <input type="text" placeholder="e.g. ₹25,000 / month or Unpaid" value={oppStipend} onChange={e => setOppStipend(e.target.value)} className="px-3.5 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 text-xs" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Duration</label>
                      <input type="text" placeholder="e.g. 3 Months" value={oppDuration} onChange={e => setOppDuration(e.target.value)} className="px-3.5 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Number of Openings</label>
                      <input type="number" placeholder="e.g. 5" value={oppOpenings} onChange={e => setOppOpenings(e.target.value)} className="px-3.5 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 text-xs" />
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-slate-400 font-semibold">Company Website</label>
                      <input type="url" placeholder="https://careers.google.com" value={oppWebsite} onChange={e => setOppWebsite(e.target.value)} className="px-3.5 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 text-xs" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400 font-semibold">Required Skills (comma-separated)</label>
                    <input type="text" placeholder="e.g. React, Node.js, Python" value={oppSkills} onChange={e => setOppSkills(e.target.value)} className="px-3.5 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 text-xs" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Banner Image URL</label>
                <input type="url" value={oppBanner} onChange={e => setOppBanner(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Technologies (comma separated)</label>
                  <input type="text" value={oppTechnologies} onChange={e => setOppTechnologies(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Tags (comma-separated)</label>
                  <input type="text" value={oppTags} onChange={e => setOppTags(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Eligibility Criteria</label>
                <input type="text" value={oppElig} onChange={e => setOppElig(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Description</label>
                <textarea rows={4} value={oppDesc} onChange={e => setOppDesc(e.target.value)} className="w-full p-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none resize-none font-sans" />
              </div>

              <div className="grid grid-cols-3 gap-4 p-3 bg-slate-900/40 rounded-xl border border-white/5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={oppIsFeatured} onChange={e => setOppIsFeatured(e.target.checked)} className="w-4 h-4 rounded accent-amber-500" />
                  <span className="text-amber-400 font-bold flex items-center gap-1"><Star className="w-3 h-3" /> Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={oppIsTrending} onChange={e => setOppIsTrending(e.target.checked)} className="w-4 h-4 rounded accent-rose-500" />
                  <span className="text-rose-400 font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Trending</span>
                </label>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Schedule Publish Date</label>
                  <input type="date" value={oppPublishDate} onChange={e => setOppPublishDate(e.target.value)} className="px-2 py-1 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full py-3" disabled={submitLoading}>
                {submitLoading ? 'Publishing...' : 'Publish Opportunity'}
              </Button>
            </form>
          </GlassCard>
        )}

        {/* ADD CERTIFICATION FORM */}
        {activeSubTab === 'add_cert' && (
          <GlassCard className="border border-white/5 max-w-2xl">
            <h3 className="font-display font-bold text-base text-slate-200 mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-violet-400" /> Add Certification Course</h3>
            <form onSubmit={handleCreateCert} className="space-y-4 text-xs text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Course Title *</label>
                  <input type="text" required placeholder="e.g. Software Engineering Virtual Experience" value={certTitle} onChange={e => setCertTitle(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Company / Partner Name *</label>
                  <input type="text" required placeholder="e.g. JPMorgan Chase" value={certCompany} onChange={e => setCertCompany(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Category</label>
                  <select value={certCategory} onChange={e => setCertCategory(e.target.value)} className="px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Platform / Provider</label>
                  <input type="text" required value={certProvider} onChange={e => setCertProvider(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Company Logo URL</label>
                  <input type="url" value={certLogo} onChange={e => setCertLogo(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Difficulty Level</label>
                  <select value={certDifficulty} onChange={e => setCertDifficulty(e.target.value)} className="px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Completion Duration</label>
                  <input type="text" placeholder="e.g. 5-6 hours" value={certDuration} onChange={e => setCertDuration(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Course URL *</label>
                  <input type="url" required value={certCourseLink} onChange={e => setCertCourseLink(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Skills Learned (comma-separated)</label>
                  <input type="text" value={certSkills} onChange={e => setCertSkills(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 items-center">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={certIsFreeCertificate} onChange={e => setCertIsFreeCertificate(e.target.checked)} className="h-4 w-4 rounded accent-violet-650" />
                    <span>Free Cert</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={certIsVirtualExperience} onChange={e => setCertIsVirtualExperience(e.target.checked)} className="h-4 w-4 rounded accent-violet-650" />
                    <span>Virtual Exp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={certIsFeatured} onChange={e => setCertIsFeatured(e.target.checked)} className="h-4 w-4 rounded accent-violet-650" />
                    <span>Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-400 font-semibold">Course Description</label>
                <textarea rows={4} value={certDesc} onChange={e => setCertDesc(e.target.value)} className="w-full p-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none resize-none font-sans" />
              </div>

              <Button type="submit" variant="primary" className="w-full py-3" disabled={submitLoading}>
                {submitLoading ? 'Creating...' : 'Create Certification Course'}
              </Button>
            </form>
          </GlassCard>
        )}

        {/* SCHEDULE WORKSHOP FORM */}
        {activeSubTab === 'add_event' && (
          <GlassCard className="border border-white/5 max-w-2xl">
            <h3 className="font-display font-bold text-base text-slate-200 mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-violet-400" /> Schedule Event / Workshop</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Workshop Title *</label>
                  <input type="text" required value={evTitle} onChange={e => setEvTitle(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Guest Speaker</label>
                  <input type="text" value={evSpeaker} onChange={e => setEvSpeaker(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Event Date *</label>
                  <input type="date" required value={evDate} onChange={e => setEvDate(e.target.value)} className="w-full px-3 py-2 bg-[#080d19] border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Event Time *</label>
                  <input type="text" required value={evTime} onChange={e => setEvTime(e.target.value)} placeholder="e.g. 18:00 IST" className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Venue / Platform</label>
                  <input type="text" value={evVenue} onChange={e => setEvVenue(e.target.value)} placeholder="e.g. Zoom" className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Registration URL</label>
                  <input type="url" value={evRegLink} onChange={e => setEvRegLink(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-semibold">Tags (comma separated)</label>
                  <input type="text" value={evTags} onChange={e => setEvTags(e.target.value)} className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-400 font-semibold">Workshop Agenda</label>
                <textarea rows={4} value={evDesc} onChange={e => setEvDesc(e.target.value)} className="w-full p-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none resize-none font-sans" />
              </div>

              <Button type="submit" variant="primary" className="w-full py-3" disabled={submitLoading}>
                {submitLoading ? 'Scheduling...' : 'Schedule Workshop'}
              </Button>
            </form>
          </GlassCard>
        )}
      </div>

      {/* Editing Modal */}
      {editingOpp && (
        <EditOpportunityModal
          opp={editingOpp}
          onClose={() => setEditingOpp(null)}
          onSave={handleUpdateOpp}
        />
      )}
    </div>
  );
};

export default AdminPanel;
