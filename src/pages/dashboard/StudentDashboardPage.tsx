import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressService } from '../../services/progress.service';
import StudentStats from '../../components/dashboard/StudentStats';
import ContinueLearning from '../../components/dashboard/ContinueLearning';
import MyCoursesProgress from '../../components/dashboard/MyCoursesProgress';

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    thumbnail?: string;
  };
  progress: number;
  completedLessons: string[];
  totalLessons: number;
  status: string;
  lastAccessedAt: string;
  certificateUrl?: string;
}

const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalLessonsWatched: 0,
    certificatesEarned: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await progressService.getMyProgress();
      const enrollmentsData = response.data.enrollments || [];
      
      setEnrollments(enrollmentsData);
      
      // Calculate stats
      const completed = enrollmentsData.filter((e: Enrollment) => e.status === 'completed').length;
      const inProgress = enrollmentsData.filter((e: Enrollment) => e.status === 'active').length;
      const totalLessonsWatched = enrollmentsData.reduce(
        (acc: number, e: Enrollment) => acc + (e.completedLessons?.length || 0), 
        0
      );
      const certificatesEarned = enrollmentsData.filter((e: Enrollment) => e.certificateUrl).length;

      setStats({
        totalCourses: enrollmentsData.length,
        completedCourses: completed,
        inProgressCourses: inProgress,
        totalLessonsWatched,
        certificatesEarned
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Transform enrollments to continue learning items
  const continueLearningItems = enrollments
    .filter(e => e.status === 'active')
    .map(e => ({
      courseId: e.course.id,
      courseTitle: e.course.title,
      courseThumbnail: e.course.thumbnail,
      nextLessonId: '', // This would come from backend
      nextLessonTitle: 'Continue Learning', // Placeholder
      progress: e.progress,
      lastAccessedAt: e.lastAccessedAt
    }));

  // Transform enrollments to course progress items
  const courseProgressItems = enrollments.map(e => ({
    courseId: e.course.id,
    courseTitle: e.course.title,
    courseThumbnail: e.course.thumbnail,
    progress: e.progress,
    completedLessons: e.completedLessons?.length || 0,
    totalLessons: e.totalLessons || 10, // Placeholder until backend sends total
    status: e.status as 'active' | 'completed' | 'dropped',
    certificateUrl: e.certificateUrl
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Stats Section */}
      <StudentStats stats={stats} />

      {/* Continue Learning Section */}
      <div className="mb-8">
        <ContinueLearning items={continueLearningItems} />
      </div>

      {/* My Courses Section */}
      <div>
        <MyCoursesProgress courses={courseProgressItems} />
      </div>
    </div>
  );
};

export default StudentDashboardPage;
