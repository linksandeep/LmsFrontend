import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

interface LoginPageProps {
  onLogin: (user: any, token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return <LoginForm onLogin={onLogin} />;
};

export default LoginPage;
