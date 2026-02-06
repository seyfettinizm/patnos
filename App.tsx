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
  const [bannerTR, setBannerTR] = useState(() => localStorage.getItem('bannerTR') || "İZMİR'DEN PATNOS'A SEVGİLER");
  const [bannerKU, setBannerKU] = useState(() => localStorage.getItem('bannerKU') || "JI ÎZMÎRÊ JI BO PANOSÊ SILAV");

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

  const t: any = {
    TR: { search: "Ara...", explore: "KEŞFET", collections: "ÖZEL KOLEKSİYONLAR", banner: bannerTR, contactTitle: "MÜZİĞİNİ PAYLAŞ", contactDesc: "Elinizdeki yöresel kayıtları bize ulaştırın.", waBtn: "WHATSAPP", topTracks: "EN ÇOK BEĞENİLENLER", catNames: { "Patnos Türküleri": "Patnos Türküleri", "Patnoslu Sanatçılar": "Patnoslu Sanatçılar", "Dengbêjler": "Dengbêjler", "Sizden Gelenler": "Sizden Gelenler" } },
    KU: { search: "Bigere...", explore: "KEŞIF BIKE", collections: "KOLEKSIYONÊN TAYBET", banner: bannerKU, contactTitle: "MUZÎKA XWE PARVE BIKE", contactDesc: "Qeydên xwe ji me re bişînin.", waBtn: "WHATSAPP", topTracks: "YÊN HERÎ ZÊDE HATINE BEĞENÎ KIRIN", catNames: { "Patnos Türküleri": "Stranên Panosê", "Patnoslu Sanatçılar": "Hunermendên Panosî", "Dengbêjler": "Dengbêj", "Sizden Gelenler": "Ji We Hatiye" } }
  };

  const categories = [
    { id: "Patnos Türküleri", color: "from-blue-600/80" },
    { id: "Patnoslu Sanatçılar", color: "from-purple-600/80" },
    { id: "Dengbêjler", color: "from-orange-600/80" },
    { id: "Sizden Gelenler", color: "from-emerald-600/80" }
  ];

  useEffect(() => { 
    localStorage.setItem('myMusicArchiive', JSON.stringify(songs));
    localStorage.setItem('myLikedSongs', JSON.stringify(likedSongs));
    localStorage.setItem('appLogo', logoUrl);
    localStorage.setItem('appBanner', bannerUrl);
    localStorage.setItem('bannerTR', bannerTR);
    localStorage.setItem('bannerKU', bannerKU);
    localStorage.setItem('appCatImages', JSON.stringify(catImages));
    localStorage.setItem('appLang', lang);
  }, [songs, likedSongs, logoUrl, bannerUrl, bannerTR, bannerKU, catImages, lang]);

  const sortSongs = (list: any[]) => {
    return [...list].sort((a, b) => {
      if ((b.likes || 0) !== (a.likes || 0)) return (b.likes || 0) - (a.likes || 0);
      return a.title.localeCompare(b.title);
    });
  };

  // OTOMATİK GEÇİŞ SİSTEMİ
  const playNextSong = () => {
    // Şarkıları beğeni ve alfabe sırasına göre diziyoruz (Sistemdeki sıralama neyse o)
    const sortedList = sortSongs(songs);
    const currentIndex = sortedList.findIndex((s: any) => s.id === currentSong?.id);
    
    // Bir sonraki şarkıyı bul (Listenin sonuna gelince başa dön)
    const nextIndex = (currentIndex + 1) % sortedList.length;
    setCurrentSong(sortedList[nextIndex]);
    setIsPlaying(true);
  };

  const handleLike = (id: number) => {
    if (likedSongs.includes(id)) return;
    setSongs(songs.map((s: any) => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s));
    setLikedSongs([...likedSongs, id]);
  };

  const displaySongs = activeCategory === 'Tümü' || activeCategory === 'Hemû'
    ? sortSongs(songs).slice(0, 6)
    : sortSongs(songs.filter((s: any) => s.category === activeCategory));

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} lang={lang} logoUrl={logoUrl} setLang={setLang} />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-neutral-900/20 to-black">
        <header className="h-16 flex items-center justify-between px-8 z-30 shrink-0 border-b border-white/5 backdrop-blur-md bg-black/20">
          <input type="text" placeholder={t[lang].search} className="bg-white/5 border border-white/10 rounded-full px-6 py-2 text-xs w-full max-w-xl outline-none" />
          <div className="flex bg-black/40 rounded-full p-1 border border-white/10">
            <button onClick={() => setLang('TR')} className={`px-4 py-1 rounded-full text-[10px] font-black ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-white'}`}>TR</button>
            <button onClick={() => setLang('KU')} className={`px-4 py-1 rounded-full text-[10px] font-black ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-white'}`}>KU</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-40 pt-8 scrollbar-hide">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
               <div className="mb-8 rounded-[3.5rem] relative overflow-hidden h-[300px] flex items-center shadow-2xl">
                <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />
                <div className="relative z-10 p-16"><h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-amber-500">{t[lang].banner}</h2></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {categories.map((cat) => (
                  <div key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? 'Tümü' : cat.id)} 
                    className={`relative rounded-[2.5rem] h-48 overflow-hidden cursor-pointer transition-all duration-500 group shadow-lg
                    ${activeCategory === cat.id ? 'ring-2 ring-amber-500 scale-[1.03]' : 'hover:scale-[1.02]'}`}>
                    <img src={catImages[cat.id as keyof typeof catImages]} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent opacity-90`} />
                    <div className="absolute bottom-6 left-6 pr-6"><p className="text-sm font-black uppercase italic tracking-tighter">{t[lang].catNames[cat.id]}</p></div>
                  </div>
                ))}
              </div>

              <h3 className="text-[10px] font-black mb-6 flex items-center tracking-widest text-neutral-500 uppercase">
                <span className="w-6 h-[2px] bg-amber-500 mr-3"></span> 
                {activeCategory === 'Tümü' || activeCategory === 'Hemû' ? t[lang].topTracks : t[lang].catNames[activeCategory]}
              </h3>

              <div className="space-y-2">
                {displaySongs.map((song: any) => (
                  <div key={song.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all group">
                    <div className="flex items-center space-x-5 cursor-pointer flex-1" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                      <img src={song.cover} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <div><p className="font-bold text-sm">{song.title}</p><p className="text-[10px] text-neutral-500 font-black uppercase">{song.artist}</p></div>
                    </div>
                    <div className="flex items-center space-x-6 pr-4">
                         <div className="hidden md:block text-[10px] font-mono text-neutral-600"><DurationDisplay url={song.url} /></div>
                         <div className="flex items-center space-x-2">
                            <span className={`text-[11px] font-black ${likedSongs.includes(song.id) ? 'text-red-500' : 'text-amber-500'}`}>{song.likes || 0}</span>
                            <button onClick={() => handleLike(song.id)} className={`${likedSongs.includes(song.id) ? 'text-red-500 cursor-default' : 'text-neutral-500 hover:text-red-400'} text-xl transition-all`}>♥</button>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); window.open(song.url, '_blank'); }} className="text-neutral-400 hover:text-white text-xl">⇩</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DİĞER TABLAR (ADMIN, CONTACT) BURAYA GELEBİLİR - SİZİN MEVCUT KODUNUZU KORUDUM */}
          {activeTab === 'admin' && (
             <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95">
                <div className="bg-neutral-900/50 p-8 rounded-[2.5rem] border border-amber-500/20 shadow-xl">
                   <h3 className="text-amber-500 font-black mb-6 uppercase text-[10px] tracking-widest italic border-b border-white/5 pb-2">Görsel & Dil Yönetimi</h3>
                   <div className="grid grid-cols-2 gap-4">
                     <input type="text" className="bg-black border border-white/10 p-4 rounded-xl text-xs text-white" value={bannerTR} onChange={(e)=>setBannerTR(e.target.value)} placeholder="Banner Türkçe" />
                     <input type="text" className="bg-black border border-white/10 p-4 rounded-xl text-xs text-white" value={bannerKU} onChange={(e)=>setBannerKU(e.target.value)} placeholder="Banner Kürtçe" />
                   </div>
                </div>
                {/* Şarkı ekleme formu vb. sizin mevcut admin kodunuzu buraya ekleyebilirsiniz */}
                <div className="bg-neutral-900/50 p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                  <h2 className="text-xl font-black text-amber-500 mb-8 uppercase italic border-b border-white/5 pb-4">YENİ ŞARKI EKLE</h2>
                  <form onSubmit={(e) => { e.preventDefault(); setSongs([{...newSong, id: Date.now(), likes: 0}, ...songs]); alert("Kaydedildi!"); }} className="space-y-4">
                    <input type="text" placeholder="Şarkı Adı" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                    <input type="text" placeholder="Sanatçı" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                    <input type="text" placeholder="Müzik URL" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    <input type="text" placeholder="Kapak URL" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                    <select className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm text-white" value={newSong.category} onChange={e => setNewSong({...newSong, category: e.target.value})}>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl">KAYDET</button>
                  </form>
                </div>
             </div>
          )}
        </div>
        
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-white/5 h-28 px-4 md:px-10 z-50 shadow-2xl">
            <Player 
              song={currentSong} 
              isPlaying={isPlaying} 
              setIsPlaying={setIsPlaying} 
              onEnded={playNextSong} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

// SÜRE ALGILAYICI BİLEŞEN
const DurationDisplay: React.FC<{ url: string }> = ({ url }) => {
  const [duration, setDuration] = useState("0:00");
  useEffect(() => {
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      const min = Math.floor(audio.duration / 60);
      const sec = Math.floor(audio.duration % 60);
      setDuration(`${min}:${sec < 10 ? '0' : ''}${sec}`);
    });
  }, [url]);
  return <span>{duration}</span>;
};

export default App;
