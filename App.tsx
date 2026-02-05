import React, { useState, useEffect, useMemo } from 'react';
import { Language, Song, Category } from './types';
import { UI_STRINGS, getSongs, initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('TR');
  const [activeTab, setActiveTab] = useState('home');
  const [songs, setSongs] = useState<Song[]>(initialSongs || []);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  
  const [bannerText, setBannerText] = useState('İzmir Patnoslular Derneği Müzik Arşivi');

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await getSongs();
        if (data && Array.isArray(data) && data.length > 0) {
          setSongs(data);
          setCurrentSong(data[0]);
        }
      } catch (err) { console.error("Hata:", err); }
    };
    loadSongs();
  }, []);

  const toggleLike = (songId: string) => {
    setLikedSongs(prev => prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]);
  };

  const handleDownload = async (song: Song) => {
    if (!song.url) return;
    setDownloadingId(song.id.toString());
    try {
      const response = await fetch(song.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${song.artist} - ${song.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) { console.error("İndirme hatası:", err); } 
    finally { setDownloadingId(null); }
  };

  const filteredSongs = useMemo(() => {
    return (songs || []).filter(s => {
      const search = searchTerm.toLowerCase();
      return (s?.title?.toLowerCase() || '').includes(search) || (s?.artist?.toLowerCase() || '').includes(search);
    });
  }, [songs, searchTerm]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') {
      setIsAdmin(true); setActiveTab('admin'); setAdminPass(''); setIsSidebarOpen(false);
    } else { alert('Hatalı Şifre!'); }
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-['Outfit']">
      <Sidebar 
        lang={lang} activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} 
        setAdminPass={setAdminPass} handleAdminLogin={handleAdminLogin} 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/10 shrink-0 z-30 bg-neutral-950">
          <div className="flex items-center space-x-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-full"><i className="fas fa-bars"></i></button>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full max-w-[400px]">
              <i className="fas fa-search text-neutral-500 mr-2"></i>
              <input type="text" placeholder="Ara..." className="bg-transparent border-none outline-none text-sm w-full text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-44">
          {activeTab === 'home' && (
            <section className="animate-in fade-in duration-500">
              {/* SABİT BANNER GÖRSELİ */}
              <div 
                className="mb-10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden min-h-[300px] flex items-end shadow-2xl border border-white/5"
                style={{ 
                  backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg')`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center 40%' 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="relative z-10">
                  <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full mb-4 inline-block uppercase tracking-widest">Kültür Mirası</span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight drop-shadow-2xl">{bannerText}</h2>
                </div>
              </div>

              {/* ŞARKI LİSTESİ (İkonlar Geri Geldi) */}
              <div className="grid gap-3">
                {filteredSongs.map((song, idx) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 ${currentSong?.id === song.id ? 'bg-amber-500/10' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-bold text-neutral-600 w-4">{idx + 1}</span>
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-lg" alt="" />
                      <div>
                        <p className={`text-sm font-black ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p>
                        <p className="text-xs text-neutral-500">{song.artist}</p>
                      </div>
                    </div>
                    {/* İNDİR VE BEĞEN İKONLARI */}
                    <div className="flex items-center space-x-4">
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(song.id.toString()); }} className={`p-2 transition-colors ${likedSongs.includes(song.id.toString()) ? 'text-red-500' : 'text-neutral-500 hover:text-red-400'}`}>
                        <i className={`${likedSongs.includes(song.id.toString()) ? 'fas' : 'far'} fa-heart`}></i>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDownload(song); }} className="p-2 text-neutral-500 hover:text-amber-500 transition-colors">
                        {downloadingId === song.id.toString() ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-download"></i>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="max-w-3xl mx-auto space-y-10 py-10">
              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl">
                <h2 className="text-xl font-black mb-6 text-amber-500 flex items-center uppercase"><i className="fas fa-edit mr-3"></i> Site Banner Ayarları</h2>
                <input type="text" className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all" value={bannerText} onChange={(e) => setBannerText(e.target.value)} />
              </div>

              {/* MÜZİK YÜKLEME PANELİ NOTU VE BUTON (Geri Geldi) */}
              <div className="p-8 bg-amber-500/10 rounded-[2.5rem] border border-amber-500/20 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h2 className="text-xl font-black mb-6 text-amber-500 flex items-center uppercase tracking-widest">
                    <i className="fas fa-cloud-upload-alt mr-3"></i> Müzik Yükleme Paneli
                  </h2>
                  <p className="text-white text-lg font-medium leading-relaxed mb-8 italic">
                    "Müzik eklemek için lütfen dosyayı Vercel Blob'a yükleyip linkini kopyalayın ve <span className="text-amber-500 font-black px-1">constants.ts</span> dosyasındaki listeye ekleyin."
                  </p>
                  <a 
                    href="https://vercel.com/dashboard/stores" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center space-x-3 bg-amber-500 text-black px-8 py-4 rounded-2xl font-black text-sm hover:bg-amber-600 transition-all transform hover:scale-105"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    <span>VERCEL BLOB'A GİT VE YÜKLE</span>
                  </a>
                </div>
                <i className="fas fa-music absolute -right-10 -bottom-10 text-[10rem] text-white/5 rotate-12"></i>
              </div>
            </div>
          )}
        </div>

        {/* MÜZİKÇALAR - SABİT */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-[100] bg-neutral-950/80 backdrop-blur-xl border-t border-white/10">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
