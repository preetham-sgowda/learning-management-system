import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { NOTIFICATIONS_DATA } from '../data/mockData';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('landing');
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [unreadCount, setUnreadCount] = useState(2);
  const [toast, setToast] = useState(null);

// UI Context manages notifications, toast state, mobile menu, and theme

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('skillforge_theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('skillforge_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(() => ({
    activeTab,
    setActiveTab,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    markAllNotificationsRead,
    toast,
    setToast,
    showToast,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    theme,
    setTheme,
    toggleTheme,
  }), [
    activeTab,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    toast,
    showToast,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    theme,
    toggleTheme,
  ]);

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export default UIContext;
