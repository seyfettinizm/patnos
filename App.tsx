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
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setAdminPass(''); } else { alert('Hatalı Şifre!'); }
  };

  return (
    <div className="flex h-screen bg-[#090909] text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} adminPass={adminPass} 
        setAdminPass={setAdminPass} handleAdminLogin={handleAdminLogin} 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* ÜST BAR */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#090909]/80 backdrop-blur-md z-20">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <span className="text-neutral-500 mr-3 text-sm">🔍</span>
            <input type="text" placeholder="Şarkı, sanatçı veya albüm ara..." className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          <div className="flex items-center space-x-4">
             <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-black text-amber-500">TR / KU</div>
             <div className="bg-neutral-800 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest">MİSAFİR</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-40">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
              
              {/* HAFTANIN SEÇİMİ BANNER */}
              <div className="mb-12 rounded-[2.5rem] relative overflow-hidden h-80 flex items-center border border-white/5 shadow-2xl group">
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" 
                  alt="Süphan Dağı"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 p-12 max-w-xl">
                  <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest shadow-lg shadow-amber-500/20">Haftanın Seçimi</span>
                  <h2 className="text-5xl font-black mb-4 leading-tight tracking-tighter">Patnos'tan İzmir'e Bir Melodi...</h2>
                  <p className="text-neutral-400 text-sm font-medium leading-relaxed italic">Köklerinizi hissedin. En sevdiğiniz Dengbêjler ve yöresel ezgiler tek bir kutuda toplandı.</p>
                </div>
              </div>

              {/* ÖZEL KOLEKSİYONLAR (RENKLİ KUTULAR) */}
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center">
                <span className="w-1 h-5 bg-amber-500 mr-3 rounded-full"></span> Özel Koleksiyonlar
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {[
                  { title: "Patnos Türküleri", color: "bg-blue-600" },
                  { title: "Patnoslu Sanatçılar", color: "bg-purple-600" },
                  { title: "Dengbêjler", color: "bg-orange-500" },
                  { title: "Sizden Gelenler", color: "bg-emerald-500" }
                ].map((item, idx) => (
                  <div key={idx} className={`${item.color} h-48 rounded-[2rem] p-6 flex flex-col justify-end shadow-xl hover:-translate-y-2 transition-transform cursor-pointer group`}>
                     <div className="w-10 h-10 bg-white/20 rounded-xl mb-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">🎵</div>
                     <p className="font-black text-lg leading-tight">{item.title}</p>
                  </div>
                ))}
              </div>

              {/* LİSTE */}
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center">
                <span className="w-1 h-5 bg-amber-500 mr-3 rounded-full"></span> Şu An Popüler
              </h3>
              <div className="space-y-3">
                {initialSongs.map((song) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 group ${currentSong?.id === song.id ? 'bg-white/5 border border-white/10' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-lg" alt="" />
                      <div>
                        <p className={`font-bold ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p>
                        <p className="text-xs text-neutral-500 font-medium">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                       <span className="text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity">❤️</span>
                       <span className="text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity">⬇️</span>
                       <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">▶️</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PLAYER ALT BAR */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-white/5 backdrop-blur-xl h-24 px-8">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
