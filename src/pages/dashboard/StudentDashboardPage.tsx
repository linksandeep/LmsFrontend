import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollmentService } from '../../services/enrollment.service';

interface Enrollment {
  id: string;
  course: {
    id: string;
    _id?: string;
    title: string;
    thumbnail?: string;
    teacher: { name: string };
    level?: string;
  };
  progress: number;
  completedLessons: string[];
  totalLessons: number;
  lastAccessedAt: string;
  certificateUrl?: string;
  status: string;
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
      console.log('Full enrollment response:', response);
      
      // Handle different response structures
      let enrollmentsData = [];
      if (response.data?.enrollments) {
        enrollmentsData = response.data.enrollments;
      } else if (response.enrollments) {
        enrollmentsData = response.enrollments;
      } else if (Array.isArray(response.data)) {
        enrollmentsData = response.data;
      } else if (Array.isArray(response)) {
        enrollmentsData = response;
      }
      
      console.log('Processed enrollments:', enrollmentsData);
      setEnrollments(enrollmentsData);
      
      // Calculate stats
      const completed = enrollmentsData.filter((e: Enrollment) => e.progress === 100 || e.status === 'completed').length;
      const inProgress = enrollmentsData.filter((e: Enrollment) => e.progress > 0 && e.progress < 100 && e.status !== 'completed').length;
      const certificates = enrollmentsData.filter((e: Enrollment) => e.certificateUrl).length;

      setStats({
        totalCourses: enrollmentsData.length,
        inProgress,
        completed,
        certificates
      });
    } catch (error: any) {
      console.error('Failed to load dashboard:', error);
      if (error.response?.status === 429) {
        alert('Too many requests. Please wait a moment and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (enrollment: Enrollment) => {
    console.log('Clicked enrollment:', enrollment);
    
    // Try to get course ID from various possible locations
    const courseId = enrollment.course?.id || enrollment.course?._id || enrollment.course;
    
    if (courseId && courseId !== 'undefined' && courseId !== 'null') {
      console.log('Navigating to course with ID:', courseId);
      navigate(`/courses/${courseId}`);
    } else {
      console.error('Invalid course ID in enrollment:', enrollment);
      alert('Cannot open this course: Invalid course data');
    }
  };

  const continueLearning = enrollments
    .filter(e => e.progress > 0 && e.progress < 100)
    .sort((a, b) => new Date(b.lastAccessedAt || 0).getTime() - new Date(a.lastAccessedAt || 0).getTime())
    .slice(0, 3);

  const handleViewCertificates = () => {
    navigate('/certificates');
  };

  const handleBrowseCourses = () => {
    navigate('/courses');
  };

  // Make stats cards clickable
  const statCards = [
    { 
      title: 'Total Courses', 
      value: stats.totalCourses, 
      icon: '📚', 
      color: 'bg-blue-500',
      onClick: () => navigate('/courses')
    },
    { 
      title: 'In Progress', 
      value: stats.inProgress, 
      icon: '⏳', 
      color: 'bg-yellow-500',
      onClick: () => navigate('/courses')
    },
    { 
      title: 'Completed', 
      value: stats.completed, 
      icon: '✅', 
      color: 'bg-green-500',
      onClick: () => navigate('/courses')
    },
    { 
      title: 'Certificates', 
      value: stats.certificates, 
      icon: '🏆', 
      color: 'bg-purple-500',
      onClick: handleViewCertificates
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
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
          {statCards.map((stat, index) => (
            <div
              key={index}
              onClick={stat.onClick}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-all hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl text-white`}>
                  {stat.icon}
                </div>
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <h3 className="text-gray-600 font-medium">{stat.title}</h3>
              <p className="text-sm text-blue-600 mt-2">Click to view →</p>
            </div>
          ))}
        </div>

        {/* Continue Learning Section */}
        {continueLearning.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueLearning.map((enrollment) => (
                <div
                  key={enrollment.id}
                  onClick={() => handleCourseClick(enrollment)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all"
                >
                  {enrollment.course?.thumbnail ? (
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
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{enrollment.course?.title || 'Untitled Course'}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {enrollment.course?.teacher?.name || 'Instructor'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{Math.round(enrollment.progress || 0)}% complete</span>
                      <span className="text-blue-600 font-medium">Continue →</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2 transition-all"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      />
                    </div>
                    {enrollment.lastAccessedAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        Last accessed: {new Date(enrollment.lastAccessedAt).toLocaleDateString()}
                      </p>
                    )}
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
                onClick={handleBrowseCourses}
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
                  onClick={() => handleCourseClick(enrollment)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all"
                >
                  {enrollment.course?.thumbnail ? (
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
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{enrollment.course?.title || 'Untitled Course'}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {enrollment.course?.teacher?.name || 'Instructor'}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(enrollment.progress || 0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`rounded-full h-2 transition-all ${
                            enrollment.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        enrollment.progress === 100 ? 'bg-green-100 text-green-800' :
                        enrollment.progress > 0 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollment.progress === 100 ? 'Completed' :
                         enrollment.progress > 0 ? 'In Progress' :
                         'Not Started'}
                      </span>
                      
                      {enrollment.certificateUrl && (
                        <span className="text-green-600 text-sm">🏆 Certified</span>
                      )}
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