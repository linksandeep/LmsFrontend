import React from 'react';

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'student': return '/dashboard/student';
      case 'teacher': return '/dashboard/teacher';
      case 'admin': return '/dashboard/admin';
      default: return '/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold text-blue-600">
              LMS Platform
            </a>
            
            <div className="hidden md:flex space-x-4">
              <a href="/courses" className="text-gray-700 hover:text-blue-600">
                Courses
              </a>
              {user?.role === 'teacher' && (
                <a href="/courses/create" className="text-gray-700 hover:text-blue-600">
                  Create Course
                </a>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Hi, {user.name}</span>
                <a href={getDashboardLink()} className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </a>
                <button
                  onClick={onLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
