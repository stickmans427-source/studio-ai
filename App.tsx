import React, { useState } from 'react';
import { GenerationMode } from './types';
import Header from './components/Header';
import TabSelector from './components/TabSelector';
import ImageEditor from './components/ImageEditor';
import TextToImage from './components/TextToImage';
import CustomTextToImage from './components/CustomTextToImage';
import GameThumbnailCreator from './components/GameThumbnailCreator';

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.TEXT_TO_IMAGE);

  const renderContent = () => {
    switch (mode) {
      case GenerationMode.TEXT_TO_IMAGE:
        return <TextToImage />;
      case GenerationMode.CUSTOM_TEXT_TO_IMAGE:
        return <CustomTextToImage />;
      case GenerationMode.GAME_THUMBNAILS:
        return <GameThumbnailCreator />;
      case GenerationMode.IMAGE_EDITOR:
        return <ImageEditor />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-light-text font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <Header />
        <main className="mt-8">
          <TabSelector selectedMode={mode} onSelectMode={setMode} />
          <div className="mt-6 bg-dark-surface p-6 rounded-2xl border border-dark-border shadow-2xl animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;