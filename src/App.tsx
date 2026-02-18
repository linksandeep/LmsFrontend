import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import StudentDashboardPage from './pages/dashboard/StudentDashboardPage';
import TeacherDashboardPage from './pages/dashboard/TeacherDashboardPage';
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage';
import CoursesPage from './pages/course/CoursesPage';
import CourseDetailPage from './pages/course/CourseDetailPage';
import CreateCoursePage from './pages/course/CreateCoursePage';
import TestBackendPage from './pages/TestBackendPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
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
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout user={user} onLogout={handleLogout}>
            <HomePage />
          </Layout>
        } />
        
        <Route path="/login" element={
          <Layout user={user} onLogout={handleLogout}>
            <LoginPage onLogin={handleLogin} />
          </Layout>
        } />
        
        <Route path="/register" element={
          <Layout user={user} onLogout={handleLogout}>
            <RegisterPage onRegister={handleRegister} />
          </Layout>
        } />
        
        <Route path="/forgot-password" element={
          <Layout user={user} onLogout={handleLogout}>
            <ForgotPasswordPage />
          </Layout>
        } />
        
        <Route path="/courses" element={
          <Layout user={user} onLogout={handleLogout}>
            <CoursesPage />
          </Layout>
        } />
        
        <Route path="/courses/:id" element={
          <Layout user={user} onLogout={handleLogout}>
            <CourseDetailPage />
          </Layout>
        } />
        
        <Route path="/courses/create" element={
          <Layout user={user} onLogout={handleLogout}>
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <CreateCoursePage />
            </ProtectedRoute>
          </Layout>
        } />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <Layout user={user} onLogout={handleLogout}>
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          </Layout>
        } />
        
        <Route path="/dashboard/student" element={
          <Layout user={user} onLogout={handleLogout}>
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          </Layout>
        } />
        
        <Route path="/dashboard/teacher" element={
          <Layout user={user} onLogout={handleLogout}>
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboardPage />
            </ProtectedRoute>
          </Layout>
        } />
        
        <Route path="/dashboard/admin" element={
          <Layout user={user} onLogout={handleLogout}>
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          </Layout>
        } />
        
        <Route path="/test-backend" element={
          <Layout user={user} onLogout={handleLogout}>
            <TestBackendPage />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
