import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual admin API calls
      // For now, using mock data
      setStats({
        totalUsers: 150,
        totalStudents: 120,
        totalTeachers: 25,
        totalCourses: 45,
        totalEnrollments: 350,
        totalRevenue: 12500
      });
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-500' },
    { title: 'Students', value: stats.totalStudents, icon: '🎓', color: 'bg-green-500' },
    { title: 'Teachers', value: stats.totalTeachers, icon: '👨‍🏫', color: 'bg-purple-500' },
    { title: 'Courses', value: stats.totalCourses, icon: '📚', color: 'bg-orange-500' },
    { title: 'Enrollments', value: stats.totalEnrollments, icon: '📝', color: 'bg-red-500' },
    { title: 'Revenue', value: `$${stats.totalRevenue}`, icon: '💰', color: 'bg-yellow-500' }
  ];

  const quickActions = [
    { title: 'Manage Users', icon: '👥', path: '/admin/users', color: 'bg-blue-600' },
    { title: 'Manage Categories', icon: '📑', path: '/admin/categories', color: 'bg-green-600' },
    { title: 'View Reports', icon: '📊', path: '/admin/reports', color: 'bg-purple-600' },
    { title: 'System Settings', icon: '⚙️', path: '/admin/settings', color: 'bg-orange-600' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className={`${stat.color} text-white text-xs px-2 py-1 rounded`}>
                  {stat.title}
                </span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-left`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="font-semibold">{action.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">New user registration</p>
              <p className="text-sm text-gray-500">John Doe joined as a teacher</p>
            </div>
            <span className="text-xs text-gray-400">2 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">New course created</p>
              <p className="text-sm text-gray-500">JavaScript Masterclass was published</p>
            </div>
            <span className="text-xs text-gray-400">15 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">New enrollment</p>
              <p className="text-sm text-gray-500">5 students enrolled in React course</p>
            </div>
            <span className="text-xs text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
