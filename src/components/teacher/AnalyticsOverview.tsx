import React from 'react';

interface AnalyticsOverviewProps {
  data: {
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
    averageRating: number;
    enrollmentTrend: Array<{ date: string; count: number }>;
    popularCourses: Array<{ courseTitle: string; students: number }>;
  };
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ data }) => {
  const statCards = [
    {
      title: 'Total Courses',
      value: data.totalCourses,
      icon: '📚',
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Students',
      value: data.totalStudents,
      icon: '👥',
      color: 'bg-green-500',
      change: '+23%'
    },
    {
      title: 'Total Revenue',
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'bg-purple-500',
      change: '+18%'
    },
    {
      title: 'Average Rating',
      value: data.averageRating.toFixed(1),
      icon: '⭐',
      color: 'bg-yellow-500',
      change: '+0.2'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className={`${stat.color} text-white text-xs px-2 py-1 rounded`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section - Placeholder for now */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Enrollment Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-400">Chart will be displayed here</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Popular Courses</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-400">Chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎓</span>
              <div>
                <p className="font-medium">New enrollment</p>
                <p className="text-sm text-gray-500">John Doe enrolled in React Course</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">2 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⭐</span>
              <div>
                <p className="font-medium">New review</p>
                <p className="text-sm text-gray-500">5-star review on JavaScript Course</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">1 hour ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-medium">Course completion</p>
                <p className="text-sm text-gray-500">Sarah Smith completed Python Course</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
