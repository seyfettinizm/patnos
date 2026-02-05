import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  // --- HAFIZA VE STATE YÖNETİMİ ---
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'TR');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || 'Misafir Kullanıcı');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [currentSong, setCurrentSong] = useState(initialSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Değişiklikleri Tarayıcıya Kaydet
  useEffect(() => { localStorage.setItem('appLang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('guestName', guestName); }, [guestName]);

  // --- DİL SÖZLÜĞÜ (KU SEÇENEĞİ İÇİN) ---
  const t: any = {
    TR: {
      search: "Şarkı ara...",
      guest: "MİSAFİR",
      bannerTitle: "İzmir Patnoslular Müzik Arşivi",
      bannerSub: "Haftanın Seçimi",
      contactTitle: "İletişim Bilgilerimiz",
      profileTitle: "Profilini Düzenle",
      save: "KAYDET",
      adminTitle: "Müzik Yükleme Konsolu"
    },
    KU: {
      search: "Li stranê bigere...",
      guest: "MÊVAN",
      bannerTitle: "Arşîva Muzîkê ya Patnosiyên Îzmîrê",
      bannerSub: "Hilbijartina Hefteyê",
      contactTitle: "Agahiyên Têkiliyê",
      profileTitle: "Profîla Xwe Rast Bike",
      save: "TOMAR BIKE",
      adminTitle: "Konsola Barkirina Muzîkê"
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setAdminPass(''); setActiveTab('admin'); }
    else { alert('Şifre Yanlış!'); }
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
            <span className="text-neutral-500 mr-3">🔍</span>
            <input type="text" placeholder={t[lang].search} className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500'}`}>KU</button>
             </div>
             <button onClick={() => setActiveTab('profile')} className="group flex items-center space-x-3 bg-neutral-800 hover:bg-neutral-700 p-1.5 pr-4 rounded-xl border border-white/5 transition-all">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-bold">👤</div>
                <span className="text-[10px] font-black tracking-widest uppercase">{guestName}</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-48">
          
          {/* ANA SAYFA */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
              <div className="mb-12 rounded-[2.5rem] relative overflow-hidden h-72 flex items-center border border-white/5 shadow-2xl">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 p-12">
                   <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest">{t[lang].bannerSub}</span>
                   <h2 className="text-5xl font-black mb-4 tracking-tighter italic">{t[lang].bannerTitle}</h2>
                </div>
              </div>

              <div className="space-y-2">
                {initialSongs.map((song) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 border border-transparent ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover" alt="" />
                      <div><p className="font-bold text-sm">{song.title}</p><p className="text-[10px] text-neutral-500 font-black uppercase">{song.artist}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFİL DÜZENLEME (KALICI) */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto py-12 text-center">
              <h3 className="text-2xl font-black mb-8 italic text-amber-500 uppercase">{t[lang].profileTitle}</h3>
              <input 
                type="text" 
                value={guestName} 
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-center font-bold focus:border-amber-500 outline-none mb-6"
              />
              <button onClick={() => setActiveTab('home')} className="w-full bg-amber-500 text-black font-black py-4 rounded-2xl shadow-lg">{t[lang].save}</button>
            </div>
          )}

          {/* İLETİŞİM (GERİ GELDİ) */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-12 text-center">
               <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 shadow-2xl">
                  <h2 className="text-3xl font-black mb-10 text-white uppercase">{t[lang].contactTitle}</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-black/60 p-8 rounded-[2rem] border border-white/5"><p className="text-amber-500 font-black text-[10px] mb-2 uppercase">WhatsApp</p><p className="font-bold">0505 225 06 55</p></div>
                    <div className="bg-black/60 p-8 rounded-[2rem] border border-white/5"><p className="text-amber-500 font-black text-[10px] mb-2 uppercase">E-Posta</p><p className="font-bold">patnosumuz@gmail.com</p></div>
                  </div>
               </div>
            </div>
          )}

          {/* YÖNETİM PANELİ */}
          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-12">
               <div className="bg-neutral-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
                  <h2 className="text-3xl font-black italic text-amber-500 mb-8">{t[lang].adminTitle}</h2>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Şarkı Adı" className="bg-black border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-amber-500" />
                      <input type="text" placeholder="Sanatçı" className="bg-black border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-amber-500" />
                    </div>
                    <div className="h-40 bg-black/40 border-2 border-dashed border-white/10 rounded-3xl flex flex-center items-center justify-center text-neutral-500 text-xs">Kapak Görseli + MP3 Sürükle</div>
                    <button type="button" onClick={() => alert('Sisteme Kaydedildi!')} className="w-full bg-amber-500 text-black font-black py-4 rounded-xl">{t[lang].save}</button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-white/5 h-24 px-8">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
