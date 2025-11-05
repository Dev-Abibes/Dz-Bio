import React from 'react';
import { Personality } from '../types';
import StarRating from './StarRating';

interface PersonalityCardProps {
  personality: Personality;
  onSelect: (id: number) => void;
}

const PersonalityCard: React.FC<PersonalityCardProps> = ({ personality, onSelect }) => {
  const currentLang = document.documentElement.lang as 'en' | 'fr' | 'ar';

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => onSelect(personality.id)}
    >
      <div className="w-full h-64">
        <img
          src={personality.mainImageUrl}
          alt={personality.name[currentLang]}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white truncate">{personality.name[currentLang]}</h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">{personality.domain}</p>
        </div>
        <div>
          <StarRating rating={personality.rating} votes={personality.ratingVotes} className="mt-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {personality.birthYear} – {personality.deathYear || '...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalityCard;