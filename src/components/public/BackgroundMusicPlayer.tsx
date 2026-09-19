import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { Pause, Play } from 'lucide-react';

export const BackgroundMusicPlayer: React.FC = () => {
  const { isPlaying, settings, togglePlayPause, trackTitle } = useAudio();

  if (!settings || !settings.enabled) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-4 sm:right-6 z-40">
      <button
        onClick={togglePlayPause}
        tabIndex={0}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        title={isPlaying ? `Pause Music — ${trackTitle}` : `Play Music — ${trackTitle}`}
        className={`w-12 h-12 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all shadow-2xl relative group focus:outline-none focus:ring-2 focus:ring-amber-400 ${
          isPlaying
            ? 'bg-zinc-900/90 border-amber-500/50 text-amber-400 ring-2 ring-amber-500/20'
            : 'bg-zinc-950/90 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
        }`}
      >
        {/* Subtle Glowing Ring Animation when Playing */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full bg-amber-500/20 animate-ping pointer-events-none" />
        )}

        {isPlaying ? (
          <Pause className="w-5 h-5 fill-amber-400 text-amber-400 relative z-10" />
        ) : (
          <Play className="w-5 h-5 fill-white text-white ml-0.5 relative z-10" />
        )}
      </button>
    </div>
  );
};
