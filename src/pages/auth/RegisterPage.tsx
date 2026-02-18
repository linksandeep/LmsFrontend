import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

interface RegisterPageProps {
  onRegister: (user: any, token: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  return <RegisterForm onRegister={onRegister} />;
};

export default RegisterPage;
