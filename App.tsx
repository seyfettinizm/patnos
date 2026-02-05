import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<'TR' | 'KU'>(() => (localStorage.getItem('appLang') as 'TR' | 'KU') || 'TR');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  
  // LOGO VE BANNER STATE
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem('appLogo') || "");
  const [bannerUrl, setBannerUrl] = useState(() => localStorage.getItem('appBanner') || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200");

  const t: any = {
    TR: {
      search: "Ara...", bannerTitle: "Patnos'tan İzmir'e Bir Melodi...",
      collTitle: "ÖZEL KOLEKSİYONLAR", popTitle: "ŞU AN POPÜLER",
      categories: ["Tümü", "Patnos Türküleri", "Patnoslu Sanatçılar", "Dengbêjler", "Sizden Gelenler"],
      contactTitle: "MÜZİĞİNİ PAYLAŞ", 
      contactNot1: '"Tozlu raflarda unutulmuş bir kayıt, ninenizden kalma bir ezgi mi var?"',
      contactNot2: "Kültürel mirasımızı birlikte ilmek ilmek işleyelim. Elinizdeki yöresel kayıtları veya kendi sesinizden parçaları bize ulaştırın; bu tınılar İzmir'den dünyaya yankılansın.",
      waBtn: "WHATSAPP", adminTitle: "İÇERİK YÖNETİMİ", saveBtn: "SİSTEME EKLE",
      address: "Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir",
      labels: ["Müzik Adı", "Sanatçı", "Kapak (URL)", "Müzik (URL)", "Klasör"]
    },
    KU: {
      search: "Bigere...", bannerTitle: "Ji Patnosê ber bi Îzmîrê ve...",
      collTitle: "KOLEKSİYONÊN TAYBET", popTitle: "NIHA POPULER E",
      categories: ["Hemû", "Stranên Patnosê", "Hunermendên Patnosî", "Dengbêj", "Ji We Hatine"],
      contactTitle: "MUZÎKA XWE PARVE BIKE", 
      contactNot1: '"Ma qeydeke ji bîr kiriye, yan jî straneke ji dapîra we mayî heye?"',
      contactNot2: "Werin em mîrateya xwe ya çandî bi hev re biparêzin. Qeydên xwe yên herêmî an jî stranên bi dengê xwe ji me re bişînin; bila ev deng ji Îzmîrê li hemû cîhanê deng vede.",
      waBtn: "WHATSAPP", adminTitle: "RÊVEBERIYA NAVEROKÊ", saveBtn: "LÊ ZÊDE BIKE",
      address: "Taxa Yeşilbağlar. 637/33 Sok. No: 25 Buca/Îzmîr",
      labels: ["Navê Stranê", "Hunermend", "Berg", "Lînk", "Klasor"]
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
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });

  useEffect(() => { 
    localStorage.setItem('appLang', lang);
    localStorage.setItem('myMusicArchiive', JSON.stringify(songs));
    localStorage.setItem('appLogo', logoUrl);
    localStorage.setItem('appBanner', bannerUrl);
  }, [lang, songs, logoUrl, bannerUrl]);

  const filteredSongs = songs
    .filter((s: any) => activeCategory === 'Tümü' || activeCategory === 'Hemû' || s.category === activeCategory)
    .sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0)).slice(0, 8);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} setAdminPass={setAdminPass} handleAdminLogin={(e:any) => { e.preventDefault(); if(adminPass === 'Mihriban04') setIsAdmin(true); }} lang={lang} logoUrl={logoUrl} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 z-30 shrink-0">
          <input type="text" placeholder={t[lang].search} className="bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm w-full max-w-xl outline-none" />
          <div className="flex bg-neutral-900 rounded-full p-1 border border-white/5 ml-4">
              <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}>TR</button>
              <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}>KU</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-40">
          {/* --- ANA SAYFA --- */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
               <div className="mb-12 rounded-[3rem] relative overflow-hidden h-[350px] flex items-center bg-neutral-900 border border-white/5 shadow-2xl">
                <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
                <div className="relative z-10 p-16">
                   <h2 className="text-5xl font-black mb-4 italic uppercase tracking-tighter">{t[lang].bannerTitle}</h2>
                </div>
              </div>
              <div className="mb-12">
                <h3 className="text-xl font-black mb-6 flex items-center space-x-3 uppercase tracking-tighter"><span className="w-1.5 h-6 bg-amber-500 rounded-full"></span><span>{t[lang].collTitle}</span></h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {t[lang].categories.slice(1).map((cat: string) => (
                    <div key={cat} onClick={() => setActiveCategory(cat)} className="bg-neutral-900/50 border border-white/5 p-8 rounded-[2.5rem] h-52 flex flex-col justify-end cursor-pointer hover:bg-amber-500 hover:text-black transition-all shadow-xl">
                      <p className="text-2xl font-black uppercase italic leading-tight">{cat}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {filteredSongs.map((song: any) => (
                  <div key={song.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all group">
                    <div className="flex items-center space-x-5 cursor-pointer flex-1" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-2xl" alt="" />
                      <div><p className="font-bold text-sm">{song.title}</p><p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- İLETİŞİM: ARTIK TAMAMEN GERİ GELDİ --- */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
              {/* TURUNCU PANEL */}
              <div className="bg-[#f59e0b] rounded-[3.5rem] p-12 md:p-16 text-center text-black shadow-[0_25px_50px_-12px_rgba(245,158,11,0.4)]">
                 <h2 className="text-5xl md:text-6xl font-[1000] mb-8 italic tracking-tighter uppercase leading-none">{t[lang].contactTitle}</h2>
                 <div className="flex flex-col items-center justify-center space-y-4 mb-10">
                    <p className="text-black font-[900] text-xl md:text-2xl italic leading-tight max-w-2xl">{t[lang].contactNot1}</p>
                    <div className="w-12 h-0.5 bg-black/20 rounded-full my-2"></div>
                    <p className="text-black/90 font-bold text-lg md:text-xl italic leading-relaxed max-w-2xl px-4">{t[lang].contactNot2}</p>
                 </div>
                 <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="inline-block bg-black text-white px-20 py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:bg-neutral-900 transition-all active:scale-95">
                   {t[lang].waBtn}
                 </a>
              </div>

              {/* ADRES KUTULARI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-neutral-900/80 border border-white/5 p-10 rounded-[3rem] text-center shadow-xl">
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">ADRES</h3>
                    <p className="font-black text-[11px] leading-relaxed italic text-neutral-300 uppercase">{t[lang].address}</p>
                 </div>
                 <div className="bg-neutral-900/80 border border-white/5 p-10 rounded-[3rem] text-center shadow-xl">
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">WHATSAPP</h3>
                    <p className="font-black text-2xl text-neutral-200 tracking-tighter">0505 225 06 55</p>
                 </div>
                 <div className="bg-neutral-900/80 border border-white/5 p-10 rounded-[3rem] text-center shadow-xl">
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">E-POSTA</h3>
                    <p className="font-black text-sm italic text-neutral-200">patnosumuz@gmail.com</p>
                 </div>
              </div>
            </div>
          )}

          {/* --- PANEL --- */}
          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in zoom-in">
               {/* Görsel Ayarları */}
               <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-amber-500/20 shadow-2xl">
                  <h3 className="text-amber-500 font-black mb-6 uppercase tracking-widest text-[10px]">Görünüm Ayarları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" className="bg-black border border-white/10 p-4 rounded-xl text-xs" value={logoUrl} onChange={(e)=>setLogoUrl(e.target.value)} placeholder="Logo URL" />
                    <input type="text" className="bg-black border border-white/10 p-4 rounded-xl text-xs" value={bannerUrl} onChange={(e)=>setBannerUrl(e.target.value)} placeholder="Banner URL" />
                  </div>
               </div>
               {/* Müzik Konsol */}
               <div className="bg-neutral-900 p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <h2 className="text-2xl font-black text-amber-500 mb-8 uppercase italic border-b border-white/5 pb-6">{t[lang].adminTitle}</h2>
                  <form onSubmit={(e) => { e.preventDefault(); setSongs([{...newSong, id: Date.now(), likes: 0}, ...songs]); alert("Müzik Eklendi!"); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder={t[lang].labels[0]} className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                      <input type="text" placeholder={t[lang].labels[1]} className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                    </div>
                    <input type="text" placeholder={t[lang].labels[2]} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                    <input type="text" placeholder={t[lang].labels[3]} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    <select className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm text-white" value={newSong.category} onChange={e => setNewSong({...newSong, category: e.target.value})}>
                      {t[lang].categories.slice(1).map((c: string) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest shadow-xl hover:bg-white transition-all">SİSTEME EKLE</button>
                  </form>
               </div>
            </div>
          )}
        </div>
        {currentSong && <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/5 h-28 px-4 md:px-10 z-50 backdrop-blur-2xl"><Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} /></div>}
      </main>
    </div>
  );
};

export default App;
