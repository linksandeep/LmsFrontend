import React from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from '../common/Rating';
import LevelBadge from '../common/LevelBadge';
import PriceTag from '../common/PriceTag';
import WishlistButton from '../common/WishlistButton';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    shortDescription: string;
    thumbnail?: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    teacher: {
      name: string;
    };
    enrolledStudents?: number;
    averageRating?: number;
    totalReviews?: number;
  };
  onEnroll?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative cursor-pointer" onClick={handleClick}>
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <LevelBadge level={course.level} size="sm" />
        </div>
        
        {/* Wishlist Button */}
        <div className="absolute top-3 right-3">
          <WishlistButton courseId={course.id} />
        </div>
      </div>
      
      <div className="p-5">
        {/* Course Title */}
        <h3
          onClick={handleClick}
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
        >
          {course.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.shortDescription}
        </p>
        
        {/* Instructor & Students */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="truncate">By {course.teacher.name}</span>
          <span className="mx-2">•</span>
          <span>{course.enrolledStudents || 0} students</span>
        </div>
        
        {/* Rating */}
        {course.averageRating ? (
          <div className="flex items-center mb-3">
            <Rating value={course.averageRating} size="sm" />
            <span className="text-xs text-gray-500 ml-2">
              ({course.totalReviews || 0} reviews)
            </span>
          </div>
        ) : (
          <div className="mb-3">
            <span className="text-xs text-gray-400">No ratings yet</span>
          </div>
        )}
        
        {/* Price and Enroll Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <PriceTag price={course.price} size="md" />
          
          <button
            onClick={onEnroll || handleClick}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {onEnroll ? 'Enroll Now' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
