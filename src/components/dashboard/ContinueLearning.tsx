import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ContinueItem {
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  nextLessonId: string;
  nextLessonTitle: string;
  progress: number;
  lastAccessedAt: string;
}

interface ContinueLearningProps {
  items: ContinueItem[];
}

const ContinueLearning: React.FC<ContinueLearningProps> = ({ items }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No courses in progress</p>
        <p className="text-gray-400 mt-2">Start learning by enrolling in a course!</p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.courseId}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/courses/${item.courseId}?lesson=${item.nextLessonId}`)}
          >
            <div className="flex items-start space-x-4">
              {item.courseThumbnail ? (
                <img
                  src={item.courseThumbnail}
                  alt={item.courseTitle}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.courseTitle}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Next: {item.nextLessonTitle}
                </p>
                
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-2">
                  Last accessed {formatDate(item.lastAccessedAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueLearning;
