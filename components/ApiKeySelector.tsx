
import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success and update state to allow the user to proceed.
      // The app will re-prompt if an API call fails due to the key.
      onKeySelected();
    }
  };

  return (
    // Fix: Removed min-h-screen to allow proper embedding in the main layout
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-dark-surface p-8 rounded-2xl shadow-lg border border-dark-border">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6.364-6.364l-1.414 1.414M2.222 12H1m10.778-10.778L10.364 2.636M15.778 15.778l1.414 1.414M18.364 10.364l1.414-1.414M21.778 12H23m-12.778 10.778l1.414-1.414M6.222 6.222l-1.414-1.414" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h2 className="mt-6 text-2xl font-bold text-light-text">API Key Required for Video Generation</h2>
        <p className="mt-2 text-medium-text">
          To generate videos, please select an API key from your project. This ensures secure access to the video generation models.
        </p>
        <button
          onClick={handleSelectKey}
          className="mt-6 w-full bg-brand-purple text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-surface focus:ring-brand-purple"
        >
          Select API Key
        </button>
        <p className="mt-4 text-xs text-medium-text">
          By using this service, you agree to the associated billing. For more details, please visit the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline"
          >
            billing documentation
          </a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeySelector;
