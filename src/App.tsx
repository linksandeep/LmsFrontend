import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const StudentDashboardPage = lazy(() => import('./pages/dashboard/StudentDashboardPage'));
const TeacherDashboardPage = lazy(() => import('./pages/dashboard/TeacherDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/dashboard/AdminDashboardPage'));
const TeacherAnalyticsPage = lazy(() => import('./pages/dashboard/TeacherAnalyticsPage'));
const CoursesPage = lazy(() => import('./pages/course/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/course/CourseDetailPage'));
const CreateCoursePage = lazy(() => import('./pages/course/CreateCoursePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const TestBackendPage = lazy(() => import('./pages/TestBackendPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'student') return <Navigate to="/dashboard/student" replace />;
    if (user.role === 'teacher') return <Navigate to="/dashboard/teacher" replace />;
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Role-based dashboard redirect
const DashboardRouter = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'student':
      return <Navigate to="/dashboard/student" replace />;
    case 'teacher':
      return <Navigate to="/dashboard/teacher" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const handleLogin = (userData: any, token: string) => {
    setUser(userData);
  };

  const handleRegister = (userData: any, token: string) => {
    setUser(userData);
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Layout user={user} onLogout={handleLogout}>
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/login" element={
            <Layout user={user} onLogout={handleLogout}>
              <Suspense fallback={<PageLoader />}>
                <LoginPage onLogin={handleLogin} />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/register" element={
            <Layout user={user} onLogout={handleLogout}>
              <Suspense fallback={<PageLoader />}>
                <RegisterPage onRegister={handleRegister} />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/forgot-password" element={
            <Layout user={user} onLogout={handleLogout}>
              <Suspense fallback={<PageLoader />}>
                <ForgotPasswordPage />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/courses" element={
            <Layout user={user} onLogout={handleLogout}>
              <Suspense fallback={<PageLoader />}>
                <CoursesPage />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/courses/:id" element={
            <Layout user={user} onLogout={handleLogout}>
              <Suspense fallback={<PageLoader />}>
                <CourseDetailPage />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/test-backend" element={
            <Layout user={user} onLogout={handleLogout}>
              <Suspense fallback={<PageLoader />}>
                <TestBackendPage />
              </Suspense>
            </Layout>
          } />
          
          {/* Protected Routes */}
          <Route path="/courses/create" element={
            <Layout user={user} onLogout={handleLogout}>
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <Suspense fallback={<PageLoader />}>
                  <CreateCoursePage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/profile" element={
            <Layout user={user} onLogout={handleLogout}>
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ProfilePage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/wishlist" element={
            <Layout user={user} onLogout={handleLogout}>
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <WishlistPage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/certificates" element={
            <Layout user={user} onLogout={handleLogout}>
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <CertificatesPage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/settings" element={
            <Layout user={user} onLogout={handleLogout}>
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <SettingsPage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          } />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <Layout user={user} onLogout={handleLogout}>
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <DashboardRouter />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/dashboard/student" element={
            <Layout user={user} onLogout={handleLogout}>
              <ProtectedRoute allowedRoles={['student']}>
                <Suspense fallback={<PageLoader />}>
                  <StudentDashboardPage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/dashboard/teacher" element={
            <Layout user={user} onLogout={handleLogout}>
              <ProtectedRoute allowedRoles={['teacher']}>
                <Suspense fallback={<PageLoader />}>
                  <TeacherDashboardPage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/dashboard/teacher/analytics" element={
            <Layout user={user} onLogout={handleLogout}>
              <ProtectedRoute allowedRoles={['teacher']}>
                <Suspense fallback={<PageLoader />}>
                  <TeacherAnalyticsPage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/dashboard/admin" element={
            <Layout user={user} onLogout={handleLogout}>
              <ProtectedRoute allowedRoles={['admin']}>
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboardPage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;