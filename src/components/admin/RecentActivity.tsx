import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  type: 'user' | 'course' | 'enrollment' | 'review';
  action: string;
  description: string;
  timestamp: string;
  userId?: string;
  courseId?: string;
  icon: string;
  color: string;
}

interface RecentActivityProps {
  activities: Activity[];
  onViewAll?: () => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, onViewAll }) => {
  const navigate = useNavigate();

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handleActivityClick = (activity: Activity) => {
    if (activity.userId) {
      navigate(`/admin/users/${activity.userId}`);
    } else if (activity.courseId) {
      navigate(`/courses/${activity.courseId}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
                (activity.userId || activity.courseId) ? 'hover:bg-gray-50 cursor-pointer' : ''
              }`}
            >
              <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center text-xl flex-shrink-0`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{getTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
