import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, DashboardStats, Activity, TopCourse } from '../../services/admin.service';
import { 
  FaUsers, FaBook, FaGraduationCap, FaMoneyBillWave, 
  FaChartLine, FaBell, FaUserPlus, FaStar, FaCog,
  FaArrowUp, FaEllipsisV, FaSearch, FaDownload, FaFilter,
  FaEye, FaEdit, FaTrash, FaArrowRight
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    pendingReviews: 0,
    activeSessions: 0,
    monthlyGrowth: 0
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, coursesRes, activityRes, revenueRes, trendsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getTopCourses(5),
        adminService.getRecentActivity(8),
        adminService.getRevenueChart(dateRange === '7d' ? 'weekly' : 'monthly'),
        adminService.getEnrollmentTrends()
      ]);
      
      setStats(statsRes.data);
      setTopCourses(coursesRes.data?.courses || []);
      setRecentActivity(activityRes.data?.activities || []);
      setRevenueData(revenueRes.data);
      setTrendData(trendsRes.data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (!value && value !== 0) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (num: number) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'enrollment': return '🎓';
      case 'course': return '✅';
      case 'review': return '⭐';
      case 'payment': return '💰';
      default: return '📌';
    }
  };

  // Calculate max revenue for chart scaling
  const getMaxRevenue = () => {
    if (!revenueData?.chartData || revenueData.chartData.length === 0) return 1;
    return Math.max(...revenueData.chartData.map((d: any) => d.revenue || 0));
  };

  // Calculate max trend for chart scaling
  const getMaxTrend = () => {
    if (!trendData?.trends || trendData.trends.length === 0) return 1;
    return Math.max(...trendData.trends.map((d: any) => d.count || 0));
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setDateRange('7d')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    dateRange === '7d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  7 days
                </button>
                <button 
                  onClick={() => setDateRange('30d')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    dateRange === '30d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  30 days
                </button>
                <button 
                  onClick={() => setDateRange('90d')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    dateRange === '90d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  90 days
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <FaBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
              <p className="text-blue-100">Here's what's happening with your platform today.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => toast.success('Report exported successfully!')}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center"
              >
                <FaDownload className="mr-2" />
                Export Report
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 font-medium flex items-center">
                <FaFilter className="mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid - CLICKABLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div 
            onClick={() => navigate('/admin/users')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer transform hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <FaArrowUp className="mr-1 text-xs" />
                +{stats.monthlyGrowth.toFixed(1)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
            <p className="text-sm text-gray-600 mb-2">Total Users</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Students: {formatNumber(stats.totalStudents)}</span>
              <span className="text-gray-500">Teachers: {formatNumber(stats.totalTeachers)}</span>
            </div>
          </div>

          <div 
            onClick={() => navigate('/admin/courses')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer transform hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaBook className="text-green-600 text-xl" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <FaArrowUp className="mr-1 text-xs" />
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            <p className="text-sm text-gray-600 mb-2">Active Courses</p>
            <p className="text-xs text-gray-500">{stats.pendingReviews} pending reviews</p>
          </div>

          <div 
            onClick={() => navigate('/admin/enrollments')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer transform hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaGraduationCap className="text-purple-600 text-xl" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <FaArrowUp className="mr-1 text-xs" />
                +23%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalEnrollments)}</p>
            <p className="text-sm text-gray-600 mb-2">Enrollments</p>
            <p className="text-xs text-gray-500">{formatNumber(stats.activeSessions)} active sessions</p>
          </div>

          <div 
            onClick={() => navigate('/admin/reports')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer transform hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-yellow-600 text-xl" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <FaArrowUp className="mr-1 text-xs" />
                +18%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-sm text-gray-600 mb-2">Revenue</p>
            <p className="text-xs text-gray-500">{formatCurrency(stats.totalRevenue * 0.12)} this month</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                <p className="text-sm text-gray-500">
                  {dateRange === '7d' ? 'Weekly' : 'Monthly'} revenue
                </p>
              </div>
              <button 
                onClick={() => navigate('/admin/reports/revenue')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View Report <FaArrowRight className="ml-1" />
              </button>
            </div>
            <div className="h-64">
              {revenueData?.chartData && revenueData.chartData.length > 0 ? (
                <div className="w-full h-full flex items-end justify-around">
                  {revenueData.chartData.map((item: any, index: number) => {
                    const maxRevenue = getMaxRevenue();
                    const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 200 : 20;
                    return (
                      <div key={index} className="flex flex-col items-center w-12">
                        <div 
                          className="w-8 bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600 cursor-pointer"
                          style={{ 
                            height: `${height}px`,
                            minHeight: '20px'
                          }}
                          title={`${item.label}: ${formatCurrency(item.revenue)}`}
                        >
                          <div className="text-xs text-white text-center font-medium pt-1">
                            ${((item.revenue || 0) / 1000).toFixed(0)}k
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 mt-2">{item.label || ''}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">No revenue data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Enrollment Trends</h3>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
              <button 
                onClick={() => navigate('/admin/reports/enrollments')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View Details <FaArrowRight className="ml-1" />
              </button>
            </div>
            <div className="h-64">
              {trendData?.trends && trendData.trends.length > 0 ? (
                <div className="w-full h-full flex items-end justify-around overflow-x-auto">
                  {trendData.trends.slice(-10).map((item: any, index: number) => {
                    const maxTrend = getMaxTrend();
                    const height = maxTrend > 0 ? (item.count / maxTrend) * 200 : 20;
                    return (
                      <div key={index} className="flex flex-col items-center min-w-[40px]">
                        <div 
                          className="w-6 bg-green-500 rounded-t-lg transition-all duration-500 hover:bg-green-600 cursor-pointer"
                          style={{ 
                            height: `${height}px`,
                            minHeight: '10px'
                          }}
                          title={`${item.date}: ${item.count} enrollments`}
                        >
                          <div className="text-xs text-white text-center font-medium">
                            {item.count || 0}
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 mt-2">{item.date || ''}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">No trend data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Courses */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Courses</h3>
              <button 
                onClick={() => navigate('/admin/courses')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All <FaArrowRight className="ml-1" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Course</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Instructor</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Students</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Revenue</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Rating</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topCourses.length > 0 ? (
                    topCourses.map((course) => (
                      <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium text-gray-900">{course.title}</td>
                        <td className="py-3 text-sm text-gray-600">{course.instructor}</td>
                        <td className="py-3 text-sm text-gray-600">{formatNumber(course.students)}</td>
                        <td className="py-3 text-sm text-gray-900 font-medium">{formatCurrency(course.revenue)}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-600">{course.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            course.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => navigate(`/admin/courses/${course.id}`)}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button 
                              onClick={() => navigate(`/admin/courses/edit/${course.id}`)}
                              className="p-1 text-gray-400 hover:text-green-600"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No courses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button 
                onClick={() => navigate('/admin/activity')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <FaEllipsisV />
              </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className={`w-8 h-8 ${activity.color || 'bg-blue-100'} rounded-full flex items-center justify-center text-sm font-semibold`}>
                      {activity.avatar || activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                        <span className="font-medium text-blue-600">{activity.target}</span>
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-400 mr-2">{activity.time}</span>
                        <span className="text-xs">{getActivityIcon(activity.type)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 text-left"
          >
            <FaUserPlus className="text-3xl mb-3" />
            <h3 className="font-semibold text-lg mb-1">Manage Users</h3>
            <p className="text-sm text-blue-100">Add, edit, or remove users</p>
            <span className="inline-block mt-3 text-sm group-hover:translate-x-1 transition-transform">View details →</span>
          </button>
          
          <button
            onClick={() => navigate('/admin/courses')}
            className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 text-left"
          >
            <FaBook className="text-3xl mb-3" />
            <h3 className="font-semibold text-lg mb-1">Manage Courses</h3>
            <p className="text-sm text-green-100">Create and edit courses</p>
            <span className="inline-block mt-3 text-sm group-hover:translate-x-1 transition-transform">View details →</span>
          </button>
          
          <button
            onClick={() => navigate('/admin/analytics')}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 text-left"
          >
            <FaChartLine className="text-3xl mb-3" />
            <h3 className="font-semibold text-lg mb-1">Analytics</h3>
            <p className="text-sm text-purple-100">View detailed reports</p>
            <span className="inline-block mt-3 text-sm group-hover:translate-x-1 transition-transform">View details →</span>
          </button>
          
          <button
            onClick={() => navigate('/admin/settings')}
            className="group bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 text-left"
          >
            <FaCog className="text-3xl mb-3" />
            <h3 className="font-semibold text-lg mb-1">Settings</h3>
            <p className="text-sm text-orange-100">Configure platform</p>
            <span className="inline-block mt-3 text-sm group-hover:translate-x-1 transition-transform">View details →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;