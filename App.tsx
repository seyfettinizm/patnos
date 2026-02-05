import React, { useState } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentSong, setCurrentSong] = useState(initialSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center px-6 border-b border-white/10 md:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white"><i className="fas fa-bars"></i></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          {activeTab === 'home' && (
            <div>
              <div className="mb-8 rounded-3xl relative overflow-hidden h-64 flex items-end shadow-2xl bg-black">
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" 
                  className="absolute inset-0 w-full h-full object-cover" 
                  alt="Süphan Dağı"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <h2 className="relative z-10 p-6 text-2xl md:text-4xl font-bold">İzmir Patnoslular Derneği Müzik Arşivi</h2>
              </div>

              <div className="space-y-2">
                {initialSongs.map((song: any) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className="p-4 bg-white/5 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10">
                    <div className="flex items-center space-x-4">
                      <img src={song.cover} className="w-12 h-12 rounded-lg" alt="" />
                      <div><p className="font-bold">{song.title}</p><p className="text-xs text-gray-400">{song.artist}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">İletişim</h2>
              <p className="text-amber-500 font-bold">WhatsApp: 0505 225 06 55</p>
              <p className="mt-2 text-sm italic text-gray-400">patnosumuz@gmail.com</p>
            </div>
          )}
        </div>

        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/10 z-50">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
