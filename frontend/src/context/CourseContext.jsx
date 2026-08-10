import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { COURSES_DATA, PRACTICE_PROBLEMS } from '../data/mockData';
import { courseApi, enrollmentApi, questionApi } from '../services/api';

const CourseContext = createContext();

export const CourseProvider = ({ children, showToast }) => {
  const [courses, setCourses] = useState(COURSES_DATA);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [practiceProblems, setPracticeProblems] = useState(PRACTICE_PROBLEMS);
  const [activeProblem, setActiveProblem] = useState(PRACTICE_PROBLEMS[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendCourses = await courseApi.listAll();
        if (Array.isArray(backendCourses) && backendCourses.length > 0) {
          // Merge backend courses with UI mock attributes (images, ratings, etc.) if missing
          const merged = backendCourses.map((bc, idx) => {
            const mock = COURSES_DATA[idx % COURSES_DATA.length] || {};
            return {
              ...mock,
              id: bc.id,
              title: bc.title || mock.title,
              description: bc.description || mock.description,
              category: bc.category || mock.category,
              createdAt: bc.createdAt,
            };
          });
          setCourses(merged);
        }
      } catch (err) {
        console.log('Backend offline or error fetching courses, using mock data.');
      }

      // Fetch user enrollments if authenticated
      try {
        const enrollments = await enrollmentApi.myEnrollments();
        if (Array.isArray(enrollments) && enrollments.length > 0) {
          const enrollmentMap = new Map(enrollments.map(e => [e.courseId, e]));
          setCourses(prev => prev.map(c => {
            const en = enrollmentMap.get(c.id);
            if (en) {
              return {
                ...c,
                status: en.progressPercent >= 100 ? 'Completed' : 'In Progress',
                progress: en.progressPercent || c.progress || 5,
              };
            }
            return c;
          }));
        }
      } catch (err) {
        console.log('Backend offline or error fetching enrollments.');
      }
    };

    fetchData();
  }, []);

  const enrollCourse = useCallback(async (courseId) => {
    // Optimistic UI update
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, status: 'In Progress', progress: Math.max(c.progress || 0, 5) };
      }
      return c;
    }));

    try {
      await enrollmentApi.enroll(courseId);
    } catch (err) {
      console.log('Backend error enrolling course, updated locally.', err);
    }

    if (showToast) {
      showToast('Enrolled in course successfully!', 'success');
    }
  }, [showToast]);

  const updateCourseProgress = useCallback((courseId, newProgress) => {
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
  }, []);

  const value = useMemo(() => ({
    courses,
    setCourses,
    selectedCourse,
    setSelectedCourse,
    enrollCourse,
    updateCourseProgress,
    practiceProblems,
    setPracticeProblems,
    activeProblem,
    setActiveProblem,
  }), [
    courses,
    selectedCourse,
    enrollCourse,
    updateCourseProgress,
    practiceProblems,
    activeProblem,
  ]);

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

export default CourseContext;

