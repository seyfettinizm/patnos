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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [bannerText, setBannerText] = useState('İzmir Patnoslular Derneği Müzik Arşivi');

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await getSongs();
        if (data && data.length > 0) {
          setSongs(data);
          setCurrentSong(data[0]);
        }
      } catch (err) { console.log("Veri çekme hatası göz ardı edildi."); }
    };
    loadSongs();
  }, []);

  const filteredSongs = useMemo(() => {
    return songs.filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [songs, searchTerm]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') {
      setIsAdmin(true); setActiveTab('admin'); setAdminPass(''); setIsSidebarOpen(false);
    } else { alert('Hatalı Şifre!'); }
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-sans">
      <Sidebar 
        lang="TR" activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} 
        setAdminPass={setAdminPass} handleAdminLogin={handleAdminLogin} 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center px-6 md:px-10 border-b border-white/10 bg-neutral-950 z-20">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 w-10 h-10 flex items-center justify-center bg-white/5 rounded-full"><i className="fas fa-bars"></i></button>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full max-w-md">
            <i className="fas fa-search text-neutral-500 mr-2"></i>
            <input type="text" placeholder="Ara..." className="bg-transparent border-none outline-none text-sm w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-40">
          {activeTab === 'home' && (
            <section className="animate-in fade-in duration-700">
              {/* BANNER GÖRSELİ */}
              <div className="mb-10 rounded-[2.5rem] relative overflow-hidden min-h-[300px] flex items-end border border-white/5 bg-black shadow-2xl">
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" 
                  alt="Süphan Dağı"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="relative z-10 p-8 md:p-12">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter drop-shadow-2xl">{bannerText}</h2>
                </div>
              </div>

              {/* LİSTE */}
              <div className="grid gap-2">
                {filteredSongs.map((song) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 ${currentSong?.id === song.id ? 'bg-amber-500/10' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <img src={song.cover} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div><p className={`text-sm font-bold ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p><p className="text-xs text-neutral-500">{song.artist}</p></div>
                    </div>
                    <i className="fas fa-play-circle text-neutral-600 group-hover:text-amber-500"></i>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center space-y-4">
                <i className="fab fa-whatsapp text-3xl text-green-500"></i>
                <h4 className="text-amber-500 font-bold text-xs uppercase">WhatsApp</h4>
                <p className="text-white font-bold">0505 225 06 55</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center space-y-4">
                <i className="fas fa-envelope text-3xl text-blue-500"></i>
                <h4 className="text-amber-500 font-bold text-xs uppercase">E-Posta</h4>
                <p className="text-white font-bold text-xs italic">patnosumuz@gmail.com</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center space-y-4">
                <i className="fas fa-map-marker-alt text-3xl text-amber-500"></i>
                <h4 className="text-amber-500 font-bold text-xs uppercase">Adres</h4>
                <p className="text-white font-bold text-[10px]">Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir</p>
              </div>
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="max-w-2xl mx-auto py-10 space-y-6">
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10">
                <label className="block text-amber-500 font-bold mb-4 uppercase text-xs">Banner Yazısı</label>
                <input type="text" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:border-amber-500" value={bannerText} onChange={(e) => setBannerText(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-white/10">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
