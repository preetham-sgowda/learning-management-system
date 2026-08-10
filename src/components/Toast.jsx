import React from 'react';
import { useApp } from '../context/AppContext';

const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-600 text-white border-emerald-400',
    error: 'bg-rose-600 text-white border-rose-400',
    info: 'bg-cyan-600 text-white border-cyan-400',
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  return (
    <div className="fixed top-5 right-5 z-[100] animate-bounce-short">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border ${bgColors[toast.type] || bgColors.info} backdrop-blur-md transition-all`}>
        <span className="material-symbols-outlined text-[22px]">{icons[toast.type] || 'info'}</span>
        <span className="font-medium text-sm tracking-wide">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
