
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        AI Video & Image Generator
      </h1>
      <p className="mt-3 text-lg sm:text-xl text-medium-text max-w-3xl mx-auto">
        Your creative suite for AI-powered video and image generation. Bring your imagination to life.
      </p>
    </header>
  );
};

export default Header;
