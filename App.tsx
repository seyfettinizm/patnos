import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<'TR' | 'KU'>(() => (localStorage.getItem('appLang') as 'TR' | 'KU') || 'TR');
  
  // DİNAMİK LOGO VE BANNER STATE'LERİ
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem('appLogo') || "");
  const [bannerUrl, setBannerUrl] = useState(() => localStorage.getItem('appBanner') || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200");

  const t: any = {
    TR: {
      search: "Ara...", bannerSub: "HAFTANIN SEÇİMİ", bannerTitle: "Patnos'tan İzmir'e Bir Melodi...",
      collTitle: "ÖZEL KOLEKSİYONLAR", popTitle: "ŞU AN POPÜLER",
      categories: ["Tümü", "Patnos Türküleri", "Patnoslu Sanatçılar", "Dengbêjler", "Sizden Gelenler"],
      contactTitle: "MÜZİĞİNİ PAYLAŞ", contactNot1: '"Tozlu raflarda unutulmuş bir kayıt mı var?"',
      contactNot2: "Kültürel mirasımızı birlikte koruyalım. Kayıtlarınızı bize ulaştırın.",
      waBtn: "WHATSAPP", adminTitle: "İÇERİK YÖNETİMİ", saveBtn: "SİSTEME EKLE", updateBtn: "GÖRSELLERİ GÜNCELLE",
      address: "Buca / İzmir", labels: ["Müzik Adı", "Sanatçı", "Kapak (URL)", "Müzik (URL)", "Klasör", "Logo URL", "Banner URL"]
    },
    KU: {
      search: "Bigere...", bannerSub: "HILBIARTINA HEFTEYÊ", bannerTitle: "Ji Patnosê ber bi Îzmîrê ve...",
      collTitle: "KOLEKSİYONÊN TAYBET", popTitle: "NIHA POPULER E",
      categories: ["Hemû", "Stranên Patnosê", "Hunermendên Patnosî", "Dengbêj", "Ji We Hatine"],
      contactTitle: "MUZÎKA XWE PARVE BIKE", contactNot1: '"Ma qeydeke ji bîr kiriye heye?"',
      contactNot2: "Werin em mîrateya xwe biparêzin. Qeydên xwe ji me re bişînin.",
      waBtn: "WHATSAPP", adminTitle: "RÊVEBERIYA NAVEROKÊ", saveBtn: "LÊ ZÊDE BIKE", updateBtn: "WÊNEYAN ROJANE BIKE",
      address: "Buca / Îzmîr", labels: ["Navê Stranê", "Hunermend", "Berg (URL)", "Muzîk (URL)", "Klasor", "Logo URL", "Banner URL"]
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

  const [activeCategory, setActiveCategory] = useState('Tümü');

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} setAdminPass={setAdminPass} handleAdminLogin={(e:any) => { e.preventDefault(); if(adminPass === 'Mihriban04') setIsAdmin(true); }} lang={lang} logoUrl={logoUrl} />

      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        <header className="h-20 flex items-center justify-between px-4 md:px-8 z-30 shrink-0">
          <input type="text" placeholder={t[lang].search} className="bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm w-40 md:w-full md:max-w-xl outline-none focus:border-amber-500" />
          <div className="flex bg-neutral-900 rounded-full p-1 border border-white/5">
              <button onClick={() => setLang('TR')} className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] font-black ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}>TR</button>
              <button onClick={() => setLang('KU')} className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] font-black ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}>KU</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-40">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
               <div className="mb-8 md:mb-12 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden h-[250px] md:h-[350px] flex items-center bg-neutral-900 border border-white/5">
                <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Banner" />
                <div className="relative z-10 p-6 md:p-16">
                   <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight">{t[lang].bannerTitle}</h2>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-lg font-black mb-6 uppercase tracking-tighter flex items-center"><span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>{t[lang].collTitle}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {t[lang].categories.slice(1).map((cat: string, i: number) => (
                    <div key={cat} onClick={() => setActiveCategory(cat)} className={`bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] h-32 md:h-52 flex flex-col justify-end cursor-pointer hover:bg-amber-500 hover:text-black transition-all shadow-xl`}>
                      <p className="text-sm md:text-2xl font-black uppercase italic leading-tight">{cat}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {filteredSongs.map((song: any) => (
                  <div key={song.id} className="flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-transparent hover:border-white/10">
                    <div className="flex items-center space-x-4 cursor-pointer flex-1" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                      <img src={song.cover} className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover" alt="" />
                      <div><p className="font-bold text-xs md:text-sm">{song.title}</p><p className="text-[9px] md:text-[10px] text-neutral-500 font-black uppercase">{song.artist}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-6 md:py-10 space-y-6 animate-in slide-in-from-bottom-6 duration-700">
              <div className="bg-[#f59e0b] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 text-center text-black">
                 <h2 className="text-3xl md:text-6xl font-black mb-6 italic uppercase">{t[lang].contactTitle}</h2>
                 <p className="text-black font-black text-lg md:text-2xl italic mb-6">{t[lang].contactNot1}</p>
                 <a href="https://wa.me/905052250655" className="inline-block bg-black text-white px-10 py-4 rounded-full font-black text-xs tracking-widest uppercase">WHATSAPP</a>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in zoom-in">
               {/* BANNER VE LOGO AYARLARI */}
               <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-amber-500/20">
                  <h3 className="text-amber-500 font-black mb-6 uppercase tracking-widest text-sm">Görünüm Ayarları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 ml-2 uppercase">Logo URL</label>
                      <input type="text" className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs" value={logoUrl} onChange={(e)=>setLogoUrl(e.target.value)} placeholder="Logo linkini yapıştırın" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 ml-2 uppercase">Banner URL</label>
                      <input type="text" className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs" value={bannerUrl} onChange={(e)=>setBannerUrl(e.target.value)} placeholder="Banner linkini yapıştırın" />
                    </div>
                  </div>
               </div>

               {/* 5'Lİ MÜZİK KONSÜLÜ */}
               <div className="bg-neutral-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10">
                  <h2 className="text-2xl font-black text-amber-500 mb-8 uppercase italic border-b border-white/5 pb-6">{t[lang].adminTitle}</h2>
                  <form onSubmit={(e) => { e.preventDefault(); setSongs([{...newSong, id: Date.now(), likes: 0}, ...songs]); alert("Eklendi!"); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder={t[lang].labels[0]} className="bg-black border border-white/10 p-4 rounded-xl text-sm" onChange={e => setNewSong({...newSong, title: e.target.value})} />
                      <input type="text" placeholder={t[lang].labels[1]} className="bg-black border border-white/10 p-4 rounded-xl text-sm" onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                    </div>
                    <input type="text" placeholder={t[lang].labels[2]} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                    <input type="text" placeholder={t[lang].labels[3]} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    <select className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" onChange={e => setNewSong({...newSong, category: e.target.value})}>
                      {t[lang].categories.slice(1).map((c: string) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest shadow-xl">{t[lang].saveBtn}</button>
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
