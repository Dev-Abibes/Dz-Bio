import React, { useState, useEffect, useCallback } from 'react';
import { Personality, Domain, Language } from '../types';

type FormData = Omit<Personality, 'id'>;

interface AdminPageProps {
  personalities: Personality[];
  onAddPersonality: (person: FormData) => void;
  onUpdatePersonality: (person: Personality) => void;
  onDeletePersonality: (id: number) => void;
  t: (key: any) => string;
  domains: Domain[];
}

const initialFormState: FormData = {
  name: { fr: '', en: '', ar: '' },
  domain: 'Music',
  bio: { fr: '', en: '', ar: '' },
  birthYear: new Date().getFullYear(),
  deathYear: undefined,
  birthPlace: { fr: '', en: '', ar: '' },
  gender: 'male',
  mainImageUrl: 'https://picsum.photos/seed/new-person/400/500',
  rating: 0,
  ratingVotes: 0,
  mediaGallery: [],
  relations: [],
  notableWorks: [],
  awards: [],
  externalLinks: [],
};


const AdminPage: React.FC<AdminPageProps> = ({ personalities, onAddPersonality, onUpdatePersonality, onDeletePersonality, t, domains }) => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [editingPersonId, setEditingPersonId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const currentLang = document.documentElement.lang as Language;

  useEffect(() => {
    if (editingPersonId !== null) {
      const personToEdit = personalities.find(p => p.id === editingPersonId);
      if (personToEdit) {
        const { id, ...rest } = personToEdit;
        setFormData(rest);
        window.scrollTo(0, 0);
      }
    } else {
      setFormData(initialFormState);
    }
    setErrors({}); // Clear errors when switching modes
  }, [editingPersonId, personalities]);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    clearError(name);
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? (value ? parseInt(value, 10) : undefined) : value }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'name' | 'bio' | 'birthPlace', lang: 'fr' | 'en' | 'ar') => {
    const { value } = e.target;
    clearError(`${field}_${lang}`);
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleListChange = <T,>(index: number, e: React.ChangeEvent<HTMLInputElement>, listName: keyof FormData, fieldName?: keyof T) => {
      const { value } = e.target;
      const list = formData[listName] as T[];
      const fieldKey = (fieldName as string) || '';
      clearError(`${listName}_${fieldKey}_${index}`);
      const updatedList = list.map((item, i) => {
          if (i === index) {
              return typeof item === 'object' && fieldName ? { ...item, [fieldName]: value } : value;
          }
          return item;
      });
      setFormData(prev => ({ ...prev, [listName]: updatedList }));
  };

  const handleWorkChange = (index: number, e: React.ChangeEvent<HTMLInputElement>, field: 'year' | { lang: 'fr' | 'en' | 'ar' }) => {
      const { value } = e.target;
      const updatedWorks = formData.notableWorks.map((work, i) => {
          if (i === index) {
              if (field === 'year') {
                  clearError(`work_year_${index}`);
                  return { ...work, year: value ? parseInt(value, 10) : 0 };
              } else {
                  return { ...work, title: { ...work.title, [field.lang]: value } };
              }
          }
          return work;
      });
      setFormData(prev => ({ ...prev, notableWorks: updatedWorks }));
  };

  const handleAddToList = (listName: 'notableWorks' | 'awards' | 'externalLinks') => {
    if (listName === 'notableWorks') {
      setFormData(prev => ({ ...prev, notableWorks: [...prev.notableWorks, { title: { fr: '', en: '', ar: '' }, year: new Date().getFullYear() }] }));
    } else if (listName === 'awards') {
      setFormData(prev => ({ ...prev, awards: [...prev.awards, ''] }));
    } else if (listName === 'externalLinks') {
      setFormData(prev => ({ ...prev, externalLinks: [...prev.externalLinks, { name: '', url: '' }] }));
    }
  };

  const handleRemoveFromList = (index: number, listName: keyof FormData) => {
    const list = formData[listName] as any[];
    setFormData(prev => ({ ...prev, [listName]: list.filter((_, i) => i !== index) }));
  };

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    const currentYear = new Date().getFullYear();
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    if (!formData.name.fr.trim()) newErrors.name_fr = t('admin_validation_required');
    
    if (!formData.birthYear) {
      newErrors.birthYear = t('admin_validation_required');
    } else if (!/^\d{4}$/.test(String(formData.birthYear))) {
      newErrors.birthYear = t('admin_validation_year');
    } else if (formData.birthYear > currentYear) {
      newErrors.birthYear = t('admin_validation_year_future');
    }

    if (formData.deathYear) {
      if (!/^\d{4}$/.test(String(formData.deathYear))) {
        newErrors.deathYear = t('admin_validation_year');
      } else if (formData.deathYear > currentYear) {
        newErrors.deathYear = t('admin_validation_year_future');
      } else if (formData.birthYear && formData.deathYear < formData.birthYear) {
        newErrors.deathYear = t('admin_validation_death_year_after_birth');
      }
    }

    if (!formData.mainImageUrl || !urlRegex.test(formData.mainImageUrl)) {
      newErrors.mainImageUrl = t('admin_validation_url');
    }

    formData.notableWorks.forEach((work, index) => {
      if (!/^\d{4}$/.test(String(work.year)) || work.year > currentYear) {
        newErrors[`work_year_${index}`] = t('admin_validation_year');
      }
    });

    formData.externalLinks.forEach((link, index) => {
      if (!link.url || !urlRegex.test(link.url)) {
        newErrors[`link_url_${index}`] = t('admin_validation_url');
      }
    });

    return newErrors;
  }, [formData, t]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingPersonId !== null) {
      onUpdatePersonality({ ...formData, id: editingPersonId });
      alert('Personality updated successfully!');
    } else {
      onAddPersonality(formData);
      alert('Personality added successfully!');
    }
    setEditingPersonId(null);
  };

  const handleCancelEdit = () => {
    setEditingPersonId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('admin_delete_confirm'))) {
      onDeletePersonality(id);
    }
  };

  const filteredPersonalities = personalities.filter(p =>
    p.name[currentLang]?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.name[currentLang].localeCompare(b.name[currentLang]));
  
  const formInputClass = "mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500";
  const formLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const errorTextClass = "text-red-500 text-xs mt-1";
  const isEditing = editingPersonId !== null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 animate-fade-in max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{isEditing ? t('admin_update') : t('admin_title')}</h1>
            <a href="#/" className="text-emerald-600 dark:text-emerald-400 hover:underline">{t('admin_back_home')}</a>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="p-4 border dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('admin_section_basic')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={formLabelClass}>{t('admin_name_fr')}</label>
              <input type="text" value={formData.name.fr} onChange={e => handleNestedChange(e, 'name', 'fr')} className={`${formInputClass} ${errors.name_fr ? 'border-red-500' : ''}`} />
              {errors.name_fr && <p className={errorTextClass}>{errors.name_fr}</p>}
            </div>
            <div><label className={formLabelClass}>{t('admin_name_en')}</label><input type="text" value={formData.name.en} onChange={e => handleNestedChange(e, 'name', 'en')} className={formInputClass} /></div>
            <div><label className={formLabelClass}>{t('admin_name_ar')}</label><input type="text" value={formData.name.ar} onChange={e => handleNestedChange(e, 'name', 'ar')} className={formInputClass} dir="rtl"/></div>
            
            <div><label className={formLabelClass}>{t('admin_domain')}</label><select name="domain" value={formData.domain} onChange={handleSimpleChange} className={formInputClass}>{domains.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div>
                <label className={formLabelClass}>{t('admin_birth_year')}</label>
                <input type="number" name="birthYear" value={formData.birthYear || ''} onChange={handleSimpleChange} className={`${formInputClass} ${errors.birthYear ? 'border-red-500' : ''}`} />
                {errors.birthYear && <p className={errorTextClass}>{errors.birthYear}</p>}
            </div>
            <div>
                <label className={formLabelClass}>{t('admin_death_year')}</label>
                <input type="number" name="deathYear" value={formData.deathYear || ''} onChange={handleSimpleChange} className={`${formInputClass} ${errors.deathYear ? 'border-red-500' : ''}`} />
                {errors.deathYear && <p className={errorTextClass}>{errors.deathYear}</p>}
            </div>
            
            <div><label className={formLabelClass}>{t('admin_birth_place_fr')}</label><input type="text" value={formData.birthPlace.fr} onChange={e => handleNestedChange(e, 'birthPlace', 'fr')} className={formInputClass}/></div>
            <div><label className={formLabelClass}>{t('admin_birth_place_en')}</label><input type="text" value={formData.birthPlace.en} onChange={e => handleNestedChange(e, 'birthPlace', 'en')} className={formInputClass}/></div>
            <div><label className={formLabelClass}>{t('admin_birth_place_ar')}</label><input type="text" value={formData.birthPlace.ar} onChange={e => handleNestedChange(e, 'birthPlace', 'ar')} className={formInputClass} dir="rtl"/></div>
            
            <div><label className={formLabelClass}>{t('admin_gender')}</label><select name="gender" value={formData.gender} onChange={handleSimpleChange} className={formInputClass}><option value="male">{t('gender_male')}</option><option value="female">{t('gender_female')}</option></select></div>
            <div className="md:col-span-2">
                <label className={formLabelClass}>{t('admin_image_url')}</label>
                <input type="text" name="mainImageUrl" value={formData.mainImageUrl} onChange={handleSimpleChange} className={`${formInputClass} ${errors.mainImageUrl ? 'border-red-500' : ''}`} />
                {errors.mainImageUrl && <p className={errorTextClass}>{errors.mainImageUrl}</p>}
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="p-4 border dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('admin_section_bio')}</h2>
          <div className="space-y-4">
            <div><label className={formLabelClass}>{t('admin_bio_fr')}</label><textarea value={formData.bio.fr} onChange={e => handleNestedChange(e, 'bio', 'fr')} className={formInputClass} rows={4}></textarea></div>
            <div><label className={formLabelClass}>{t('admin_bio_en')}</label><textarea value={formData.bio.en} onChange={e => handleNestedChange(e, 'bio', 'en')} className={formInputClass} rows={4}></textarea></div>
            <div><label className={formLabelClass}>{t('admin_bio_ar')}</label><textarea value={formData.bio.ar} onChange={e => handleNestedChange(e, 'bio', 'ar')} className={formInputClass} rows={4} dir="rtl"></textarea></div>
          </div>
        </div>

        {/* Notable Works */}
        <div className="p-4 border dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('admin_section_works')}</h2>
            {formData.notableWorks.map((work, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 p-2 border dark:border-gray-600 rounded">
                    <input type="text" placeholder={t('admin_work_title_fr')} value={work.title.fr} onChange={e => handleWorkChange(index, e, { lang: 'fr' })} className={formInputClass} />
                    <input type="text" placeholder={t('admin_work_title_en')} value={work.title.en} onChange={e => handleWorkChange(index, e, { lang: 'en' })} className={formInputClass} />
                    <input type="text" placeholder={t('admin_work_title_ar')} value={work.title.ar} onChange={e => handleWorkChange(index, e, { lang: 'ar' })} className={formInputClass} dir="rtl" />
                    <div>
                        <input type="number" placeholder={t('admin_work_year')} value={work.year} onChange={e => handleWorkChange(index, e, 'year')} className={`${formInputClass} ${errors[`work_year_${index}`] ? 'border-red-500' : ''}`} />
                        {errors[`work_year_${index}`] && <p className={errorTextClass}>{errors[`work_year_${index}`]}</p>}
                    </div>
                    <button type="button" onClick={() => handleRemoveFromList(index, 'notableWorks')} className="bg-red-500 text-white px-2 py-1 rounded text-sm">{t('admin_remove')}</button>
                </div>
            ))}
            <button type="button" onClick={() => handleAddToList('notableWorks')} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">{t('admin_add_work')}</button>
        </div>
        
        {/* Awards */}
        <div className="p-4 border dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('admin_section_awards')}</h2>
            {formData.awards.map((award, index) => (
                <div key={index} className="flex gap-2 mb-2">
                    <input type="text" placeholder={t('admin_award_name')} value={award} onChange={e => handleListChange(index, e, 'awards')} className={formInputClass} />
                    <button type="button" onClick={() => handleRemoveFromList(index, 'awards')} className="bg-red-500 text-white px-2 py-1 rounded text-sm">{t('admin_remove')}</button>
                </div>
            ))}
            <button type="button" onClick={() => handleAddToList('awards')} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">{t('admin_add_award')}</button>
        </div>

        {/* External Links */}
        <div className="p-4 border dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('admin_section_links')}</h2>
            {formData.externalLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <input type="text" placeholder={t('admin_link_name')} value={link.name} onChange={e => handleListChange(index, e, 'externalLinks', 'name')} className={formInputClass} />
                    <div className="md:col-span-2 grid grid-cols-1fr auto gap-2">
                        <div className='flex-grow'>
                            <input type="url" placeholder={t('admin_link_url')} value={link.url} onChange={e => handleListChange(index, e, 'externalLinks', 'url')} className={`${formInputClass} ${errors[`link_url_${index}`] ? 'border-red-500' : ''}`} />
                            {errors[`link_url_${index}`] && <p className={errorTextClass}>{errors[`link_url_${index}`]}</p>}
                        </div>
                        <button type="button" onClick={() => handleRemoveFromList(index, 'externalLinks')} className="bg-red-500 text-white px-2 py-1 rounded text-sm">{t('admin_remove')}</button>
                    </div>
                </div>
            ))}
            <button type="button" onClick={() => handleAddToList('externalLinks')} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">{t('admin_add_link')}</button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 text-lg">
            {isEditing ? t('admin_update') : t('admin_save')}
            </button>
            {isEditing && (
            <button type="button" onClick={handleCancelEdit} className="flex-grow bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 text-lg">
                {t('admin_cancel_edit')}
            </button>
            )}
        </div>
      </form>

      <div className="mt-12 pt-8 border-t dark:border-gray-600">
        <h2 className="text-2xl font-bold mb-4">{t('admin_manage_title')}</h2>
        <div className="mb-4">
            <label htmlFor="search" className="sr-only">{t('admin_search_placeholder')}</label>
            <input
                id="search"
                type="search"
                placeholder={t('admin_search_placeholder')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={formInputClass}
            />
        </div>
        <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            {filteredPersonalities.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{p.name[currentLang]} ({p.birthYear})</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setEditingPersonId(p.id)} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded transition-colors">{t('admin_edit')}</button>
                        <button onClick={() => handleDelete(p.id)} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded transition-colors">{t('admin_delete')}</button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;