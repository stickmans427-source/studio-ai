import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setGeneratedImageUrl('');
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      setError('Please upload an image.');
      return;
    }
    if (!prompt) {
      setError('Please enter a prompt to customize the image.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedImageUrl('');
    try {
      const url = await editImage(prompt, imageFile);
      setGeneratedImageUrl(url);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    const filename = `edited_${(prompt.substring(0, 20) || 'image').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Side: Upload and Prompt */}
        <div className="space-y-6">
          <div>
            <label htmlFor="image-upload" className="block text-lg font-medium text-light-text mb-2">
              Upload Image
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dark-border border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md object-cover"/>
                ) : (
                  <svg className="mx-auto h-12 w-12 text-medium-text" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                )}
                <div className="flex text-sm text-medium-text">
                  <label htmlFor="image-upload-input" className="relative cursor-pointer bg-dark-card rounded-md font-medium text-brand-purple hover:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-dark-surface focus-within:ring-brand-purple">
                    <span>{imageFile ? 'Change image' : 'Upload a file'}</span>
                    <input id="image-upload-input" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-medium-text">{imageFile ? imageFile.name : 'PNG, JPG, GIF'}</p>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="prompt-edit" className="block text-lg font-medium text-light-text mb-2">
              Customization Prompt
            </label>
            <textarea
              id="prompt-edit"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Add a futuristic helmet to the person."
              className="w-full h-28 p-4 bg-dark-card border border-dark-border rounded-lg text-light-text placeholder-medium-text focus:ring-2 focus:ring-brand-purple focus:outline-none transition"
            />
          </div>
        </div>
        
        {/* Right Side: Generated Image */}
        <div className="space-y-2">
            <label className="block text-lg font-medium text-light-text">
              Result
            </label>
            <div className="aspect-square bg-dark-card rounded-lg flex items-center justify-center border border-dark-border p-2">
                {isLoading ? (
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-medium-text">Editing your image...</p>
                </div>
                ) : generatedImageUrl ? (
                <img src={generatedImageUrl} alt={prompt} className="w-full h-full object-contain rounded-md" />
                ) : (
                <p className="text-medium-text text-center p-4">Your customized image will appear here.</p>
                )}
            </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !imageFile || !prompt}
        className="w-full flex justify-center items-center py-4 px-6 bg-brand-purple text-white font-bold rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span className="ml-3">Generating...</span>
          </>
        ) : (
          'Customize Image'
        )}
      </button>

      {error && <div className="text-red-400 text-center p-3 bg-red-900/20 rounded-lg">{error}</div>}

      {generatedImageUrl && !isLoading && (
        <button
            onClick={handleDownload}
            className="w-full flex justify-center items-center py-3 px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Customized Image
        </button>
      )}
    </div>
  );
};

export default ImageEditor;