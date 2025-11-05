import React, { useState } from 'react';

interface FooterProps {
  t: (key: any) => string;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000); // Reset after 5 seconds
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-start">
        {/* About & Copyright */}
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">Luminaires Algériens</h3>
          <p className="text-sm">&copy; {new Date().getFullYear()} {t('footer_text')}</p>
          <div className="mt-2">
            <a href="#/admin" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
              Admin Panel
            </a>
          </div>
        </div>
        
        {/* Legal Links */}
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#/privacy" className="text-sm hover:underline">{t('footer_privacy_policy')}</a></li>
            <li><a href="#/legal" className="text-sm hover:underline">{t('footer_legal_notice')}</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{t('newsletter_title')}</h3>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder={t('newsletter_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">
              {t('newsletter_subscribe')}
            </button>
          </form>
          {subscribed && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 animate-fade-in">{t('newsletter_success')}</p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
