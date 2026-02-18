import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollmentService } from '../../services/enrollment.service';

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    thumbnail?: string;
    teacher: { name: string };
  };
  progress: number;
  completedLessons: string[];
  totalLessons: number;
  lastAccessedAt: string;
  certificateUrl?: string;
}

const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    inProgress: 0,
    completed: 0,
    certificates: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await enrollmentService.getMyEnrollments();
      const data = response.data?.enrollments || [];
      setEnrollments(data);
      
      // Calculate stats
      const completed = data.filter((e: Enrollment) => e.progress === 100).length;
      const inProgress = data.filter((e: Enrollment) => e.progress > 0 && e.progress < 100).length;
      const certificates = data.filter((e: Enrollment) => e.certificateUrl).length;

      setStats({
        totalCourses: data.length,
        inProgress,
        completed,
        certificates
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const continueLearning = enrollments
    .filter(e => e.progress > 0 && e.progress < 100)
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your progress and continue learning</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                📚
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalCourses}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Courses</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                ⏳
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.inProgress}</span>
            </div>
            <h3 className="text-gray-600 font-medium">In Progress</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                ✅
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.completed}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Completed</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.certificates}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Certificates</h3>
          </div>
        </div>

        {/* Continue Learning Section */}
        {continueLearning.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueLearning.map((enrollment) => (
                <div
                  key={enrollment.id}
                  onClick={() => navigate(`/courses/${enrollment.course.id}`)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all"
                >
                  {enrollment.course.thumbnail ? (
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-4xl">📚</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{enrollment.course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {enrollment.course.teacher?.name || 'Instructor'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{Math.round(enrollment.progress)}% complete</span>
                      <span className="text-blue-600 font-medium">Continue →</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2 transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Courses</h2>
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  onClick={() => navigate(`/courses/${enrollment.course.id}`)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all"
                >
                  {enrollment.course.thumbnail ? (
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
                      <span className="text-white text-4xl">📖</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{enrollment.course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {enrollment.course.teacher?.name || 'Instructor'}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {enrollment.completedLessons?.length || 0}/{enrollment.totalLessons || 0} lessons
                      </span>
                      {enrollment.certificateUrl && (
                        <span className="text-green-600 text-sm">🏆 Certified</span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`rounded-full h-2 transition-all ${
                          enrollment.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
