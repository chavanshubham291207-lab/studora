import React, { useState } from 'react';
import { FileText, Plus, Trash2, Printer, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import PDFExporter from '../components/PDFExporter';

const ResumeBuilder = () => {
  const [personal, setPersonal] = useState({
    name: 'Aarav Roy',
    email: 'aarav.roy@university.edu',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    github: 'github.com/aaravroy',
    linkedin: 'linkedin.com/in/aaravroy'
  });

  const [education, setEducation] = useState([
    { school: 'Indian Institute of Technology, Bombay', degree: 'B.Tech in Computer Science', gpa: '8.8/10', dates: '2023 - 2027' }
  ]);

  const [experience, setExperience] = useState([
    { company: 'Studora Technologies', role: 'Software Engineer Intern', dates: 'May 2025 - July 2025', description: 'Engineered responsive MERN stack student portal. Deployed AWS cloud pipelines, lowering page load latency by 20%.' }
  ]);

  const [projects, setProjects] = useState([
    { name: 'Studora All-in-One Platform', stack: 'React, Express, MongoDB, Tailwind', description: 'Developed academic planner platform. Integrated Google Gemini LLMs to summarize textbooks and automate GPA tracking.' }
  ]);

  const [skills, setSkills] = useState('React, Node.js, Express, JavaScript, MongoDB, Python, Git, Docker, RESTful APIs');

  // AI suggestions states
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Helper to append education
  const addEducation = () => {
    setEducation([...education, { school: '', degree: '', gpa: '', dates: '' }]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, idx) => idx !== index));
  };

  const handleEducationChange = (index, field, val) => {
    const updated = [...education];
    updated[index][field] = val;
    setEducation(updated);
  };

  // Helper to append experience
  const addExperience = () => {
    setExperience([...experience, { company: '', role: '', dates: '', description: '' }]);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, idx) => idx !== index));
  };

  const handleExperienceChange = (index, field, val) => {
    const updated = [...experience];
    updated[index][field] = val;
    setExperience(updated);
  };

  // Helper to append project
  const addProject = () => {
    setProjects([...projects, { name: '', stack: '', description: '' }]);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, idx) => idx !== index));
  };

  const handleProjectChange = (index, field, val) => {
    const updated = [...projects];
    updated[index][field] = val;
    setProjects(updated);
  };

  const handleAiAudit = async () => {
    setLoadingAi(true);
    // Concatenate resume details to feed to AI
    const contentText = `
      Name: ${personal.name}
      Email: ${personal.email}
      Skills: ${skills}
      Education: ${education.map(e => `${e.school} - ${e.degree} - ${e.gpa}`).join(' | ')}
      Experience: ${experience.map(exp => `${exp.company} - ${exp.role} - ${exp.description}`).join(' | ')}
      Projects: ${projects.map(p => `${p.name} - ${p.stack} - ${p.description}`).join(' | ')}
    `;

    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/ai/resume-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resumeText: contentText })
      });

      if (res.ok) {
        const data = await res.json();
        setAiSuggestions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4 no-print">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-violet-400" /> ATS Resume Builder
          </h1>
          <p className="text-sm text-slate-400">Design professional, resume-scanner-ready portfolios. Run AI audits to optimize keyword matching scores.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleAiAudit} loading={loadingAi}>
            <Sparkles className="w-4 h-4" /> AI Check
          </Button>
          <PDFExporter 
            personal={personal}
            education={education}
            experience={experience}
            projects={projects}
            skills={skills}
          />
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4" /> Print Page
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* INPUT FIELDS COLUMN */}
        <div className="space-y-6 no-print">
          {/* AI Feedback Alerts */}
          {aiSuggestions && (
            <GlassCard className="border border-violet-500/20 bg-violet-950/10">
              <h3 className="font-display font-bold text-sm text-slate-200 flex justify-between items-center mb-3">
                <span className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-violet-400" /> AI Resume Audit
                </span>
                <span className="px-3 py-1 bg-violet-600 text-white rounded-full font-extrabold text-xs">
                  Score: {aiSuggestions.score}/100
                </span>
              </h3>

              {/* Warnings list */}
              <div className="space-y-3 mt-4 text-xs">
                {aiSuggestions.formatIssues.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-300 flex items-center gap-1.5 mb-1 text-amber-400">
                      <ShieldAlert className="w-4 h-4" /> Structure Warnings
                    </h4>
                    <ul className="list-disc list-inside pl-2 text-slate-400 space-y-1">
                      {aiSuggestions.formatIssues.map((issue, idx) => <li key={idx}>{issue}</li>)}
                    </ul>
                  </div>
                )}

                {aiSuggestions.impactBulletPoints.length > 0 && (
                  <div className="pt-2">
                    <h4 className="font-bold text-slate-300 flex items-center gap-1.5 mb-1 text-violet-400">
                      <Sparkles className="w-4 h-4" /> Bullet Point Rewrites
                    </h4>
                    <ul className="list-disc list-inside pl-2 text-slate-400 space-y-1">
                      {aiSuggestions.impactBulletPoints.map((bullet, idx) => <li key={idx}>{bullet}</li>)}
                    </ul>
                  </div>
                )}

                {aiSuggestions.missingKeywords.length > 0 && (
                  <div className="pt-2">
                    <h4 className="font-bold text-slate-300 mb-1.5">Missing Core Keywords</h4>
                    <div className="flex flex-wrap gap-1.5 pl-2">
                      {aiSuggestions.missingKeywords.map(word => (
                        <span key={word} className="px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-[10px] text-slate-400 font-medium">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Personal Info */}
          <GlassCard className="border border-white/5 flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-slate-200">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={personal.name} 
                  onChange={e => setPersonal({...personal, name: e.target.value})}
                  className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={personal.email} 
                  onChange={e => setPersonal({...personal, email: e.target.value})}
                  className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Phone Number</label>
                <input 
                  type="text" 
                  value={personal.phone} 
                  onChange={e => setPersonal({...personal, phone: e.target.value})}
                  className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Location</label>
                <input 
                  type="text" 
                  value={personal.location} 
                  onChange={e => setPersonal({...personal, location: e.target.value})}
                  className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">GitHub URL</label>
                <input 
                  type="text" 
                  value={personal.github} 
                  onChange={e => setPersonal({...personal, github: e.target.value})}
                  className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">LinkedIn URL</label>
                <input 
                  type="text" 
                  value={personal.linkedin} 
                  onChange={e => setPersonal({...personal, linkedin: e.target.value})}
                  className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </GlassCard>

          {/* Education list */}
          <GlassCard className="border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-sm text-slate-200">Education Details</h3>
              <button onClick={addEducation} className="text-violet-400 hover:text-violet-300 font-bold text-xs flex items-center gap-1 cursor-pointer">
                <Plus className="w-4 h-4" /> Add School
              </button>
            </div>
            
            {education.map((edu, idx) => (
              <div key={idx} className="border-t border-white/5 pt-4 text-xs space-y-3 relative">
                {idx > 0 && (
                  <button onClick={() => removeEducation(idx)} className="absolute right-0 top-3 text-slate-500 hover:text-rose-400 cursor-pointer">
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400">School / University</label>
                    <input 
                      type="text" 
                      value={edu.school} 
                      onChange={e => handleEducationChange(idx, 'school', e.target.value)}
                      className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400">Degree & Field</label>
                    <input 
                      type="text" 
                      value={edu.degree} 
                      onChange={e => handleEducationChange(idx, 'degree', e.target.value)}
                      className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400">GPA / Percentage</label>
                    <input 
                      type="text" 
                      value={edu.gpa} 
                      onChange={e => handleEducationChange(idx, 'gpa', e.target.value)}
                      className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400">Graduation Timeline</label>
                    <input 
                      type="text" 
                      value={edu.dates} 
                      onChange={e => handleEducationChange(idx, 'dates', e.target.value)}
                      className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </GlassCard>

          {/* Work Experience */}
          <GlassCard className="border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-sm text-slate-200">Work History</h3>
              <button onClick={addExperience} className="text-violet-400 hover:text-violet-300 font-bold text-xs flex items-center gap-1 cursor-pointer">
                <Plus className="w-4 h-4" /> Add Job
              </button>
            </div>
            
            {experience.map((exp, idx) => (
              <div key={idx} className="border-t border-white/5 pt-4 text-xs space-y-3 relative">
                {idx > 0 && (
                  <button onClick={() => removeExperience(idx)} className="absolute right-0 top-3 text-slate-500 hover:text-rose-400 cursor-pointer">
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400 font-semibold">Company Name</label>
                    <input 
                      type="text" 
                      value={exp.company} 
                      onChange={e => handleExperienceChange(idx, 'company', e.target.value)}
                      className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400 font-semibold">Job Title</label>
                    <input 
                      type="text" 
                      value={exp.role} 
                      onChange={e => handleExperienceChange(idx, 'role', e.target.value)}
                      className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left col-span-2">
                    <label className="text-[10px] text-slate-400 font-semibold">Employment Period</label>
                    <input 
                      type="text" 
                      value={exp.dates} 
                      onChange={e => handleExperienceChange(idx, 'dates', e.target.value)}
                      className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left col-span-2">
                    <label className="text-[10px] text-slate-400 font-semibold">Roles & Accomplishments</label>
                    <textarea 
                      rows={3} 
                      value={exp.description} 
                      onChange={e => handleExperienceChange(idx, 'description', e.target.value)}
                      className="p-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-250 text-xs focus:outline-none resize-none font-sans"
                    />
                  </div>
                </div>
              </div>
            ))}
          </GlassCard>

          {/* Projects */}
          <GlassCard className="border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-sm text-slate-200 font-display">Academic Projects</h3>
              <button onClick={addProject} className="text-violet-400 hover:text-violet-300 font-bold text-xs flex items-center gap-1 cursor-pointer">
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
            
            {projects.map((proj, idx) => (
              <div key={idx} className="border-t border-white/5 pt-4 text-xs space-y-3 relative">
                {idx > 0 && (
                  <button onClick={() => removeProject(idx)} className="absolute right-0 top-3 text-slate-500 hover:text-rose-400 cursor-pointer">
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400">Project Name</label>
                    <input 
                      type="text" 
                      value={proj.name} 
                      onChange={e => handleProjectChange(idx, 'name', e.target.value)}
                      className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-400">Technologies / Stack</label>
                    <input 
                      type="text" 
                      value={proj.stack} 
                      onChange={e => handleProjectChange(idx, 'stack', e.target.value)}
                      className="px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left col-span-2">
                    <label className="text-[10px] text-slate-400 font-semibold">Description / Features</label>
                    <textarea 
                      rows={3} 
                      value={proj.description} 
                      onChange={e => handleProjectChange(idx, 'description', e.target.value)}
                      className="p-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-250 text-xs focus:outline-none resize-none font-sans"
                    />
                  </div>
                </div>
              </div>
            ))}
          </GlassCard>

          {/* Skills */}
          <GlassCard className="border border-white/5 flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-slate-200">Skills (Comma-separated)</h3>
            <div className="flex flex-col gap-1 text-left text-xs">
              <textarea 
                rows={3} 
                value={skills} 
                onChange={e => setSkills(e.target.value)}
                placeholder="React, Java, Python, SQL..."
                className="p-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-250 text-xs focus:outline-none resize-none font-sans"
              />
            </div>
          </GlassCard>
        </div>

        {/* REAL-TIME PREVIEW PANEL (ATS COMPLIANT DESIGN) */}
        <div className="sticky top-24 bg-white text-black p-8 rounded-2xl print-container shadow-xl overflow-y-auto max-h-[85vh] text-left border border-slate-200 leading-normal">
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <h2 className="font-display font-extrabold text-2xl tracking-wide uppercase text-slate-900">{personal.name || 'Your Name'}</h2>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-700 mt-2 font-medium">
              <span>{personal.phone}</span>
              <span>•</span>
              <span>{personal.email}</span>
              <span>•</span>
              <span>{personal.location}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-indigo-700 mt-1 font-semibold">
              {personal.linkedin && <span>LinkedIn: {personal.linkedin}</span>}
              {personal.github && <span>GitHub: {personal.github}</span>}
            </div>
          </div>

          {/* Education */}
          <div className="mt-5">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">Education</h3>
            <div className="mt-2 space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs text-slate-900">
                  <div>
                    <p className="font-bold text-slate-950">{edu.school || 'University Name'}</p>
                    <p className="italic text-slate-700 mt-0.5">{edu.degree || 'Degree Course'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{edu.dates || 'Timeline'}</p>
                    <p className="text-[11px] text-slate-700 mt-0.5">GPA: {edu.gpa || 'Grade'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mt-5">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">Experience</h3>
            <div className="mt-2 space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="text-xs text-slate-900">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-950">{exp.company || 'Company Name'}</span>
                      <span className="text-slate-700"> — {exp.role || 'Job Role'}</span>
                    </div>
                    <span className="font-bold text-slate-800 shrink-0">{exp.dates || 'Timeline'}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1.5 whitespace-pre-line leading-relaxed pl-1">
                    {exp.description || 'Roles & accomplishments...'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="mt-5">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">Projects</h3>
            <div className="mt-2 space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="text-xs text-slate-900">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-950">{proj.name || 'Project Name'}</span>
                      <span className="text-indigo-800 font-semibold"> ({proj.stack || 'Stack'})</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed pl-1">
                    {proj.description || 'Project features...'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-5">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">Skills</h3>
            <div className="mt-2 text-xs text-slate-900">
              <p className="leading-relaxed">
                <span className="font-bold text-slate-850">Technologies:</span> {skills || 'JavaScript, React...'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeBuilder;
