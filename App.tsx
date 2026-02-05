import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'TR');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || 'MİSAFİR');
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const [songs, setSongs] = useState(() => {
    const saved = localStorage.getItem('myMusicArchiive');
    return saved ? JSON.parse(saved) : initialSongs.map(s => ({ ...s, likes: 0, category: 'Patnos Türküleri' }));
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('siteSettings');
    return saved ? JSON.parse(saved) : {
      bannerText: "Patnos'tan İzmir'e Bir Melodi...",
      bannerSub: "HAFTANIN SEÇİMİ",
      bannerDesc: "Köklerinizi hissedin. En sevdiğiniz Dengbêjler ve yöresel ezgiler tek bir kutuda toplandı.",
      bannerImg: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200",
      logoUrl: ""
    };
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [currentSong, setCurrentSong] = useState(songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });

  useEffect(() => { 
    localStorage.setItem('appLang', lang);
    localStorage.setItem('myMusicArchiive', JSON.stringify(songs));
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
  }, [lang, songs, siteSettings]);

  const categories = [
    { id: 'Patnos Türküleri', color: 'bg-blue-600', icon: '🎸' },
    { id: 'Patnoslu Sanatçılar', color: 'bg-purple-600', icon: '🎤' },
    { id: 'Dengbêjler', color: 'bg-orange-600', icon: '🎙️' },
    { id: 'Sizden Gelenler', color: 'bg-emerald-600', icon: '👥' }
  ];

  const handleLike = (id: number) => {
    setSongs(songs.map((s: any) => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s));
  };

  const filteredSongs = songs
    .filter((s: any) => activeCategory === 'Tümü' || s.category === activeCategory)
    .sort((a: any, b: any) => b.likes - a.likes)
    .slice(0, 8);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans select-none">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} setAdminPass={setAdminPass} handleAdminLogin={(e:any) => { e.preventDefault(); if(adminPass === 'Mihriban04') setIsAdmin(true); }} lang={lang} logo={siteSettings.logoUrl} />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0a0a0a]">
        {/* ÜST BAR (GÖRSELDEKİ GİBİ) */}
        <header className="h-20 flex items-center justify-between px-8 z-30">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-2.5 w-full max-w-xl">
            <span className="text-neutral-500 mr-3 text-lg">🔍</span>
            <input type="text" placeholder="Şarkı, sanatçı veya albüm ara..." className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-neutral-600" />
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex bg-neutral-900/80 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}>KU</button>
            </div>
            <div className="flex items-center space-x-3 bg-neutral-900 px-4 py-1.5 rounded-full border border-white/5">
                <span className="text-[10px] font-black tracking-widest">{guestName}</span>
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs">👤</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-40">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
              {/* BANNER AREA */}
              <div className="mb-12 rounded-[3rem] relative overflow-hidden h-[400px] flex items-center bg-neutral-900 border border-white/5 group">
                <img src={siteSettings.bannerImg} className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="relative z-10 p-16 max-w-3xl">
                   <span className="bg-amber-500 text-black text-[10px] font-black px-4 py-1.5 rounded-lg mb-6 inline-block uppercase tracking-widest shadow-xl">{siteSettings.bannerSub}</span>
                   <h2 className="text-6xl font-black mb-6 tracking-tighter leading-none">{siteSettings.bannerText}</h2>
                   <p className="text-neutral-400 font-medium text-lg italic leading-relaxed">{siteSettings.bannerDesc}</p>
                </div>
              </div>

              {/* KATEGORİ KUTULARI (GÖRSELDEKİ GİBİ) */}
              <div className="mb-12">
                <h3 className="text-xl font-black mb-6 flex items-center space-x-3 uppercase tracking-tighter">
                  <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                  <span>Özel Koleksiyonlar</span>
                </h3>
                <div className="grid grid-cols-4 gap-6">
                  {categories.map((cat) => (
                    <div 
                      key={cat.id} 
                      onClick={() => setActiveCategory(cat.id === activeCategory ? 'Tümü' : cat.id)}
                      className={`${cat.color} ${activeCategory === cat.id ? 'ring-4 ring-white shadow-2xl scale-105' : 'opacity-80 hover:opacity-100'} p-8 rounded-[2.5rem] h-60 flex flex-col justify-end cursor-pointer transition-all duration-300 relative overflow-hidden group`}
                    >
                      <div className="absolute top-6 right-8 text-4xl opacity-20 group-hover:scale-125 transition-transform">{cat.icon}</div>
                      <p className="text-2xl font-black leading-tight tracking-tighter">{cat.id}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ŞARKILAR LİSTESİ */}
              <div>
                <h3 className="text-xl font-black mb-6 flex items-center space-x-3 uppercase tracking-tighter">
                  <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                  <span>Şu An Popüler</span>
                </h3>
                <div className="space-y-2">
                  {filteredSongs.map((song: any) => (
                    <div key={song.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent transition-all group">
                      <div className="flex items-center space-x-5 cursor-pointer flex-1" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                        <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-2xl" alt="" />
                        <div>
                          <p className="font-bold text-sm">{song.title}</p>
                          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8">
                        <button onClick={() => handleLike(song.id)} className="flex items-center space-x-2 text-neutral-500 hover:text-red-500 transition-colors">
                           <span className="text-xs font-black">{song.likes || 0}</span>
                           <span className="text-xl">❤️</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* YÖNETİM PANELİ (Mevcut Özellikler Korundu) */}
          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in py-10">
               <div className="bg-neutral-900/50 p-12 rounded-[3.5rem] border border-white/5">
                  <h2 className="text-2xl font-black text-amber-500 mb-8 uppercase italic tracking-tighter">İçerik & Banner Yönetimi</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <input type="text" placeholder="Banner Başlığı" className="bg-black border border-white/10 p-5 rounded-2xl text-sm" value={siteSettings.bannerText} onChange={e => setSiteSettings({...siteSettings, bannerText: e.target.value})} />
                    <input type="text" placeholder="Banner Görsel Linki" className="bg-black border border-white/10 p-5 rounded-2xl text-sm" value={siteSettings.bannerImg} onChange={e => setSiteSettings({...siteSettings, bannerImg: e.target.value})} />
                    <textarea placeholder="Banner Açıklaması" className="bg-black border border-white/10 p-5 rounded-2xl text-sm col-span-2 h-24" value={siteSettings.bannerDesc} onChange={e => setSiteSettings({...siteSettings, bannerDesc: e.target.value})} />
                  </div>
               </div>

               <div className="bg-neutral-900/50 p-12 rounded-[3.5rem] border border-white/5">
                  <h2 className="text-2xl font-black text-amber-500 mb-8 uppercase italic tracking-tighter">Müzik Yükleme Konsolu</h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setSongs([{...newSong, id: Date.now(), likes: 0}, ...songs]);
                    alert("Eklendi!");
                  }} className="grid grid-cols-2 gap-6">
                    <input type="text" placeholder="1. Müzik Adı" className="bg-black border border-white/10 p-5 rounded-2xl text-sm" onChange={e => setNewSong({...newSong, title: e.target.value})} />
                    <input type="text" placeholder="2. Sanatçı Adı" className="bg-black border border-white/10 p-5 rounded-2xl text-sm" onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                    <input type="text" placeholder="3. Şarkı Kapağı Linki" className="bg-black border border-white/10 p-5 rounded-2xl text-sm" onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                    <input type="text" placeholder="4. Müzik Dosyası (MP3) Linki" className="bg-black border border-white/10 p-5 rounded-2xl text-sm" onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    <select className="bg-black border border-white/10 p-5 rounded-2xl text-sm text-neutral-400" onChange={e => setNewSong({...newSong, category: e.target.value})}>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                    </select>
                    <button type="submit" className="bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest">Sisteme Kaydet</button>
                  </form>
               </div>
            </div>
          )}
        </div>

        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/5 h-28 px-10 z-50 backdrop-blur-xl">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
