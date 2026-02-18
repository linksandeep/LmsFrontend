import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import StatsCard from '../../components/admin/StatsCard';
import RecentActivity from '../../components/admin/RecentActivity';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
}

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

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats from API
      const statsResponse = await adminService.getDashboardStats();
      setStats(statsResponse.data || {
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        totalRevenue: 0
      });

      // Load recent activity
      const activityResponse = await adminService.getRecentActivity(10);
      setActivities(activityResponse.data?.activities || []);
      
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setError('Failed to load dashboard data. Please try again.');
      
      // Fallback to mock data if API fails
      setStats({
        totalUsers: 150,
        totalStudents: 120,
        totalTeachers: 25,
        totalCourses: 45,
        totalEnrollments: 350,
        totalRevenue: 12500
      });
      
      setActivities([
        {
          id: '1',
          type: 'user',
          action: 'New user registration',
          description: 'John Doe joined as a teacher',
          timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
          userId: '1',
          icon: '👤',
          color: 'bg-blue-100'
        },
        {
          id: '2',
          type: 'course',
          action: 'New course created',
          description: 'JavaScript Masterclass was published',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          courseId: '1',
          icon: '📚',
          color: 'bg-green-100'
        },
        {
          id: '3',
          type: 'enrollment',
          action: 'New enrollment',
          description: '5 students enrolled in React course',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          courseId: '2',
          icon: '🎓',
          color: 'bg-purple-100'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Manage Users',
      icon: '👥',
      path: '/admin/users',
      color: 'bg-blue-600',
      description: 'Add, edit, or remove users'
    },
    {
      title: 'Manage Categories',
      icon: '📑',
      path: '/admin/categories',
      color: 'bg-green-600',
      description: 'Organize courses by category'
    },
    {
      title: 'View Reports',
      icon: '📊',
      path: '/admin/reports',
      color: 'bg-purple-600',
      description: 'Analytics and insights'
    },
    {
      title: 'System Settings',
      icon: '⚙️',
      path: '/admin/settings',
      color: 'bg-orange-600',
      description: 'Configure platform settings'
    }
  ];

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-100',
      onClick: () => navigate('/admin/users')
    },
    {
      title: 'Students',
      value: stats.totalStudents,
      icon: '🎓',
      color: 'bg-green-100',
      onClick: () => navigate('/admin/users?role=student')
    },
    {
      title: 'Teachers',
      value: stats.totalTeachers,
      icon: '👨‍🏫',
      color: 'bg-purple-100',
      onClick: () => navigate('/admin/users?role=teacher')
    },
    {
      title: 'Courses',
      value: stats.totalCourses,
      icon: '📚',
      color: 'bg-orange-100',
      onClick: () => navigate('/admin/courses')
    },
    {
      title: 'Enrollments',
      value: stats.totalEnrollments,
      icon: '📝',
      color: 'bg-red-100',
      onClick: () => navigate('/admin/reports/enrollments')
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '��',
      color: 'bg-yellow-100',
      onClick: () => navigate('/admin/reports/revenue')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage your platform</p>
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              {error} Showing sample data.
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              onClick={stat.onClick}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-left"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity
          activities={activities}
          onViewAll={() => navigate('/admin/activity')}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
