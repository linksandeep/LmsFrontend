import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/course.service';
import { lessonService } from '../../services/lesson.service';
import { enrollmentService } from '../../services/enrollment.service';
import { reviewService } from '../../services/review.service';
import { Course } from '../../types/course';
import { Lesson, LessonFormData } from '../../types/lesson';
import { Review, ReviewStats } from '../../types/review';
import LessonList from '../../components/lesson/LessonList';
import LessonPlayer from '../../components/lesson/LessonPlayer';
import ReviewCard from '../../components/course/ReviewCard';
import ReviewForm from '../../components/course/ReviewForm';
import Rating from '../../components/common/Rating';
import LevelBadge from '../../components/common/LevelBadge';
import PriceTag from '../../components/common/PriceTag';
import WishlistButton from '../../components/common/WishlistButton';
import LessonForm from '../../components/lesson/LessonForm';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use refs to track if data has been loaded
  const hasLoaded = useRef({
    course: false,
    lessons: false,
    reviews: false,
    enrollment: false
  });

  // Course state
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  
  // Enrollment state
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  
  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Teacher state
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'reviews'>('overview');
  const [authChecked, setAuthChecked] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem('token');

  // Check authentication on mount
  useEffect(() => {
    console.log('=== AUTH CHECK ===');
    console.log('Token exists:', !!token);
    console.log('User:', user);
    console.log('Course ID:', id);
    setAuthChecked(true);
  }, [token, user, id]);

  const isTeacher = user?.role === 'teacher' && isOwner;
  const isAdmin = user?.role === 'admin';
  const canReview = isEnrolled && !reviews.some(r => r.userId === user?.id);

  // Load course data only once
  useEffect(() => {
    if (!id) {
      setError('Invalid course ID');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('=== LOADING COURSE DATA ===');
        console.log('Course ID from URL:', id);
        console.log('Token exists:', !!token);
        console.log('User:', user);
        
        // Load course data
        if (!hasLoaded.current.course) {
          console.log('Fetching course data...');
          try {
            const courseResponse = await courseService.getCourse(id);
            console.log('Course API response:', courseResponse);
            
            const courseData = courseResponse.data?.course || courseResponse.data;
            console.log('Processed course data:', courseData);
            
            if (!courseData) {
              throw new Error('No course data received');
            }
            
            setCourse(courseData);
            
            // Check if current user is the owner
            if (user) {
              const courseTeacherId = courseData.teacher?.id || courseData.teacher;
              const isOwnerCheck = courseTeacherId === user.id;
              setIsOwner(isOwnerCheck);
              console.log('Owner check:', {
                courseTeacherId,
                userId: user.id,
                isOwner: isOwnerCheck
              });
            }
            
            hasLoaded.current.course = true;
            console.log('Course data loaded successfully');
          } catch (courseError: any) {
            console.error('Error fetching course:', courseError);
            console.error('Error response:', courseError.response?.data);
            throw courseError;
          }
        }

        // Load lessons
        if (!hasLoaded.current.lessons) {
          console.log('Fetching lessons...');
          try {
            const lessonsResponse = await lessonService.getCourseLessons(id);
            console.log('Lessons response:', lessonsResponse);
            setLessons(lessonsResponse.data?.lessons || []);
            hasLoaded.current.lessons = true;
          } catch (lessonsError) {
            console.error('Error fetching lessons:', lessonsError);
            // Don't throw - lessons might not exist
          }
        }

        // Load reviews
        if (!hasLoaded.current.reviews) {
          console.log('Fetching reviews...');
          try {
            const reviewsResponse = await reviewService.getCourseReviews(id, 1);
            console.log('Reviews response:', reviewsResponse);
            setReviews(reviewsResponse.data?.reviews || []);
            setReviewStats({
              averageRating: reviewsResponse.data?.statistics?.averageRating || 0,
              totalReviews: reviewsResponse.data?.statistics?.totalReviews || 0,
              ratingDistribution: reviewsResponse.data?.statistics?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            });
            hasLoaded.current.reviews = true;
          } catch (reviewsError) {
            console.error('Error fetching reviews:', reviewsError);
            // Don't throw - reviews might not exist
          }
        }

      } catch (err: any) {
        console.error('❌ Failed to load course:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        if (err.response?.status === 404) {
          setError('Course not found');
        } else if (err.response?.status === 401) {
          setError('Please log in to view this course');
        } else if (err.response?.status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
        } else {
          setError(err.response?.data?.message || 'Failed to load course');
        }
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    loadData();
  }, [id, token, user]);

  // Set first lesson as current when lessons are loaded
  useEffect(() => {
    if (lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessons]);

  // Check enrollment separately
  useEffect(() => {
    if (!user || !id || hasLoaded.current.enrollment) return;

    const checkEnrollment = async () => {
      try {
        const response = await enrollmentService.getMyEnrollments();
        const enrollments = response.data?.enrollments || [];
        const enrolled = enrollments.find((e: any) => 
          e.course?.id === id || e.course === id
        );
        
        if (enrolled) {
          setIsEnrolled(true);
          setEnrollmentId(enrolled.id);
        }
        hasLoaded.current.enrollment = true;
      } catch (err) {
        console.error('Failed to check enrollment:', err);
      }
    };

    checkEnrollment();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentService.enrollInCourse(id!);
      setIsEnrolled(true);
      alert('🎉 Successfully enrolled in course!');
    } catch (err: any) {
      if (err.response?.status === 429) {
        alert('Too many requests. Please wait a moment and try again.');
      } else {
        alert(err.response?.data?.message || 'Failed to enroll in course');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleCreateLesson = async (data: LessonFormData) => {
    try {
      setFormLoading(true);
      
      const lessonData = {
        title: data.title,
        description: data.description,
        duration: data.duration,
        videoUrl: data.videoUrl,
        videoProvider: data.videoProvider,
        isPreview: data.isPreview,
        order: lessons.length + 1,
        resources: data.resources
          .filter(r => r.title && r.url)
          .map(r => ({
            title: r.title,
            fileUrl: r.url,
            fileType: 'application/octet-stream'
          }))
      };
  
      const response = await lessonService.createLesson(id!, lessonData);
      setLessons([...lessons, response.data.lesson]);
      setShowLessonForm(false);
      alert('✅ Lesson created successfully!');
    } catch (err: any) {
      console.error('Failed to create lesson:', err);
      alert(err.response?.data?.message || 'Failed to create lesson');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleUpdateLesson = async (data: LessonFormData) => {
    if (!editingLesson) return;
    try {
      setFormLoading(true);
      
      const lessonData = {
        title: data.title,
        description: data.description,
        duration: data.duration,
        videoUrl: data.videoUrl,
        videoProvider: data.videoProvider,
        isPreview: data.isPreview,
        resources: data.resources
          .filter(r => r.title && r.url)
          .map(r => ({
            title: r.title,
            fileUrl: r.url,
            fileType: 'application/octet-stream'
          }))
      };
  
      const response = await lessonService.updateLesson(id!, editingLesson.id, lessonData);
      setLessons(lessons.map(l => l.id === editingLesson.id ? response.data.lesson : l));
      setEditingLesson(null);
      setShowLessonForm(false);
      alert('✅ Lesson updated successfully!');
    } catch (err: any) {
      console.error('Failed to update lesson:', err);
      alert(err.response?.data?.message || 'Failed to update lesson');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await lessonService.deleteLesson(id!, lessonId);
      setLessons(lessons.filter(l => l.id !== lessonId));
      if (currentLesson?.id === lessonId) {
        setCurrentLesson(lessons[0] || null);
      }
      alert('✅ Lesson deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete lesson:', err);
      alert(err.response?.data?.message || 'Failed to delete lesson');
    }
  };
  
  // Helper function to convert Lesson to LessonFormData
  const getLessonFormData = (lesson: Lesson | null): Partial<LessonFormData> | undefined => {
    if (!lesson) return undefined;
    return {
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl || '',
      videoProvider: lesson.videoProvider || 'youtube',
      isPreview: lesson.isPreview,
      resources: lesson.resources?.map(r => ({ title: r.title, url: r.fileUrl })) || []
    };
  };

  const handleCreateReview = async (data: { rating: number; title: string; comment: string }) => {
    try {
      await reviewService.createReview(id!, data);
      setShowReviewForm(false);
      // Refresh reviews
      const reviewsResponse = await reviewService.getCourseReviews(id!, 1);
      setReviews(reviewsResponse.data.reviews || []);
      setReviewStats({
        averageRating: reviewsResponse.data.statistics?.averageRating || 0,
        totalReviews: reviewsResponse.data.statistics?.totalReviews || 0,
        ratingDistribution: reviewsResponse.data.statistics?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
      alert('✅ Review submitted! Thank you for your feedback.');
    } catch (err: any) {
      if (err.response?.status === 429) {
        alert('Too many requests. Please wait a moment and try again.');
      } else {
        alert(err.response?.data?.message || 'Failed to submit review');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading course details...</p>
          <p className="text-sm text-gray-400 mt-2">Course ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    const isAuthError = error === 'Please log in to view this course';
    const isPermissionError = error === 'You do not have permission to view this course';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">
            {isAuthError ? '🔐' : isPermissionError ? '🚫' : '😕'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isAuthError ? 'Authentication Required' : isPermissionError ? 'Access Denied' : 'Error'}
          </h2>
          <p className="text-gray-600 mb-4">{error || 'The course you\'re looking for doesn\'t exist.'}</p>
          <p className="text-xs text-gray-400 mb-4">Course ID: {id}</p>
          
          {isAuthError && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                This course is not published yet. Please log in with the teacher account that created it.
              </p>
              <button
                onClick={() => navigate('/login', { state: { from: `/courses/${id}` } })}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Log In to View
              </button>
            </div>
          )}
          
          {isPermissionError && (
            <p className="text-sm text-gray-500 mb-4">
              You don't have permission to view this course. It may belong to another teacher.
            </p>
          )}
          
          <button
            onClick={() => navigate('/courses')}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium mt-3"
          >
            Browse Other Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/courses')}
            className="mb-6 inline-flex items-center text-white/90 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">{course.title}</h1>
                <WishlistButton courseId={course.id} />
              </div>
              
              <p className="text-xl text-white/90 mb-6 line-clamp-3">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <LevelBadge level={course.level} />
                <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                  <Rating value={reviewStats.averageRating} size="sm" />
                  <span className="ml-2 text-sm">
                    ({reviewStats.totalReviews} reviews)
                  </span>
                </div>
                <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-sm">{course.enrolledStudents || 0} students</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">
                    {course.teacher?.name?.charAt(0).toUpperCase() || 'T'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-white/80">Created by</p>
                  <p className="font-semibold">{course.teacher?.name || 'Unknown Instructor'}</p>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-800">
                <PriceTag price={course.price} size="lg" className="mb-4" />
                
                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 font-semibold text-lg mb-4"
                  >
                    {enrolling ? 'Processing...' : 'Enroll Now'}
                  </button>
                ) : (
                  <div className="text-center p-4 bg-green-50 text-green-700 rounded-xl font-semibold mb-4 border-2 border-green-200">
                    <span className="text-2xl block mb-2">✅</span>
                    You're enrolled in this course
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{course.totalLessons || lessons.length} on-demand video lessons</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Access on mobile and TV</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'content', label: 'Course Content', icon: '📚', count: lessons.length },
              { id: 'reviews', label: 'Reviews', icon: '⭐', count: reviewStats.totalReviews }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {course.objectives && course.objectives.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="text-2xl mr-2">🎯</span>
                    What you'll learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="text-2xl mr-2">📋</span>
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-2">📝</span>
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-2">ℹ️</span>
                  Course Details
                </h2>
                <dl className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <dt className="text-gray-500">Category</dt>
                    <dd className="font-medium">{course.category?.name || 'Uncategorized'}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <dt className="text-gray-500">Level</dt>
                    <dd className="font-medium capitalize">{course.level}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <dt className="text-gray-500">Total Lessons</dt>
                    <dd className="font-medium">{course.totalLessons || lessons.length}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <dt className="text-gray-500">Total Duration</dt>
                    <dd className="font-medium">{course.totalDuration || 0} minutes</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <dt className="text-gray-500">Language</dt>
                    <dd className="font-medium">English</dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt className="text-gray-500">Last Updated</dt>
                    <dd className="font-medium">
                      {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <LessonList
                lessons={lessons}
                currentLessonId={currentLesson?.id}
                onLessonSelect={setCurrentLesson}
                isTeacher={isTeacher || isAdmin}
                onCreateClick={() => {
                  setEditingLesson(null);
                  setShowLessonForm(true);
                }}
                onEdit={(lesson) => {
                  setEditingLesson(lesson);
                  setShowLessonForm(true);
                }}
                onDelete={handleDeleteLesson}
              />
            </div>
            <div className="lg:col-span-2">
              {currentLesson ? (
                <LessonPlayer lesson={currentLesson} />
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="text-6xl mb-4">📺</div>
                  <p className="text-gray-500 text-lg">No lesson selected</p>
                  <p className="text-gray-400 mt-2">
                    {lessons.length === 0 
                      ? 'This course has no lessons yet.' 
                      : 'Select a lesson from the list to start learning.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-2">⭐</span>
                  Reviews
                </h2>
                
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {reviewStats.averageRating.toFixed(1)}
                  </div>
                  <Rating value={reviewStats.averageRating} size="lg" className="justify-center" />
                  <p className="text-sm text-gray-500 mt-2">
                    Based on {reviewStats.totalReviews} reviews
                  </p>
                </div>

                {canReview && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Write a Review
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    onSubmit={handleCreateReview}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              {reviewsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="text-6xl mb-4">💭</div>
                  <p className="text-gray-500 text-lg">No reviews yet</p>
                  <p className="text-gray-400 mt-2">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lesson Form Modal - Always accessible */}
      {showLessonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
                </h2>
                <button
                  onClick={() => {
                    setShowLessonForm(false);
                    setEditingLesson(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <LessonForm
                initialData={getLessonFormData(editingLesson)}
                onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson}
                onCancel={() => {
                  setShowLessonForm(false);
                  setEditingLesson(null);
                }}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;