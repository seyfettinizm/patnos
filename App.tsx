import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<'TR' | 'KU'>(() => (localStorage.getItem('appLang') as 'TR' | 'KU') || 'TR');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem('appLogo') || "");
  const [bannerUrl, setBannerUrl] = useState(() => localStorage.getItem('appBanner') || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200");
  const [bannerText, setBannerText] = useState(() => localStorage.getItem('appBannerText') || "");

  const [likedSongs, setLikedSongs] = useState<number[]>(() => {
    const saved = localStorage.getItem('myLikedSongs');
    return saved ? JSON.parse(saved) : [];
  });

  const [songs, setSongs] = useState(() => {
    const saved = localStorage.getItem('myMusicArchiive');
    return saved ? JSON.parse(saved) : initialSongs.map(s => ({ ...s, likes: 0, category: 'Patnos Türküleri' }));
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [currentSong, setCurrentSong] = useState(songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });

  // DİL VE METİN AYARLARI
  const t: any = {
    TR: {
      contactTitle: "MÜZİĞİNİ PAYLAŞ",
      contactSub: '"Tozlu raflarda unutulmuş bir kayıt mı var?"',
      waBtn: "WHATSAPP",
      adrTitle: "ADRES",
      adrText: "Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir",
      mailTitle: "E-POSTA"
    },
    KU: {
      contactTitle: "MUZÎKA XWE PARVE BIKE",
      contactSub: '"Ma qeydeke ji bîr kiriye heye?"',
      waBtn: "WHATSAPP",
      adrTitle: "ADRES",
      adrText: "Taxa Yeşilbağlar. 637/33 Sok. No: 25 Buca/Îzmîr",
      mailTitle: "E-POSTA"
    }
  };

  useEffect(() => { 
    localStorage.setItem('myMusicArchiive', JSON.stringify(songs));
    localStorage.setItem('myLikedSongs', JSON.stringify(likedSongs));
    localStorage.setItem('appLogo', logoUrl);
    localStorage.setItem('appBanner', bannerUrl);
    localStorage.setItem('appBannerText', bannerText);
  }, [songs, likedSongs, logoUrl, bannerUrl, bannerText]);

  const handleLike = (id: number) => {
    if (likedSongs.includes(id)) return;
    setSongs(songs.map((s: any) => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s));
    setLikedSongs([...likedSongs, id]);
  };

  const filteredSongs = songs
    .filter((s: any) => activeCategory === 'Tümü' || activeCategory === 'Hemû' || s.category === activeCategory)
    .sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0));

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} lang={lang} logoUrl={logoUrl} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center px-8 z-30 shrink-0 border-b border-white/5">
          <input type="text" placeholder="Ara..." className="bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm w-full max-w-xl outline-none" />
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-40 pt-8">
          
          {/* ANA SAYFA */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in">
               <div className="mb-12 rounded-[3rem] relative overflow-hidden h-[300px] flex items-center bg-neutral-900 border border-white/5">
                <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
                <div className="relative z-10 p-16"><h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight max-w-2xl">{bannerText || "Patnos'tan İzmir'e Bir Melodi..."}</h2></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {["Patnos Türküleri", "Patnoslu Sanatçılar", "Dengbêjler", "Sizden Gelenler"].map((cat) => (
                  <div key={cat} onClick={() => setActiveCategory(cat)} className={`p-6 rounded-[2rem] h-28 flex flex-col justify-end cursor-pointer transition-all text-sm font-black uppercase italic ${activeCategory === cat ? 'bg-amber-500 text-black' : 'bg-neutral-900/50 border border-white/5 hover:bg-white/5'}`}>{cat}</div>
                ))}
              </div>
              <div className="space-y-2">
                {filteredSongs.map((song: any) => (
                  <div key={song.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all">
                    <div className="flex items-center space-x-5 cursor-pointer flex-1" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                      <img src={song.cover} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <div><p className="font-bold text-sm">{song.title}</p><p className="text-[10px] text-neutral-500 font-black uppercase">{song.artist}</p></div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                         <span className={`text-[10px] font-black ${likedSongs.includes(song.id) ? 'text-red-500' : 'text-amber-500'}`}>{song.likes || 0}</span>
                         <button onClick={() => handleLike(song.id)} className={`${likedSongs.includes(song.id) ? 'text-red-500' : 'text-neutral-500'} text-xl`}>♥</button>
                      </div>
                      <a href={song.url} download={`${song.title}.mp3`} className="text-neutral-400 hover:text-white text-xl">⇩</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* İLETİŞİM PANELİ (DÜZELTİLEN KISIM) */}
          {activeTab === 'contact' && (
             <div className="max-w-5xl mx-auto py-10 space-y-10 animate-in zoom-in-95">
                {/* O ÇARPICI SARI KUTU */}
                <div className="bg-[#f2a30b] rounded-[4rem] p-20 text-center text-black shadow-[0_20px_50px_rgba(242,163,11,0.3)]">
                   <h2 className="text-7xl font-black mb-6 italic uppercase tracking-tighter leading-none">
                     {t[lang].contactTitle}
                   </h2>
                   <p className="font-black text-2xl italic mb-12 tracking-tight">
                     {t[lang].contactSub}
                   </p>
                   {/* WHATSAPP BUTONU */}
                   <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" 
                      className="inline-block bg-black text-white px-16 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-transform shadow-2xl">
                      {t[lang].waBtn}
                   </a>
                </div>
                
                {/* ALT KUTULAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-[#141414] p-12 rounded-[3rem] border border-white/5 text-center shadow-xl">
                      <h3 className="text-[#f2a30b] font-black mb-4 uppercase tracking-widest text-xs">{t[lang].adrTitle}</h3>
                      <p className="text-lg italic text-neutral-300 font-bold max-w-xs mx-auto">{t[lang].adrText}</p>
                   </div>
                   <div className="bg-[#141414] p-12 rounded-[3rem] border border-white/5 text-center shadow-xl">
                      <h3 className="text-[#f2a30b] font-black mb-4 uppercase tracking-widest text-xs">{t[lang].mailTitle}</h3>
                      <p className="text-xl italic text-neutral-100 font-black tracking-tight">patnosumuz@gmail.com</p>
                   </div>
                </div>
             </div>
          )}

          {/* PANEL / ADMİN */}
          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto space-y-10">
               <div className="bg-neutral-900 p-10 rounded-[3.5rem] border border-white/10">
                  <h2 className="text-xl font-black text-amber-500 mb-8 uppercase italic border-b border-white/5 pb-4">YENİ ŞARKI EKLE</h2>
                  <form onSubmit={(e) => { e.preventDefault(); setSongs([{...newSong, id: Date.now(), likes: 0}, ...songs]); alert("Eklendi!"); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Şarkı Adı" className="bg-black border border-white/10 p-4 rounded-xl" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} required />
                      <input type="text" placeholder="Sanatçı" className="bg-black border border-white/10 p-4 rounded-xl" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} required />
                    </div>
                    <input type="text" placeholder="Kapak URL" className="w-full bg-black border border-white/10 p-4 rounded-xl" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} required />
                    <input type="text" placeholder="Müzik URL" className="w-full bg-black border border-white/10 p-4 rounded-xl" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} required />
                    <select className="w-full bg-black border border-white/10 p-4 rounded-xl text-white" value={newSong.category} onChange={e => setNewSong({...newSong, category: e.target.value})}>
                      {["Patnos Türküleri", "Patnoslu Sanatçılar", "Dengbêjler", "Sizden Gelenler"].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl shadow-xl uppercase">KAYDET VE YAYINLA</button>
                  </form>
               </div>
            </div>
          )}

        </div>
        {currentSong && <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/5 h-28 px-4 md:px-10 z-50"><Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} /></div>}
      </main>
    </div>
  );
};

export default App;
