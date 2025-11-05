import React, { useState, useEffect } from 'react';

interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (newUrl: string) => void;
  t: (key: string) => string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onImageChange, t }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);

  // Sync preview with external changes (e.g., loading a different person to edit)
  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Create a temporary local URL for immediate preview
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);

      // Simulate upload and get back a new placeholder URL.
      // In a real app, you would upload the file and get a permanent URL.
      const newPlaceholderUrl = `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/400/500`;
      onImageChange(newPlaceholderUrl);
    }
  };
  
  const handleRemoveImage = () => {
    // Revoke the object URL to free up memory if it was a blob
    if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    // Reset to a default placeholder
    onImageChange('https://picsum.photos/seed/new-person/400/500');
  }

  const onInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    // Allows re-selecting the same file
    (event.target as HTMLInputElement).value = '';
  };

  return (
    <div className="md:col-span-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_image_url')}</label>
        <div className="mt-1">
        {previewUrl ? (
             <div className="relative group w-full max-w-sm h-64 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <img src={previewUrl} alt={t('admin_image_url')} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label htmlFor="file-upload" className="cursor-pointer text-white text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded me-2">
                        Change
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} onClick={onInputClick}/>
                    </label>
                    <button type="button" onClick={handleRemoveImage} className="text-white text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
                        {t('admin_remove')}
                    </button>
                </div>
            </div>
        ) : (
            <div className="w-full max-w-sm h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center text-center p-4">
                <label htmlFor="file-upload-placeholder" className="relative cursor-pointer bg-transparent rounded-md font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 focus-within:outline-none">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <p className="pl-1">Click to upload an image</p>
                        </div>
                    </div>
                    <input id="file-upload-placeholder" name="file-upload-placeholder" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} onClick={onInputClick}/>
                </label>
            </div>
        )}
        </div>
    </div>
  );
};

export default ImageUpload;
