import React from 'react';
import HeroAudioPlayer from './HeroAudioPlayer';

const AudioExperienceSection = () => {
  return (
    <section id="audio-experience" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-4">
            BC + AI Music Audio Experience
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto">
            Immerse yourself in our revolutionary audio analytics. Each track represents unique insights 
            from British Columbia's AI survey, transformed into engaging musical narratives.
          </p>
        </div>
        
        <HeroAudioPlayer />
      </div>
    </section>
  );
};

export default AudioExperienceSection;