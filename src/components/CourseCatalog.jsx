import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const CourseCatalog = () => {
  const { courses, enrollCourse, updateCourseProgress, selectedCourse, setSelectedCourse, setActiveTab } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalCourse, setDetailModalCourse] = useState(null);

  const categories = ['All', 'Core CS', 'Database', 'Architecture', 'Development'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesCat = activeCategory === 'All' || course.category === activeCategory;
    const matchesDiff = activeDifficulty === 'All' || course.difficulty.toLowerCase().includes(activeDifficulty.toLowerCase());
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesDiff && matchesSearch;
  });

  const handleModuleToggle = (courseId, moduleId) => {
    if (!detailModalCourse) return;
    const updatedModules = detailModalCourse.modules.map(m => 
      m.id === moduleId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedModules.filter(m => m.completed).length;
    const newProgress = Math.round((completedCount / updatedModules.length) * 100);

    const updatedCourse = {
      ...detailModalCourse,
      modules: updatedModules,
      completedModules: completedCount,
      progress: newProgress,
      status: newProgress === 100 ? 'Completed' : 'In Progress'
    };

    setDetailModalCourse(updatedCourse);
    updateCourseProgress(courseId, newProgress);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900">
            Computer Science Learning Paths
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Master core fundamentals, algorithms, and system design tailored for tech placements.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, tags..."
            className="w-full bg-white border border-slate-200 rounded-full py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#810B38]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#810B38] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeDifficulty === diff
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                  {course.category}
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-xs font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    ★ {course.rating} ({course.studentsCount.toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#810B38] transition-colors leading-snug">
                    {course.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {course.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Progress bar if enrolled */}
                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Course Progress</span>
                      <span className="text-[#810B38] font-mono">{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
              <span className="text-xs text-slate-500 font-medium">
                {course.modulesCount} Modules
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setDetailModalCourse(course)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  View Syllabus
                </button>
                {course.status === 'New' ? (
                  <button
                    onClick={() => enrollCourse(course.id)}
                    className="px-4 py-2 rounded-xl bg-[#810B38] hover:bg-[#9c244b] text-white text-xs font-bold transition-all shadow-md"
                  >
                    Enroll Now
                  </button>
                ) : (
                  <button
                    onClick={() => setDetailModalCourse(course)}
                    className="px-4 py-2 rounded-xl bg-[#810B38] hover:bg-[#9c244b] text-white text-xs font-bold transition-all shadow-md"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {detailModalCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-[#810B38] text-[10px] font-bold uppercase tracking-wider">
                  {detailModalCourse.category} • {detailModalCourse.difficulty}
                </span>
                <h2 className="font-display text-xl font-bold text-slate-900 mt-2">
                  {detailModalCourse.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">Instructor: {detailModalCourse.instructor}</p>
              </div>
              <button
                onClick={() => setDetailModalCourse(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {detailModalCourse.description}
            </p>

            {/* Modules List with Toggle */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-display font-bold text-sm text-slate-900">Module Syllabus & Interactive Checkpoints</h4>
                <span className="text-xs font-mono font-bold text-[#810B38]">
                  {detailModalCourse.completedModules} / {detailModalCourse.modulesCount} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {detailModalCourse.modules.map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => handleModuleToggle(detailModalCourse.id, mod.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      mod.completed
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[20px] ${mod.completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {mod.completed ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span className={`text-xs font-semibold ${mod.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {mod.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{mod.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setDetailModalCourse(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  setDetailModalCourse(null);
                  setActiveTab('practice');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#810B38] hover:bg-[#9c244b] text-white text-xs font-bold shadow-md"
              >
                Practice Related Sandbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
