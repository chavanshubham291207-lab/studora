import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ReminderProvider } from './context/ReminderContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Hackathons from './pages/Hackathons';
import Scholarships from './pages/Scholarships';
import Jobs from './pages/Jobs';
import StudyResources from './pages/StudyResources';
import CodingContests from './pages/CodingContests';
import Calendar from './pages/Calendar';
import AIAssistant from './pages/AIAssistant';
import ResumeBuilder from './pages/ResumeBuilder';
import Community from './pages/Community';
import CGPACalculator from './pages/CGPACalculator';
import AttendanceTracker from './pages/AttendanceTracker';
import Timetable from './pages/Timetable';
import ProfileAnalyzers from './pages/ProfileAnalyzers';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import FreeCertifications from './pages/FreeCertifications';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AIAssistantModal from './components/AIAssistantModal';

// Auth Guard Wrapper
const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <span className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Workspace Layout Wrapper
const WorkspaceLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white font-sans transition-all duration-300">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Floating Quick AI Doubt Assistant */}
      <AIAssistantModal />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Scrollable Dashboard view */}
        <main className="flex-1 p-6 mt-16 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/resources" element={<StudyResources />} />
            <Route path="/contests" element={<CodingContests />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/community" element={<Community />} />
            <Route path="/cgpa-calculator" element={<CGPACalculator />} />
            <Route path="/attendance" element={<AttendanceTracker />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/analyzers" element={<ProfileAnalyzers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/certifications" element={<FreeCertifications />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ReminderProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated Workspace Wrapper */}
              <Route 
                path="/*" 
                element={
                  <AuthGuard>
                    <WorkspaceLayout />
                  </AuthGuard>
                } 
              />
            </Routes>
          </BrowserRouter>
        </ReminderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
