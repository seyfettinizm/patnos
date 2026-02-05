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
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setAdminPass(''); } else { alert('Hatalı Şifre!'); }
  };

  return (
    <div className="flex h-screen bg-[#090909] text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} 
        adminPass={adminPass} setAdminPass={setAdminPass} 
        handleAdminLogin={handleAdminLogin} 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* ÜST BAR (Dil ve Misafir Aktifleşti) */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#090909]/90 backdrop-blur-xl z-20">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <span className="text-neutral-500 mr-3 text-sm">🔍</span>
            <input type="text" placeholder="Şarkı ara..." className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1 border border-white/5">
                <button onClick={() => { setLang('TR'); alert('Dil: Türkçe olarak ayarlandı'); }} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}>TR</button>
                <button onClick={() => { setLang('KU'); alert('Ziman: Kurdî hat hilbijartin'); }} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}>KU</button>
             </div>
             <button onClick={() => alert('Profil ayarları yakında eklenecek.')} className="bg-neutral-800 hover:bg-neutral-700 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest flex items-center border border-white/5">
                MİSAFİR <span className="ml-2">👤</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-48">
          {activeTab === 'home' && (
            <div>
              {/* BANNER VE DİĞERLERİ... (Görsel 1 tasarımı korunmuştur) */}
              <div className="mb-12 rounded-[2.5rem] relative overflow-hidden h-72 flex items-center border border-white/5 shadow-2xl">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent"></div>
                <div className="relative z-10 p-12">
                   <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest">HAFTANIN SEÇİMİ</span>
                   <h2 className="text-5xl font-black mb-4 leading-tight tracking-tighter italic">Patnos'tan İzmir'e...</h2>
                </div>
              </div>

              {/* LİSTE */}
              <div className="space-y-2">
                {initialSongs.map((song) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 group border border-transparent ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20 shadow-lg' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-2xl" alt="" />
                      <div>
                        <p className={`font-bold text-sm ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={(e) => { e.stopPropagation(); alert('Favorilere eklendi!'); }} className="text-neutral-500 hover:text-red-500">❤️</button>
                       <button onClick={(e) => { e.stopPropagation(); alert('İndirme başlatılıyor...'); }} className="text-neutral-500 hover:text-amber-500">⬇️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-12 space-y-8 animate-in slide-in-from-top-4 duration-500">
               <div className="bg-neutral-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
                  <h2 className="text-3xl font-black mb-8 italic text-amber-500">Müzik Yükleme Konsolu</h2>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-neutral-500 font-black uppercase ml-2">Şarkı Adı</label>
                        <input type="text" placeholder="Örn: Mihriban" className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-amber-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-neutral-500 font-black uppercase ml-2">Sanatçı</label>
                        <input type="text" placeholder="Örn: Patnoslu Seyfettin" className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-amber-500 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="bg-amber-500/5 border-2 border-dashed border-amber-500/20 p-12 rounded-[2.5rem] text-center cursor-pointer hover:bg-amber-500/10 transition-all group">
                       <p className="text-3xl mb-4 group-hover:scale-125 transition-transform">🎵</p>
                       <p className="text-xs font-bold text-neutral-400">MP3 dosyasını buraya sürükleyin veya <span className="text-amber-500 underline">göz atın</span></p>
                    </div>
                    <button onClick={() => alert('Yükleme işlemi simüle edildi. Kayıt başarılı!')} className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all">SİSTEME KAYDET</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-12 animate-in zoom-in duration-500">
               <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 text-center relative overflow-hidden shadow-2xl">
                  <h2 className="text-3xl font-black mb-10 tracking-tighter italic">Bize Ulaşın</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5 hover:border-amber-500 transition-all">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-3">WhatsApp</p>
                      <p className="text-lg font-bold">0505 225 06 55</p>
                    </div>
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5 hover:border-amber-500 transition-all">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-3 text-xs italic font-bold">Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir</p>
                    </div>
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5 hover:border-amber-500 transition-all">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-3 italic">patnosumuz@gmail.com</p>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* PLAYER ALT KONTROL */}
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
