import React, { useState } from 'react';
import { ImageConfig, ImageAspectRatio } from '../types';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const games = [
  'Roblox',
  'Grand Theft Auto V',
  'Minecraft',
  'Rec Room',
  'Fortnite',
  'Among Us',
  'Valorant',
  'League of Legends',
  'Cyberpunk 2077',
  'Elden Ring',
  'The Witcher 3',
  'Red Dead Redemption 2',
];

const GameThumbnailCreator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedGame, setSelectedGame] = useState(games[0]);
  const [config, setConfig] = useState<ImageConfig>({ aspectRatio: '16:9' }); // Default to 16:9 for thumbnails
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError('');
    setImageUrl('');
    try {
      let fullPrompt;
      if (selectedGame === 'Roblox') {
        fullPrompt = `Cinematic game thumbnail for Roblox, featuring a blocky Rthro avatar style character, ${prompt}, in the style of a popular Roblox game, high quality, vibrant colors`;
      } else {
        fullPrompt = `Game thumbnail for ${selectedGame}, ${prompt}, cinematic, high quality, vibrant colors`;
      }
      
      const urls = await generateImage(fullPrompt, config);
      if (urls && urls.length > 0) {
        setImageUrl(urls[0]);
      } else {
        setError('Image generation failed. No image data received.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const filename = `${selectedGame.replace(/ /g, '_')}_thumbnail.png`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getAspectRatioClass = (aspect: ImageAspectRatio) => {
    switch(aspect) {
      case '16:9': return 'aspect-[16/9]';
      case '9:16': return 'aspect-[9/16] w-1/2 mx-auto';
      case '4:3': return 'aspect-[4/3]';
      case '3:4': return 'aspect-[3/4] w-3/4 mx-auto';
      case '1:1':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="game-select" className="block text-lg font-medium text-light-text mb-2">
            Select Game
          </label>
          <select
            id="game-select"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full p-3 bg-dark-card border border-dark-border rounded-lg text-light-text focus:ring-2 focus:ring-brand-purple focus:outline-none"
          >
            {games.map(game => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="aspectRatio-game" className="block text-lg font-medium text-light-text mb-2">Aspect Ratio</label>
          <select
            id="aspectRatio-game"
            value={config.aspectRatio}
            onChange={(e) => setConfig({ ...config, aspectRatio: e.target.value as ImageAspectRatio })}
            className="w-full p-3 bg-dark-card border border-dark-border rounded-lg text-light-text focus:ring-2 focus:ring-brand-purple focus:outline-none"
          >
            <option value="16:9">16:9 (Widescreen)</option>
            <option value="4:3">4:3 (Standard)</option>
            <option value="1:1">1:1 (Square)</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="prompt-game" className="block text-lg font-medium text-light-text mb-2">
          Thumbnail Description
        </label>
        <textarea
          id="prompt-game"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A character discovering a hidden treasure chest in a cave."
          className="w-full h-28 p-4 bg-dark-card border border-dark-border rounded-lg text-light-text placeholder-medium-text focus:ring-2 focus:ring-brand-purple focus:outline-none transition"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full flex justify-center items-center py-4 px-6 bg-brand-purple text-white font-bold rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span className="ml-3">Generating...</span>
          </>
        ) : (
          'Generate Thumbnail'
        )}
      </button>

      {error && <div className="text-red-400 text-center p-3 bg-red-900/20 rounded-lg">{error}</div>}

      <div className="mt-6">
        {isLoading && (
            <div className={`flex justify-center items-center flex-col bg-dark-card rounded-lg border border-dark-border p-2 ${getAspectRatioClass(config.aspectRatio)}`}>
                <LoadingSpinner />
                <p className="mt-4 text-medium-text">Creating your thumbnail...</p>
            </div>
        )}
        {!isLoading && imageUrl && (
            <div className="space-y-4 animate-fade-in">
              <div className={`bg-dark-card rounded-lg flex items-center justify-center border border-dark-border p-2 transition-all duration-300 ${getAspectRatioClass(config.aspectRatio)}`}>
                  <img src={imageUrl} alt={prompt} className="w-full h-full object-contain rounded-md" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button
                    onClick={handleDownload}
                    className="w-full flex justify-center items-center py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                </button>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 bg-dark-card text-light-text font-bold rounded-lg border border-dark-border hover:bg-dark-border transition-colors duration-300 disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.992-1.635v4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 00-11.667 0L2.985 15.644z" />
                    </svg>
                    Try Again
                </button>
              </div>
            </div>
        )}
        {!isLoading && !imageUrl && (
            <div className={`bg-dark-card rounded-lg flex items-center justify-center border border-dark-border p-2 transition-all duration-300 ${getAspectRatioClass(config.aspectRatio)}`}>
                <p className="text-medium-text text-center">Your generated game thumbnail will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default GameThumbnailCreator;
