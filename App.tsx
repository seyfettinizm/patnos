import React, { useState } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [songs, setSongs] = useState(initialSongs);
  const [currentSong, setCurrentSong] = useState(initialSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [lang, setLang] = useState('TR');

  // Yönetici Girişi
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setAdminPass(''); } else { alert('Hatalı Şifre!'); }
  };

  // Yeni Şarkı Yükleme Fonksiyonu
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newSong = {
      id: songs.length + 1,
      title: "Yeni Yüklenen Şarkı",
      artist: "Sanatçı Adı",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60",
      url: ""
    };
    setSongs([newSong, ...songs]);
    alert("Şarkı başarıyla arşive eklendi!");
    setActiveTab('home');
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} 
        adminPass={adminPass} setAdminPass={setAdminPass} 
        handleAdminLogin={handleAdminLogin} 
        isOpen={false} setIsOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* ÜST BAR */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-20">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <span className="text-neutral-500 mr-3">🔍</span>
            <input type="text" placeholder={lang === 'TR' ? "Şarkı ara..." : "Li stranê bigere..."} className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-neutral-500 hover:text-white'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-neutral-500 hover:text-white'}`}>KU</button>
             </div>
             <button onClick={() => setActiveTab('home')} className="bg-neutral-800 hover:bg-neutral-700 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest border border-white/5">
                {lang === 'TR' ? 'MİSAFİR' : 'MÊVAN'} 👤
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-48">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
              <div className="mb-12 rounded-[2.5rem] relative overflow-hidden h-72 flex items-center border border-white/5 shadow-2xl">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 p-12">
                   <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest">KÜLTÜR MİRASI</span>
                   <h2 className="text-5xl font-black mb-4 tracking-tighter italic">
                     {lang === 'TR' ? "İzmir Patnoslular Müzik Arşivi" : "Arşîva Muzîkê ya Patnosiyên Îzmîrê"}
                   </h2>
                </div>
              </div>

              <div className="space-y-2">
                {songs.map((song) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 group border border-transparent ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover" alt="" />
                      <div>
                        <p className={`font-bold text-sm ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-all">
                       <button className="text-neutral-500 hover:text-red-500">❤️</button>
                       <button className="text-neutral-500 hover:text-amber-500">⬇️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-12">
               <form onSubmit={handleUpload} className="bg-neutral-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-8">
                  <h2 className="text-3xl font-black italic text-amber-500">Müzik Yükleme Konsolu</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <input type="text" required placeholder="Şarkı Adı" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-amber-500 outline-none" />
                    <input type="text" required placeholder="Sanatçı" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-amber-500 outline-none" />
                  </div>
                  <div className="bg-amber-500/5 border-2 border-dashed border-amber-500/20 p-16 rounded-[2.5rem] text-center">
                    <p className="text-4xl mb-4">🎵</p>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Dosyayı Buraya Sürükleyin</p>
                  </div>
                  <button type="submit" className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] shadow-xl hover:bg-amber-400 transition-all">SİSTEME KAYDET</button>
               </form>
            </div>
          )}
        </div>

        {/* PLAYER */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-white/5 backdrop-blur-2xl h-24 px-8">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
