import React, { useState, useEffect } from 'react';
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
import LessonForm from '../../components/lesson/LessonForm';
import ReviewCard from '../../components/course/ReviewCard';
import ReviewForm from '../../components/course/ReviewForm';
import Rating from '../../components/common/Rating';
import LevelBadge from '../../components/common/LevelBadge';
import PriceTag from '../../components/common/PriceTag';
import WishlistButton from '../../components/common/WishlistButton';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Course state
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  
  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'reviews'>('overview');
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isTeacher = user?.role === 'teacher' && course?.teacher?.id === user?.id;
  const isAdmin = user?.role === 'admin';
  const canReview = isEnrolled && !reviews.some(r => r.userId === user?.id);

  useEffect(() => {
    if (!id) {
      setError('Invalid course ID');
      setLoading(false);
      return;
    }
    loadCourseData();
    if (user) {
      checkEnrollmentStatus();
    }
  }, [id, user]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError('');
      const courseResponse = await courseService.getCourse(id!);
      
      // Handle different response structures
      if (courseResponse.data?.course) {
        setCourse(courseResponse.data.course);
        setReviews(courseResponse.data.reviews || []);
      } else if (courseResponse.data) {
        setCourse(courseResponse.data);
      }
      
      // Load lessons
      const lessonsResponse = await lessonService.getCourseLessons(id!);
      setLessons(lessonsResponse.data.lessons || []);
      
      // Set first lesson as current if available
      if (lessonsResponse.data.lessons?.length > 0) {
        setCurrentLesson(lessonsResponse.data.lessons[0]);
      }
    } catch (err: any) {
      console.error('Failed to load course:', err);
      setError(err.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
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
    } catch (err) {
      console.error('Failed to check enrollment:', err);
    }
  };

  const loadReviews = async (page = 1) => {
    try {
      setReviewsLoading(true);
      const response = await reviewService.getCourseReviews(id!, page);
      const newReviews = response.data.reviews || [];
      
      if (page === 1) {
        setReviews(newReviews);
        setReviewStats({
          averageRating: response.data.statistics?.averageRating || 0,
          totalReviews: response.data.statistics?.totalReviews || 0,
          ratingDistribution: response.data.statistics?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      } else {
        setReviews([...reviews, ...newReviews]);
      }
      
      setHasMoreReviews(newReviews.length === 10);
      setReviewPage(page);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      const response = await enrollmentService.enrollInCourse(id!);
      setIsEnrolled(true);
      setEnrollmentId(response.data?.enrollment?.id || null);
      alert('Successfully enrolled in course! 🎉');
      
      // Reload course data to show full content
      loadCourseData();
    } catch (err: any) {
      console.error('Enrollment error:', err);
      alert(err.response?.data?.message || 'Failed to enroll in course');
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
      alert('Lesson created successfully!');
    } catch (err: any) {
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
      alert('Lesson updated successfully!');
    } catch (err: any) {
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
      alert('Lesson deleted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete lesson');
    }
  };

  const handleCreateReview = async (data: { rating: number; title: string; comment: string }) => {
    try {
      await reviewService.createReview(id!, data);
      setShowReviewForm(false);
      loadReviews(1);
      alert('Review submitted successfully! Thank you for your feedback.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      await reviewService.markHelpful(id!, reviewId);
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      ));
    } catch (err) {
      console.error('Failed to mark helpful:', err);
    }
  };

  const handleReport = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to report this review?')) return;
    try {
      await reviewService.reportReview(id!, reviewId);
      alert('Review reported. Thank you for helping keep our community safe.');
    } catch (err) {
      console.error('Failed to report review:', err);
    }
  };

  const handleLessonComplete = async () => {
    if (isEnrolled && currentLesson && enrollmentId) {
      try {
        await enrollmentService.updateProgress(enrollmentId, currentLesson.id, true);
        console.log('Progress updated for lesson:', currentLesson.id);
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    }
  };

  if (!id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Invalid course ID
        </div>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Course not found'}
        </div>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/courses')}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <WishlistButton courseId={course.id} />
              </div>
              
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <LevelBadge level={course.level} />
                <div className="flex items-center">
                  <Rating value={reviewStats.averageRating} size="sm" />
                  <span className="text-sm text-gray-500 ml-2">
                    ({reviewStats.totalReviews} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {course.enrolledStudents || 0} students
                </span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-600 text-sm font-semibold">
                    {course.teacher?.name?.charAt(0).toUpperCase() || 'T'}
                  </span>
                </div>
                <span className="text-gray-700">
                  Created by <span className="font-semibold">{course.teacher?.name}</span>
                </span>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <PriceTag price={course.price} size="lg" className="mb-4" />
              
              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {enrolling ? 'Processing...' : 'Enroll Now'}
                </button>
              ) : (
                <div className="text-center p-3 bg-green-100 text-green-700 rounded-lg font-medium">
                  ✓ You're enrolled in this course
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                <p>This course includes:</p>
                <ul className="mt-2 space-y-1">
                  <li>📹 {course.totalLessons || lessons.length} on-demand video lessons</li>
                  <li>📝 Full lifetime access</li>
                  <li>📱 Access on mobile and TV</li>
                  <li>🎓 Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Course Content ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews ({reviewStats.totalReviews})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {course.objectives && course.objectives.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Requirements</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Course Details</h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">Category</dt>
                    <dd className="font-medium">{course.category?.name || 'Uncategorized'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Level</dt>
                    <dd className="font-medium capitalize">{course.level}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Total Lessons</dt>
                    <dd className="font-medium">{course.totalLessons || lessons.length}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Total Duration</dt>
                    <dd className="font-medium">{course.totalDuration || 0} minutes</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Last Updated</dt>
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
              {(isTeacher || isAdmin) && (
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setEditingLesson(null);
                      setShowLessonForm(true);
                    }}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    + Add New Lesson
                  </button>
                </div>
              )}
              
              <LessonList
                lessons={lessons}
                currentLessonId={currentLesson?.id}
                onLessonSelect={(lesson) => setCurrentLesson(lesson)}
                isTeacher={isTeacher || isAdmin}
                onEdit={(lesson) => {
                  setEditingLesson(lesson);
                  setShowLessonForm(true);
                }}
                onDelete={handleDeleteLesson}
              />
            </div>

            <div className="lg:col-span-2">
              {showLessonForm ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
                  </h2>
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
              ) : currentLesson ? (
                <LessonPlayer
                  lesson={currentLesson}
                  onComplete={handleLessonComplete}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
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
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {reviewStats.averageRating.toFixed(1)}
                  </div>
                  <Rating value={reviewStats.averageRating} size="lg" className="justify-center" />
                  <p className="text-sm text-gray-500 mt-2">
                    Based on {reviewStats.totalReviews} reviews
                  </p>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewStats.ratingDistribution[star as keyof typeof reviewStats.ratingDistribution] || 0;
                    const percentage = reviewStats.totalReviews > 0 
                      ? (count / reviewStats.totalReviews) * 100 
                      : 0;
                    
                    return (
                      <div key={star} className="flex items-center">
                        <span className="text-sm text-gray-600 w-8">{star} ★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                          <div
                            className="h-2 bg-yellow-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">{count}</span>
                      </div>
                    );
                  })}
                </div>

                {canReview && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

              {reviewsLoading && reviews.length === 0 ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-500 text-lg">No reviews yet</p>
                  <p className="text-gray-400 mt-2">Be the first to review this course!</p>
                </div>
              ) : (
                <>
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onHelpful={() => handleHelpful(review.id)}
                      onReport={() => handleReport(review.id)}
                    />
                  ))}
                  
                  {hasMoreReviews && (
                    <button
                      onClick={() => loadReviews(reviewPage + 1)}
                      className="w-full py-3 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Load More Reviews
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
