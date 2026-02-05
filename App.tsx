import React, { useState } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentSong, setCurrentSong] = useState(initialSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') {
      setIsAdmin(true);
      setAdminPass('');
      alert('Yönetici girişi başarılı!');
    } else {
      alert('Hatalı şifre!');
    }
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} adminPass={adminPass} 
        setAdminPass={setAdminPass} handleAdminLogin={handleAdminLogin} 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center px-6 border-b border-white/10 bg-neutral-950">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">☰</button>
          <div className="text-amber-500 font-bold uppercase tracking-widest text-sm italic">İzmir Patnoslular Derneği</div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-40">
          {activeTab === 'home' && (
            <section>
              {/* SÜPHAN DAĞI BANNER */}
              <div className="mb-10 rounded-[2.5rem] relative overflow-hidden min-h-[300px] flex items-end border border-white/5 bg-black shadow-2xl">
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" 
                  alt="Süphan Dağı"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="relative z-10 p-8 md:p-12">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter drop-shadow-2xl italic">Müzik Arşivi</h2>
                </div>
              </div>

              <div className="grid gap-2">
                {initialSongs.map((song) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 border border-white/5 ${currentSong?.id === song.id ? 'bg-amber-500/10' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <img src={song.cover} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div>
                        <p className={`text-sm font-bold ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p>
                        <p className="text-xs text-neutral-500 italic">{song.artist}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center space-y-4">
                <h4 className="text-amber-500 font-bold text-xs uppercase">WhatsApp</h4>
                <p className="text-white font-bold">0505 225 06 55</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center space-y-4">
                <h4 className="text-amber-500 font-bold text-xs uppercase">E-Posta</h4>
                <p className="text-white font-bold text-xs italic">patnosumuz@gmail.com</p>
              </div>
            </div>
          )}
        </div>

        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-white/10 backdrop-blur-md">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
