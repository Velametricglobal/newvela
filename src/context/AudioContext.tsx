import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { BackgroundMusicSettings } from '../types/database.types';
import { settingsService } from '../services/settingsService';

interface AudioContextType {
  isPlaying: boolean;
  isAutoplayBlocked: boolean;
  volume: number;
  trackTitle: string;
  artistName: string;
  settings: BackgroundMusicSettings | null;
  togglePlayPause: () => void;
  pause: () => void;
  play: () => void;
  setVolume: (vol: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [settings, setSettings] = useState<BackgroundMusicSettings | null>(null);
  const [volume, setVolumeState] = useState<number>(0.2); // Default 20%
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const userManuallyPausedRef = useRef<boolean>(false);

  useEffect(() => {
    // Load Admin Music Settings
    settingsService.getMusicSettings().then(cfg => {
      setSettings(cfg);
      if (cfg) {
        setVolumeState((cfg.default_volume || 20) / 100);
      }
    });

    const storedPref = localStorage.getItem('website_music_enabled');
    if (storedPref === 'false') {
      userManuallyPausedRef.current = true;
    }
  }, []);

  const startSoundSynth = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Clear existing active oscillators
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      oscillatorsRef.current = [];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume || 0.15, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      masterGain.connect(filter);
      filter.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Relaxing Corporate Ambient Chords (A2, E3, A3, C#4, E4)
      const freqs = [110.00, 164.81, 220.00, 277.18, 329.63];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12 + idx * 0.03, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(2.5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.detune);
        lfo.start();

        osc.connect(masterGain);
        osc.start();
        oscillatorsRef.current.push(osc);
      });

      setIsPlaying(true);
      setIsAutoplayBlocked(false);
    } catch (e) {
      console.warn('AudioContext synth error:', e);
    }
  };

  const stopSoundSynth = () => {
    try {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      oscillatorsRef.current = [];
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
    } catch (e) {
      console.warn('Error stopping synth:', e);
    } finally {
      setIsPlaying(false);
    }
  };

  const play = () => {
    userManuallyPausedRef.current = false;
    localStorage.setItem('website_music_enabled', 'true');
    startSoundSynth();
  };

  const pause = () => {
    userManuallyPausedRef.current = true;
    localStorage.setItem('website_music_enabled', 'false');
    stopSoundSynth();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(vol, audioCtxRef.current.currentTime);
    }
  };

  // Automatic load playback attempt + gesture fallback
  useEffect(() => {
    if (!settings || !settings.enabled) return;

    if (userManuallyPausedRef.current) {
      setIsPlaying(false);
      return;
    }

    if (settings.autoplay) {
      startSoundSynth();
    }

    const handleGesture = () => {
      if (!userManuallyPausedRef.current && !isPlaying) {
        startSoundSynth();
      }
    };

    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [settings]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isAutoplayBlocked,
        volume,
        trackTitle: settings?.track_title || 'Corporate Ambient',
        artistName: settings?.artist_name || 'Velametric Sound Studio',
        settings,
        togglePlayPause,
        pause,
        play,
        setVolume
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return ctx;
};
