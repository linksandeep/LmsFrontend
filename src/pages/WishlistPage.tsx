import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistService } from '../services/wishlist.service';
import { courseService } from '../services/course.service';

interface WishlistItem {
  id: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    thumbnail?: string;
    level: string;
    price: number;
    teacher: { name: string };
    enrolledStudents: number;
    averageRating: number;
  };
  addedAt: string;
}

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      setItems(response.data?.items || []);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (courseId: string) => {
    try {
      await wishlistService.removeFromWishlist(courseId);
      setItems(items.filter(item => item.courseId !== courseId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    navigate(`/courses/${courseId}`);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">Courses you've saved for later</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-8xl mb-6">💝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save courses you're interested in and they'll appear here</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all"
              >
                <div
                  onClick={() => navigate(`/courses/${item.courseId}`)}
                  className="cursor-pointer"
                >
                  {item.course.thumbnail ? (
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-4xl">📚</span>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      onClick={() => navigate(`/courses/${item.courseId}`)}
                      className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 flex-1"
                    >
                      {item.course.title}
                    </h3>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getLevelColor(item.course.level)}`}>
                      {item.course.level}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    by {item.course.teacher?.name || 'Instructor'}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>⭐ {item.course.averageRating?.toFixed(1) || 'New'}</span>
                    <span className="mx-2">•</span>
                    <span>{item.course.enrolledStudents || 0} students</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(item.course.price)}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRemove(item.courseId)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove from wishlist"
                      >
                        <span className="text-xl">🗑️</span>
                      </button>
                      <button
                        onClick={() => handleEnroll(item.courseId)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
