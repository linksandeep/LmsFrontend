import React from 'react';

interface Stats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessonsWatched: number;
  certificatesEarned: number;
}

interface StudentStatsProps {
  stats: Stats;
}

const StudentStats: React.FC<StudentStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: '��',
      color: 'bg-blue-500'
    },
    {
      title: 'In Progress',
      value: stats.inProgressCourses,
      icon: '📖',
      color: 'bg-yellow-500'
    },
    {
      title: 'Completed',
      value: stats.completedCourses,
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Certificates',
      value: stats.certificatesEarned,
      icon: '🎓',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`${stat.color} text-white text-xs px-2 py-1 rounded`}>
                {stat.title}
              </span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentStats;
