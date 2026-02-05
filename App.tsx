import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  // --- HAFIZA VE AYARLAR ---
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'TR');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || 'Misafir Kullanıcı');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [currentSong, setCurrentSong] = useState(initialSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Değişiklikleri tarayıcıya kaydet (F5 yapınca silinmez)
  useEffect(() => { localStorage.setItem('appLang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('guestName', guestName); }, [guestName]);

  // --- DİL SÖZLÜĞÜ (TÜM YAZILAR BURADAN DEĞİŞİR) ---
  const t: any = {
    TR: {
      search: "Şarkı veya sanatçı ara...",
      guest: "MİSAFİR",
      bannerTitle: "İzmir Patnoslular Derneği Müzik Kutusu",
      bannerSub: "KÜLTÜR ARŞİVİ",
      contactTitle: "İletişim Bilgilerimiz",
      profileTitle: "Profilini Düzenle",
      save: "DEĞİŞİKLİKLERİ KAYDET",
      adminTitle: "Müzik Yükleme Konsolu",
      address: "Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir",
      populer: "ŞU AN POPÜLER"
    },
    KU: {
      search: "Li stranê bigere...",
      guest: "MÊVAN",
      bannerTitle: "Sindoqa Muzîkê ya Komeleya Patnosiyên Îzmîrê",
      bannerSub: "ARŞÎVA ÇANDÊ",
      contactTitle: "Agahiyên Têkiliyê",
      profileTitle: "Profîla Xwe Rast Bike",
      save: "TOMAR BIKE",
      adminTitle: "Konsola Barkirina Muzîkê",
      address: "Mah. Yeşilbağlar. 637/33 Sok. No: 25 Buca/Îzmîr",
      populer: "YÊN POPULER"
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') { 
      setIsAdmin(true); 
      setAdminPass(''); 
      setActiveTab('admin'); 
    } else { 
      alert('Şifre Yanlış!'); 
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} 
        adminPass={adminPass} setAdminPass={setAdminPass} 
        handleAdminLogin={handleAdminLogin} 
        lang={lang}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* ÜST BAR */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-20">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <span className="text-neutral-500 mr-3 text-sm">🔍</span>
            <input type="text" placeholder={t[lang].search} className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-400 hover:text-white'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-400 hover:text-white'}`}>KU</button>
             </div>
             <button onClick={() => setActiveTab('profile')} className="group flex items-center space-x-3 bg-neutral-800 hover:bg-neutral-700 p-1.5 pr-4 rounded-xl border border-white/5 transition-all shadow-lg active:scale-95">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black text-xs">P</div>
                <span className="text-[10px] font-black tracking-widest uppercase">{guestName}</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-48">
          
          {/* ANA SAYFA */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-1000">
              <div className="mb-12 rounded-[2.5rem] relative overflow-hidden h-80 flex items-center border border-white/5 shadow-2xl group">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 p-12 max-w-2xl">
                   <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest shadow-lg">{t[lang].bannerSub}</span>
                   <h2 className="text-5xl font-black mb-4 tracking-tighter italic leading-tight">{t[lang].bannerTitle}</h2>
                </div>
              </div>

              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-neutral-500 flex items-center italic">
                <span className="w-1.5 h-4 bg-amber-500 mr-4 rounded-full"></span> {t[lang].populer}
              </h3>

              <div className="space-y-2">
                {initialSongs.map((song) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 border border-transparent group ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20 shadow-lg' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <div className="relative">
                        <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-2xl" alt="" />
                        {currentSong?.id === song.id && <div className="absolute inset-0 bg-amber-500/30 rounded-xl flex items-center justify-center">🔊</div>}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-neutral-500 hover:text-red-500">❤️</button>
                       <button className="text-neutral-500 hover:text-amber-500">⬇️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFİL DÜZENLEME */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto py-12 text-center animate-in slide-in-from-bottom-8 duration-500">
              <div className="bg-neutral-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
                <h3 className="text-2xl font-black mb-10 italic text-amber-500 uppercase tracking-tighter">{t[lang].profileTitle}</h3>
                <div className="w-32 h-32 bg-amber-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-black text-5xl font-black shadow-2xl">👤</div>
                <input 
                  type="text" 
                  value={guestName} 
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-center font-bold text-white focus:border-amber-500 outline-none mb-6 shadow-inner"
                  placeholder="İsminizi Yazın..."
                />
                <button onClick={() => setActiveTab('home')} className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl shadow-xl hover:bg-amber-400 transition-all uppercase tracking-widest">{t[lang].save}</button>
              </div>
            </div>
          )}

          {/* İLETİŞİM */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-12 animate-in fade-in duration-500">
               <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                  <h2 className="text-3xl font-black mb-12 text-white uppercase italic tracking-tighter">{t[lang].contactTitle}</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-black/60 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500 transition-all">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-4 tracking-[0.2em]">WhatsApp</p>
                      <p className="font-bold text-lg">0505 225 06 55</p>
                    </div>
                    <div className="bg-black/60 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500 transition-all">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-4 tracking-[0.2em]">E-Posta</p>
                      <p className="text-sm font-bold italic">patnosumuz@gmail.com</p>
                    </div>
                    <div className="bg-black/60 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500 transition-all col-span-full md:col-span-1">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-4 tracking-[0.2em]">Adres</p>
                      <p className="text-[11px] font-bold leading-relaxed">{t[lang].address}</p>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* YÖNETİM PANELİ */}
          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-12 animate-in zoom-in duration-500">
               <div className="bg-neutral-900/60 p-12 rounded-[4rem] border border-white/5 shadow-2xl">
                  <h2 className="text-3xl font-black italic text-amber-500 mb-10 flex items-center">
                    <span className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mr-4 text-xl">⚙️</span>
                    {t[lang].adminTitle}
                  </h2>
                  <div className="grid gap-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-neutral-500 font-black uppercase ml-2 tracking-widest">Şarkı Adı</label>
                        <input type="text" placeholder="Örn: Mihriban" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-amber-500 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-neutral-500 font-black uppercase ml-2 tracking-widest">Sanatçı</label>
                        <input type="text" placeholder="Örn: Seyfettin" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-amber-500 transition-all shadow-inner" />
                      </div>
                    </div>
                    <div className="bg-amber-500/5 border-2 border-dashed border-amber-500/20 p-16 rounded-[3rem] text-center cursor-pointer hover:bg-amber-500/10 transition-all group">
                       <p className="text-5xl mb-6 group-hover:scale-110 transition-transform">🎵</p>
                       <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">MP3 + Kapak Görselini Buraya Sürükleyin</p>
                    </div>
                    <button type="button" onClick={() => alert('Sisteme başarıyla kaydedildi!')} className="w-full bg-amber-500 text-black font-black py-6 rounded-2xl uppercase tracking-[0.3em] shadow-xl hover:bg-amber-400 transition-all active:scale-[0.98]">{t[lang].save}</button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* PLAYER */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/95 border-t border-white/5 backdrop-blur-2xl h-24 px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
