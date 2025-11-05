
import React from 'react';
import { Domain } from '../types';

interface FiltersProps {
  filters: {
    domain: string;
    birthYear: string;
    deathYear: string;
    status: string;
    gender: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  domains: Domain[];
  t: (key: any) => string;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters, domains, t }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      domain: 'all',
      birthYear: '',
      deathYear: '',
      status: 'all',
      gender: 'all',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Domain Filter */}
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('filter_by_domain')}</label>
          <select id="domain" name="domain" value={filters.domain} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
            <option value="all">{t('all_domains')}</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Birth Year Filter */}
        <div>
          <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('filter_by_birth_year')}</label>
          <input type="text" name="birthYear" id="birthYear" value={filters.birthYear} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
        </div>

        {/* Death Year Filter */}
        <div>
          <label htmlFor="deathYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('filter_by_death_year')}</label>
          <input type="text" name="deathYear" id="deathYear" value={filters.deathYear} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('filter_by_status')}</label>
          <select id="status" name="status" value={filters.status} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
            <option value="all">{t('status_all')}</option>
            <option value="alive">{t('status_alive')}</option>
            <option value="deceased">{t('status_deceased')}</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('filter_by_gender')}</label>
          <select id="gender" name="gender" value={filters.gender} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
            <option value="all">{t('gender_all')}</option>
            <option value="male">{t('gender_male')}</option>
            <option value="female">{t('gender_female')}</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button onClick={resetFilters} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            {t('reset_filters')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
