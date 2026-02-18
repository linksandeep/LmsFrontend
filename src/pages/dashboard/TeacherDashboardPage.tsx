import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/course.service';

interface Course {
  id: string;
  _id?: string;
  title: string;
  enrolledStudents: number;
  totalLessons: number;
  isPublished: boolean;
  createdAt: string;
}

const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalLessons: 0
  });

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      const response = await courseService.getMyCourses();
      const coursesData = response.data.courses || [];
      
      setCourses(coursesData);
      
      // Calculate stats
      const published = coursesData.filter((c: Course) => c.isPublished).length;
      const totalStudents = coursesData.reduce((acc: number, c: Course) => acc + (c.enrolledStudents || 0), 0);
      const totalLessons = coursesData.reduce((acc: number, c: Course) => acc + (c.totalLessons || 0), 0);

      setStats({
        totalCourses: coursesData.length,
        publishedCourses: published,
        totalStudents,
        totalLessons
      });
    } catch (err) {
      console.error('Failed to load teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (courseId: string) => {
    try {
      setPublishing(courseId);
      await courseService.publishCourse(courseId);
      // Reload data to show updated status
      await loadTeacherData();
      alert('Course published successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to publish course');
    } finally {
      setPublishing(null);
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const statCards = [
    { title: 'Total Courses', value: stats.totalCourses, icon: '📚', color: 'bg-blue-500' },
    { title: 'Published', value: stats.publishedCourses, icon: '✅', color: 'bg-green-500' },
    { title: 'Total Students', value: stats.totalStudents, icon: '👥', color: 'bg-purple-500' },
    { title: 'Total Lessons', value: stats.totalLessons, icon: '📹', color: 'bg-orange-500' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
   <div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
  <div className="flex space-x-4">
    <button
      onClick={() => navigate('/dashboard/teacher/analytics')}
      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
    >
      <span className="mr-2">📊</span>
      Analytics
    </button>
    <button
      onClick={() => navigate('/courses/create')}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
    >
      <span className="mr-2">+</span>
      Create New Course
    </button>
  </div>
</div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className={`${stat.color} text-white text-xs px-2 py-1 rounded`}>
                  {stat.title}
                </span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">My Courses</h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">You haven't created any courses yet</p>
            <button
              onClick={() => navigate('/courses/create')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id || course._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleCourseClick(course.id || course._id || '')}
                  >
                    <h3 className="font-semibold">{course.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>📊 {course.enrolledStudents || 0} students</span>
                      <span>📹 {course.totalLessons || 0} lessons</span>
                      <span>📅 Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {course.isPublished ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Published
                      </span>
                    ) : (
                      <>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          Draft
                        </span>
                        <button
                          onClick={() => handlePublish(course.id || course._id || '')}
                          disabled={publishing === (course.id || course._id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {publishing === (course.id || course._id) ? 'Publishing...' : 'Publish'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
