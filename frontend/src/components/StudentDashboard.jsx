import React, { useState, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { useUI } from '../context/UIContext';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Sparkles,
  Flame,
  Play,
  BookOpen,
  Code2,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  Target,
  TrendingUp,
  Award,
  Zap,
  Star,
  Medal,
  Shield,
  Check,
  X,
  Activity,
  Brain,
  Timer
} from 'lucide-react';

import { profileApi, streakApi } from '../services/api';

// Counting animation component
const CountUp = memo(({ value, duration = 1.5 }) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [motionValue, value, duration]);

  return <motion.span>{rounded}</motion.span>;
});

CountUp.displayName = 'CountUp';

// Circular Progress Component
const CircularProgress = memo(({ percentage, size = 80, strokeWidth = 8, children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#5B4E80"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
});

CircularProgress.displayName = 'CircularProgress';

const StudentDashboard = memo(() => {
  const { user } = useAuth();
  const { courses, setSelectedCourse } = useCourse();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const [liveStreak, setLiveStreak] = useState(null);
  const [liveProfile, setLiveProfile] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const streak = await streakApi.getMyStreak();
        if (streak) setLiveStreak(streak);
      } catch (e) {
        console.log('Streak API offline or error:', e.message);
      }

      try {
        const profile = await profileApi.getMyProfile();
        if (profile) setLiveProfile(profile);
      } catch (e) {
        console.log('Profile API offline or error:', e.message);
      }
    };
    fetchDashboardData();
  }, []);

  // Quick stats computed with live profile data when available
  const overallAcc = liveProfile?.overallAccuracyPercent
    ? Math.round(liveProfile.overallAccuracyPercent)
    : user?.codingAccuracy || 88;

  const quickStats = [
    { icon: Code2, value: user?.completedProblems || 84, label: 'Problems Solved', trend: '+12 this week', color: 'text-[#5B4E80]', bgColor: 'bg-[#F0EBFA]' },
    { icon: Target, value: 88, label: 'ATS Score', trend: '+5 this week', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { icon: Trophy, value: user?.rank || 14, label: 'Current Rank', trend: 'Top 5%', color: 'text-amber-500', bgColor: 'bg-amber-50' },
    { icon: TrendingUp, value: overallAcc, label: 'Accuracy', trend: '+3% this week', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  ];

  const xpProgress = { current: 2450, next: 3000, level: 12 };
  const dailyGoals = [
    { id: 1, text: 'Solve 2 DSA Problems', completed: true },
    { id: 2, text: 'Complete Resume Audit', completed: true },
    { id: 3, text: 'Finish DBMS Module', completed: false },
  ];

  const weeklyActivity = [
    { day: 'Mon', problems: 4 },
    { day: 'Tue', problems: 6 },
    { day: 'Wed', problems: 3 },
    { day: 'Thu', problems: 8 },
    { day: 'Fri', problems: 5 },
    { day: 'Sat', problems: 7 },
    { day: 'Sun', problems: 2 },
  ];

  const recentActivities = [
    { icon: CheckCircle2, title: 'Solved Binary Search', time: '2 hours ago', color: 'text-emerald-600' },
    { icon: Award, title: 'Completed Resume Audit', time: '5 hours ago', color: 'text-[#5B4E80]' },
    { icon: BookOpen, title: 'Finished React Module', time: '1 day ago', color: 'text-blue-600' },
  ];

  const achievements = [
    { icon: Star, title: '100 Problems Solved', desc: 'Milestone achievement', color: 'from-amber-400 to-amber-600' },
    { icon: Flame, title: '12-Day Streak', desc: 'Consistency champion', color: 'from-orange-400 to-red-500' },
    { icon: Medal, title: 'Top 5% Rank', desc: 'Elite performer', color: 'from-purple-400 to-purple-600' },
    { icon: Shield, title: 'ATS Score Above 85', desc: 'Resume ready', color: 'from-emerald-400 to-emerald-600' },
  ];

  // Heatmap rows data matching Reference Image 1 grid
  const daysMon = [0,1,3,4,3,4,3,2,1,2,3,4,2,3,4,2,3,1,2,1];
  const daysWed = [1,2,3,0,2,0,3,4,3,4,3,2,1,2,3,4,2,3,2,1];
  const daysFri = [0,3,4,3,4,1,3,4,3,2,1,2,1,1,0,4,1,0,0,0];

  return (
    <div className="space-y-6 animate-fade-in-up pb-12 font-sans">
      
      {/* 
        ========================================================================
        1. HERO SPOTLIGHT WELCOME CARD (MOBILE & DESKTOP ENHANCED)
        ========================================================================
      */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1F1B2D] via-[#28213B] to-[#5B4E80] p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-mono font-semibold border border-white/15 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{user.streak || 12}-Day Active Streak 🔥</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome back, <span className="text-purple-200">{user.name}!</span>
            </h1>

            <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed font-normal">
              You're making great progress. Continue your Data Structures & System Design path today.
            </p>

            {/* Responsive Touch Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
              <motion.button
                onClick={() => navigate('/courses')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6E56CF] to-[#5B4E80] hover:from-[#5B4E80] hover:to-[#4C4070] text-white text-xs font-bold shadow-md cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Learning Path</span>
              </motion.button>
              <motion.button
                onClick={() => navigate('/practice')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/10 text-white text-xs font-bold backdrop-blur-xs cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <Code2 className="w-4 h-4" />
                <span>Open Practice Sandbox</span>
              </motion.button>
            </div>
          </div>

          {/* Glass Trophy Illustration */}
          <div className="w-full md:w-44 h-24 sm:h-28 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center p-3 backdrop-blur-md shrink-0 shadow-inner">
            <div className="relative flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center mb-1">
                <Trophy className="w-6 h-6 text-amber-300" />
              </div>
              <span className="font-mono text-[10px] text-purple-200 font-bold uppercase tracking-wider">Top 5% Rank</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        2. QUICK STATS SECTION
        ========================================================================
      */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-[#EAEAEA] dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {stat.trend}
              </span>
            </div>
            <div className="font-display font-black text-2xl text-[#1F1B2D] dark:text-slate-100 mb-1">
              <CountUp value={stat.value} duration={1.2} />
            </div>
            <div className="text-[10px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 
        ========================================================================
        3. MIDDLE ROW: XP PROGRESS, DAILY GOALS, HEATMAP & AI SKILL INSIGHT
        ========================================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* XP & Level Progress Card (Col 3) */}
        <motion.div
          className="lg:col-span-3 bg-gradient-to-br from-[#5B4E80] to-[#6E56CF] rounded-3xl p-5 text-white shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Level</div>
              <div className="font-display font-black text-3xl">{xpProgress.level}</div>
            </div>
            <Zap className="w-8 h-8 text-amber-300" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-purple-200">{xpProgress.current} XP</span>
              <span className="text-purple-200">{xpProgress.next} XP</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(xpProgress.current / xpProgress.next) * 100}%` }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="text-[10px] text-purple-200 text-center">
              {xpProgress.next - xpProgress.current} XP to next level
            </div>
          </div>
        </motion.div>

        {/* Daily Goals Card (Col 3) */}
        <motion.div
          className="lg:col-span-3 bg-white dark:bg-slate-900 border border-[#EAEAEA] dark:border-slate-800 rounded-3xl p-5 shadow-xs"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-sm text-[#1F1B2D] dark:text-slate-100">Daily Goals</h4>
            <Target className="w-4 h-4 text-[#5B4E80]" />
          </div>
          <div className="flex items-center gap-4">
            <CircularProgress percentage={67} size={70} strokeWidth={6}>
              <span className="font-display font-black text-sm text-[#1F1B2D] dark:text-slate-100">67%</span>
            </CircularProgress>
            <div className="flex-1 space-y-2">
              {dailyGoals.map((goal) => (
                <div key={goal.id} className="flex items-center gap-2 text-xs">
                  {goal.completed ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-[#9CA3AF]" />
                  )}
                  <span className={goal.completed ? 'text-[#1F1B2D] dark:text-slate-100 line-through' : 'text-[#6B7280] dark:text-slate-400'}>
                    {goal.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 30-Day Activity & Submissions (Col 6) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-[#EAEAEA] dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#1F1B2D] dark:text-slate-100">
                  30-Day Activity & Submissions
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400">
                  Consistent daily coding builds placement velocity.
                </p>
              </div>

              {/* Heatmap Legend */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B7280] dark:text-slate-400">
                <span>LESS</span>
                <span className="w-2.5 h-2.5 rounded-xs bg-[#EAE5F5] dark:bg-purple-950/60" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#C4B5FD] dark:bg-purple-800/60" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#9333EA] dark:bg-purple-600" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#6B5B95] dark:bg-purple-500" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#4C1D95] dark:bg-purple-400" />
                <span>MORE</span>
              </div>
            </div>

            {/* Grid with Mon, Wed, Fri Labels */}
            <div className="mt-4 flex gap-3 items-center">
              <div className="flex flex-col justify-between h-14 text-[10px] font-semibold text-[#9CA3AF] dark:text-slate-500">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              <div className="flex-1 space-y-1.5 overflow-x-auto pb-1 scrollbar-none">
                <div className="flex gap-1.5">
                  {daysMon.map((lvl, idx) => (
                    <div key={idx} className={`heatmap-cell heatmap-${lvl}`} title={`Mon Activity: Level ${lvl}`} />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {daysWed.map((lvl, idx) => (
                    <div key={idx} className={`heatmap-cell heatmap-${lvl}`} title={`Wed Activity: Level ${lvl}`} />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {daysFri.map((lvl, idx) => (
                    <div key={idx} className={`heatmap-cell heatmap-${lvl}`} title={`Fri Activity: Level ${lvl}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        4. WEEKLY ACTIVITY CHART & RECENT ACTIVITY
        ========================================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Weekly Coding Activity Chart (Col 8) */}
        <motion.div
          className="lg:col-span-8 bg-white dark:bg-slate-900 border border-[#EAEAEA] dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-[#1F1B2D] dark:text-slate-100">
                Weekly Coding Activity
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400">
                Problems solved this week
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-slate-400">
              <Activity className="w-4 h-4" />
              <span>35 Total</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F1B2D',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="problems" radius={[4, 4, 0, 0]}>
                {weeklyActivity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 3 ? '#5B4E80' : '#C4B5FD'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity Timeline (Col 4) */}
        <motion.div
          className="lg:col-span-4 bg-white dark:bg-slate-900 border border-[#EAEAEA] dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm text-[#1F1B2D] dark:text-slate-100">Recent Activity</h3>
            <Clock className="w-4 h-4 text-[#5B4E80]" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${activity.color === 'text-emerald-600' ? 'bg-emerald-50' : activity.color === 'text-[#5B4E80]' ? 'bg-[#F0EBFA]' : 'bg-blue-50'} ${activity.color} flex items-center justify-center shrink-0`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-[#1F1B2D] dark:text-slate-100">{activity.title}</h4>
                  <p className="text-[10px] text-[#6B7280] dark:text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 
        ========================================================================
        5. ACHIEVEMENTS SECTION
        ========================================================================
      */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-base text-[#1F1B2D] dark:text-slate-100">Achievements</h3>
          <Award className="w-5 h-5 text-[#5B4E80]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-br from-white to-[#F9FAFC] dark:from-slate-900 dark:to-slate-800 border border-[#EAEAEA] dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow group"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <achievement.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-display font-bold text-xs text-[#1F1B2D] dark:text-slate-100 mb-1">{achievement.title}</h4>
              <p className="text-[10px] text-[#6B7280] dark:text-slate-400">{achievement.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 
        ========================================================================
        6. BOTTOM ROW: ENROLLED LEARNING MODULES & AI RECOMMENDATION
        ========================================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Enrolled Learning Modules (Col 8) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-[#EAEAEA] dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors duration-300">
          <div className="flex justify-between items-center pb-2 border-b border-[#F3F4F6] dark:border-slate-800">
            <h3 className="font-display font-bold text-base text-[#1F1B2D] dark:text-slate-100">
              Enrolled Learning Paths
            </h3>
            <button
              onClick={() => navigate('/courses')}
              className="text-[11px] font-bold text-[#5B4E80] dark:text-purple-400 hover:underline tracking-wider uppercase cursor-pointer"
            >
              VIEW ALL
            </button>
          </div>

          <div className="space-y-3">
            {[
              { id: 'dsa-mastery', title: 'Data Structures & Algorithms Mastery', desc: 'Trees, Graphs, and Dynamic Programming', progress: 72, color: 'bg-[#3B82F6]' },
              { id: 'dbms-internals', title: 'Database Management Systems & SQL Scaling', desc: 'SQL, Indexing, and Query Optimization', progress: 40, color: 'bg-[#10B981]' },
              { id: 'system-design', title: 'System Design for High Scale Applications', desc: 'Microservices, Caching, Load Balancing', progress: 15, color: 'bg-[#9333EA]' },
            ].map((mod, i) => (
              <motion.div
                key={i}
                onClick={() => navigate(`/courses/${mod.id}`)}
                className="p-4 rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-[#5B4E80] dark:hover:border-purple-500 cursor-pointer space-y-3"
                whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(91, 78, 128, 0.15)' }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F0EBFA] dark:bg-purple-950/60 text-[#5B4E80] dark:text-purple-300 flex items-center justify-center font-bold shrink-0">
                      <Layers className="w-4 h-4 text-[#5B4E80] dark:text-purple-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1F1B2D] dark:text-slate-100 hover:text-[#5B4E80] dark:hover:text-purple-300 transition-colors">{mod.title}</h4>
                      <p className="text-[11px] text-[#6B7280] dark:text-slate-400">{mod.desc}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#5B4E80] dark:text-purple-400 shrink-0 ml-2">{mod.progress}%</span>
                </div>

                <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${mod.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.progress}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Recommendation Card (Col 4) */}
        <motion.div
          className="lg:col-span-4 bg-gradient-to-br from-[#F4F0FA] to-white dark:from-slate-900/80 dark:to-slate-900 border border-[#EAE5F5] dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B4E80] to-[#6E56CF] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[#1F1B2D] dark:text-slate-100">AI Recommendation</h4>
              <p className="text-[10px] text-[#6B7280] dark:text-slate-400">Personalized for you</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B7280] dark:text-slate-400">Topic</span>
              <span className="font-bold text-[#1F1B2D] dark:text-slate-100">Dynamic Programming</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B7280] dark:text-slate-400">Difficulty</span>
              <span className="font-bold text-amber-600">Medium</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B7280] dark:text-slate-400">Est. Time</span>
              <span className="font-bold text-[#1F1B2D] dark:text-slate-100 flex items-center gap-1">
                <Timer className="w-3 h-3" />
                45 min
              </span>
            </div>
          </div>

          <motion.button
            onClick={() => {
              showToast('Starting Dynamic Programming challenge!', 'info');
              navigate('/practice');
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5B4E80] to-[#6E56CF] hover:from-[#4C4070] hover:to-[#5B4E80] text-white text-xs font-bold shadow-md cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Start Challenge
          </motion.button>
        </motion.div>
      </div>

    </div>
  );
});

StudentDashboard.displayName = 'StudentDashboard';

export default StudentDashboard;
