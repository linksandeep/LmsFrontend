import React, { useState } from 'react';
import Rating from '../common/Rating';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: {
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title?: string;
    comment: string;
    helpful: number;
    createdAt: string;
  };
  onHelpful?: () => void;
  onReport?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpful, onReport }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [markedHelpful, setMarkedHelpful] = useState(false);

  const handleHelpful = () => {
    if (!markedHelpful) {
      setHelpfulCount(helpfulCount + 1);
      setMarkedHelpful(true);
      onHelpful?.();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="text-blue-600 font-semibold">
                {review.userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Rating value={review.rating} size="sm" />
      </div>

      {review.title && (
        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
      )}
      
      <p className="text-gray-600 mb-4">{review.comment}</p>

      <div className="flex items-center justify-between">
        <button
          onClick={handleHelpful}
          className={`flex items-center space-x-1 text-sm transition-colors ${
            markedHelpful ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>Helpful ({helpfulCount})</span>
        </button>

        <button
          onClick={onReport}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Report
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
