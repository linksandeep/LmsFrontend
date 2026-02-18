import React from 'react';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className={`flex items-baseline ${className}`}>
      <span className={`${sizeClasses[size]} font-bold text-blue-600`}>
        {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className="ml-2 text-sm text-gray-400 line-through">
            ${originalPrice.toFixed(2)}
          </span>
          <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
            {discount}% off
          </span>
        </>
      )}
    </div>
  );
};

export default PriceTag;
