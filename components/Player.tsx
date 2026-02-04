import React, { useRef, useEffect } from 'react';
import { Song } from '../types';

interface PlayerProps {
  song: Song;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Player: React.FC<PlayerProps> = ({ song, isPlaying, setIsPlaying }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, song]);

  if (!song) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-white/10 p-4 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Şarkı Bilgisi */}
        <div className="flex items-center space-x-4 w-1/3">
          <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-lg border border-white/5" alt="" />
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm text-white truncate">{song.title}</h4>
            <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
          </div>
        </div>

        {/* Oynatıcı Kontrolleri */}
        <div className="flex flex-col items-center w-1/3 space-y-2">
          <div className="flex items-center space-x-6">
            <button className="text-neutral-400 hover:text-white transition-colors"><i className="fas fa-step-backward"></i></button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-amber-500/20"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-lg`}></i>
            </button>
            <button className="text-neutral-400 hover:text-white transition-colors"><i className="fas fa-step-forward"></i></button>
          </div>
          <audio 
            ref={audioRef}
            src={song.url} 
            onEnded={() => setIsPlaying(false)}
            className="w-full max-w-md h-8 accent-amber-500"
          />
        </div>

        {/* Ses ve Diğerleri */}
        <div className="w-1/3 flex justify-end items-center space-x-4">
          <i className="fas fa-volume-up text-neutral-500 text-sm"></i>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-amber-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
