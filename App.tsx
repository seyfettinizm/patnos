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
  const [lang, setLang] = useState('TR');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setAdminPass(''); alert('Yönetici Girişi Başarılı!'); } else { alert('Hatalı Şifre!'); }
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
        {/* ÜST BAR (Dil ve Misafir Butonları) */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#090909]/90 backdrop-blur-xl z-20">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <span className="text-neutral-500 mr-3 text-sm">🔍</span>
            <input type="text" placeholder="Şarkı veya sanatçı ara..." className="bg-transparent border-none outline-none text-xs w-full text-white placeholder:text-neutral-600" />
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-3 py-1 rounded-full text-[9px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-3 py-1 rounded-full text-[9px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500'}`}>KU</button>
             </div>
             <button className="bg-neutral-800 hover:bg-neutral-700 px-5 py-2 rounded-xl text-[10px] font-black tracking-widest flex items-center border border-white/5 transition-colors">
                MİSAFİR <span className="ml-2">👤</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-48">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-1000">
              {/* BANNER */}
              <div className="mb-12 rounded-[2.5rem] relative overflow-hidden h-80 flex items-center border border-white/5 shadow-2xl group">
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110" 
                  alt="Süphan Dağı"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 p-12 max-w-xl">
                  <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest shadow-lg">HAFTANIN SEÇİMİ</span>
                  <h2 className="text-5xl font-black mb-4 leading-tight tracking-tighter italic">Patnos'tan İzmir'e Bir Melodi...</h2>
                  <p className="text-neutral-400 text-sm font-medium leading-relaxed italic">Köklerinizi hissedin. En sevdiğiniz Dengbêjler ve yöresel ezgiler tek bir kutuda toplandı.</p>
                </div>
              </div>

              {/* KOLEKSİYONLAR */}
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 flex items-center text-neutral-500">
                <span className="w-1.5 h-4 bg-amber-500 mr-4 rounded-full"></span> ÖZEL KOLEKSİYONLAR
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {[
                  { title: "Patnos Türküleri", color: "bg-blue-600", icon: "🎸" },
                  { title: "Patnoslu Sanatçılar", color: "bg-purple-600", icon: "🎙️" },
                  { title: "Dengbêjler", color: "bg-orange-500", icon: "🥁" },
                  { title: "Sizden Gelenler", color: "bg-emerald-500", icon: "👥" }
                ].map((item, idx) => (
                  <div key={idx} className={`${item.color} h-48 rounded-[2rem] p-7 flex flex-col justify-end shadow-xl hover:-translate-y-3 transition-all duration-300 cursor-pointer group relative overflow-hidden`}>
                     <div className="absolute top-6 right-6 text-2xl opacity-20 group-hover:scale-125 transition-all">{item.icon}</div>
                     <p className="font-black text-xl leading-tight drop-shadow-md">{item.title}</p>
                  </div>
                ))}
              </div>

              {/* ŞARKI LİSTESİ */}
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 flex items-center text-neutral-500">
                <span className="w-1.5 h-4 bg-amber-500 mr-4 rounded-full"></span> ŞU AN POPÜLER
              </h3>
              <div className="space-y-2">
                {initialSongs.map((song) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 group border border-transparent ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20 shadow-lg' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <div className="relative">
                        <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-2xl" alt="" />
                        {currentSong?.id === song.id && <div className="absolute inset-0 bg-amber-500/30 rounded-xl flex items-center justify-center">🔊</div>}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-neutral-500 hover:text-red-500 transition-colors">❤️</button>
                       <button className="text-neutral-500 hover:text-amber-500 transition-colors">⬇️</button>
                       <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all shadow-xl font-bold">▶</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-12 animate-in zoom-in duration-500">
               <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                  <h2 className="text-3xl font-black mb-10 tracking-tighter italic">İzmir Patnoslular Derneği İletişim</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-3">WhatsApp</p>
                      <p className="text-lg font-bold">0505 225 06 55</p>
                    </div>
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-3">E-Posta</p>
                      <p className="text-sm font-bold italic">patnosumuz@gmail.com</p>
                    </div>
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-3">Adres</p>
                      <p className="text-[11px] font-bold leading-relaxed">Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir</p>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* PLAYER ALT BAR */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#090909]/95 border-t border-white/5 backdrop-blur-2xl h-24 px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
