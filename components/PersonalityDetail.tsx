
// FIX: Replaced invalid file content with a functional PersonalityDetail component.
// This component displays details of a selected personality and integrates with the Gemini API to generate a summary of their biography.
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Personality, Language } from '../types';
import StarRating from './StarRating';

interface PersonalityDetailProps {
  personality: Personality;
  allPersonalities: Personality[];
  onClose: () => void;
  onSelectRelated: (id: number) => void;
  onRate: (personId: number, newRatingValue: number) => void;
  t: (key: any) => string;
}

const PersonalityDetail: React.FC<PersonalityDetailProps> = ({
  personality,
  allPersonalities,
  onClose,
  onSelectRelated,
  onRate,
  t,
}) => {
  const currentLang = document.documentElement.lang as Language;
  const dir = document.documentElement.dir;
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setSummaryError('');
    setAiSummary('');

    try {
      // FIX: Correctly initialize the GoogleGenAI client and generate content using the 'gemini-2.5-flash' model for text summarization.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = `Provide a concise, engaging summary (around 100 words) in ${currentLang} for the biography of ${personality.name[currentLang]}. Biography: "${personality.bio[currentLang]}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      // FIX: Access the generated text via the `response.text` property as per the updated SDK guidelines.
      const summaryText = response.text;
      if (summaryText) {
        setAiSummary(summaryText);
      } else {
        setSummaryError(t('ai_summary_error'));
      }
    } catch (error) {
      console.error('Error generating AI summary:', error);
      setSummaryError(t('ai_summary_error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const findPersonNameById = (id: number) => {
    const person = allPersonalities.find(p => p.id === id);
    return person ? person.name[currentLang] : `Person ID: ${id}`;
  };

  const getRelationText = (type: string) => {
    const key = `relation_${type}`;
    return t(key as any) || type;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-8 animate-fade-in">
      <button onClick={onClose} className="mb-6 text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={dir === 'rtl' ? { transform: 'scaleX(-1)'} : {}}>
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {t('back_to_gallery')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and basic info */}
        <div className="lg:col-span-1">
          <img src={personality.mainImageUrl} alt={personality.name[currentLang]} className="w-full rounded-lg shadow-md mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{personality.name[currentLang]}</h1>
          <p className="text-xl text-emerald-600 dark:text-emerald-400 font-semibold mb-4">{personality.domain}</p>
          <StarRating rating={personality.rating} votes={personality.ratingVotes} isEditable onRate={(newRating) => onRate(personality.id, newRating)} />
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p><strong>{t('born')}:</strong> {personality.birthYear} {t('in')} {personality.birthPlace[currentLang]}</p>
            {personality.deathYear && <p><strong>{t('died')}:</strong> {personality.deathYear}</p>}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2">
          {/* AI Summary Section */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-6 border dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-3">{t('ai_summary_title')}</h2>
            {!aiSummary && !isGenerating && !summaryError && (
              <button onClick={handleGenerateSummary} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                {t('ai_summary_button')}
              </button>
            )}
            {isGenerating && <p className="text-gray-500 dark:text-gray-400 animate-pulse">{t('ai_summary_generating')}</p>}
            {summaryError && <p className="text-red-500">{summaryError}</p>}
            {aiSummary && (
              <div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{aiSummary}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('ai_summary_disclaimer')}</p>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-3 border-b-2 border-emerald-500 pb-2">{t('biography')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{personality.bio[currentLang]}</p>

          {personality.notableWorks.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-3 border-b-2 border-emerald-500 pb-2">{t('notable_works')}</h2>
              <ul className="list-disc ps-5 space-y-1 text-gray-700 dark:text-gray-300">
                {personality.notableWorks.map((work, index) => (
                  <li key={index}>{work.title[currentLang]} ({work.year})</li>
                ))}
              </ul>
            </div>
          )}

          {personality.awards.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-3 border-b-2 border-emerald-500 pb-2">{t('awards')}</h2>
              <ul className="list-disc ps-5 space-y-1 text-gray-700 dark:text-gray-300">
                {personality.awards.map((award, index) => (
                  <li key={index}>{award}</li>
                ))}
              </ul>
            </div>
          )}
          
          {personality.relations.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-3 border-b-2 border-emerald-500 pb-2">{t('relations')}</h2>
              <ul className="list-disc ps-5 space-y-1 text-gray-700 dark:text-gray-300">
                {personality.relations.map((relation, index) => (
                  <li key={index}>
                    {getRelationText(relation.type)}: <button onClick={() => onSelectRelated(relation.personId)} className="text-emerald-600 dark:text-emerald-400 hover:underline">{findPersonNameById(relation.personId)}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {personality.mediaGallery.length > 0 && (
             <div className="mt-6">
              <h2 className="text-2xl font-bold mb-3 border-b-2 border-emerald-500 pb-2">{t('media_gallery')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {personality.mediaGallery.map((media, index) => (
                      <div key={index} className="group">
                          <img src={media.url} alt={media.caption} className="w-full h-auto rounded-md shadow-md transition-transform duration-300 group-hover:scale-105" />
                          <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">{media.caption}</p>
                      </div>
                  ))}
              </div>
            </div>
          )}

          {personality.externalLinks.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-3 border-b-2 border-emerald-500 pb-2">{t('external_links')}</h2>
              <ul className="list-disc ps-5 space-y-1 text-gray-700 dark:text-gray-300">
                {personality.externalLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalityDetail;
