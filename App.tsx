import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<'TR' | 'KU'>(() => (localStorage.getItem('appLang') as 'TR' | 'KU') || 'TR');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || 'MİSAFİR');
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const t: any = {
    TR: {
      search: "Şarkı, sanatçı ara...",
      bannerSub: "HAFTANIN SEÇİMİ",
      bannerTitle: "Patnos'tan İzmir'e Bir Melodi...",
      collTitle: "Özel Koleksiyonlar",
      popTitle: "Şu An Popüler",
      categories: ["Tümü", "Patnos Türküleri", "Patnoslu Sanatçılar", "Dengbêjler", "Sizden Gelenler"],
      adminTitle: "İÇERİK YÖNETİM PANELİ",
      saveBtn: "MÜZİĞİ SİSTEME EKLE",
      address: "Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir"
    },
    KU: {
      search: "Li stran bigere...",
      bannerSub: "HILBIARTINA HEFTEYÊ",
      bannerTitle: "Ji Patnosê ber bi Îzmîrê ve...",
      collTitle: "Koleksiyonên Taybet",
      popTitle: "Niha Populer e",
      categories: ["Hemû", "Stranên Patnosê", "Hunermendên Patnosî", "Dengbêj", "Ji We Hatine"],
      adminTitle: "PANELA RÊVEBERIYA NAVEROKÊ",
      saveBtn: "STRANÊ LI PERGALÊ ZÊDE BIKE",
      address: "Mah. Yeşilbağlar. 637/33 Sok. No: 25 Buca/Îzmîr"
    }
  };

  const [songs, setSongs] = useState(() => {
    const saved = localStorage.getItem('myMusicArchiive');
    return saved ? JSON.parse(saved) : initialSongs.map(s => ({ ...s, likes: 0, category: 'Patnos Türküleri' }));
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [currentSong, setCurrentSong] = useState(songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- KONSOL İÇİN YENİ STATE (TÜM ALANLAR BURADA) ---
  const [newSong, setNewSong] = useState({ 
    title: '', 
    artist: '', 
    cover: '', 
    url: '', 
    category: 'Patnos Türküleri' 
  });

  useEffect(() => { 
    localStorage.setItem('appLang', lang);
    localStorage.setItem('myMusicArchiive', JSON.stringify(songs));
  }, [lang, songs]);

  const categoryMap = [
    { id: t[lang].categories[1], color: 'bg-blue-600', icon: '🎸' },
    { id: t[lang].categories[2], color: 'bg-purple-600', icon: '🎤' },
    { id: t[lang].categories[3], color: 'bg-orange-600', icon: '🎙️' },
    { id: t[lang].categories[4], color: 'bg-emerald-600', icon: '👥' }
  ];

  const handleLike = (id: number) => {
    setSongs(songs.map((s: any) => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s));
  };

  const filteredSongs = songs
    .filter((s: any) => activeCategory === 'Tümü' || activeCategory === 'Hemû' || s.category === activeCategory)
    .sort((a: any, b: any) => b.likes - a.likes)
    .slice(0, 8);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} setAdminPass={setAdminPass} handleAdminLogin={(e:any) => { e.preventDefault(); if(adminPass === 'Mihriban04') setIsAdmin(true); }} lang={lang} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 z-30">
          <div className="flex bg-white/5 border border-white/10 rounded-full px-5 py-2 w-full max-w-xl">
            <input type="text" placeholder={t[lang].search} className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-neutral-900 rounded-full p-1">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black ${lang === 'TR' ? 'bg-amber-500 text-black' : ''}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black ${lang === 'KU' ? 'bg-amber-500 text-black' : ''}`}>KU</button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-40">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
               {/* BANNER */}
               <div className="mb-12 rounded-[3rem] relative overflow-hidden h-[350px] flex items-center bg-neutral-900">
                <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
                <div className="relative z-10 p-16">
                   <h2 className="text-5xl font-black mb-4 italic uppercase">{t[lang].bannerTitle}</h2>
                </div>
              </div>

              {/* KATEGORİ KUTULARI */}
              <div className="grid grid-cols-4 gap-6 mb-12">
                {categoryMap.map((cat) => (
                  <div key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`${cat.color} p-8 rounded-[2.5rem] h-52 flex flex-col justify-end cursor-pointer transition-all hover:scale-105 active:scale-95`}>
                    <p className="text-2xl font-black uppercase italic">{cat.id}</p>
                  </div>
                ))}
              </div>

              {/* ŞARKILAR */}
              <div className="space-y-2">
                {filteredSongs.map((song: any) => (
                  <div key={song.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all">
                    <div className="flex items-center space-x-5 cursor-pointer" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover" alt="" />
                      <div><p className="font-bold text-sm">{song.title}</p><p className="text-[10px] text-neutral-500 font-black uppercase">{song.artist}</p></div>
                    </div>
                    <button onClick={() => handleLike(song.id)} className="flex items-center space-x-2 text-neutral-500 hover:text-red-500">
                       <span className="text-xs font-black">{song.likes || 0}</span><span className="text-xl">❤️</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* İLETİŞİM */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-10 space-y-6">
              <div className="bg-amber-500 rounded-[3rem] p-16 text-center text-black">
                 <h2 className="text-4xl font-black mb-4 uppercase italic">Müziğini Paylaş</h2>
                 <a href="https://wa.me/905052250655" className="inline-block bg-black text-white px-10 py-4 rounded-2xl font-black uppercase mt-6">WhatsApp</a>
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div className="bg-neutral-900 p-10 rounded-[2.5rem] text-center"><p className="text-amber-500 font-black text-[10px] mb-2 uppercase">Adres</p><p className="text-[10px] font-bold italic">{t[lang].address}</p></div>
                 <div className="bg-neutral-900 p-10 rounded-[2.5rem] text-center"><p className="text-amber-500 font-black text-[10px] mb-2 uppercase">WhatsApp</p><p className="font-black">0505 225 06 55</p></div>
                 <div className="bg-neutral-900 p-10 rounded-[2.5rem] text-center"><p className="text-amber-500 font-black text-[10px] mb-2 uppercase">E-Posta</p><p className="font-bold text-sm">patnosumuz@gmail.com</p></div>
              </div>
            </div>
          )}

          {/* YÖNETİCİ PANELİ (GARANTİLİ KONSOL) */}
          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-10 animate-in zoom-in">
               <div className="bg-neutral-900 p-12 rounded-[3.5rem] border border-white/10">
                  <h2 className="text-3xl font-black text-amber-500 mb-10 uppercase italic tracking-tighter text-center border-b border-white/5 pb-6">
                    {t[lang].adminTitle}
                  </h2>
                  
                  <form onSubmit={(e) => { 
                    e.preventDefault(); 
                    if(!newSong.title || !newSong.url) return alert("Hata: Ad ve Link boş bırakılamaz!");
                    setSongs([{...newSong, id: Date.now(), likes: 0}, ...songs]); 
                    alert("Başarılı: Müzik kütüphaneye eklendi!");
                  }} className="space-y-6">
                    
                    <div className="grid grid-cols-2 gap-6">
                      {/* 1. Müzik Adı */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-amber-500/50 uppercase ml-2">1. Müzik Adı</label>
                        <input type="text" placeholder="Şarkı İsmi" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm focus:border-amber-500 outline-none" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                      </div>

                      {/* 2. Sanatçı Adı */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-amber-500/50 uppercase ml-2">2. Sanatçı Adı</label>
                        <input type="text" placeholder="Sanatçı İsmi" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm focus:border-amber-500 outline-none" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                      </div>
                    </div>

                    {/* 3. Şarkı Kapağı (URL) */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-amber-500/50 uppercase ml-2">3. Şarkı Kapağı (GitHub / Vercel Resim Linki)</label>
                      <input type="text" placeholder="https://..." className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm focus:border-amber-500 outline-none" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                    </div>

                    {/* 4. Müzik Linki (MP3 URL) */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-amber-500/50 uppercase ml-2">4. Müzik Linki (GitHub / Vercel MP3 Linki)</label>
                      <input type="text" placeholder="https://...mp3" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm focus:border-amber-500 outline-none" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    </div>

                    {/* 5. Kategori Seçimi */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-amber-500/50 uppercase ml-2">5. Hangi Klasöre Eklensin?</label>
                      <select className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm text-white focus:border-amber-500 outline-none appearance-none" value={newSong.category} onChange={e => setNewSong({...newSong, category: e.target.value})}>
                        {t[lang].categories.slice(1).map((c: string) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <button type="submit" className="w-full bg-amber-500 text-black font-black py-6 rounded-3xl uppercase tracking-[0.2em] text-sm hover:bg-white transition-all shadow-xl shadow-amber-500/10">
                      {t[lang].saveBtn}
                    </button>

                  </form>
               </div>
            </div>
          )}
        </div>

        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/5 h-28 px-10 z-50 backdrop-blur-2xl">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
