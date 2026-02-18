import React from 'react';

interface LevelBadgeProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  size?: 'sm' | 'md';
  className?: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'md', className = '' }) => {
  const getLevelStyles = () => {
    switch (level) {
      case 'beginner':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '🌱',
          label: 'Beginner'
        };
      case 'intermediate':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: '📊',
          label: 'Intermediate'
        };
      case 'advanced':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '🚀',
          label: 'Advanced'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: '📚',
          label: level
        };
    }
  };

  const styles = getLevelStyles();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${styles.bg} ${styles.text} ${sizeClasses} ${className}`}
    >
      <span className="mr-1">{styles.icon}</span>
      {styles.label}
    </span>
  );
};

export default LevelBadge;
