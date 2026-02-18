import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle'; // Add this import

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
    <nav className="bg-white shadow-lg dark:bg-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              LMS Platform
            </a>
            
            <div className="hidden md:flex space-x-4">
              <a href="/courses" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Courses
              </a>
              {user?.role === 'teacher' && (
                <a href="/courses/create" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Create Course
                </a>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 dark:text-gray-300">Hi, {user.name}</span>
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Dashboard Link */}
                <a href={getDashboardLink()} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Dashboard
                </a>
                
                {/* Wishlist Link */}
                <Link to="/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                  <span className="text-xl mr-1">💝</span>
                  Wishlist
                </Link>
                
                {/* Certificates Link */}
                <Link to="/certificates" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                  <span className="text-xl mr-1">🏆</span>
                  Certificates
                </Link>
                
                {/* Settings Link */}
                <Link to="/settings" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                  <span className="text-xl mr-1">⚙️</span>
                  Settings
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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