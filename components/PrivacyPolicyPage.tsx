import React from 'react';

interface PrivacyPolicyPageProps {
  t: (key: string) => string;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ t }) => {
  const dir = document.documentElement.dir;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 animate-fade-in max-w-4xl mx-auto">
      <a href="#/" className="mb-6 text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={dir === 'rtl' ? { transform: 'scaleX(-1)'} : {}}>
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {t('back_to_gallery')}
      </a>
      <h1 className="text-4xl font-bold mb-6">{t('privacy_policy_title')}</h1>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
        <p>{t('privacy_policy_content')}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
