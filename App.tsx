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
  
  // FORM İÇİN 5'Lİ YAPI GERİ GELDİ
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });

  useEffect(() => { 
    localStorage.setItem('myMusicArchiive', JSON.stringify(songs));
    localStorage.setItem('myLikedSongs', JSON.stringify(likedSongs));
    localStorage.setItem('appLogo', logoUrl);
    localStorage.setItem('appBanner', bannerUrl);
    localStorage.setItem('appBannerText', bannerText);
  }, [songs, likedSongs, logoUrl, bannerUrl, bannerText]);

  const handleLike = (id: number) => {
    if (likedSongs.includes(id)) return;
    const updatedSongs = songs.map((s: any) => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s);
    setSongs(updatedSongs);
    setLikedSongs([...likedSongs, id]);
  };

  const editSong = (id: number) => {
    const song = songs.find((s:any) => s.id === id);
    if(song) {
      const newTitle = prompt("Yeni Şarkı Adı:", song.title);
      const newArtist = prompt("Yeni Sanatçı Adı:", song.artist);
      if(newTitle && newArtist) {
        setSongs(songs.map((s:any) => s.id === id ? {...s, title: newTitle, artist: newArtist} : s));
      }
    }
  };

  const filteredSongs = songs
    .filter((s: any) => activeCategory === 'Tümü' || activeCategory === 'Hemû' || s.category === activeCategory)
    .sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0));

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} lang={lang} logoUrl={logoUrl} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 z-30 shrink-0">
          <input type="text" placeholder="Ara..." className="bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm w-full max-w-xl outline-none" />
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-40">
          {activeTab === 'home' && (
            <div className="animate-in fade-in">
               <div className="mb-12 rounded-[3rem] relative overflow-hidden h-[300px] flex items-center bg-neutral-900 border border-white/5">
                <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
                <div className="relative z-10 p-16"><h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight max-w-2xl">{bannerText || "Patnos'tan İzmir'e Bir Melodi..."}</h2></div>
              </div>
              
              <div className="mb-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {["Patnos Türküleri", "Patnoslu Sanatçılar", "Dengbêjler", "Sizden Gelenler"].map((cat) => (
                    <div key={cat} onClick={() => setActiveCategory(cat)} className={`p-6 rounded-[2rem] h-32 flex flex-col justify-end cursor-pointer transition-all ${activeCategory === cat ? 'bg-amber-500 text-black' : 'bg-neutral-900/50 border border-white/5 hover:bg-white/5'}`}>
                      <p className="text-lg font-black uppercase italic">{cat}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {filteredSongs.map((song: any) => (
                  <div key={song.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all">
                    <div className="flex items-center space-x-5 cursor-pointer flex-1" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover" alt="" />
                      <div><p className="font-bold text-sm">{song.title}</p><p className="text-[10px] text-neutral-500 font-black uppercase">{song.artist}</p></div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                         <span className={`text-[10px] font-black ${likedSongs.includes(song.id) ? 'text-red-500' : 'text-amber-500'}`}>{song.likes || 0}</span>
                         <button onClick={() => handleLike(song.id)} className={`${likedSongs.includes(song.id) ? 'text-red-500' : 'text-neutral-500'} text-xl transition-all`}>♥</button>
                      </div>
                      <a href={song.url} download={`${song.title}.mp3`} className="text-neutral-400 hover:text-white text-xl">⇩</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-10 space-y-10 animate-in zoom-in">
               {/* GÖRÜNÜM AYARLARI */}
               <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-amber-500/20 shadow-2xl">
                  <h3 className="text-amber-500 font-black mb-6 uppercase text-[10px] tracking-widest">Görünüm Ayarları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" className="bg-black border border-white/10 p-4 rounded-xl text-xs" value={logoUrl} onChange={(e)=>setLogoUrl(e.target.value)} placeholder="Logo URL" />
                    <input type="text" className="bg-black border border-white/10 p-4 rounded-xl text-xs" value={bannerUrl} onChange={(e)=>setBannerUrl(e.target.value)} placeholder="Banner URL" />
                    <input type="text" className="bg-black border border-white/10 p-4 rounded-xl text-xs" value={bannerText} onChange={(e)=>setBannerText(e.target.value)} placeholder="Banner Yazısı" />
                  </div>
               </div>

               {/* 5'Lİ ŞARKI EKLEME FORMU (TAM HALİ) */}
               <div className="bg-neutral-900 p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl">
                  <h2 className="text-2xl font-black text-amber-500 mb-8 uppercase italic border-b border-white/5 pb-6">YENİ ŞARKI EKLE</h2>
                  <form onSubmit={(e) => { e.preventDefault(); setSongs([{...newSong, id: Date.now(), likes: 0}, ...songs]); alert("Şarkı Sisteme Eklendi!"); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Şarkı Adı" className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                      <input type="text" placeholder="Sanatçı" className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                    </div>
                    <input type="text" placeholder="Kapak Görsel URL (Wix Linki)" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                    <input type="text" placeholder="Müzik Dosya URL (MP3 Linki)" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    <select className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm text-white" value={newSong.category} onChange={e => setNewSong({...newSong, category: e.target.value})}>
                      {["Patnos Türküleri", "Patnoslu Sanatçılar", "Dengbêjler", "Sizden Gelenler"].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest shadow-xl">KAYDET VE YAYINLA</button>
                  </form>
               </div>

               {/* ŞARKI YÖNETİM PANELİ (DÜZENLE VE SİL) */}
               <div className="bg-neutral-900 p-8 md:p-12 rounded-[3.5rem] border border-red-500/10 shadow-2xl">
                  <h2 className="text-xl font-black text-red-500 mb-8 uppercase italic tracking-tighter">ŞARKIYI DÜZENLE VEYA SİL</h2>
                  <div className="space-y-3">
                    {songs.map((song: any) => (
                      <div key={song.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                        <div className="flex items-center space-x-4">
                          <img src={song.cover} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <div>
                            <p className="font-bold text-sm">{song.title}</p>
                            <p className="text-[9px] text-neutral-600 font-black uppercase tracking-widest">{song.artist}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                           <button onClick={() => editSong(song.id)} className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-amber-500 hover:text-black transition-all">DÜZENLE</button>
                           <button onClick={() => setSongs(songs.filter((s:any) => s.id !== song.id))} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all">SİL</button>
                        </div>
                      </div>
                    ))}
                  </div>
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
