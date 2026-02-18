import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/course.service';
import { adminService } from '../../services/admin.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Rating from '../../components/common/Rating';

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail?: string;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
  };
  level: string;
  price: number;
  isPublished: boolean;
  totalLessons: number;
  totalDuration: number;
  averageRating: number;
  enrolledStudents: number;
  createdAt: string;
  updatedAt: string;
  requirements?: string[];
  objectives?: string[];
}

const AdminCourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'students'>('overview');

  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourse(id!);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!course) return;
    
    try {
      setPublishing(true);
      if (course.isPublished) {
        await courseService.unpublishCourse(course.id);
      } else {
        await courseService.publishCourse(course.id);
      }
      // Reload course to get updated status
      await loadCourse();
    } catch (error) {
      console.error('Failed to toggle course status:', error);
      alert('Failed to update course status');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!course) return;
    
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await courseService.deleteCourse(course.id);
      navigate('/admin/courses');
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading course details..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
          <button
            onClick={() => navigate('/admin/courses')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Actions */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/courses')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <span className="text-xl mr-2">←</span>
            Back to Courses
          </button>
          
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {course.isPublished ? 'Published' : 'Draft'}
            </span>
            
            <button
              onClick={handlePublish}
              disabled={publishing}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                course.isPublished 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } disabled:opacity-50`}
            >
              {publishing ? 'Processing...' : course.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-4xl">📚</span>
            </div>
          )}
          
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Teacher</p>
                <p className="font-semibold">{course.teacher?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{course.teacher?.email}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold">{course.category?.name || 'Uncategorized'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Level</p>
                <p className={`inline-block px-2 py-1 mt-1 text-xs rounded-full ${getLevelColor(course.level)}`}>
                  {course.level}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold text-blue-600">{formatPrice(course.price)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Students</p>
                <p className="text-2xl font-bold">{course.enrolledStudents || 0}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Lessons</p>
                <p className="text-2xl font-bold">{course.totalLessons || 0}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center">
                  <Rating value={course.averageRating} size="sm" />
                  <span className="ml-2 text-sm">({course.averageRating.toFixed(1)})</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-semibold">{formatDate(course.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
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
              onClick={() => setActiveTab('lessons')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lessons'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lessons ({course.totalLessons || 0})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Students ({course.enrolledStudents || 0})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {course.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What You'll Learn */}
              {course.objectives && course.objectives.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.objectives.map((obj, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Course Details</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b">
                    <dt className="text-gray-500">Course ID</dt>
                    <dd className="font-mono text-sm">{course.id}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <dt className="text-gray-500">Last Updated</dt>
                    <dd>{formatDate(course.updatedAt)}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <dt className="text-gray-500">Total Duration</dt>
                    <dd>{course.totalDuration} minutes</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <dt className="text-gray-500">Status</dt>
                    <dd>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Lesson management coming soon...</p>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Student list coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourseDetail;
