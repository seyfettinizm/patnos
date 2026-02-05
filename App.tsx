import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  // --- HAFIZA (SİTE AYARLARI VE ŞARKILAR) ---
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'TR');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || 'Misafir Kullanıcı');
  const [activeCategory, setActiveCategory] = useState('Tümü');

  // Şarkı Hafızası (Beğeni sayıları dahil)
  const [songs, setSongs] = useState(() => {
    const saved = localStorage.getItem('myMusicArchiive');
    return saved ? JSON.parse(saved) : initialSongs.map(s => ({ ...s, likes: Math.floor(Math.random() * 100), category: 'Yöresel' }));
  });

  // Site Görünüm Hafızası (Banner ve Logo)
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('siteSettings');
    return saved ? JSON.parse(saved) : {
      bannerText: "İzmir Patnoslular Derneği Müzik Kutusu",
      bannerSub: "KÜLTÜR ARŞİVİ",
      bannerImg: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg",
      logoUrl: ""
    };
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [currentSong, setCurrentSong] = useState(songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Yönetim Formu
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '', category: 'Yöresel' });

  useEffect(() => { 
    localStorage.setItem('appLang', lang);
    localStorage.setItem('myMusicArchiive', JSON.stringify(songs));
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
  }, [lang, songs, siteSettings]);

  // --- İŞLEMLER ---
  const handleLike = (id: number) => {
    setSongs(songs.map((s: any) => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s));
  };

  const addSong = (e: React.FormEvent) => {
    e.preventDefault();
    const songToAdd = { ...newSong, id: Date.now(), likes: 0 };
    setSongs([songToAdd, ...songs]);
    setNewSong({ title: '', artist: '', cover: '', url: '', category: 'Yöresel' });
    alert("Şarkı eklendi!");
  };

  // Sıralama ve Filtreleme: Beğeniye göre azalan, ilk 8 şarkı
  const filteredSongs = songs
    .filter((s: any) => activeCategory === 'Tümü' || s.category === activeCategory)
    .sort((a: any, b: any) => b.likes - a.likes)
    .slice(0, 8);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setActiveTab('admin'); } else { alert('Hatalı Şifre!'); }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} setAdminPass={setAdminPass} handleAdminLogin={handleAdminLogin} lang={lang} logo={siteSettings.logoUrl} />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-20">
          <div className="flex space-x-2">
            {['Tümü', 'Yöresel', 'Dengbêj', 'Halay', 'Güncel'].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all ${activeCategory === cat ? 'bg-amber-500 text-black border-amber-500' : 'border-white/10 text-neutral-500 hover:text-white'}`}>{cat}</button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
             <button onClick={() => setLang(lang === 'TR' ? 'KU' : 'TR')} className="bg-neutral-800 px-4 py-1.5 rounded-full text-[10px] font-black border border-white/5">{lang}</button>
             <button onClick={() => setActiveTab('profile')} className="bg-amber-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{guestName}</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-40">
          {activeTab === 'home' && (
            <div className="animate-in fade-in">
              <div className="mb-10 rounded-[3rem] relative overflow-hidden h-64 flex items-center border border-white/5 shadow-2xl">
                <img src={siteSettings.bannerImg} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />
                <div className="relative z-10 p-12">
                   <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-4 inline-block uppercase tracking-widest">{siteSettings.bannerSub}</span>
                   <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-tight max-w-2xl">{siteSettings.bannerText}</h2>
                </div>
              </div>

              <div className="space-y-2">
                {filteredSongs.map((song: any) => (
                  <div key={song.id} className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all group`}>
                    <div className="flex items-center space-x-5 cursor-pointer" onClick={() => { setCurrentSong(song); setIsPlaying(true); }}>
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-2xl" alt="" />
                      <div>
                        <p className="font-bold text-sm">{song.title}</p>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist} • <span className="text-amber-500/70">{song.category}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <button onClick={() => handleLike(song.id)} className="text-neutral-500 hover:text-red-500 transition-colors flex items-center space-x-2">
                          <span className="text-[10px] font-black">{song.likes || 0}</span>
                          <span className="text-lg">❤️</span>
                        </button>
                      </div>
                      {isAdmin && <button onClick={() => setSongs(songs.filter((s:any) => s.id !== song.id))} className="text-red-500 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">SİL</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in">
              {/* Site Görünüm Ayarları */}
              <div className="bg-neutral-900 p-10 rounded-[3rem] border border-white/5">
                <h2 className="text-xl font-black text-amber-500 mb-6 uppercase tracking-tighter italic italic">Saha & Görünüm Ayarları</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Banner Ana Yazısı" className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={siteSettings.bannerText} onChange={e => setSiteSettings({...siteSettings, bannerText: e.target.value})} />
                  <input type="text" placeholder="Banner Alt Yazısı" className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={siteSettings.bannerSub} onChange={e => setSiteSettings({...siteSettings, bannerSub: e.target.value})} />
                  <input type="text" placeholder="Banner Görsel URL (GitHub/Vercel Linki)" className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={siteSettings.bannerImg} onChange={e => setSiteSettings({...siteSettings, bannerImg: e.target.value})} />
                  <input type="text" placeholder="Logo Görsel URL" className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={siteSettings.logoUrl} onChange={e => setSiteSettings({...siteSettings, logoUrl: e.target.value})} />
                </div>
              </div>

              {/* Müzik Yükleme Konsolu */}
              <div className="bg-neutral-900 p-10 rounded-[3rem] border border-white/5">
                <h2 className="text-xl font-black text-amber-500 mb-6 uppercase tracking-tighter italic italic">Müzik Yükleme Konsolu</h2>
                <form onSubmit={addSong} className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="1. Müzik Adı" className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                  <input type="text" placeholder="2. Sanatçı Adı" className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                  <input type="text" placeholder="3. Şarkı Kapağı Linki (GitHub/Vercel)" className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                  <input type="text" placeholder="4. Müzik Dosyası Linki (MP3)" className="bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                  <select className="bg-black border border-white/10 p-4 rounded-xl text-sm text-neutral-400" value={newSong.category} onChange={e => setNewSong({...newSong, category: e.target.value})}>
                    <option value="Yöresel">Yöresel</option>
                    <option value="Dengbêj">Dengbêj</option>
                    <option value="Halay">Halay</option>
                    <option value="Güncel">Güncel</option>
                  </select>
                  <button type="submit" className="bg-amber-500 text-black font-black rounded-xl uppercase tracking-widest text-xs">Müziği Sisteme Ekle</button>
                </form>
              </div>
            </div>
          )}

          {/* İLETİŞİM */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto space-y-6 text-center py-10">
               <div className="bg-amber-500 p-12 rounded-[3rem] text-black shadow-2xl shadow-amber-500/20">
                  <h2 className="text-4xl font-black italic mb-4">BİZE ULAŞIN</h2>
                  <p className="font-bold mb-8">Elinizdeki müzikleri WhatsApp üzerinden gönderin, yayınlayalım.</p>
                  <a href="https://wa.me/905052250655" className="inline-block bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest">WHATSAPP</a>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-white/5"><p className="text-amber-500 font-black text-[10px] mb-2">TELEFON</p><p className="font-bold">0505 225 06 55</p></div>
                  <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-white/5"><p className="text-amber-500 font-black text-[10px] mb-2">E-POSTA</p><p className="font-bold">patnosumuz@gmail.com</p></div>
                  <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-white/5"><p className="text-amber-500 font-black text-[10px] mb-2">ADRES</p><p className="font-bold text-[9px]">Yeşilbağlar Mah. Buca/İzmir</p></div>
               </div>
            </div>
          )}
        </div>

        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/5 h-24 px-8 z-50 backdrop-blur-md">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
