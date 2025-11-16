
import React from 'react';
import { GenerationMode } from '../types';

interface TabSelectorProps {
  selectedMode: GenerationMode;
  onSelectMode: (mode: GenerationMode) => void;
}

const TabButton: React.FC<{
    mode: GenerationMode;
    selectedMode: GenerationMode;
    onSelectMode: (mode: GenerationMode) => void;
    children: React.ReactNode;
}> = ({ mode, selectedMode, onSelectMode, children }) => {
  const isSelected = mode === selectedMode;
  return (
    <button
      onClick={() => onSelectMode(mode)}
      className={`px-4 py-2.5 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-surface focus:ring-brand-purple ${
        isSelected
          ? 'bg-brand-purple text-white shadow-lg'
          : 'bg-dark-card text-medium-text hover:bg-dark-border hover:text-light-text'
      }`}
    >
      {children}
    </button>
  );
};

const TabSelector: React.FC<TabSelectorProps> = ({ selectedMode, onSelectMode }) => {
  const modes = Object.values(GenerationMode);
  return (
    <div className="flex justify-center bg-dark-card p-2 rounded-xl border border-dark-border space-x-2">
      {modes.map((mode) => (
        <TabButton key={mode} mode={mode} selectedMode={selectedMode} onSelectMode={onSelectMode}>
          {mode}
        </TabButton>
      ))}
    </div>
  );
};

export default TabSelector;
