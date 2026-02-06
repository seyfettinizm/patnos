import React, { useState, useRef, useEffect } from 'react';

const Player: React.FC<any> = ({ song, isPlaying, setIsPlaying }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8); // Standart %80 ses ile başlar

  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying, song]);

  // Standart ses kontrolü (Maksimum %100)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
    setDuration(audioRef.current?.duration || 0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
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
      
      {/* SOL: ŞARKI BİLGİSİ */}
      <div className="flex items-center space-x-4 w-1/4">
        <img src={song.cover} className="w-12 h-12 rounded-lg object-cover" alt="" />
        <div className="hidden md:block overflow-hidden">
          <p className="text-xs font-black text-white truncate">{song.title}</p>
          <p className="text-[9px] text-amber-500 font-black uppercase truncate">{song.artist}</p>
        </div>
      </div>

      {/* ORTA: OYNATMA VE SAF İLERLEME ÇUBUĞU */}
      <div className="flex flex-col items-center w-1/2 px-4">
        <button onClick={() => setIsPlaying(!isPlaying)} className="text-white text-2xl mb-2 hover:scale-110 transition-all">
          {isPlaying ? "Ⅱ" : "▶"}
        </button>
        <div className="flex items-center space-x-3 w-full">
          <span className="text-[9px] text-neutral-600 font-bold w-8 text-right">{formatTime(currentTime)}</span>
          <div className="relative flex-1 h-1 flex items-center">
            <input 
              type="range" 
              min="0" 
              max={duration || 0} 
              value={currentTime} 
              onChange={handleProgressChange}
              className="absolute w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" 
            />
          </div>
          <span className="text-[9px] text-neutral-600 font-bold w-8 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* SAĞ: STANDART SES AYARI */}
      <div className="w-1/4 flex justify-end items-center space-x-3">
        <span className="text-neutral-600 text-[10px] font-black uppercase">Vol</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 accent-amber-500 h-1 bg-white/10 rounded-full cursor-pointer appearance-none" 
        />
      </div>
    </div>
  );
};

export default Player;
