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
  
  // ÖNEMLİ: Görsel ve Yazı Ayarları
  const [bannerText, setBannerText] = useState('İzmir Patnoslular Derneği Müzik Arşivi');
  const [bannerImg, setBannerImg] = useState(''); // Banner arka planı için URL
  const [logoImg, setLogoImg] = useState(''); // Dernek logosu için URL

  // Şarkı Ekleme Formu State'i
  const [newSong, setNewSong] = useState({ title: '', artist: '', category: 'Patnos Türküleri' as Category, cover: '', url: '' });

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

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    const songToAdd: Song = { id: Date.now().toString(), ...newSong };
    setSongs([songToAdd, ...songs]);
    alert('Şarkı listeye eklendi! Sayfa yenilenene kadar listede kalacaktır.');
    setNewSong({ title: '', artist: '', category: 'Patnos Türküleri', cover: '', url: '' });
    setActiveTab('home');
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-['Outfit']">
      <Sidebar 
        lang={lang} activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} 
        setAdminPass={setAdminPass} handleAdminLogin={handleAdminLogin} 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 md:h-24 flex items-center justify-between px-4 md:px-10 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-full"><i className="fas fa-bars"></i></button>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full max-w-[320px]">
              <i className="fas fa-search text-neutral-500 mr-2"></i>
              <input type="text" placeholder="Ara..." className="bg-transparent border-none outline-none text-sm w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          {activeTab === 'home' && (
            <section>
              {/* Dinamik Banner */}
              <div 
                className="mb-10 bg-amber-700 rounded-[2rem] p-8 md:p-12 relative overflow-hidden min-h-[250px] flex items-center"
                style={bannerImg ? { backgroundImage: `url(${bannerImg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight drop-shadow-2xl">{bannerText}</h2>
                </div>
              </div>

              <div className="grid gap-2">
                {filteredSongs.map((song, idx) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <img src={song.cover} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div><p className="text-sm font-black">{song.title}</p><p className="text-xs text-neutral-500">{song.artist}</p></div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleLike(song.id.toString()); }} className={`p-2 ${likedSongs.includes(song.id.toString()) ? 'text-red-500' : 'text-neutral-500'}`}><i className="fas fa-heart"></i></button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="max-w-4xl mx-auto space-y-10">
              {/* Bölüm 1: Site Görünümü */}
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                <h2 className="text-xl font-black mb-6 text-amber-500 uppercase italic underline decoration-2">1. Site Görünüm Ayarları</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400">Banner Yazısı</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl" value={bannerText} onChange={(e) => setBannerText(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400">Banner Arka Plan Görsel (URL)</label>
                    <input type="text" placeholder="Vercel'den aldığınız resim linki" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl" value={bannerImg} onChange={(e) => setBannerImg(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Bölüm 2: Müzik Yükleme */}
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                <h2 className="text-xl font-black mb-6 text-amber-500 uppercase italic underline decoration-2">2. Yeni Müzik Ekle</h2>
                <form onSubmit={handleAddSong} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Şarkı Adı" className="bg-black/40 border border-white/10 p-3 rounded-xl" value={newSong.title} onChange={(e) => setNewSong({...newSong, title: e.target.value})} required />
                  <input type="text" placeholder="Sanatçı" className="bg-black/40 border border-white/10 p-3 rounded-xl" value={newSong.artist} onChange={(e) => setNewSong({...newSong, artist: e.target.value})} required />
                  <input type="text" placeholder="Kapak Resmi URL" className="bg-black/40 border border-white/10 p-3 rounded-xl" value={newSong.cover} onChange={(e) => setNewSong({...newSong, cover: e.target.value})} required />
                  <input type="text" placeholder="Müzik Dosyası URL (.mp3)" className="bg-black/40 border border-white/10 p-3 rounded-xl" value={newSong.url} onChange={(e) => setNewSong({...newSong, url: e.target.value})} required />
                  <button type="submit" className="md:col-span-2 bg-amber-500 text-black font-black py-4 rounded-2xl hover:bg-amber-600 transition-all uppercase tracking-widest">Şarkıyı Arşive Ekle</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
