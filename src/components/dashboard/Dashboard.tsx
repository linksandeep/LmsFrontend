import React from 'react';

interface DashboardProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome</h3>
          <p className="text-xl font-medium">{user.name}</p>
          <p className="text-sm text-gray-600 mt-2 capitalize">Role: {user.role}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Email</h3>
          <p className="text-gray-600 break-all">{user.email}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Status</h3>
          <p className="text-green-600 font-medium">Active</p>
          <p className="text-sm text-gray-600 mt-2">Member since today</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 text-left">
            <div className="font-semibold mb-1">📚 Browse Courses</div>
            <p className="text-sm opacity-90">Find your next course</p>
          </button>
          
          <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 text-left">
            <div className="font-semibold mb-1">📈 My Progress</div>
            <p className="text-sm opacity-90">Track your learning</p>
          </button>
          
          <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 text-left">
            <div className="font-semibold mb-1">👤 Profile</div>
            <p className="text-sm opacity-90">Manage your account</p>
          </button>
          
          <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 text-left">
            <div className="font-semibold mb-1">⚙️ Settings</div>
            <p className="text-sm opacity-90">Customize preferences</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
