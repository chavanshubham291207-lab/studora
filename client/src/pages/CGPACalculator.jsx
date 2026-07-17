import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Save, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const CGPACalculator = () => {
  const { user, updateCgpa } = useAuth();
  
  // Semester list: [{ semester: 1, sgpa: 8.5, courses: [{ name: 'Math', grade: 9, credits: 4 }] }]
  const [semesters, setSemesters] = useState(() => {
    if (user?.cgpa?.semesters && user.cgpa.semesters.length > 0) {
      return user.cgpa.semesters;
    }
    return [
      {
        semester: 1,
        sgpa: 0,
        courses: [{ name: 'Engineering Physics', grade: 9, credits: 4 }]
      }
    ];
  });

  const [saving, setSaving] = useState(false);

  const calculateSgpa = (courses) => {
    const totalCredits = courses.reduce((acc, c) => acc + Number(c.credits), 0);
    if (totalCredits === 0) return 0;
    const totalPoints = courses.reduce((acc, c) => acc + (Number(c.grade) * Number(c.credits)), 0);
    return Math.round((totalPoints / totalCredits) * 100) / 100;
  };

  const calculateCgpa = (semsList) => {
    let totalScore = 0;
    let totalCredits = 0;
    
    semsList.forEach(sem => {
      sem.courses.forEach(c => {
        totalScore += (Number(c.grade) * Number(c.credits));
        totalCredits += Number(c.credits);
      });
    });

    if (totalCredits === 0) return 0;
    return Math.round((totalScore / totalCredits) * 100) / 100;
  };

  const handleAddSemester = () => {
    const nextSemNum = semesters.length + 1;
    setSemesters([
      ...semesters,
      {
        semester: nextSemNum,
        sgpa: 0,
        courses: [{ name: '', grade: 8, credits: 3 }]
      }
    ]);
  };

  const handleRemoveSemester = (semIdx) => {
    const updated = semesters.filter((_, idx) => idx !== semIdx).map((sem, i) => ({
      ...sem,
      semester: i + 1 // Re-index semesters sequentially
    }));
    setSemesters(updated);
  };

  const handleAddCourse = (semIdx) => {
    const updated = [...semesters];
    updated[semIdx].courses.push({ name: '', grade: 8, credits: 3 });
    updated[semIdx].sgpa = calculateSgpa(updated[semIdx].courses);
    setSemesters(updated);
  };

  const handleRemoveCourse = (semIdx, courseIdx) => {
    const updated = [...semesters];
    updated[semIdx].courses = updated[semIdx].courses.filter((_, idx) => idx !== courseIdx);
    updated[semIdx].sgpa = calculateSgpa(updated[semIdx].courses);
    setSemesters(updated);
  };

  const handleCourseChange = (semIdx, courseIdx, field, val) => {
    const updated = [...semesters];
    updated[semIdx].courses[courseIdx][field] = val;
    updated[semIdx].sgpa = calculateSgpa(updated[semIdx].courses);
    setSemesters(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const finalCgpaVal = calculateCgpa(semesters);
    await updateCgpa(semesters, finalCgpaVal);
    setSaving(false);
    alert('CGPA metrics saved successfully!');
  };

  const totalCgpaVal = calculateCgpa(semesters);

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100 font-display">CGPA & SGPA Calculator</h1>
          <p className="text-sm text-slate-400 font-display">Manage courses by semester, calculate target GPAs, and synchronize stats to your dashboard.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleAddSemester}>
            <Plus className="w-4 h-4" /> Add Semester
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" /> Save Metrics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* GPA Summary panel */}
        <div className="lg:col-span-1">
          <GlassCard className="border border-white/5 bg-gradient-to-br from-[#111e3b]/40 to-[#0b1427]/40 flex flex-col gap-4 text-center">
            <div className="p-3 bg-violet-650/20 text-violet-400 border border-violet-800/20 w-fit mx-auto rounded-2xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Calculated CGPA</p>
              <h2 className="text-4xl font-display font-extrabold text-slate-100 mt-1">{totalCgpaVal || '0.00'}</h2>
              <span className="text-[10px] text-slate-400 mt-2 block">Weighted by course credit hours</span>
            </div>
          </GlassCard>
        </div>

        {/* Semesters list */}
        <div className="lg:col-span-2 space-y-6">
          {semesters.map((sem, semIdx) => (
            <GlassCard key={semIdx} className="border border-white/5 flex flex-col gap-4 relative">
              {semIdx > 0 && (
                <button
                  onClick={() => handleRemoveSemester(semIdx)}
                  className="absolute right-6 top-6 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                  title="Remove Semester"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              )}

              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-200">Semester {sem.semester}</h3>
                  <p className="text-[10px] text-slate-400">SGPA: <span className="font-bold text-violet-400">{sem.sgpa || '0.00'}</span></p>
                </div>
                <button 
                  onClick={() => handleAddCourse(semIdx)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/40 border border-white/10 hover:border-violet-500/20 text-slate-350 hover:text-violet-400 text-xs font-semibold font-display flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Course
                </button>
              </div>

              {/* Course list table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400">
                      <th className="py-2 pr-4 font-semibold uppercase text-[10px]">Course Name</th>
                      <th className="py-2 pr-4 font-semibold uppercase text-[10px] w-28">Grade Points (0-10)</th>
                      <th className="py-2 pr-4 font-semibold uppercase text-[10px] w-24">Credits</th>
                      <th className="py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses.map((course, courseIdx) => (
                      <tr key={courseIdx} className="border-b border-white/5">
                        <td className="py-2.5 pr-4">
                          <input 
                            type="text" 
                            placeholder="e.g. Discrete Maths" 
                            value={course.name}
                            onChange={e => handleCourseChange(semIdx, courseIdx, 'name', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-950/40 border border-white/10 rounded-lg text-xs text-slate-200 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 pr-4">
                          <input 
                            type="number" 
                            min="0"
                            max="10"
                            value={course.grade}
                            onChange={e => handleCourseChange(semIdx, courseIdx, 'grade', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-950/40 border border-white/10 rounded-lg text-xs text-slate-200 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 pr-4">
                          <input 
                            type="number" 
                            min="1"
                            max="6"
                            value={course.credits}
                            onChange={e => handleCourseChange(semIdx, courseIdx, 'credits', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-950/40 border border-white/10 rounded-lg text-xs text-slate-200 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 text-right">
                          {sem.courses.length > 1 && (
                            <button
                              onClick={() => handleRemoveCourse(semIdx, courseIdx)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CGPACalculator;
