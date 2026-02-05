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

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await getSongs();
        if (data && Array.isArray(data) && data.length > 0) {
          setSongs(data);
          setCurrentSong(data[0]);
        }
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
      }
    };
    loadSongs();
  }, []);

  const toggleLike = (songId: string) => {
    setLikedSongs(prev => 
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  };

  const filteredSongs = useMemo(() => {
    return (songs || []).filter(s => {
      const title = s?.title?.toLowerCase() || '';
      const artist = s?.artist?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      const matchesSearch = title.includes(search) || artist.includes(search);
      const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [songs, searchTerm, selectedCategory]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') {
      setIsAdmin(true);
      setActiveTab('admin');
      setAdminPass('');
      setIsSidebarOpen(false);
    } else {
      alert(lang === 'TR' ? 'Hatalı Şifre!' : 'Şîfreya Şaş!');
    }
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
    } catch (err) {
      console.error("İndirme hatası:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const ALBUMS = [
    { id: 'Patnos Türküleri', label: UI_STRINGS?.album1?.[lang] || 'Patnos Türküleri', icon: 'fa-guitar', color: 'from-blue-600 to-blue-400' },
    { id: 'Patnoslu Sanatçılar', label: UI_STRINGS?.album2?.[lang] || 'Sanatçılar', icon: 'fa-microphone-lines', color: 'from-purple-600 to-purple-400' },
    { id: 'Dengbêjler', label: UI_STRINGS?.album3?.[lang] || 'Dengbêjler', icon: 'fa-drum', color: 'from-amber-600 to-amber-400' },
    { id: 'Sizden Gelenler', label: UI_STRINGS?.album4?.[lang] || 'Sizden Gelenler', icon: 'fa-users', color: 'from-emerald-600 to-emerald-400' },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-['Outfit']">
      <Sidebar 
        lang={lang} 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setSelectedCategory(null); setIsSidebarOpen(false); }} 
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        adminPass={adminPass}
        setAdminPass={setAdminPass}
        handleAdminLogin={handleAdminLogin}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="flex flex-col bg-neutral-950/90 backdrop-blur-2xl z-40 border-b border-white/10 shrink-0">
          <div className="h-16 md:h-24 flex items-center justify-between px-4 md:px-10">
            <div className="flex items-center space-x-4 flex-1">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-full">
                <i className="fas fa-bars text-sm"></i>
              </button>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full max-w-[320px]">
                <i className="fas fa-search text-neutral-500 mr-2"></i>
                <input 
                  type="text" 
                  placeholder={UI_STRINGS?.searchPlaceholder?.[lang] || "Ara..."} 
                  className="bg-transparent border-none outline-none text-sm w-full text-white" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>
            <div className="flex space-x-1 bg-white/5 rounded-full p-1">
              <button onClick={() => setLang('TR')} className={`px-4 py-1 rounded-full text-xs font-bold ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-neutral-400'}`}>TR</button>
              <button onClick={() => setLang('KU')} className={`px-4 py-1 rounded-full text-xs font-bold ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-neutral-400'}`}>KU</button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          {activeTab === 'home' && (
            <section>
              {!selectedCategory && (
                <div className="mb-8">
                  <h3 className="text-xl font-black mb-6 uppercase tracking-tight">{UI_STRINGS?.albumsTitle?.[lang] || "ALBÜMLER"}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ALBUMS.map((album) => (
                      <button key={album.id} onClick={() => setSelectedCategory(album.id as Category)} className={`h-40 rounded-3xl bg-gradient-to-br ${album.color} p-6 text-left flex flex-col justify-between shadow-xl transition-transform hover:scale-105`}>
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <i className={`fas ${album.icon} text-white`}></i>
                        </div>
                        <span className="font-black text-lg">{album.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-12">
                <h3 className="text-xl font-black mb-6 uppercase tracking-tight">{selectedCategory || UI_STRINGS?.popularNow?.[lang] || "Popüler"}</h3>
                <div className="grid gap-2">
                  {filteredSongs.length > 0 ? filteredSongs.map((song, idx) => (
                    <div 
                      key={song.id} 
                      onClick={() => { setCurrentSong(song); setIsPlaying(true); }} 
                      className={`group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 ${currentSong?.id === song.id ? 'bg-amber-500/10 text-amber-500' : ''}`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-bold text-neutral-600 w-4">{idx + 1}</span>
                        <img src={song.cover} className="w-12 h-12 rounded-lg object-cover" alt="" />
                        <div>
                          <p className="text-sm font-black">{song.title}</p>
                          <p className="text-xs text-neutral-500">{song.artist}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleLike(song.id.toString()); }}
                            className={`p-2 transition-colors ${likedSongs.includes(song.id.toString()) ? 'text-red-500' : 'text-neutral-500 hover:text-red-400'}`}
                          >
                            <i className={`${likedSongs.includes(song.id.toString()) ? 'fas' : 'far'} fa-heart`}></i>
                          </button>
                          <span className="text-[10px] font-bold text-neutral-500">
                            {likedSongs.includes(song.id.toString()) ? 1 : 0}
                          </span>
                        </div>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDownload(song); }} 
                          className="p-2 text-neutral-500 hover:text-amber-500 transition-colors"
                        >
                          {downloadingId === song.id.toString() ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-download"></i>}
                        </button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-neutral-500 text-center py-10">Şarkı bulunamadı...</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'contact' && (
            <section className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-amber-500 uppercase tracking-tighter">İLETİŞİM</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a href="https://wa.me/905000000000" className="bg-white/5 p-8 rounded-3xl border border-white/10 flex items-center space-x-6 hover:bg-green-500/10 hover:border-green-500/30 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fab fa-whatsapp text-3xl text-green-500"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">WhatsApp</h4>
                    <p className="text-neutral-400 text-sm">Bizimle hemen iletişime geçin</p>
                  </div>
                </a>

                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <i className="fas fa-envelope text-3xl text-blue-500"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">E-Posta</h4>
                    <p className="text-neutral-400 text-sm">iletisim@patnosmuzik.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/20 to-transparent p-10 rounded-[2rem] border border-amber-500/20 text-center">
                <i className="fas fa-music text-4xl text-amber-500 mb-6"></i>
                <h3 className="text-2xl font-black mb-4">Müziğinizi Yayınlayalım!</h3>
                <p className="text-neutral-300 leading-relaxed max-w-lg mx-auto italic">
                  "Bizimle paylaşmak istediğiniz kişisel müzik dosyalarını WhatsApp veya E-Posta yoluyla gönderin, inceleyip Patnos Müzik'te yayınlayalım."
                </p>
              </div>
            </section>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <h2 className="text-2xl font-black mb-4 text-amber-500">Yönetici Paneli</h2>
              <p className="text-neutral-400">Hoş geldiniz. Buradan şarkı ekleme işlemlerini yapabilirsiniz.</p>
            </div>
          )}
        </div>

        {currentSong && (
          <Player 
            song={currentSong} 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying} 
            onNext={() => {}} 
            onPrev={() => {}} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
