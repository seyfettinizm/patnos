import React, { useState, useRef, useEffect } from 'react';

const Player: React.FC<any> = ({ song, isPlaying, setIsPlaying }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying, song]);

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
    setDuration(audioRef.current?.duration || 0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
      <audio ref={audioRef} src={song.url} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onTimeUpdate} />
      
      <div className="flex items-center space-x-4 w-1/3">
        <img src={song.cover} className="w-14 h-14 rounded-xl shadow-2xl object-cover animate-pulse" alt="" />
        <div className="hidden md:block">
          <p className="text-sm font-black text-white">{song.title}</p>
          <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">{song.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-1/3">
        <button onClick={() => setIsPlaying(!isPlaying)} className="bg-amber-500 text-black w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-all mb-2">
          {isPlaying ? "Ⅱ" : "▶"}
        </button>
        <div className="flex items-center space-x-3 w-full">
          <span className="text-[10px] text-neutral-500 font-bold">{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0" 
            max={duration || 0} 
            value={currentTime} 
            onChange={handleProgressChange}
            className="flex-1 accent-amber-500 h-1 bg-white/10 rounded-full cursor-pointer" 
          />
          <span className="text-[10px] text-neutral-500 font-bold">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="w-1/3 flex justify-end items-center space-x-4">
        <span className="text-neutral-500 text-xl">🔊</span>
        <input type="range" className="w-24 accent-white h-1 bg-white/10 rounded-full" />
      </div>
    </div>
  );
};

export default Player;
