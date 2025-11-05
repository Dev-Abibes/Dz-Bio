import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { personalities as initialPersonalities, DOMAINS } from './services/api';
import { Personality, Language } from './types';
import Header from './components/Header';
import PersonalityGrid from './components/PersonalityGrid';
import PersonalityDetail from './components/PersonalityDetail';
import Filters from './components/Filters';
import AdminPage from './components/AdminPage';
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import LegalNoticePage from './components/LegalNoticePage';
import { useTranslations } from './hooks/useTranslations';

const App: React.FC = () => {
  const [allPersonalities, setAllPersonalities] = useState<Personality[]>(initialPersonalities);
  const [selectedPersonalityId, setSelectedPersonalityId] = useState<number | null>(null);
  const [language, setLanguage] = useState<Language>('fr');
  const { t, setLang, dir } = useTranslations();
  const [page, setPage] = useState(window.location.hash || '#/');
  const [isAdmin, setIsAdmin] = useState(false);

  const [filters, setFilters] = useState({
    domain: 'all',
    birthYear: '',
    deathYear: '',
    status: 'all',
    gender: 'all',
  });

  useEffect(() => {
    setLang(language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, setLang, dir]);

  // Check for admin status in session storage on initial load
  useEffect(() => {
    if (sessionStorage.getItem('isAdmin') === 'true') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setPage(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (page === '#/admin' || page ==='#/login' || page ==='#/privacy' || page ==='#/legal') {
      setSelectedPersonalityId(null);
    }
  }, [page]);

  const handleLogin = useCallback((user: string, pass: string) => {
    // This simulates a database check. In a real app, this would be an API call.
    if (user === 'admin' && pass === 'admin123') {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      window.location.hash = '#/admin';
    } else {
      alert(t('login_error'));
    }
  }, [t]);

  const handleLogout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
    window.location.hash = '#/';
  }, []);

  const handleSelectPersonality = useCallback((id: number) => {
    setSelectedPersonalityId(id);
    window.scrollTo(0, 0);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedPersonalityId(null);
  }, []);
  
  const handleRatingChange = useCallback((personId: number, newRatingValue: number) => {
    setAllPersonalities(prevPersonalities =>
      prevPersonalities.map(p => {
        if (p.id === personId) {
          const currentVotes = p.ratingVotes || 0;
          const newVotes = currentVotes + 1;
          const newAverageRating = ((p.rating * currentVotes) + newRatingValue) / newVotes;
          return { ...p, rating: newAverageRating, ratingVotes: newVotes };
        }
        return p;
      })
    );
  }, []);

  const handleAddPersonality = useCallback((newPersonData: Omit<Personality, 'id'>) => {
    setAllPersonalities(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1;
      const newPersonality: Personality = {
        ...newPersonData,
        id: newId,
      };
      return [...prev, newPersonality];
    });
  }, []);

  const handleDeletePersonality = useCallback((personId: number) => {
    setAllPersonalities(prev => prev.filter(p => p.id !== personId));
  }, []);

  const handleUpdatePersonality = useCallback((updatedPerson: Personality) => {
    setAllPersonalities(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
  }, []);

  const filteredPersonalities = useMemo(() => {
    return allPersonalities.filter(p => {
      const { domain, birthYear, deathYear, status, gender } = filters;
      
      const domainMatch = domain === 'all' || p.domain === domain;
      const birthYearMatch = !birthYear || p.birthYear.toString().includes(birthYear);
      const deathYearMatch = !deathYear || (p.deathYear && p.deathYear.toString().includes(deathYear));
      const statusMatch = status === 'all' || (status === 'alive' && !p.deathYear) || (status === 'deceased' && !!p.deathYear);
      const genderMatch = gender === 'all' || p.gender === gender;

      return domainMatch && birthYearMatch && deathYearMatch && statusMatch && genderMatch;
    });
  }, [filters, allPersonalities]);

  const selectedPersonality = useMemo(
    () => allPersonalities.find(p => p.id === selectedPersonalityId),
    [allPersonalities, selectedPersonalityId]
  );
  
  const renderContent = () => {
    switch(page) {
      case '#/admin':
        return isAdmin 
          ? <AdminPage
              personalities={allPersonalities} 
              onAddPersonality={handleAddPersonality}
              onUpdatePersonality={handleUpdatePersonality}
              onDeletePersonality={handleDeletePersonality}
              t={t}
              domains={DOMAINS}
            />
          : <LoginPage onLogin={handleLogin} t={t} />;
      case '#/login':
        return <LoginPage onLogin={handleLogin} t={t} />;
      case '#/privacy':
        return <PrivacyPolicyPage t={t} />;
      case '#/legal':
        return <LegalNoticePage t={t} />;
      default:
        if (selectedPersonality) {
          return (
            <PersonalityDetail
              personality={selectedPersonality}
              allPersonalities={allPersonalities}
              onClose={handleCloseDetail}
              onSelectRelated={handleSelectPersonality}
              onRate={handleRatingChange}
              t={t}
            />
          );
        }
        return (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800 dark:text-white">{t('main_title')}</h1>
            <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8">{t('main_subtitle')}</p>
            <Filters filters={filters} setFilters={setFilters} domains={DOMAINS} t={t} />
            <PersonalityGrid personalities={filteredPersonalities} onSelectPersonality={handleSelectPersonality} t={t} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header 
        currentLanguage={language} 
        onLanguageChange={setLanguage} 
        t={t} 
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <Footer t={t} />
      <CookieBanner t={t} />
    </div>
  );
};

export default App;
