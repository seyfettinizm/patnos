import React, { useRef, useEffect, useState } from 'react';

interface PlayerProps {
  song: any;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onEnded: () => void;
}

const Player: React.FC<PlayerProps> = ({ song, isPlaying, setIsPlaying, onEnded }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, song]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const val = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(val || 0);
    }
  };

  return (
    <div className="flex items-center justify-between h-full max-w-7xl mx-auto px-4">
      <div className="flex items-center space-x-4 w-1/3">
        <img src={song.cover} className={`w-14 h-14 rounded-xl object-cover border border-white/10 ${isPlaying ? 'animate-pulse' : ''}`} alt="" />
        <div className="overflow-hidden">
          <p className="font-bold text-sm truncate uppercase italic tracking-tighter">{song.title}</p>
          <p className="text-[10px] text-neutral-500 font-bold truncate uppercase">{song.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-1/3 space-y-2">
        <div className="flex items-center space-x-8">
          <button onClick={() => { if(audioRef.current) audioRef.current.currentTime = 0 }} className="text-neutral-400 hover:text-white transition-colors">⏮</button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-xl hover:scale-105 transition-all">
            {isPlaying ? 'Ⅱ' : '▶'}
          </button>
          <button onClick={onEnded} className="text-neutral-400 hover:text-white transition-colors">⏭</button>
        </div>
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <audio ref={audioRef} src={song.url} onTimeUpdate={handleTimeUpdate} onEnded={onEnded} autoPlay={isPlaying} />
      
      <div className="w-1/3 flex justify-end">
        <div className="text-[10px] font-black text-amber-500 italic tracking-widest opacity-50 uppercase">Patnos Music Pro</div>
      </div>
    </div>
  );
};

export default Player;
