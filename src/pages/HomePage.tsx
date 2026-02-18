import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to LMS Platform</h1>
      <p className="text-xl text-gray-600 mb-8">Your complete learning management solution</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Learn Anywhere</h3>
          <p className="text-gray-600">Access courses on any device, anytime, anywhere</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
          <p className="text-gray-600">Learn from industry experts with real-world experience</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Get Certified</h3>
          <p className="text-gray-600">Earn certificates and boost your career</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
