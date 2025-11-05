import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Personality, Media } from '../types';
import StarRating from './StarRating';

interface PersonalityDetailProps {
  personality: Personality;
  allPersonalities: Personality[];
  onClose: () => void;
  onSelectRelated: (id: number) => void;
  onRate: (personId: number, rating: number) => void;
  t: (key: any) => string;
}

const PersonalityDetail: React.FC<PersonalityDetailProps> = ({ personality, allPersonalities, onClose, onSelectRelated, onRate, t }) => {
    const currentLang = document.documentElement.lang as 'en' | 'fr' | 'ar';
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    const [summary, setSummary] = useState<string | null>(null);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

    useEffect(() => {
      // Reset state when personality changes
      setSummary(null);
      setIsLoadingSummary(false);
      setSummaryError(null);
      setSelectedMedia(null);
    }, [personality.id]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
            setSelectedMedia(null);
           }
        };
        window.addEventListener('keydown', handleEsc);
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
      }, []);

    const handleGenerateSummary = async () => {
      if (!process.env.API_KEY) {
        setSummaryError("API Key is not configured. Please contact the administrator.");
        return;
      }
      setIsLoadingSummary(true);
      setSummaryError(null);
      setSummary(null);

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const langName = { 'en': 'English', 'fr': 'French', 'ar': 'Arabic' }[currentLang];
        const prompt = `Based on the following biography, provide a concise, one-paragraph summary in ${langName}. The summary should be engaging and capture the essence of the person's life and impact:\n\n${personality.bio[currentLang]}`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        setSummary(response.text);
      } catch (error) {
        console.error("Error generating summary:", error);
        setSummaryError(t('ai_summary_error'));
      } finally {
        setIsLoadingSummary(false);
      }
    };

    const getRelatedPerson = (id: number) => allPersonalities.find(p => p.id === id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 animate-fade-in">
        {selectedMedia && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
                onClick={() => setSelectedMedia(null)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="media-caption"
            >
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <button 
                        onClick={() => setSelectedMedia(null)} 
                        className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 z-20 hover:bg-black/75 transition-colors"
                        aria-label="Close media view"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <div className="flex-grow flex items-center justify-center p-4">
                    {selectedMedia.type === 'image' ? (
                        <img src={selectedMedia.url} alt={selectedMedia.caption} className="max-w-full max-h-[75vh] object-contain" />
                    ) : (
                        <video src={selectedMedia.url} controls autoPlay className="max-w-full max-h-[75vh] object-contain">
                            Your browser does not support the video tag.
                        </video>
                    )}
                    </div>
                    {selectedMedia.caption && (
                        <div className="p-4 bg-gray-100 dark:bg-gray-900 text-center">
                            <p id="media-caption" className="text-gray-800 dark:text-gray-200">{selectedMedia.caption}</p>
                        </div>
                    )}
                </div>
            </div>
        )}

      <button onClick={onClose} className="mb-6 text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={dir === 'rtl' ? { transform: 'scaleX(-1)'} : {}}>
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {t('back_to_gallery')}
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Image and Info */}
        <div className="md:w-1/3 flex-shrink-0">
          <img src={personality.mainImageUrl} alt={personality.name[currentLang]} className="w-full rounded-lg shadow-md object-cover" />
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
             <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-2">{personality.name[currentLang]}</h3>
             <p className="text-sm"><strong>{t('born')}:</strong> {personality.birthYear}, {personality.birthPlace[currentLang]}</p>
             {personality.deathYear && <p className="text-sm"><strong>{t('died')}:</strong> {personality.deathYear}</p>}
             <p className="text-sm"><strong>{t('filter_by_domain')}:</strong> {personality.domain}</p>
          </div>
        </div>

        {/* Right Column: Bio and Details */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{personality.name[currentLang]}</h1>
          <h2 className="text-2xl text-emerald-600 dark:text-emerald-400 mb-2">{personality.domain}</h2>
          <StarRating 
            rating={personality.rating} 
            votes={personality.ratingVotes} 
            className="mb-6"
            isEditable={true}
            onRate={(newRating) => onRate(personality.id, newRating)}
          />
          
          <div className="flex justify-between items-center border-b-2 border-emerald-500 pb-1 mb-2">
            <h3 className="text-2xl font-semibold">{t('biography')}</h3>
            {!summary && !isLoadingSummary && (
              <button
                onClick={handleGenerateSummary}
                className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-md text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                disabled={isLoadingSummary}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5a1.5 1.5 0 01.956 2.812l-2.128 2.129A1.5 1.5 0 015.688 9.54l2.129-2.128A1.5 1.5 0 0110 3.5zM10 16.5a1.5 1.5 0 01-2.812-.956l2.128-2.129a1.5 1.5 0 012.128-2.128l-2.129 2.128A1.5 1.5 0 0110 16.5zM13.596 10.456a1.5 1.5 0 01-2.128 2.128L9.34 10.456a1.5 1.5 0 012.128-2.128l2.128 2.128zM6.404 9.544a1.5 1.5 0 012.128-2.128L10.66 9.544a1.5 1.5 0 01-2.128 2.128L6.404 9.544z" />
                </svg>
                {isLoadingSummary ? t('ai_summary_generating') : t('ai_summary_button')}
              </button>
            )}
          </div>
          
          {/* AI Summary Section */}
          {isLoadingSummary && (
              <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700/50 my-4 text-center animate-pulse">
                  <p>{t('ai_summary_generating')}</p>
              </div>
          )}
          {summaryError && (
              <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 my-4">
                  <p>{summaryError}</p>
              </div>
          )}
          {summary && (
              <blockquote className="p-4 rounded-lg bg-emerald-50 dark:bg-gray-700/50 my-4 border-s-4 border-emerald-500">
                  <h4 className="font-bold text-lg mb-2 text-emerald-800 dark:text-emerald-300">{t('ai_summary_title')}</h4>
                  <p className="text-gray-700 dark:text-gray-300 italic">{summary}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{t('ai_summary_disclaimer')}</p>
              </blockquote>
          )}

          <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
            {personality.bio[currentLang].split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
          </div>

          {personality.notableWorks.length > 0 && (
            <>
              <h3 className="text-2xl font-semibold mt-6 mb-2 border-b-2 border-emerald-500 pb-1">{t('notable_works')}</h3>
              <ul className="list-disc ps-6 text-gray-700 dark:text-gray-300">
                {personality.notableWorks.map((work, index) => <li key={index}>"{work.title[currentLang]}" ({work.year})</li>)}
              </ul>
            </>
          )}

          {personality.relations.length > 0 && (
            <>
              <h3 className="text-2xl font-semibold mt-6 mb-2 border-b-2 border-emerald-500 pb-1">{t('relations')}</h3>
              <div className="flex flex-wrap gap-4">
                {personality.relations.map(relation => {
                    const relatedPerson = getRelatedPerson(relation.personId);
                    if (!relatedPerson) return null;
                    const relationKey = `relation_${relation.type}`;
                    const relationText = t(relationKey) || relation.type;
                    const personName = relatedPerson.name[currentLang];
                    return (
                        <button 
                            key={relation.personId} 
                            onClick={() => onSelectRelated(relatedPerson.id)} 
                            className="bg-emerald-50 dark:bg-gray-700/50 text-emerald-800 dark:text-emerald-300 p-2 rounded-lg text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-sm"
                            aria-label={`View details for ${personName}, ${relationText}`}
                        >
                           <strong>{relationText}:</strong> {personName}
                        </button>
                    )
                })}
              </div>
            </>
          )}

            {personality.mediaGallery.length > 0 && (
            <>
              <h3 className="text-2xl font-semibold mt-6 mb-2 border-b-2 border-emerald-500 pb-1">{t('media_gallery')}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {personality.mediaGallery.map((media, index) => (
                  <button key={index} onClick={() => setSelectedMedia(media)} className="relative aspect-square block w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                    {media.type === 'image' ? (
                      <img src={media.url} alt={media.caption} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50"></div>
                        <svg className="w-1/3 h-1/3 text-white z-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                      </div>
                    )}
                     <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-25 transition-all duration-300"></div>
                  </button>
                ))}
              </div>
            </>
          )}

          {personality.externalLinks.length > 0 && (
             <>
              <h3 className="text-2xl font-semibold mt-6 mb-2 border-b-2 border-emerald-500 pb-1">{t('external_links')}</h3>
              <div className="flex flex-wrap gap-4">
                {personality.externalLinks.map(link => (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.name} className="text-emerald-600 dark:text-emerald-400 hover:underline">
                        {link.name}
                    </a>
                ))}
              </div>
             </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalityDetail;