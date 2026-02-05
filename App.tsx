import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  // --- HAFIZA YÖNETİMİ ---
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'TR');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || 'Misafir Kullanıcı');
  
  // Şarkıları hafızadan al (Yoksa başlangıç şarkılarını kullan)
  const [songs, setSongs] = useState(() => {
    const savedSongs = localStorage.getItem('myMusicList');
    return savedSongs ? JSON.parse(savedSongs) : initialSongs;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [currentSong, setCurrentSong] = useState(songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Form State (Admin Paneli İçin)
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '' });

  // Hafızaya Kaydetme İşlemleri
  useEffect(() => { localStorage.setItem('appLang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('guestName', guestName); }, [guestName]);
  useEffect(() => { localStorage.setItem('myMusicList', JSON.stringify(songs)); }, [songs]);

  const t: any = {
    TR: {
      search: "Şarkı veya sanatçı ara...",
      bannerTitle: "İzmir Patnoslular Derneği Müzik Kutusu",
      bannerSub: "KÜLTÜR ARŞİVİ",
      contactTitle: "İletişim ve Paylaşım",
      profileTitle: "Profilini Düzenle",
      save: "KAYDET",
      adminTitle: "Müzik Yükleme Konsolu",
      shareTitle: "Kendi Müziğini Gönder",
      shareDesc: "Elinizde bulunan Patnos yöresine ait müzikleri bize WhatsApp üzerinden ulaştırın. Uygun bulunan eserler arşivimizde adınızla yayınlanacaktır.",
      shareButton: "WhatsApp ile Gönder",
      uploadButton: "LİSTEYE EKLE VE YAYINLA",
      fileLabel: "Dosya Bilgilerini Girin"
    },
    KU: {
      search: "Li stranê bigere...",
      bannerTitle: "Sindoqa Muzîkê ya Komeleya Patnosiyên Îzmîrê",
      bannerSub: "ARŞÎVA ÇANDÊ",
      contactTitle: "Têkilî û Parvekirin",
      profileTitle: "Profîla Xwe Rast Bike",
      save: "TOMAR BIKE",
      adminTitle: "Konsola Barkirina Muzîkê",
      shareTitle: "Muzîka Xwe Bişînin",
      shareDesc: "Muzîkên herêma Patnosê bi rêya WhatsAppê ji me re bişînin. Berhemên guncav dê di arşîva me de werin weşandin.",
      shareButton: "Bi WhatsApp bişîne",
      uploadButton: "LİSTEYÊ ZÊDE BIKE",
      fileLabel: "Agahiyên Dosyayê Binivîsin"
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setAdminPass(''); setActiveTab('admin'); } else { alert('Şifre Yanlış!'); }
  };

  // Yeni Şarkı Ekleme Fonksiyonu
  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.title || !newSong.url) return alert("Lütfen şarkı adı ve dosya linkini girin!");
    
    const songToAdd = {
      ...newSong,
      id: Date.now(),
      cover: newSong.cover || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300"
    };
    
    setSongs([songToAdd, ...songs]);
    setNewSong({ title: '', artist: '', cover: '', url: '' });
    alert("Şarkı başarıyla listeye eklendi!");
    setActiveTab('home');
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans text-sm">
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} 
        adminPass={adminPass} setAdminPass={setAdminPass} 
        handleAdminLogin={handleAdminLogin} 
        lang={lang}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-20">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <span className="text-neutral-500 mr-3">🔍</span>
            <input type="text" placeholder={t[lang].search} className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-400'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-400'}`}>KU</button>
             </div>
             <button onClick={() => setActiveTab('profile')} className="group flex items-center space-x-3 bg-neutral-800 p-1.5 pr-4 rounded-xl border border-white/5 shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black text-xs">P</div>
                <span className="text-[10px] font-black tracking-widest uppercase">{guestName}</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-48">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-1000">
              <div className="mb-12 rounded-[2.5rem] relative overflow-hidden h-72 flex items-center border border-white/5 shadow-2xl">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 p-12"><h2 className="text-4xl font-black mb-4 tracking-tighter italic leading-tight">{t[lang].bannerTitle}</h2></div>
              </div>

              <div className="space-y-2">
                {songs.map((song: any) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 border border-transparent ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20 shadow-lg' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-2xl" alt="" />
                      <div><p className={`font-bold text-sm ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p><p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist}</p></div>
                    </div>
                    {isAdmin && (
                      <button onClick={(e) => { e.stopPropagation(); setSongs(songs.filter((s:any) => s.id !== song.id)); }} className="text-neutral-600 hover:text-red-500 p-2">🗑️ Sil</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-3xl mx-auto py-12 animate-in zoom-in duration-500">
               <div className="bg-neutral-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
                  <h2 className="text-3xl font-black italic text-amber-500 mb-8 tracking-tighter">⚙️ {t[lang].adminTitle}</h2>
                  <form onSubmit={handleAddSong} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Şarkı Adı" className="bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                      <input type="text" placeholder="Sanatçı" className="bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                    </div>
                    <input type="text" placeholder="Kapak Resmi Linki (Vercel/GitHub/İnternet Linki)" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                    <input type="text" placeholder="Müzik Dosyası Linki (.mp3)" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500 font-mono text-amber-500" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    
                    <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-[11px] text-neutral-400 italic">
                      💡 <b>İpucu:</b> Dosyalarınızı GitHub'a yükledikten sonra "Raw" linkini buraya yapıştırın veya Google Drive linki kullanın.
                    </div>
                    
                    <button type="submit" className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest shadow-xl hover:bg-amber-400 transition-all">
                       {t[lang].uploadButton}
                    </button>
                  </form>
               </div>
            </div>
          )}

          {/* İletişim Sekmesi (Öncekiyle Aynı) */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-8 text-center animate-in fade-in duration-500">
               <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-14 shadow-2xl">
                  <h2 className="text-3xl font-black mb-6 italic">{t[lang].shareTitle}</h2>
                  <p className="text-neutral-400 mb-10">{t[lang].shareDesc}</p>
                  <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="inline-block px-12 py-5 bg-amber-500 text-black font-black rounded-2xl shadow-xl hover:scale-105 transition-all">
                     {t[lang].shareButton}
                  </a>
               </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto py-12 text-center animate-in zoom-in duration-500">
               <div className="bg-neutral-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
                <h3 className="text-2xl font-black mb-10 italic text-amber-500 uppercase">{t[lang].profileTitle}</h3>
                <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-center font-bold mb-6 focus:border-amber-500 outline-none" />
                <button onClick={() => setActiveTab('home')} className="w-full bg-amber-500 text-black font-black py-4 rounded-2xl uppercase">{t[lang].save}</button>
              </div>
            </div>
          )}
        </div>

        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/95 border-t border-white/5 h-24 px-8">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
