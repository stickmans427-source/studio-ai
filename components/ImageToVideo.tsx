
import React, { useState } from 'react';
import { VideoConfig, VideoAspectRatio, VideoResolution } from '../types';
import { generateVideo } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ImageToVideoProps {
  onApiKeyError: () => void;
}

const ImageToVideo: React.FC<ImageToVideoProps> = ({ onApiKeyError }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [config, setConfig] = useState<VideoConfig>({ aspectRatio: '16:9', resolution: '720p' });
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      setError('Please upload an image.');
      return;
    }
    setIsLoading(true);
    setError('');
    setVideoUrl('');
    try {
      const url = await generateVideo(prompt, config, setProgressMessage, imageFile);
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      if (err.message.includes("API key is invalid")) {
        onApiKeyError();
      }
    } finally {
      setIsLoading(false);
      setProgressMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="image-upload" className="block text-lg font-medium text-light-text mb-2">
            Upload Image
          </label>
          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dark-border border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md"/>
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
              <p className="text-xs text-medium-text">{imageFile ? imageFile.name : 'PNG, JPG, GIF up to 10MB'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-lg font-medium text-light-text mb-2">
              Your Prompt <span className="text-sm text-medium-text">(Optional)</span>
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Make the scene snowy and magical."
              className="w-full h-28 p-4 bg-dark-card border border-dark-border rounded-lg text-light-text placeholder-medium-text focus:ring-2 focus:ring-brand-purple focus:outline-none transition"
            />
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="aspectRatio-img" className="block text-sm font-medium text-medium-text mb-2">Aspect Ratio</label>
              <select
                id="aspectRatio-img"
                value={config.aspectRatio}
                onChange={(e) => setConfig({ ...config, aspectRatio: e.target.value as VideoAspectRatio })}
                className="w-full p-3 bg-dark-card border border-dark-border rounded-lg text-light-text focus:ring-2 focus:ring-brand-purple focus:outline-none"
              >
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
              </select>
            </div>
            <div>
              <label htmlFor="resolution-img" className="block text-sm font-medium text-medium-text mb-2">Resolution</label>
              <select
                id="resolution-img"
                value={config.resolution}
                onChange={(e) => setConfig({ ...config, resolution: e.target.value as VideoResolution })}
                className="w-full p-3 bg-dark-card border border-dark-border rounded-lg text-light-text focus:ring-2 focus:ring-brand-purple focus:outline-none"
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={isLoading || !imageFile}
        className="w-full flex justify-center items-center py-4 px-6 bg-brand-purple text-white font-bold rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span className="ml-3">Generating...</span>
          </>
        ) : (
          'Generate Video from Image'
        )}
      </button>

      {error && <div className="text-red-400 text-center p-3 bg-red-900/20 rounded-lg">{error}</div>}

      <div className="mt-6 aspect-video bg-dark-card rounded-lg flex items-center justify-center border border-dark-border">
        {isLoading ? (
          <div className="text-center p-4">
            <LoadingSpinner />
            <p className="mt-4 text-medium-text animate-pulse">{progressMessage}</p>
          </div>
        ) : videoUrl ? (
          <video src={videoUrl} controls autoPlay loop className="w-full h-full rounded-lg" />
        ) : (
          <div className="text-center text-medium-text">
             <p>Your generated video will appear here.</p>
             <p className="text-sm mt-2">(Note: AI-generated videos do not include audio.)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToVideo;
