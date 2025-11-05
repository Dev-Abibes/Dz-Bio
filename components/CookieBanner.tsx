import React, { useState, useEffect } from 'react';

interface CookieBannerProps {
  t: (key: string) => string;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ t }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 dark:bg-black/95 backdrop-blur-sm text-white p-4 z-50 animate-fade-in">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center sm:text-start">
          {t('cookie_banner_text')}
        </p>
        <button 
          onClick={handleAccept} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-md text-sm transition-colors flex-shrink-0"
        >
          {t('cookie_banner_accept')}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
