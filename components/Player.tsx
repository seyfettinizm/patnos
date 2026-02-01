
import React, { useState, useRef, useEffect } from 'react';
import { Song, Language } from '../types';

interface PlayerProps {
  currentSong: Song | null;
  lang: Language;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: () => void;
  onPrev: () => void;
}

const Player: React.FC<PlayerProps> = ({ currentSong, lang, isPlaying, setIsPlaying, onNext, onPrev }) => {
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audioUrl || "";
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current && duration > 0) {
      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      audioRef.current.currentTime = percentage * duration;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 md:h-24 glass-panel border-t border-white/10 px-4 md:px-8 flex items-center justify-between z-[80] animate-in slide-in-from-bottom-full duration-500">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={onNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Song Info */}
      <div className="flex items-center space-x-3 md:space-x-4 w-1/3">
        <img 
          src={currentSong.coverUrl} 
          alt={currentSong.title} 
          className="w-10 h-10 md:w-14 md:h-14 rounded-lg object-cover shadow-lg shrink-0"
        />
        <div className="overflow-hidden">
          <h4 className="text-[11px] md:text-sm font-black truncate leading-tight">{currentSong.title}</h4>
          <p className="text-[9px] md:text-xs text-neutral-500 truncate mt-0.5">{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center flex-1 max-w-lg px-2 md:px-0">
        <div className="flex items-center space-x-4 md:space-x-8 mb-2">
          <button className="text-neutral-500 hover:text-white transition-colors hidden sm:block">
            <i className="fas fa-random text-xs"></i>
          </button>
          <button 
            onClick={onPrev}
            className="text-white hover:text-amber-500 transition-colors"
          >
            <i className="fas fa-step-backward text-sm md:text-lg"></i>
          </button>
          <button 
            onClick={togglePlay}
            className="w-9 h-9 md:w-11 md:h-11 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 shadow-xl"
          >
            <i className={`fas ${isPlaying ? 'fa-pause text-xs md:text-sm' : 'fa-play text-xs md:text-sm ml-0.5'}`}></i>
          </button>
          <button 
            onClick={onNext}
            className="text-white hover:text-amber-500 transition-colors"
          >
            <i className="fas fa-step-forward text-sm md:text-lg"></i>
          </button>
          <button className="text-neutral-500 hover:text-white transition-colors hidden sm:block">
            <i className="fas fa-redo text-xs"></i>
          </button>
        </div>
        <div className="w-full flex items-center space-x-3 text-[8px] md:text-[10px] text-neutral-500 font-bold">
          <span className="w-8 text-right shrink-0">{formatTime(currentTime)}</span>
          <div 
            ref={progressRef}
            onClick={handleSeek}
            className="flex-1 h-1 bg-neutral-800 rounded-full relative overflow-hidden cursor-pointer"
          >
            <div 
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              className="absolute top-0 left-0 h-full bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            ></div>
          </div>
          <span className="w-8 shrink-0">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume - Hidden on Mobile */}
      <div className="hidden md:flex items-center justify-end space-x-4 w-1/3">
        <div className="flex items-center space-x-3 w-28 bg-white/5 rounded-full px-3 py-1.5 border border-white/5">
          <i className="fas fa-volume-up text-[10px] text-neutral-500"></i>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
      
      {/* Mobile Right Controls - Like button */}
      <div className="md:hidden flex items-center justify-end w-1/3">
        <button className="w-10 h-10 flex items-center justify-center text-neutral-400">
           <i className="far fa-heart"></i>
        </button>
      </div>
    </div>
  );
};

export default Player;
