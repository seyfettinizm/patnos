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
      collTitle: "ÖZEL KOLEKSİYONLAR",
      popTitle: "ŞU AN POPÜLER",
      categories: ["Tümü", "Patnos Türküleri", "Patnoslu Sanatçılar", "Dengbêjler", "Sizden Gelenler"],
      adminTitle: "İÇERİK YÖNETİM PANELİ",
      saveBtn: "MÜZİĞİ SİSTEME EKLE",
      address: "Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir"
    },
    KU: {
      search: "Li stran bigere...",
      bannerSub: "HILBIARTINA HEFTEYÊ",
      bannerTitle: "Ji Patnosê ber bi Îzmîrê ve...",
      collTitle: "KOLEKSİYONÊN TAYBET",
      popTitle: "NIHA POPULER E",
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
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
        adminPass={adminPass} 
        setAdminPass={setAdminPass} 
        handleAdminLogin={(e:any) => { e.preventDefault(); if(adminPass === 'Mihriban04') setIsAdmin(true); }} 
        lang={lang} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 z-30">
          <div className="flex bg-white/5 border border-white/10 rounded-full px-5 py-2 w-full max-w-xl">
            <input type="text" placeholder={t[lang].search} className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-neutral-900 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}>KU</button>
            </div>
            <div className="flex items-center space-x-3 bg-neutral-900 px-4 py-1.5 rounded-full border border-white/5">
                <span className="text-[10px] font-black tracking-widest uppercase">{t[lang].guest}</span>
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs">👤</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-40">
          {/* 1. ANA SAYFA */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
               <div className="mb-12 rounded-[3rem] relative overflow-hidden h-[350px] flex items-center bg-neutral-900 border border-white/5">
                <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
                <div className="relative z-10 p-16">
                   <span className="bg-amber-500 text-black text-[10px] font-black px-4 py-1.5 rounded-lg mb-6 inline-block uppercase tracking-widest">{t[lang].bannerSub}</span>
                   <h2 className="text-5xl font-black mb-4 italic uppercase tracking-tighter">{t[lang].bannerTitle}</h2>
                   <p className="text-neutral-400 font-medium italic">Köklerinizi hissedin. En sevdiğiniz Dengbêjler ve yöresel ezgiler tek bir kutuda toplandı.</p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-xl font-black mb-6 flex items-center space-x-3 uppercase tracking-tighter"><span className="w-1.5 h-6 bg-amber-500 rounded-full"></span><span>{t[lang].collTitle}</span></h3>
                <div className="grid grid-cols-4 gap-6">
                  {categoryMap.map((cat) => (
                    <div key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`${cat.color} p-8 rounded-[2.5rem] h-52 flex flex-col justify-end cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xl`}>
                      <p className="text-2xl font-black uppercase italic leading-tight">{cat.id}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black mb-6 flex items-center space-x-3 uppercase tracking-tighter"><span className="w-1.5 h-6 bg-amber-500 rounded-full"></span><span>{t[lang].popTitle}</span></h3>
                <div className="space-y-2">
                  {filteredSongs.map((song: any) => (
                    <div key={song.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all group">
                      <div className="flex items-center space-x-5 cursor-pointer flex-1" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                        <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-2xl" alt="" />
                        <div><p className="font-bold text-sm">{song.title}</p><p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist}</p></div>
                      </div>
                      <button onClick={() => handleLike(song.id)} className="flex items-center space-x-2 text-neutral-500 hover:text-red-500 transition-colors mr-4">
                         <span className="text-xs font-black">{song.likes || 0}</span><span className="text-xl">❤️</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. İLETİŞİM - GÖRSELDEKİ BOŞLUĞU DOLDURAN NOT BURADA */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
              <div className="bg-[#f59e0b] rounded-[3.5rem] p-12 md:p-16 text-center text-black shadow-2xl">
                 <h2 className="text-5xl md:text-6xl font-[1000] mb-8 italic tracking-tighter uppercase leading-none">
                   MÜZİĞİNİ PAYLAŞ
                 </h2>
                 
                 {/* DUYGUSAL NOT - GÖRSELDEKİ BOŞLUK İÇİN EKLENEN KISIM */}
                 <div className="flex flex-col items-center justify-center space-y-4 mb-10">
                    <p className="text-black font-[900] text-xl md:text-2xl italic leading-tight max-w-2xl">
                      "Tozlu raflarda unutulmuş bir kayıt, ninenizden kalma bir ezgi mi var?"
                    </p>
                    <div className="w-12 h-0.5 bg-black/20 rounded-full my-2"></div>
                    <p className="text-black/90 font-bold text-lg md:text-xl italic leading-relaxed max-w-2xl">
                      Kültürel mirasımızı birlikte ilmek ilmek işleyelim. Elinizdeki yöresel kayıtları, 
                      dengbêj ezgilerini veya kendi sesinizden can bulan parçaları bize ulaştırın; 
                      bu tınılar İzmir'den tüm dünyaya yankılansın.
                    </p>
                 </div>
                 
                 <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="inline-block bg-black text-white px-20 py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:bg-neutral-900 transition-all active:scale-95">
                   WHATSAPP
                 </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-neutral-900/80 border border-white/5 p-10 rounded-[3rem] text-center">
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">ADRES</h3>
                    <p className="font-black text-[11px] leading-relaxed italic text-neutral-300 uppercase">{t[lang].address}</p>
                 </div>
                 <div className="bg-neutral-900/80 border border-white/5 p-10 rounded-[3rem] text-center">
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">WHATSAPP</h3>
                    <p className="font-black text-2xl text-neutral-200">0505 225 06 55</p>
                 </div>
                 <div className="bg-neutral-900/80 border border-white/5 p-10 rounded-[3rem] text-center">
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">E-POSTA</h3>
                    <p className="font-black text-sm italic text-neutral-200">patnosumuz@gmail.com</p>
                 </div>
              </div>
            </div>
          )}

          {/* 3. ADMİN PANELİ */}
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
                      <input type="text" placeholder="1. Müzik Adı" className="bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                      <input type="text" placeholder="2. Sanatçı Adı" className="bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                    </div>
                    <input type="text" placeholder="3. Şarkı Kapağı (URL)" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                    <input type="text" placeholder="4. Müzik Linki (MP3 URL)" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    <select className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm text-white outline-none focus:border-amber-500" value={newSong.category} onChange={e => setNewSong({...newSong, category: e.target.value})}>
                      {t[lang].categories.slice(1).map((c: string) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-amber-500 text-black font-black py-6 rounded-3xl uppercase tracking-widest text-sm hover:bg-white transition-all shadow-xl">
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
