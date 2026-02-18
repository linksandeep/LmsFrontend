import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/course.service';
import { adminService } from '../../services/admin.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface Course {
  id: string;
  title: string;
  teacher: {
    name: string;
    email: string;
  };
  category: {
    name: string;
  };
  level: string;
  price: number;
  isPublished: boolean;
  enrolledStudents: number;
  totalLessons: number;
  createdAt: string;
}

const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // Use admin endpoint to get all courses
      const response = await adminService.getAllCourses();
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      setPublishing(courseId);
      if (currentStatus) {
        await courseService.unpublishCourse(courseId);
      } else {
        await courseService.publishCourse(courseId);
      }
      // Reload courses to get updated status
      await loadCourses();
    } catch (error) {
      console.error('Failed to toggle course status:', error);
      alert('Failed to update course status');
    } finally {
      setPublishing(null);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    
    try {
      await courseService.deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'published' && !course.isPublished) return false;
    if (filter === 'draft' && course.isPublished) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        course.title.toLowerCase().includes(searchLower) ||
        course.teacher?.name?.toLowerCase().includes(searchLower) ||
        course.category?.name?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.isPublished).length,
    draft: courses.filter(c => !c.isPublished).length,
    totalStudents: courses.reduce((acc, c) => acc + (c.enrolledStudents || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading courses..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-2">View and manage all courses on the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📚</span>
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-gray-600">Total Courses</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">✅</span>
              <span className="text-2xl font-bold text-green-600">{stats.published}</span>
            </div>
            <p className="text-gray-600">Published</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📝</span>
              <span className="text-2xl font-bold text-yellow-600">{stats.draft}</span>
            </div>
            <p className="text-gray-600">Drafts</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">👥</span>
              <span className="text-2xl font-bold text-purple-600">{stats.totalStudents}</span>
            </div>
            <p className="text-gray-600">Total Students</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'published' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Published ({stats.published})
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'draft' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Draft ({stats.draft})
              </button>
            </div>
            
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses by title, teacher, or category..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredCourses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/admin/courses/${course.id}`)}
                          className="font-medium text-gray-900 hover:text-blue-600 text-left"
                        >
                          {course.title}
                        </button>
                        <div className="text-sm text-gray-500">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{course.teacher?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{course.teacher?.email || ''}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {course.category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                          course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {course.enrolledStudents || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          course.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => navigate(`/admin/courses/${course.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handlePublish(course.id, course.isPublished)}
                            disabled={publishing === course.id}
                            className={`hover:text-blue-900 disabled:opacity-50 ${
                              course.isPublished ? 'text-yellow-600' : 'text-green-600'
                            }`}
                            title={course.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {publishing === course.id ? '⏳' : (course.isPublished ? '📝' : '✅')}
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Course"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCoursesPage;
