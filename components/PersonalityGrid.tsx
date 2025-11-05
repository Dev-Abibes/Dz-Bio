import React, { useState } from 'react';
import { Personality } from '../types';
import PersonalityCard from './PersonalityCard';
import Pagination from './Pagination';

interface PersonalityGridProps {
  personalities: Personality[];
  onSelectPersonality: (id: number) => void;
  t: (key: any) => string;
}

const ITEMS_PER_PAGE = 20;

const PersonalityGrid: React.FC<PersonalityGridProps> = ({ personalities, onSelectPersonality, t }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(personalities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPersonalities = personalities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (personalities.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">{t('no_results_title')}</h2>
        <p className="text-gray-600 dark:text-gray-300">{t('no_results_desc')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentPersonalities.map(p => (
          <PersonalityCard key={p.id} personality={p} onSelect={onSelectPersonality} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          t={t}
        />
      )}
    </div>
  );
};

export default PersonalityGrid;