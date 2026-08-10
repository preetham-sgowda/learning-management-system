import React, { useState, useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle2, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  Share2, 
  Check, 
  Sparkles, 
  Code2, 
  MessageSquare,
  ShieldCheck,
  GraduationCap,
  FileCode,
  Lock,
  Layers,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { courseApi } from '../services/api';

const CourseDetailPage = memo(() => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, setSelectedCourse, enrollCourse } = useCourse();

  const [expandedModuleId, setExpandedModuleId] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'syllabus' | 'instructor' | 'reviews'
  const [backendModules, setBackendModules] = useState(null);

  // Find course matching URL courseId param, fallback to first course
  const course = courses.find((c) => c.id === courseId) || courses[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

  useEffect(() => {
    const fetchModulesAndArticles = async () => {
      if (!courseId) return;
      try {
        const modules = await courseApi.getModules(courseId);
        if (Array.isArray(modules) && modules.length > 0) {
          const modulesWithArticles = await Promise.all(
            modules.map(async (mod) => {
              try {
                const articles = await courseApi.getArticles(mod.id);
                return { ...mod, articles: articles || [] };
              } catch (e) {
                return { ...mod, articles: [] };
              }
            })
          );
          setBackendModules(modulesWithArticles);
        }
      } catch (err) {
        console.log('Backend modules not available for this course, using mock data.');
      }
    };
    fetchModulesAndArticles();
  }, [courseId]);

  if (!course) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="font-[#1F1B2D] font-display text-2xl font-bold">Course Page Not Found</h2>
        <button
          onClick={() => navigate('/courses')}
          className="px-5 py-2.5 rounded-xl bg-[#5B4E80] text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          Back to Course Catalog
        </button>
      </div>
    );
  }

  const completedModules = course.completedModules || course.completed || 0;
  const totalModules = course.modulesCount || course.total || (course.modules ? course.modules.length : 18);

  // Dynamic Course-Specific Objectives Generator
  const learningObjectives = course.overviewObjectives || [
    `Master production patterns and architectures in ${course.title}`,
    `Analyze time complexity, memory allocation, and performance bottlenecks for ${course.category}`,
    `Implement real-world projects utilizing ${course.tags ? course.tags.join(', ') : 'modern CS toolchains'}`,
    `Build production-ready code passable in tier-1 engineering placement technical rounds`,
    `Optimize ATS resume keyword matches for ${course.category} specialized engineering roles`,
    `Deploy scalable services using industry standard DevOps and CI/CD best practices`
  ];

  // Dynamic Course-Specific Syllabus Generator
  const syllabusModules = (course.modules && course.modules.length > 2) ? course.modules : [
    {
      id: 1,
      title: `Module 1: Foundations & Architecture of ${course.title}`,
      duration: '3h 15m',
      completed: course.progress > 20,
      lessons: [
        { title: `Introduction & Core Paradigms of ${course.title}`, duration: '35m', previewable: true },
        { title: `Memory Allocation & Data Layout Standards`, duration: '50m', previewable: true },
        { title: `Setting up local environment & toolchains`, duration: '40m', previewable: false },
        { title: `Interactive Sandbox Problem Set #1`, duration: '1h 10m', previewable: false }
      ]
    },
    {
      id: 2,
      title: `Module 2: Advanced Core Mechanics & Optimization Patterns`,
      duration: '4h 30m',
      completed: course.progress > 50,
      lessons: [
        { title: `Internal Algorithms & State Transitions`, duration: '1h 05m', previewable: true },
        { title: `Benchmarking performance & eliminating bottlenecks`, duration: '1h 20m', previewable: false },
        { title: `Concurrency, Locking & Thread Safety`, duration: '2h 05m', previewable: false }
      ]
    },
    {
      id: 3,
      title: `Module 3: Enterprise Integration & Security Protocols`,
      duration: '5h 10m',
      completed: course.progress > 80,
      lessons: [
        { title: `API Gateway, OAuth2 & Token Authentication`, duration: '1h 45m', previewable: false },
        { title: `Fault Tolerance, Logging & Observability`, duration: '2h 15m', previewable: false },
        { title: `Practice Sandbox Problem Set #2`, duration: '1h 10m', previewable: false }
      ]
    },
    {
      id: 4,
      title: `Module 4: Capstone Engineering Project & Placement Review`,
      duration: '6h 00m',
      completed: course.progress === 100,
      lessons: [
        { title: `End-to-End Capstone Implementation Guide`, duration: '2h 30m', previewable: false },
        { title: `Mock Technical Interview Questions & Edge Cases`, duration: '2h 00m', previewable: false },
        { title: `Final Certification Assessment & Code Submission`, duration: '1h 30m', previewable: false }
      ]
    }
  ];

  // Dynamic Instructor Details
  const instructor = {
    name: course.instructor || 'Dr. Aris Thorne',
    title: `Professor & Chair of ${course.category} Engineering`,
    bio: `Leading researcher and educator with over 14 years of engineering experience. Specialized in ${course.category.toLowerCase()} architecture, memory optimization, and mentoring top-tier CS graduates.`,
    avatar: (course.instructor ? course.instructor.split(' ').map(n=>n[0]).join('').slice(0, 2) : 'AT'),
    coursesTaught: 12,
    studentsCount: course.studentsCount ? (course.studentsCount * 1.5).toFixed(0) : 18500,
    rating: course.rating || 4.9
  };

  // Dynamic Student Reviews
  const reviews = [
    {
      id: 1,
      name: 'Aarav Sharma',
      avatar: 'AS',
      role: 'Placed SDE-1 at Amazon',
      rating: 5,
      date: '3 days ago',
      comment: `The depth of ${course.title} is unmatched! The step-by-step breakdown of ${course.tags ? course.tags[0] : 'core concepts'} helped me crack my technical interview with total confidence.`
    },
    {
      id: 2,
      name: 'Priya Patel',
      avatar: 'PP',
      role: 'CS Senior, BITS Pilani',
      rating: 5,
      date: '1 week ago',
      comment: `Incredible course structure by ${instructor.name}. The interactive practice sandbox exercises sealed my understanding of complex concurrency edge cases.`
    },
    {
      id: 3,
      name: 'Rohan Mehta',
      avatar: 'RM',
      role: 'SDE Intern at Microsoft',
      rating: 5,
      date: '2 weeks ago',
      comment: `Extremely practical course for real-world software engineering. Highly recommend to anyone preparing for high-scale backend rounds.`
    }
  ];

  const enrolledRoster = course.enrolledStudentsList || [
    'Preetham S Gowda',
    'Rakshith Y B',
    'Avani J C',
    'Rakshith Y B'
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in-up font-sans pb-16">
      {/* 
        ========================================================================
        1. BREADCRUMB & BACK NAVIGATION BAR
        ========================================================================
      */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#1F1B2D] text-xs font-bold hover:bg-[#F9FAFC] hover:border-[#5B4E80] transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#5B4E80]" />
          <span>Back to Course Catalog</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280]">
          <span className="cursor-pointer hover:text-[#5B4E80]" onClick={() => navigate('/courses')}>
            Courses
          </span>
          <span>/</span>
          <span className="text-[#5B4E80] font-bold">{course.category}</span>
          <span>/</span>
          <span className="truncate max-w-[220px] text-[#1F1B2D] font-semibold">{course.title}</span>
        </div>
      </div>

      {/* 
        ========================================================================
        2. HERO SPOTLIGHT BANNER (ULTRA-PROFESSIONAL GRADIENT)
        ========================================================================
      */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1F1B2D] via-[#28213B] to-[#5B4E80] p-6 md:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-white/10 text-purple-200 text-xs font-extrabold uppercase tracking-wider border border-white/15 backdrop-blur-md">
              {course.category}
            </span>
            <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold border border-emerald-400/20">
              {course.difficulty || 'Intermediate'} Level
            </span>
            <span className="px-3 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-mono">
              Course ID: {course.id}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed font-normal">
            {course.description}
          </p>

          {/* Professor & Metrics Bar */}
          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-purple-200/90 border-t border-white/10">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <GraduationCap className="w-4 h-4 text-[#A78BFA]" />
              <span>{instructor.name}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-amber-300">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{course.rating || 4.9}</span>
              <span className="text-purple-200/60 font-normal">(1,420 ratings)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-300" />
              <span>{(course.studentsCount || 14200).toLocaleString()} Learners</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-300" />
              <span>{course.duration || '40 Hours'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-300" />
              <span>{totalModules} Modules</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        3. NAVIGATION TAB BAR
        ========================================================================
      */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2 text-xs font-bold overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Course Overview' },
          { id: 'syllabus', label: 'Curriculum Syllabus' },
          { id: 'instructor', label: 'Instructor Profile' },
          { id: 'reviews', label: 'Student Reviews & Roster' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#5B4E80] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#1F1B2D] hover:bg-[#F9FAFC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 
        ========================================================================
        4. TWO-COLUMN ASYMMETRIC LAYOUT (68% Main Content / 32% Sticky Sidebar)
        ========================================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MAIN CONTENT (8 Cols = ~68%) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 4.1 COURSE OVERVIEW SECTION */}
          {(activeTab === 'overview' || activeTab === 'syllabus') && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
              <h3 className="font-display font-bold text-lg text-[#1F1B2D] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#5B4E80]" />
                <span>What You Will Learn</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {learningObjectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4B5563] leading-relaxed p-3 rounded-2xl bg-[#F9FAFC] border border-[#F3F4F6]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack & Keywords */}
              {course.tags && (
                <div className="pt-4 border-t border-[#F3F4F6] space-y-2">
                  <h4 className="font-bold text-xs text-[#1F1B2D] uppercase tracking-wider font-mono">
                    Technologies Covered:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((t, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-[#F0EBFA] text-[#5B4E80] text-xs font-mono font-bold border border-[#D0C5E8]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4.2 CURRICULUM SYLLABUS BREAKDOWN ACCORDION */}
          {(activeTab === 'overview' || activeTab === 'syllabus') && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#F3F4F6]">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1F1B2D]">Detailed Curriculum Syllabus</h3>
                  <p className="text-xs text-[#6B7280] font-mono mt-0.5">
                    {syllabusModules.length} Modules • {totalModules} Total Interactive Lessons
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {syllabusModules.map((mod) => {
                  const isExpanded = expandedModuleId === mod.id;

                  return (
                    <div
                      key={mod.id}
                      className="border border-[#E5E7EB] rounded-2xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                        className="w-full p-4 bg-[#F9FAFC] hover:bg-[#F4F0FA]/50 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${mod.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-[#F0EBFA] text-[#5B4E80]'}`}>
                            {mod.id}
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-xs text-[#1F1B2D]">{mod.title}</h4>
                            <span className="text-[10px] text-[#6B7280] font-mono">{mod.lessons.length} lessons • {mod.duration}</span>
                          </div>
                        </div>

                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#5B4E80]" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-white border-t border-[#E5E7EB] space-y-2.5">
                          {mod.lessons.map((lesson, lIdx) => (
                            <div key={lIdx} className="flex items-center justify-between text-xs py-2 px-3 rounded-xl hover:bg-[#F9FAFC] border border-transparent hover:border-[#E5E7EB]">
                              <div className="flex items-center gap-3 text-[#4B5563]">
                                <Play className="w-3.5 h-3.5 text-[#5B4E80]" />
                                <span>{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[10px] text-[#6B7280]">
                                {lesson.previewable && (
                                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold">Free Preview</span>
                                )}
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4.3 INSTRUCTOR BIOGRAPHY */}
          {(activeTab === 'overview' || activeTab === 'instructor') && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-lg text-[#1F1B2D]">Instructor Biography & Credentials</h3>

              <div className="flex flex-col sm:flex-row items-start gap-5 pt-2">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6E56CF] to-[#5B4E80] text-white font-display text-2xl font-bold flex items-center justify-center shadow-lg shrink-0">
                  {instructor.avatar}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-display font-bold text-lg text-[#1F1B2D]">
                      {instructor.name}
                    </h4>
                    <span className="px-3 py-1 rounded-full bg-[#F0EBFA] text-[#5B4E80] font-mono text-[10px] font-bold">
                      ⭐ {instructor.rating} Instructor Rating
                    </span>
                  </div>

                  <p className="text-xs text-[#5B4E80] font-mono font-semibold">
                    {instructor.title}
                  </p>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {instructor.bio}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#4B5563]">
                    <div><span className="font-bold text-[#1F1B2D]">{instructor.coursesTaught}</span> Courses Taught</div>
                    <div>•</div>
                    <div><span className="font-bold text-[#1F1B2D]">{Number(instructor.studentsCount).toLocaleString()}</span> Total Students</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4.4 STUDENT REVIEWS & ENROLLED ROSTER */}
          {(activeTab === 'overview' || activeTab === 'reviews') && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h3 className="font-display font-bold text-lg text-[#1F1B2D]">Student Reviews & Ratings</h3>
                <span className="text-xs text-[#6B7280] font-mono">Verified Learner Feedback</span>
              </div>

              {/* Rating Gauge */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-[#F9FAFC] border border-[#E5E7EB]">
                <div className="text-center sm:text-left space-y-1">
                  <span className="font-display text-4xl font-black text-[#1F1B2D]">{course.rating || 4.9}</span>
                  <div className="flex items-center justify-center sm:justify-start text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-[10px] text-[#6B7280] font-mono">Course Rating • 1,420 Reviews</p>
                </div>
              </div>

              {/* Review Testimonials */}
              <div className="space-y-3 pt-2">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-[#E5E7EB] bg-white space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#F0EBFA] text-[#5B4E80] font-bold text-xs flex items-center justify-center">
                          {rev.avatar}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-[#1F1B2D]">{rev.name}</h5>
                          <p className="text-[10px] text-[#6B7280] font-mono">{rev.role}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#9CA3AF] font-mono">{rev.date}</span>
                    </div>
                    <p className="text-xs text-[#4B5563] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Enrolled Students Roster */}
              <div className="pt-4 border-t border-[#F3F4F6] space-y-3">
                <h4 className="font-bold text-xs text-[#1F1B2D] uppercase tracking-wider font-mono">
                  Enrolled Peers in this Course ({enrolledRoster.length} Students):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {enrolledRoster.map((student, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-[#F3F4F6] text-[#1F1B2D] text-xs font-semibold border border-[#E5E7EB]">
                      👤 {student}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY ENROLLMENT SIDEBAR (4 Cols = ~32%) */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xl space-y-6">
            {/* Image Preview */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 shadow-inner group">
              <img
                src={course.image || 'https://images.unsplash.com/photo-1516116211223-4c7142b2e2ec?auto=format&fit=crop&w=600&q=80'}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 text-[#5B4E80] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            {/* Pricing & Access */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-black text-[#1F1B2D]">Included</span>
                <span className="text-xs text-[#5B4E80] font-mono font-bold">with SkillForge Pro</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-mono font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Full Lifetime Access & Certificate
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                setSelectedCourse(course);
                enrollCourse(course.id);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#5B4E80] to-[#6E56CF] hover:from-[#4C4070] hover:to-[#5B4E80] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{course.progress > 0 ? 'Continue Learning' : 'Enroll in Path Now'}</span>
            </button>

            {/* Direct Practice Sandbox Link */}
            <button
              onClick={() => navigate('/practice')}
              className="w-full py-3 rounded-2xl bg-[#F9FAFC] hover:bg-[#F0EBFA] border border-[#E5E7EB] hover:border-[#5B4E80] text-[#1F1B2D] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-[#5B4E80]" />
              <span>Open Practice Sandbox</span>
            </button>

            {/* Quick Actions (Share + Bookmark) */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex-1 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isBookmarked ? 'bg-[#F0EBFA] border-[#5B4E80] text-[#5B4E80]' : 'border-[#E5E7EB] text-[#4B5563] hover:bg-[#F9FAFC]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex-1 py-2 rounded-xl border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F9FAFC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Features Checklist */}
            <div className="space-y-2.5 pt-4 border-t border-[#F3F4F6] text-xs text-[#4B5563]">
              <h5 className="font-bold text-[#1F1B2D]">This learning path includes:</h5>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#5B4E80]" />
                <span>Verified Certificate of Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#5B4E80]" />
                <span>Interactive Practice Sandbox Challenges</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#5B4E80]" />
                <span>24/7 SkillForge AI Chatbot Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseDetailPage.displayName = 'CourseDetailPage';

export default CourseDetailPage;
