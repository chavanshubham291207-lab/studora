import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const API_BASE = '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile if token is present
  const loadUser = async () => {
    const token = localStorage.getItem('studora_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // Token might be invalid/expired
        localStorage.removeItem('studora_token');
        setUser(null);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('studora_token', data.token);
    await loadUser(); // load profile details
    return data.user;
  };

  // Register handler
  const register = async (name, email, password, role = 'student') => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    localStorage.setItem('studora_token', data.token);
    await loadUser();
    return data.user;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('studora_token');
    setUser(null);
  };

  // Toggle bookmark
  const toggleBookmark = async (itemId) => {
    if (!user) return;
    const token = localStorage.getItem('studora_token');
    try {
      const res = await fetch(`${API_BASE}/auth/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({
          ...prev,
          bookmarks: data.bookmarks
        }));
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // Update CGPA
  const updateCgpa = async (semesters, cgpa) => {
    if (!user) return;
    const token = localStorage.getItem('studora_token');
    try {
      const res = await fetch(`${API_BASE}/auth/cgpa`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ semesters, cgpa })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({
          ...prev,
          cgpa: data.cgpa
        }));
      }
    } catch (err) {
      console.error('Error updating CGPA:', err);
    }
  };

  // Update Attendance
  const updateAttendance = async (attendance) => {
    if (!user) return;
    const token = localStorage.getItem('studora_token');
    try {
      const res = await fetch(`${API_BASE}/auth/attendance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ attendance })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({
          ...prev,
          attendance: data.attendance
        }));
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
    }
  };

  // Update Timetable
  const updateTimetable = async (timetable) => {
    if (!user) return;
    const token = localStorage.getItem('studora_token');
    try {
      const res = await fetch(`${API_BASE}/auth/timetable`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ timetable })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({
          ...prev,
          timetable: data.timetable
        }));
      }
    } catch (err) {
      console.error('Error updating timetable:', err);
    }
  };

  // Update Profile & Achievements
  const updateProfile = async (profileData) => {
    if (!user) return;
    const token = localStorage.getItem('studora_token');
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      toggleBookmark,
      updateCgpa,
      updateAttendance,
      updateTimetable,
      updateProfile,
      reloadProfile: loadUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
