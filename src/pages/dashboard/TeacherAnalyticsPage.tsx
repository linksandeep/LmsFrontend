import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalyticsOverview from '../../components/teacher/AnalyticsOverview';
import StudentManagement from '../../components/teacher/StudentManagement';
import { analyticsService } from '../../services/analytics.service';
import { courseService } from '../../services/course.service';

interface Course {
  id: string;
  title: string;
}

const TeacherAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students'>('overview');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    enrollmentTrend: [],
    popularCourses: []
  });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load courses
      const coursesResponse = await courseService.getMyCourses();
      setCourses(coursesResponse.data.courses || []);
      
      // Load analytics
      const analyticsResponse = await analyticsService.getTeacherAnalytics();
      setAnalyticsData(analyticsResponse.data || {
        totalCourses: coursesResponse.data.courses?.length || 0,
        totalStudents: 0,
        totalRevenue: 0,
        averageRating: 0,
        enrollmentTrend: [],
        popularCourses: []
      });
      
      // Load students if a course is selected
      if (selectedCourse !== 'all') {
        const studentsResponse = await analyticsService.getCourseStudents(selectedCourse);
        setStudents(studentsResponse.data?.students || []);
      }
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId);
    if (courseId !== 'all') {
      try {
        const studentsResponse = await analyticsService.getCourseStudents(courseId);
        setStudents(studentsResponse.data?.students || []);
      } catch (err) {
        console.error('Failed to load students:', err);
      }
    } else {
      setStudents([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Teacher Analytics</h1>
          <p className="text-gray-600 mt-1">Track your course performance and student engagement</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/teacher')}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Course Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-gray-700 font-medium">Select Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white rounded-t-lg">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Student Management
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow-md p-6">
        {activeTab === 'overview' ? (
          <AnalyticsOverview data={analyticsData} />
        ) : (
          selectedCourse === 'all' ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Please select a specific course to manage students</p>
            </div>
          ) : (
            <StudentManagement
              courseId={selectedCourse}
              courseTitle={courses.find(c => c.id === selectedCourse)?.title || ''}
              students={students}
              onViewProgress={(studentId) => console.log('View progress:', studentId)}
              onMessageStudent={(studentId) => console.log('Message student:', studentId)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TeacherAnalyticsPage;
