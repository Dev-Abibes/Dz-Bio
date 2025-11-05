import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  votes?: number;
  className?: string;
  isEditable?: boolean;
  onRate?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, votes, className = '', isEditable = false, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const totalStars = 5;
  const displayRating = hoverRating || Math.round(rating);

  const handleRate = (rateValue: number) => {
    if (isEditable && onRate) {
      onRate(rateValue);
    }
  };

  const handleMouseEnter = (rateValue: number) => {
    if (isEditable) {
      setHoverRating(rateValue);
    }
  };

  const handleMouseLeave = () => {
    if (isEditable) {
      setHoverRating(0);
    }
  };

  const starContainerClasses = isEditable ? 'cursor-pointer' : '';

  return (
    <div className={`flex items-center ${className}`} title={`${rating.toFixed(1)} out of ${totalStars} stars`}>
      <div className={`flex items-center ${starContainerClasses}`} onMouseLeave={handleMouseLeave}>
        {[...Array(totalStars)].map((_, i) => {
          const starValue = i + 1;
          const starClass = starValue <= displayRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500';

          return (
            <button
              key={i}
              type="button"
              disabled={!isEditable}
              onClick={() => handleRate(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              className="p-0 bg-transparent border-none"
              aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <svg aria-hidden="true" className={`w-5 h-5 fill-current ${starClass}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            </button>
          );
        })}
      </div>
       <span className="sr-only">{displayRating} out of {totalStars} stars</span>
       <span className="text-xs text-gray-500 dark:text-gray-400 ms-1">({rating.toFixed(1)})</span>
       {votes !== undefined && (
         <span className="text-xs text-gray-500 dark:text-gray-400 ms-2">
           ({votes} votes)
         </span>
       )}
    </div>
  );
};

export default StarRating;