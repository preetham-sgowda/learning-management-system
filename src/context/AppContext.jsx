import React, { createContext, useContext, useState } from 'react';
import { INITIAL_USER, COURSES_DATA, PRACTICE_PROBLEMS, NOTIFICATIONS_DATA } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState('landing'); // landing, dashboard, courses, practice, resume-ai, leaderboard, signin, signup
  const [courses, setCourses] = useState(COURSES_DATA);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [practiceProblems, setPracticeProblems] = useState(PRACTICE_PROBLEMS);
  const [activeProblem, setActiveProblem] = useState(PRACTICE_PROBLEMS[0]);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [unreadCount, setUnreadCount] = useState(2);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const login = (email, password) => {
    setIsAuthenticated(true);
    setUser({
      ...INITIAL_USER,
      email: email || INITIAL_USER.email,
    });
    setActiveTab('dashboard');
    showToast(`Welcome back, ${INITIAL_USER.name}!`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('landing');
    showToast('Logged out successfully', 'info');
  };

  const enrollCourse = (courseId) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, status: 'In Progress', progress: Math.max(c.progress, 5) };
      }
      return c;
    }));
    showToast('Enrolled in course successfully!', 'success');
  };

  const updateCourseProgress = (courseId, newProgress) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const isComp = newProgress >= 100;
        return {
          ...c,
          progress: newProgress,
          status: isComp ? 'Completed' : 'In Progress'
        };
      }
      return c;
    }));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      activeTab,
      setActiveTab,
      courses,
      selectedCourse,
      setSelectedCourse,
      enrollCourse,
      updateCourseProgress,
      practiceProblems,
      activeProblem,
      setActiveProblem,
      notifications,
      unreadCount,
      markAllNotificationsRead,
      login,
      logout,
      toast,
      showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
