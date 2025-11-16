import React, { useState } from 'react';
import { ImageConfig, ImageAspectRatio } from '../types';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const styles = [
  { name: 'None', promptPrefix: '', description: 'Default model style.' },
  { name: 'Photorealistic', promptPrefix: 'photorealistic, 8k, detailed, professional lighting, ', description: 'Lifelike and highly detailed.' },
  { name: 'Anime', promptPrefix: 'anime style, vibrant colors, detailed, ', description: 'Japanese animation style.' },
  { name: 'Pixel Art', promptPrefix: 'pixel art, 16-bit, vibrant, ', description: 'Retro video game aesthetic.' },
  { name: 'Cartoon', promptPrefix: 'cartoon style, bold lines, simplified, ', description: 'Playful and stylized.' },
  { name: 'Fantasy Art', promptPrefix: 'fantasy art, epic, detailed, intricate, ', description: 'Mythical and imaginative.' },
  { name: 'Sci-Fi', promptPrefix: 'sci-fi concept art, futuristic, detailed, ', description: 'Futuristic and technological.' },
  { name: 'Watercolor', promptPrefix: 'watercolor painting, soft, blended, ', description: 'Soft and artistic brushwork.' },
];

const CustomTextToImage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [config, setConfig] = useState<ImageConfig>({ aspectRatio: '1:1' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError('');
    setImageUrl('');
    try {
      const fullPrompt = selectedStyle.promptPrefix + prompt;
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
    const filename = `${selectedStyle.name.replace(/ /g, '_')}_${(prompt.substring(0, 20) || 'generated').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
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
      <div>
        <label htmlFor="prompt-image" className="block text-lg font-medium text-light-text mb-2">
          Your Prompt
        </label>
        <textarea
          id="prompt-image"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., An astronaut riding a horse on Mars"
          className="w-full h-28 p-4 bg-dark-card border border-dark-border rounded-lg text-light-text placeholder-medium-text focus:ring-2 focus:ring-brand-purple focus:outline-none transition"
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-light-text mb-2">Select a Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {styles.map(style => (
                <button
                    key={style.name}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${selectedStyle.name === style.name ? 'bg-brand-purple border-purple-400' : 'bg-dark-card border-dark-border hover:border-brand-purple'}`}
                >
                    <p className="font-bold text-sm text-light-text">{style.name}</p>
                    <p className="text-xs text-medium-text">{style.description}</p>
                </button>
            ))}
        </div>
      </div>

      <div>
        <label htmlFor="aspectRatio-image" className="block text-sm font-medium text-medium-text mb-2">Aspect Ratio</label>
        <select
          id="aspectRatio-image"
          value={config.aspectRatio}
          onChange={(e) => setConfig({ ...config, aspectRatio: e.target.value as ImageAspectRatio })}
          className="w-full md:w-1/2 p-3 bg-dark-card border border-dark-border rounded-lg text-light-text focus:ring-2 focus:ring-brand-purple focus:outline-none"
        >
          <option value="1:1">1:1 (Square)</option>
          <option value="16:9">16:9 (Landscape)</option>
          <option value="9:16">9:16 (Portrait)</option>
          <option value="4:3">4:3</option>
          <option value="3:4">3:4</option>
        </select>
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
          'Generate Image'
        )}
      </button>

      {error && <div className="text-red-400 text-center p-3 bg-red-900/20 rounded-lg">{error}</div>}

      {imageUrl && !isLoading && (
        <button
            onClick={handleDownload}
            className="w-full flex justify-center items-center py-3 px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Image
        </button>
      )}

      <div className={`mt-6 bg-dark-card rounded-lg flex items-center justify-center border border-dark-border p-2 transition-all duration-300 ${getAspectRatioClass(config.aspectRatio)}`}>
        {isLoading ? (
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-medium-text">Creating your image...</p>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={prompt} className="w-full h-full object-contain rounded-md" />
        ) : (
          <p className="text-medium-text">Your generated image will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default CustomTextToImage;