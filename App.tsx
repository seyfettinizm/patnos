import React, { useState, useEffect, useMemo } from 'react';
import { Song } from './types';
import { getSongs, initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [songs, setSongs] = useState<Song[]>(initialSongs || []);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
    } catch (err) { console.error(err); } 
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
        lang="TR" activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} 
        setAdminPass={setAdminPass} handleAdminLogin={handleAdminLogin} 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/10 shrink-0 z-30 bg-neutral-950">
          <div className="flex items-center space-x-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-full"><i className="fas fa-bars"></i></button>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full max-w-[400px]">
              <i className="fas fa-search text-neutral-500 mr-2 text-sm"></i>
              <input type="text" placeholder="Ara..." className="bg-transparent border-none outline-none text-sm w-full text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-48">
          {activeTab === 'home' && (
            <section className="animate-in fade-in duration-500">
              {/* SÜPHAN DAĞI BANNER - GÜNCEL LİNK */}
              <div className="mb-10 rounded-[2.5rem] relative overflow-hidden min-h-[300px] flex items-end shadow-2xl border border-white/5 bg-black">
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" 
                  alt="Süphan Dağı"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="relative z-10 p-8 md:p-12">
                  <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full mb-4 inline-block uppercase tracking-widest italic">Kültür Mirası</span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight drop-shadow-2xl">{bannerText}</h2>
                </div>
              </div>

              {/* MÜZİK LİSTESİ */}
              <div className="grid gap-3">
                {filteredSongs.map((song, idx) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 ${currentSong?.id === song.id ? 'bg-amber-500/10' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-bold text-neutral-600 w-4">{idx + 1}</span>
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-lg border border-white/5" alt="" />
                      <div><p className={`text-sm font-black ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p><p className="text-xs text-neutral-500 italic">{song.artist}</p></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(song.id.toString()); }} className={`p-2 transition-all ${likedSongs.includes(song.id.toString()) ? 'text-red-500 scale-110' : 'text-neutral-500 hover:text-red-400'}`}>
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

          {/* İLETİŞİM - 3 AYRI KUTU */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-10 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-amber-500 uppercase tracking-tighter text-center italic underline decoration-2 underline-offset-8">İLETİŞİM BİLGİLERİ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex flex-col items-center text-center space-y-4 hover:bg-green-500/10 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fab fa-whatsapp text-2xl text-green-500"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-amber-500 text-[10px] uppercase tracking-widest mb-1">WhatsApp</h4>
                    <p className="text-white font-bold">0505 225 06 55</p>
                  </div>
                </a>

                <a href="mailto:patnosumuz@gmail.com" className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex flex-col items-center text-center space-y-4 hover:bg-blue-500/10 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fas fa-envelope text-2xl text-blue-500"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-amber-500 text-[10px] uppercase tracking-widest mb-1">E-Posta</h4>
                    <p className="text-white font-bold text-xs italic">patnosumuz@gmail.com</p>
                  </div>
                </a>

                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex flex-col items-center text-center space-y-4 hover:bg-amber-500/10 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fas fa-map-marker-alt text-2xl text-amber-500"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-amber-500 text-[10px] uppercase tracking-widest mb-1">Dernek Adresi</h4>
                    <p className="text-white font-bold text-[10px] leading-relaxed">
                      Yeşilbağlar Mah. 637/33 Sok.<br/>
                      No: 25 Buca/İzmir
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* YÖNETİCİ PANELİ */}
          {activeTab === 'admin' && isAdmin && (
            <div className="max-w-3xl mx-auto space-y-10 py-10">
              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl">
                <h2 className="text-xl font-black mb-6 text-amber-500 uppercase italic flex items-center"><i className="fas fa-edit mr-3"></i> Banner Yazısını Değiştir</h2>
                <input type="text" className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all" value={bannerText} onChange={(e) => setBannerText(e.target.value)} />
              </div>

              <div className="p-8 bg-amber-500/10 rounded-[2.5rem] border border-amber-500/20 text-center shadow-2xl">
                <h2 className="text-xl font-black mb-6 text-amber-500 uppercase italic flex items-center justify-center"><i className="fas fa-cloud-upload-alt mr-3"></i> Müzik Ekleme Notu</h2>
                <p className="text-white text-lg font-medium leading-relaxed mb-8 italic">
                  "Müzik eklemek için lütfen dosyayı Vercel Blob'a yükleyip linkini kopyalayın ve <span className="text-amber-500 font-bold underline">constants.ts</span> dosyasındaki listeye ekleyin."
                </p>
                <a href="https://vercel.com/dashboard/stores" target="_blank" rel="noreferrer" className="inline-block bg-amber-500 text-black px-10 py-4 rounded-2xl font-black text-sm hover:bg-amber-600 transition-all transform hover:scale-105">VERCEL BLOB'A GİT</a>
              </div>
            </div>
          )}
        </div>

        {/* PLAYER - EN ALTTA ÇAKILI */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-[100] bg-neutral-950/95 backdrop-blur-xl border-t border-white/10">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
