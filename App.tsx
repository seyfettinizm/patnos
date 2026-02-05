import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'TR');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || 'Misafir Kullanıcı');
  
  const [songs, setSongs] = useState(() => {
    const savedSongs = localStorage.getItem('myMusicList');
    return savedSongs ? JSON.parse(savedSongs) : initialSongs;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [currentSong, setCurrentSong] = useState(songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '' });

  useEffect(() => { localStorage.setItem('appLang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('guestName', guestName); }, [guestName]);
  useEffect(() => { localStorage.setItem('myMusicList', JSON.stringify(songs)); }, [songs]);

  const t: any = {
    TR: {
      search: "Şarkı ara...",
      bannerTitle: "İzmir Patnoslular Derneği Müzik Kutusu",
      contactTitle: "İletişim & Paylaşım",
      shareTitle: "Kendi Müziğini Gönder",
      shareDesc: "Elinizde bulunan Patnos yöresine ait müzikleri bize ulaştırın. Uygun bulunan eserler arşivimizde yayınlanacaktır.",
      shareButton: "WhatsApp ile Gönder",
      address: "Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir"
    },
    KU: {
      search: "Li stranê bigere...",
      bannerTitle: "Sindoqa Muzîkê ya Komeleya Patnosiyên Îzmîrê",
      contactTitle: "Têkilî & Parvekirin",
      shareTitle: "Muzîka Xwe Bişînin",
      shareDesc: "Muzîkên herêma Patnosê yên ku di destê we de hene ji me re bişînin.",
      shareButton: "Bi WhatsApp bişîne",
      address: "Mah. Yeşilbağlar. 637/33 Sok. No: 25 Buca/Îzmîr"
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setAdminPass(''); setActiveTab('admin'); } else { alert('Şifre Yanlış!'); }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} setAdminPass={setAdminPass} handleAdminLogin={handleAdminLogin} lang={lang} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* ÜST BAR */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-20">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <input type="text" placeholder={t[lang].search} className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-neutral-400'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-neutral-400'}`}>KU</button>
             </div>
             <button onClick={() => setActiveTab('profile')} className="bg-neutral-800 px-4 py-2 rounded-xl text-[10px] font-black border border-white/5 uppercase tracking-widest">{guestName}</button>
          </div>
        </header>

        {/* ANA İÇERİK PANELİ */}
        <div className="flex-1 overflow-y-auto p-8 pb-40">
          
          {/* 1. ANA SAYFA */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-10 rounded-[2.5rem] relative overflow-hidden h-64 flex items-center border border-white/5">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
                <div className="relative z-10 p-12"><h2 className="text-4xl font-black italic tracking-tighter uppercase">{t[lang].bannerTitle}</h2></div>
              </div>
              <div className="space-y-3">
                {songs.map((song: any) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-amber-500/30 cursor-pointer ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover" alt="" />
                      <div><p className="font-bold text-sm">{song.title}</p><p className="text-[10px] text-neutral-500 uppercase font-black">{song.artist}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. İLETİŞİM VE PAYLAŞIM (BURASI ÇOK ÖNEMLİ - GÜNCELLENDİ) */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              
              {/* WHATSAPP PAYLAŞIM KUTUSU */}
              <div className="bg-amber-500 rounded-[3rem] p-12 text-center shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
                 <h2 className="text-4xl font-black text-black mb-4 italic tracking-tighter uppercase">{t[lang].shareTitle}</h2>
                 <p className="text-black/70 font-bold mb-8 max-w-xl mx-auto italic">{t[lang].shareDesc}</p>
                 <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="inline-block bg-black text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] hover:scale-105 transition-transform">
                   {t[lang].shareButton}
                 </a>
              </div>

              {/* BİLGİ KARTLARI (WhatsApp, Eposta, Adres) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[2.5rem] text-center">
                    <div className="text-3xl mb-4">📱</div>
                    <h3 className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-3">WhatsApp Hat</h3>
                    <p className="font-black text-lg">0505 225 06 55</p>
                 </div>
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[2.5rem] text-center">
                    <div className="text-3xl mb-4">📧</div>
                    <h3 className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-3">E-Posta Adresi</h3>
                    <p className="font-black text-sm italic">patnosumuz@gmail.com</p>
                 </div>
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[2.5rem] text-center">
                    <div className="text-3xl mb-4">📍</div>
                    <h3 className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-3">Dernek Adres</h3>
                    <p className="font-black text-[11px] leading-relaxed italic">{t[lang].address}</p>
                 </div>
              </div>

            </div>
          )}

          {/* 3. PROFİL VE ADMİN (Hızlıca ekliyorum) */}
          {activeTab === 'profile' && (
            <div className="max-w-md mx-auto py-20 text-center">
              <div className="bg-neutral-900 p-12 rounded-[3rem] border border-white/5">
                <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-center font-black mb-6" />
                <button onClick={() => setActiveTab('home')} className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest">KAYDET</button>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-2xl mx-auto py-10">
               <div className="bg-neutral-900 p-12 rounded-[3rem] border border-white/5">
                  <h2 className="text-2xl font-black text-amber-500 mb-8 uppercase italic">Müzik Yükleme Konsolu</h2>
                  <div className="space-y-4">
                    <input type="text" placeholder="Şarkı Adı" className="w-full bg-black border border-white/10 p-4 rounded-xl" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                    <input type="text" placeholder="Müzik Linki (.mp3)" className="w-full bg-black border border-white/10 p-4 rounded-xl" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    <button onClick={() => { setSongs([{...newSong, id: Date.now(), cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300"}, ...songs]); setActiveTab('home'); }} className="w-full bg-amber-500 text-black font-black py-4 rounded-xl uppercase">YAYINLA</button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* PLAYER ALT BAR */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/5 h-24 px-8 z-50">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
