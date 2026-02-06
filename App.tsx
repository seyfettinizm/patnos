import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<'TR' | 'KU'>(() => (localStorage.getItem('appLang') as 'TR' | 'KU') || 'TR');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  
  // LOGO VE BANNER AYARLARI
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem('appLogo') || "");
  const [bannerUrl, setBannerUrl] = useState(() => localStorage.getItem('appBanner') || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200");
  const [bannerText, setBannerText] = useState(() => localStorage.getItem('appBannerText') || "İZMİR'DEN PATNOS'A SEVGİLER");

  // KATEGORİ GÖRSELLERİ (Yönetici tarafından değiştirilebilir)
  const [catImages, setCatImages] = useState(() => {
    const saved = localStorage.getItem('appCatImages');
    return saved ? JSON.parse(saved) : {
      "Patnos Türküleri": "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400",
      "Patnoslu Sanatçılar": "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400",
      "Dengbêjler": "https://images.unsplash.com/photo-1514525253361-b83f859b73c0?w=400",
      "Sizden Gelenler": "https://images.unsplash.com/photo-1459749411177-0421800673d6?w=400"
    };
  });

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

  const categories = [
    { name: "Patnos Türküleri", color: "from-blue-600/80" },
    { name: "Patnoslu Sanatçılar", color: "from-purple-600/80" },
    { name: "Dengbêjler", color: "from-orange-600/80" },
    { name: "Sizden Gelenler", color: "from-emerald-600/80" }
  ];

  useEffect(() => { 
    localStorage.setItem('myMusicArchiive', JSON.stringify(songs));
    localStorage.setItem('myLikedSongs', JSON.stringify(likedSongs));
    localStorage.setItem('appLogo', logoUrl);
    localStorage.setItem('appBanner', bannerUrl);
    localStorage.setItem('appBannerText', bannerText);
    localStorage.setItem('appCatImages', JSON.stringify(catImages));
  }, [songs, likedSongs, logoUrl, bannerUrl, bannerText, catImages]);

  const handleLike = (id: number) => {
    if (likedSongs.includes(id)) return;
    setSongs(songs.map((s: any) => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s));
    setLikedSongs([...likedSongs, id]);
  };

  const filteredSongs = songs
    .filter((s: any) => activeCategory === 'Tümü' || activeCategory === 'Hemû' || s.category === activeCategory)
    .sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0));

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} lang={lang} logoUrl={logoUrl} />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-neutral-900/20 to-black">
        <header className="h-16 flex items-center px-8 z-30 shrink-0 border-b border-white/5 backdrop-blur-md bg-black/20">
          <input type="text" placeholder="Melodilerde yolculuğa çık..." className="bg-white/5 border border-white/10 rounded-full px-6 py-2 text-xs w-full max-w-xl outline-none focus:border-amber-500/50 transition-all" />
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-40 pt-8 scrollbar-hide">
          
          {activeTab === 'home' && (
            <div className="animate-in fade-in zoom-in-95 duration-700">
               {/* ANA BANNER - CAM EFEKTİ */}
               <div className="mb-10 rounded-[3.5rem] relative overflow-hidden h-[350px] flex items-center group shadow-2xl">
                <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div className="relative z-10 p-16">
                  <span className="text-amber-500 font-black text-xs tracking-[0.4em] uppercase mb-4 block">Günün Seçkisi</span>
                  <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none drop-shadow-2xl max-w-xl">{bannerText}</h2>
                </div>
              </div>
              
              <h3 className="text-xs font-black mb-8 flex items-center tracking-widest text-neutral-400 uppercase">
                <span className="w-8 h-[2px] bg-amber-500 mr-4"></span> Keşfet
              </h3>
              
              {/* GÖRSEL ŞÖLEN KATEGORİLER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {categories.map((cat) => (
                  <div key={cat.name} onClick={() => setActiveCategory(cat.name)} 
                    className={`relative rounded-[2.5rem] h-52 overflow-hidden cursor-pointer transition-all duration-500 group shadow-lg
                    ${activeCategory === cat.name ? 'ring-2 ring-amber-500 scale-[1.03]' : 'hover:scale-[1.02]'}`}>
                    <img src={catImages[cat.name as keyof typeof catImages]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent opacity-80`} />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-sm font-black uppercase italic tracking-tighter leading-none">{cat.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* LİSTE TASARIMI */}
              <div className="grid gap-3">
                {filteredSongs.map((song: any) => (
                  <div key={song.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group">
                    <div className="flex items-center space-x-5 cursor-pointer flex-1" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                      <div className="relative overflow-hidden rounded-xl w-14 h-14 shadow-xl">
                        <img src={song.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        {currentSong?.id === song.id && isPlaying && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="animate-pulse text-amber-500">●</span></div>}
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight group-hover:text-amber-400 transition-colors">{song.title}</p>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 pr-4">
                      <button onClick={() => handleLike(song.id)} className={`flex items-center space-x-2 transition-all ${likedSongs.includes(song.id) ? 'text-red-500' : 'text-neutral-500 hover:text-white'}`}>
                        <span className="text-[10px] font-black">{song.likes || 0}</span>
                        <span className="text-xl">♥</span>
                      </button>
                      <a href={song.url} download className="text-neutral-600 hover:text-white transition-colors">⇩</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PANEL - YENİ ÖZELLİK: KATEGORİ RESMİ DÜZENLEME */}
          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-10">
               <div className="bg-neutral-900/50 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
                  <h2 className="text-xl font-black text-amber-500 mb-8 uppercase italic tracking-tighter border-b border-white/5 pb-4">Görsel Atmosfer Yönetimi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     {categories.map(cat => (
                       <div key={cat.name} className="space-y-2">
                         <label className="text-[10px] font-black text-neutral-500 uppercase ml-2">{cat.name} Görseli</label>
                         <input type="text" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-amber-500" 
                                value={catImages[cat.name as keyof typeof catImages]} 
                                onChange={(e) => setCatImages({...catImages, [cat.name]: e.target.value})} placeholder="Resim URL yapıştır..." />
                       </div>
                     ))}
                  </div>
                  
                  <h2 className="text-xl font-black text-amber-500 mb-8 uppercase italic tracking-tighter border-b border-white/5 pb-4">Yeni Melodi Ekle</h2>
                  <form onSubmit={(e) => { e.preventDefault(); setSongs([{...newSong, id: Date.now(), likes: 0}, ...songs]); alert("Yayına alındı!"); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Şarkı Adı" className="bg-black/40 border border-white/10 p-4 rounded-xl text-sm" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} required />
                      <input type="text" placeholder="Sanatçı" className="bg-black/40 border border-white/10 p-4 rounded-xl text-sm" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} required />
                    </div>
                    <input type="text" placeholder="Kapak Resmi URL" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-sm" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} required />
                    <input type="text" placeholder="MP3 Dosya URL" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-sm" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} required />
                    <select className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-sm text-white" value={newSong.category} onChange={e => setNewSong({...newSong, category: e.target.value})}>
                      {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-amber-500 text-black font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95">SİSTEME KAYDET</button>
                  </form>
               </div>
            </div>
          )}
        </div>
        {currentSong && <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/5 h-28 px-4 md:px-10 z-50 shadow-2xl"><Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} /></div>}
      </main>
    </div>
  );
};

export default App;
