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

  const t: any = {
    TR: {
      search: "Ara...", bannerTitle: bannerText || "Patnos'tan İzmir'e Bir Melodi...",
      collTitle: "ÖZEL KOLEKSİYONLAR", categories: ["Tümü", "Patnos Türküleri", "Patnoslu Sanatçılar", "Dengbêjler", "Sizden Gelenler"],
      contactTitle: "MÜZİĞİNİ PAYLAŞ", waBtn: "WHATSAPP", adminTitle: "İÇERİK YÖNETİMİ",
      address: "Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir", labels: ["Müzik Adı", "Sanatçı", "Kapak (URL)", "Müzik (URL)", "Klasör", "Banner Yazısı"]
    },
    KU: {
      search: "Bigere...", bannerTitle: bannerText || "Ji Patnosê ber bi Îzmîrê ve...",
      collTitle: "KOLEKSİYONÊN TAYBET", categories: ["Hemû", "Stranên Patnosê", "Hunermendên Patnosî", "Dengbêj", "Ji We Hatine"],
      contactTitle: "MUZÎKA XWE PARVE BIKE", waBtn: "WHATSAPP", adminTitle: "RÊVEBERIYA NAVEROKÊ",
      address: "Taxa Yeşilbağlar. 637/33 Sok. No: 25 Buca/Îzmîr", labels: ["Navê Stranê", "Hunermend", "Berg", "Lînk", "Klasor", "Nivîsa Banner"]
    }
  };

  const [songs, setSongs] = useState(() => {
    const saved = localStorage.getItem('myMusicArchiive');
    return saved ? JSON.parse(saved) : initialSongs.map(s => ({ ...s, likes: 0, category: 'Patnos Türküleri' }));
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [currentSong, setCurrentSong] = useState(songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });

  useEffect(() => { 
    localStorage.setItem('myMusicArchiive', JSON.stringify(songs));
    localStorage.setItem('appLogo', logoUrl);
    localStorage.setItem('appBanner', bannerUrl);
    localStorage.setItem('appBannerText', bannerText);
  }, [songs, logoUrl, bannerUrl, bannerText]);

  // BEĞENİ ARTIRMA VE SIRALAMA FONKSİYONU
  const handleLike = (id: number) => {
    const updatedSongs = songs.map((s: any) => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s);
    setSongs(updatedSongs);
  };

  // FİLTRELEME VE BEĞENİYE GÖRE SIRALAMA
  const filteredSongs = songs
    .filter((s: any) => activeCategory === 'Tümü' || activeCategory === 'Hemû' || s.category === activeCategory)
    .sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0));

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} lang={lang} logoUrl={logoUrl} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 z-30 shrink-0">
          <input type="text" placeholder={t[lang].search} className="bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm w-full max-w-xl outline-none" />
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-40">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
               <div className="mb-12 rounded-[3rem] relative overflow-hidden h-[300px] flex items-center bg-neutral-900 border border-white/5">
                <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
                <div className="relative z-10 p-16"><h2 className="text-4xl font-black italic uppercase leading-tight">{t[lang].bannerTitle}</h2></div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-black mb-6 flex items-center space-x-3 uppercase"><span className="w-1.5 h-6 bg-amber-500 rounded-full"></span><span>{t[lang].collTitle}</span></h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {t[lang].categories.slice(1).map((cat: string) => (
                    <div key={cat} onClick={() => setActiveCategory(cat)} className={`p-6 rounded-[2rem] h-32 flex flex-col justify-end cursor-pointer transition-all ${activeCategory === cat ? 'bg-amber-500 text-black' : 'bg-neutral-900/50 border border-white/5 hover:bg-white/5'}`}>
                      <p className="text-lg font-black uppercase italic">{cat}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {filteredSongs.map((song: any) => (
                  <div key={song.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:bg-white/10 transition-all group">
                    <div className="flex items-center space-x-5 cursor-pointer flex-1" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="font-bold text-sm">{song.title}</p>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist}</p>
                      </div>
                    </div>
                    {/* HER ZAMAN GÖRÜNÜR BEĞEN VE İNDİR */}
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                         <span className="text-[10px] font-black text-amber-500">{song.likes || 0}</span>
                         <button onClick={() => handleLike(song.id)} className="text-red-500 text-xl hover:scale-125 transition-all">♥</button>
                      </div>
                      <a href={song.url} download target="_blank" className="text-neutral-400 hover:text-white text-xl">⇩</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
             <div className="max-w-4xl mx-auto py-10 space-y-10">
                {/* ... (Admin formu kodları burada değişmeden kalıyor) ... */}
                <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-amber-500/20 shadow-2xl">
                  <h3 className="text-amber-500 font-black mb-6 uppercase tracking-widest text-[10px]">Ayarlar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" className="bg-black border border-white/10 p-4 rounded-xl text-xs" value={logoUrl} onChange={(e)=>setLogoUrl(e.target.value)} placeholder="Logo URL" />
                    <input type="text" className="bg-black border border-white/10 p-4 rounded-xl text-xs" value={bannerUrl} onChange={(e)=>setBannerUrl(e.target.value)} placeholder="Banner URL" />
                    <input type="text" className="bg-black border border-white/10 p-4 rounded-xl text-xs" value={bannerText} onChange={(e)=>setBannerText(e.target.value)} placeholder="Banner Yazısı" />
                  </div>
                </div>
                {/* Şarkı Ekleme ve Düzenleme Listesi */}
                <div className="bg-neutral-900 p-8 rounded-[3.5rem] border border-white/10">
                   <h2 className="text-xl font-black text-amber-500 mb-6 uppercase italic tracking-tighter">Şarkı Yönetimi</h2>
                   <div className="space-y-3">
                    {songs.map((song: any) => (
                      <div key={song.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                        <div className="flex items-center space-x-4">
                          <img src={song.cover} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <p className="font-bold text-sm">{song.title} <span className="text-amber-500 ml-2">({song.likes || 0} ♥)</span></p>
                        </div>
                        <button onClick={() => setSongs(songs.filter((s:any) => s.id !== song.id))} className="text-red-500 text-[10px] font-black border border-red-500/20 px-3 py-1 rounded-lg">SİL</button>
                      </div>
                    ))}
                   </div>
                </div>
             </div>
          )}
        </div>
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/5 h-28 px-4 md:px-10 z-50">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
