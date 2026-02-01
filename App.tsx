
import React, { useState, useEffect, useMemo } from 'react';
import { Language, Song, Category } from './types';
import { UI_STRINGS, MOCK_SONGS } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

interface Liker {
  name: string;
  avatar: string | null;
  isCurrentUser?: boolean;
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('TR');
  const [activeTab, setActiveTab] = useState('home');
  const [currentSong, setCurrentSong] = useState<Song | null>(MOCK_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Guest Profile States
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || '');
  const [guestAvatar, setGuestAvatar] = useState(() => localStorage.getItem('guestAvatar') || '');
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [tempGuestName, setTempGuestName] = useState('');
  const [tempGuestAvatar, setTempGuestAvatar] = useState('');

  // Initial mock likers for realism
  const [songLikers, setSongLikers] = useState<Record<string, Liker[]>>(() => {
    const initial: Record<string, Liker[]> = {};
    const randomAvatars = [
      "https://i.pravatar.cc/150?u=1",
      "https://i.pravatar.cc/150?u=2",
      "https://i.pravatar.cc/150?u=3",
      "https://i.pravatar.cc/150?u=4"
    ];
    MOCK_SONGS.forEach(song => {
      initial[song.id] = [
        { name: "Ali", avatar: randomAvatars[0] },
        { name: "Berfin", avatar: randomAvatars[1] }
      ];
    });
    return initial;
  });

  const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
  const [logo, setLogo] = useState<string | null>(null);
  const [banner, setBanner] = useState({
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
    titleTr: "Patnos'tan İzmir'e Bir Melodi...",
    titleKu: "Ji Panosê Ber Bi Îzmîrê Melodiyek...",
    descTr: "Köklerinizi hissedin. En sevdiğiniz Dengbêjler ve yöresel ezgiler tek bir kutuda toplandı.",
    descKu: "Koka xwe hîs bikin. Dengbêjên we yên herî hezkirî û awazên herêmî di sindoqekê de hatin komkirin."
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Sync user profile in all liked songs whenever guest profile changes
  useEffect(() => {
    setSongLikers(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(songId => {
        updated[songId] = updated[songId].map(liker => {
          if (liker.isCurrentUser) {
            return {
              ...liker,
              name: guestName || UI_STRINGS.defaultGuestName[lang],
              avatar: guestAvatar || null
            };
          }
          return liker;
        });
      });
      return updated;
    });
  }, [guestName, guestAvatar, lang]);

  const filteredSongs = useMemo(() => {
    return songs
      .filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             s.artist.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const totalLikesA = a.likes + (likedSongs.has(a.id) ? 1 : 0);
        const totalLikesB = b.likes + (likedSongs.has(b.id) ? 1 : 0);
        return totalLikesB - totalLikesA;
      });
  }, [songs, searchTerm, selectedCategory, likedSongs]);

  const playNextSong = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    setCurrentSong(filteredSongs[nextIndex]);
    setIsPlaying(true);
  };

  const playPrevSong = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    setCurrentSong(filteredSongs[prevIndex]);
    setIsPlaying(true);
  };

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

  const handleBannerUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanner(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLike = (songId: string) => {
    const next = new Set(likedSongs);
    const likers = { ...songLikers };
    const currentGuest: Liker = { 
      name: guestName || UI_STRINGS.defaultGuestName[lang], 
      avatar: guestAvatar || null,
      isCurrentUser: true
    };

    if (next.has(songId)) {
      next.delete(songId);
      likers[songId] = (likers[songId] || []).filter(l => !l.isCurrentUser);
    } else {
      next.add(songId);
      const alreadyLiked = (likers[songId] || []).some(l => l.isCurrentUser);
      if (!alreadyLiked) {
        likers[songId] = [...(likers[songId] || []), currentGuest];
      }
    }
    setLikedSongs(next);
    setSongLikers(likers);
  };

  const handleSaveGuestName = () => {
    if (tempGuestName.trim()) {
      setGuestName(tempGuestName);
      setGuestAvatar(tempGuestAvatar);
      localStorage.setItem('guestName', tempGuestName);
      localStorage.setItem('guestAvatar', tempGuestAvatar);
      setIsGuestModalOpen(false);
    }
  };

  const handleDownload = async (song: Song) => {
    if (!song.audioUrl) return;
    setDownloadingId(song.id);
    try {
      const response = await fetch(song.audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${song.artist} - ${song.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingId(null);
    }
  };

  const ALBUMS = [
    { id: 'Patnos Türküleri', label: UI_STRINGS.album1[lang], icon: 'fa-guitar', color: 'from-blue-600 to-blue-400' },
    { id: 'Patnoslu Sanatçılar', label: UI_STRINGS.album2[lang], icon: 'fa-microphone-lines', color: 'from-purple-600 to-purple-400' },
    { id: 'Dengbêjler', label: UI_STRINGS.album3[lang], icon: 'fa-drum', color: 'from-amber-600 to-amber-400' },
    { id: 'Sizden Gelenler', label: UI_STRINGS.album4[lang], icon: 'fa-users', color: 'from-emerald-600 to-emerald-400' },
  ];

  const handleAddOrUpdateSong = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const coverFile = formData.get('cover') as File;
    const musicFile = formData.get('music') as File;

    setIsUploading(true);
    setUploadProgress(10);

    const readFile = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    };

    let coverUrl = editingSong?.coverUrl || "https://picsum.photos/seed/music/400/400";
    let audioUrl = editingSong?.audioUrl || "";

    if (coverFile && coverFile.size > 0) {
      coverUrl = await readFile(coverFile);
    }
    setUploadProgress(50);
    if (musicFile && musicFile.size > 0) {
      audioUrl = await readFile(musicFile);
    }
    setUploadProgress(90);

    const newSongId = editingSong?.id || Date.now().toString();
    const newSong: Song = {
      id: newSongId,
      title: formData.get('title') as string,
      artist: formData.get('artist') as string,
      album: formData.get('category') as string,
      duration: "3:45",
      coverUrl: coverUrl,
      audioUrl: audioUrl,
      category: formData.get('category') as Category,
      likes: editingSong?.likes || 0
    };

    if (editingSong) {
      setSongs(songs.map(s => s.id === editingSong.id ? newSong : s));
      setEditingSong(null);
    } else {
      setSongs([newSong, ...songs]);
      // Initialize likers for new song
      setSongLikers(prev => ({ ...prev, [newSongId]: [] }));
    }
    
    setUploadProgress(100);
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 500);
    e.currentTarget.reset();
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white selection:bg-amber-500/30 overflow-hidden font-['Outfit']">
      <Sidebar 
        lang={lang} 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setSelectedCategory(null); setIsSidebarOpen(false); }} 
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        adminPass={adminPass}
        setAdminPass={setAdminPass}
        handleAdminLogin={handleAdminLogin}
        logo={logo}
        onGuestLogin={() => setIsGuestModalOpen(true)}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="flex flex-col bg-neutral-950/90 backdrop-blur-2xl z-40 sticky top-0 border-b border-white/10 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          {/* Main Strip */}
          <div className="h-16 md:h-24 flex items-center justify-between px-4 md:px-10">
            <div className="flex items-center space-x-3 md:space-x-4 flex-1 overflow-hidden mr-2">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-full shrink-0 border border-white/10 active:scale-95 transition-all hover:bg-white/10"
              >
                <i className="fas fa-bars text-sm"></i>
              </button>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2.5 w-full max-w-[140px] xs:max-w-[200px] md:max-w-[320px] group shadow-inner focus-within:border-amber-500/50 transition-colors">
                <i className="fas fa-search text-neutral-500 mr-2 text-[11px] group-focus-within:text-amber-500"></i>
                <input 
                  type="text" 
                  placeholder={UI_STRINGS.searchPlaceholder[lang]}
                  className="bg-transparent border-none outline-none text-[11px] md:text-[13px] w-full placeholder:text-neutral-600 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-6">
              <div className="flex items-center space-x-1 bg-white/5 rounded-full p-1 border border-white/10">
                <button onClick={() => setLang('TR')} className={`px-2.5 md:px-4 py-1.5 rounded-full text-[10px] md:text-[11px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-neutral-400 hover:text-white'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-2.5 md:px-4 py-1.5 rounded-full text-[10px] md:text-[11px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-neutral-400 hover:text-white'}`}>KU</button>
              </div>
              
              <button 
                onClick={() => setIsGuestModalOpen(true)}
                className="flex items-center group cursor-pointer bg-white/5 p-1 md:px-5 md:py-2.5 rounded-full md:rounded-[2rem] border border-white/10 hover:border-amber-500/50 transition-all shadow-xl shrink-0"
              >
                <div className="text-right hidden md:block mr-4">
                  <p className="text-[12px] font-black uppercase tracking-wider">{guestName || UI_STRINGS.defaultGuestName[lang]}</p>
                </div>
                <div className="w-8 h-8 md:w-11 md:h-11 rounded-full md:rounded-xl overflow-hidden border border-white/20 shadow-lg bg-neutral-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {guestAvatar ? <img src={guestAvatar} className="w-full h-full object-cover" alt="Profile" /> : <i className="fas fa-user text-neutral-500 text-xs md:text-base"></i>}
                </div>
              </button>
            </div>
          </div>

          {/* Attractive Mobile Brand Banner */}
          <div className="md:hidden px-4 py-5 bg-gradient-to-b from-white/5 to-transparent border-t border-white/5 flex items-center justify-center animate-in fade-in slide-in-from-top duration-1000">
            <div className="flex items-center space-x-5 w-full max-w-[340px] justify-center">
              {logo ? (
                <div className="w-12 h-12 xs:w-14 xs:h-14 rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)] shrink-0 ring-1 ring-white/10">
                  <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 xs:w-14 xs:h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-[0_0_25px_rgba(245,158,11,0.3)] shrink-0">P</div>
              )}
              <div className="flex flex-col items-center overflow-hidden">
                <h1 className="text-sm xs:text-base font-black leading-tight tracking-tight uppercase truncate text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-neutral-400 drop-shadow-md text-center">
                  {UI_STRINGS.appName[lang]}
                </h1>
                <div className="flex items-center space-x-2 w-full justify-center mt-1">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/50"></div>
                  <p className="text-[10px] xs:text-[11px] text-amber-500 font-black uppercase tracking-[0.5em] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] text-center whitespace-nowrap">
                    {UI_STRINGS.musicBox[lang]}
                  </p>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/50"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 scroll-smooth">
          {activeTab === 'home' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {!selectedCategory && (
                <>
                  <div className="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden h-48 xs:h-60 md:h-80 mb-6 md:mb-12 group shadow-2xl">
                    <img src={banner.image} alt="Banner" className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-[4000ms]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-4 md:p-12 flex flex-col justify-end">
                      <div className="bg-amber-500 text-black text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-2 md:px-3 py-1 rounded-full w-fit mb-2 md:mb-4">HAFTANIN SEÇİMİ</div>
                      <h2 className="text-2xl md:text-5xl font-black mb-1 md:mb-2 leading-tight tracking-tighter drop-shadow-2xl">{lang === 'TR' ? banner.titleTr : banner.titleKu}</h2>
                      <p className="text-neutral-300 max-w-xl text-xs md:text-lg font-medium opacity-90 leading-relaxed hidden sm:block">{lang === 'TR' ? banner.descTr : banner.descKu}</p>
                    </div>
                  </div>

                  <div className="mb-8 md:mb-14">
                    <h3 className="text-lg md:text-2xl font-black mb-4 md:mb-8 flex items-center space-x-3">
                      <div className="w-1.5 h-5 md:h-8 bg-amber-500 rounded-full shadow-lg"></div>
                      <span className="tracking-tight uppercase">{UI_STRINGS.albumsTitle[lang]}</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
                      {ALBUMS.map((album) => (
                        <button
                          key={album.id}
                          onClick={() => setSelectedCategory(album.id as Category)}
                          className={`relative h-36 md:h-48 rounded-xl md:rounded-[2rem] overflow-hidden group transition-all hover:scale-[1.03] bg-gradient-to-br ${album.color} p-3 md:p-6 text-left flex flex-col justify-between shadow-xl`}
                        >
                          <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20">
                            <i className={`fas ${album.icon} text-white text-sm md:text-xl`}></i>
                          </div>
                          <span className="font-black text-sm md:text-xl leading-none tracking-tighter drop-shadow-md">{album.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="mb-12">
                <div className="flex items-center justify-between mb-4 md:mb-8">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    {selectedCategory && (
                      <button onClick={() => setSelectedCategory(null)} className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all">
                        <i className="fas fa-arrow-left text-xs"></i>
                      </button>
                    )}
                    <h3 className="text-lg md:text-2xl font-black flex items-center space-x-3">
                      {!selectedCategory && <div className="w-1.5 h-5 md:h-8 bg-amber-500 rounded-full shadow-lg"></div>}
                      <span className="tracking-tight uppercase">{selectedCategory || UI_STRINGS.popularNow[lang]}</span>
                    </h3>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <div className="hidden md:grid grid-cols-[50px_1fr_1fr_80px_120px_80px_80px] gap-4 px-6 py-4 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] border-b border-white/5 mb-4">
                    <div className="text-center">#</div>
                    <div>{lang === 'TR' ? 'Eser Adı' : 'Navê Berhemê'}</div>
                    <div className="hidden md:block">{lang === 'TR' ? 'Sanatçı' : 'Hunermend'}</div>
                    <div className="text-center"><i className="far fa-clock"></i></div>
                    <div className="text-center">{UI_STRINGS.likersHeader[lang]}</div>
                    <div className="text-center">Daxîne</div>
                    <div className="text-right pr-4">Beğen</div>
                  </div>

                  {filteredSongs.map((song, idx) => {
                    const likers = songLikers[song.id] || [];
                    const currentTotalLikes = song.likes + (likedSongs.has(song.id) ? 1 : 0);
                    return (
                      <div 
                        key={song.id} 
                        onClick={() => { setCurrentSong(song); setIsPlaying(true); }} 
                        className={`group grid grid-cols-[32px_1fr_110px] md:grid-cols-[50px_1fr_1fr_80px_120px_80px_80px] gap-2 md:gap-4 items-center px-3 md:px-6 py-2 md:py-4 rounded-lg md:rounded-2xl transition-all cursor-pointer hover:bg-white/5 border border-transparent ${currentSong?.id === song.id ? 'bg-amber-500/10 text-amber-500' : ''}`}
                      >
                        <div className="text-center text-[10px] md:text-sm font-black text-neutral-600">
                          {currentSong?.id === song.id && isPlaying ? <i className="fas fa-volume-up animate-pulse text-amber-500"></i> : idx + 1}
                        </div>
                        <div className="flex items-center space-x-2 md:space-x-4 overflow-hidden">
                          <img src={song.coverUrl} className="w-8 h-8 md:w-12 md:h-12 rounded md:rounded-xl object-cover shrink-0" />
                          <div className="truncate">
                            <p className="text-xs md:text-sm font-black tracking-tight truncate">{song.title}</p>
                            <p className="text-[9px] md:text-[10px] text-neutral-500 font-bold truncate">{song.artist}</p>
                          </div>
                        </div>
                        
                        <div className="hidden md:block text-sm font-bold text-neutral-400 truncate">{song.artist}</div>
                        <div className="hidden md:block text-xs text-neutral-500 text-center font-black">{song.duration}</div>
                        
                        {/* Likers Column - Dynamic Avatars */}
                        <div className="hidden md:flex justify-center -space-x-2.5 overflow-hidden py-1">
                          {likers.length > 0 ? (
                            likers.slice(-4).map((l, i) => (
                              <div key={i} className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-neutral-900 overflow-hidden bg-neutral-800 shadow-lg transform transition-transform group-hover:translate-x-1 ${l.isCurrentUser ? 'border-amber-500/50' : ''}`} title={l.name}>
                                {l.avatar ? (
                                  <img src={l.avatar} className="w-full h-full object-cover" alt={l.name} />
                                ) : (
                                  <div className={`w-full h-full flex items-center justify-center text-[8px] md:text-[10px] font-black uppercase ${l.isCurrentUser ? 'bg-amber-500 text-black' : 'bg-neutral-700 text-neutral-400'}`}>
                                    {l.name[0]}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest opacity-40">...</div>
                          )}
                        </div>

                        <div className="hidden md:flex justify-center">
                          <button onClick={(e) => { e.stopPropagation(); handleDownload(song); }} className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all text-neutral-500">
                            {downloadingId === song.id ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-download text-xs"></i>}
                          </button>
                        </div>

                        <div className="flex items-center justify-end space-x-1.5 pr-1 md:pr-4">
                          {/* Mobile Download Button */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDownload(song); }} 
                            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-all text-neutral-500"
                          >
                            {downloadingId === song.id ? <i className="fas fa-spinner animate-spin text-[10px]"></i> : <i className="fas fa-download text-[10px]"></i>}
                          </button>
                          
                          <span className="text-[10px] font-black text-neutral-500 md:hidden opacity-80">{currentTotalLikes}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }} 
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all ${likedSongs.has(song.id) ? 'text-amber-500 bg-amber-500/10 scale-110' : 'text-neutral-500 hover:scale-110'}`}
                          >
                            <i className={`${likedSongs.has(song.id) ? 'fas' : 'far'} fa-heart text-xs md:text-sm`}></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'contact' && (
            <section className="animate-in fade-in zoom-in-95 duration-500 p-2 md:p-4">
               <div className="glass-panel rounded-3xl md:rounded-[3rem] p-6 md:p-12 max-w-3xl mx-auto text-center space-y-6 md:space-y-10 border border-white/10 shadow-2xl">
                    <div className="w-16 h-16 md:w-28 md:h-28 bg-amber-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-5xl mx-auto shadow-lg rotate-3">
                      <i className="fas fa-map-location-dot text-black"></i>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl md:text-4xl font-black tracking-tighter">{UI_STRINGS.appName[lang]}</h4>
                      <p className="text-amber-500 font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-[8px] md:text-xs">Müzik ve Kültür Platformu</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                      <a href="mailto:patnosumuz@gmail.com" className="bg-white/5 p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 hover:border-amber-500/50 transition-all">
                        <i className="fas fa-envelope text-amber-500 mb-2 md:mb-4 text-sm md:text-xl block"></i>
                        <p className="text-xs md:text-lg font-black truncate">patnosumuz@gmail.com</p>
                      </a>
                      <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="bg-white/5 p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 hover:border-amber-500/50 transition-all">
                        <i className="fab fa-whatsapp text-amber-500 mb-2 md:mb-4 text-sm md:text-xl block"></i>
                        <p className="text-xs md:text-lg font-black">0505 225 06 55</p>
                      </a>
                    </div>
                  </div>
            </section>
          )}

          {activeTab === 'admin' && isAdmin && (
            <section className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 md:p-10 rounded-2xl md:rounded-[3rem] shadow-xl text-black flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-4xl font-black tracking-tighter">Yönetici Paneli</h2>
                  <p className="text-black/70 text-[9px] md:text-sm font-bold">Patnos dijital arşivini ve genel ayarları yönetin.</p>
                </div>
                <button onClick={() => setIsAdmin(false)} className="bg-black text-white px-4 py-2 md:px-8 md:py-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase">Çıkış</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-5 md:p-8 rounded-2xl space-y-4">
                  <h3 className="text-base font-black uppercase tracking-widest">Logo Güncelle</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
                      {logo ? <img src={logo} className="w-full h-full object-contain" /> : <i className="fas fa-image text-neutral-500"></i>}
                    </div>
                    <label className="flex-1 cursor-pointer bg-amber-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase text-center hover:bg-amber-400 transition-colors">
                      Dosya Seç
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpdate} />
                    </label>
                  </div>
                </div>
                <div className="glass-panel p-5 md:p-8 rounded-2xl space-y-4">
                  <h3 className="text-base font-black uppercase tracking-widest">Banner Güncelle</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-16 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
                      <img src={banner.image} className="w-full h-full object-cover" />
                    </div>
                    <label className="flex-1 cursor-pointer bg-amber-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase text-center hover:bg-amber-400 transition-colors">
                      Dosya Seç
                      <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpdate} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                   <div className="glass-panel p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] space-y-4 md:space-y-6 sticky top-4">
                      <h3 className="text-base md:text-xl font-black uppercase tracking-tighter">
                        {editingSong ? 'Eseri Düzenle' : 'Yeni Eser Ekle'}
                      </h3>
                      <form onSubmit={handleAddOrUpdateSong} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase">Eser Adı</label>
                          <input name="title" required placeholder="Başlık" defaultValue={editingSong?.title} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase">Sanatçı</label>
                          <input name="artist" required placeholder="Sanatçı" defaultValue={editingSong?.artist} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase">Kategori</label>
                          <select name="category" defaultValue={editingSong?.category} className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-400">
                            {ALBUMS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Kapak Görseli</label>
                            <label className="cursor-pointer block bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[9px] font-bold text-center hover:bg-white/10">
                              Seç
                              <input type="file" name="cover" className="hidden" accept="image/*" />
                            </label>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Müzik Dosyası</label>
                            <label className="cursor-pointer block bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[9px] font-bold text-center hover:bg-white/10">
                              Yükle
                              <input type="file" name="music" className="hidden" accept="audio/*" />
                            </label>
                          </div>
                        </div>

                        {isUploading && (
                          <div className="space-y-1">
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <p className="text-[8px] text-center font-bold text-amber-500">% {uploadProgress} Tamamlandı</p>
                          </div>
                        )}

                        <div className="flex space-x-2 pt-2">
                          <button type="submit" disabled={isUploading} className="flex-1 bg-amber-500 text-black font-black py-3 rounded-xl text-xs uppercase shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50">
                            {editingSong ? 'Güncelle' : 'Sisteme Kaydet'}
                          </button>
                          {editingSong && (
                            <button type="button" onClick={() => setEditingSong(null)} className="px-4 py-3 bg-white/5 rounded-xl text-[10px] font-bold">İptal</button>
                          )}
                        </div>
                      </form>
                   </div>
                </div>
                <div className="lg:col-span-2">
                   <div className="glass-panel rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[500px] border-collapse">
                          <thead className="bg-white/5 text-[9px] font-black uppercase text-neutral-500 tracking-widest">
                            <tr>
                              <th className="px-5 py-4">#</th>
                              <th className="px-5 py-4">Eser</th>
                              <th className="px-5 py-4">Kategori</th>
                              <th className="px-5 py-4 text-right">İşlem</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {songs.map((song, i) => (
                              <tr key={song.id} className="text-xs hover:bg-white/5 transition-colors group">
                                <td className="px-5 py-4 text-neutral-600 font-bold">{i + 1}</td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center space-x-3">
                                    <img src={song.coverUrl} className="w-8 h-8 rounded shadow-lg object-cover" />
                                    <div>
                                      <p className="font-black">{song.title}</p>
                                      <p className="text-[10px] text-neutral-500">{song.artist}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded-lg text-[9px] font-black border border-amber-500/20">{song.category}</span>
                                </td>
                                <td className="px-5 py-4 text-right space-x-2">
                                  <button onClick={() => setEditingSong(song)} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                                    <i className="fas fa-edit text-[10px]"></i>
                                  </button>
                                  <button onClick={() => { if(confirm('Silsin mi?')) setSongs(songs.filter(s => s.id !== song.id)) }} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                    <i className="fas fa-trash-alt text-[10px]"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Player 
        currentSong={currentSong} 
        lang={lang} 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={playNextSong}
        onPrev={playPrevSong}
      />

      {isGuestModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-sm p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-6 md:space-y-8 animate-in zoom-in-95">
            <div className="text-center space-y-3">
              <label className="relative block group cursor-pointer mx-auto w-20 h-20 md:w-24 md:h-24">
                <div className="w-full h-full bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-dashed border-amber-500/30 overflow-hidden">
                  {tempGuestAvatar ? <img src={tempGuestAvatar} className="w-full h-full object-cover" alt="Preview" /> : <i className="fas fa-camera text-xl text-amber-500"></i>}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setTempGuestAvatar(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
              </label>
              <h3 className="text-lg md:text-xl font-black">{UI_STRINGS.guestProfile[lang]}</h3>
            </div>
            <div className="space-y-3">
              <input 
                type="text" 
                value={tempGuestName}
                onChange={(e) => setTempGuestName(e.target.value)}
                placeholder={UI_STRINGS.defaultGuestName[lang]}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm font-bold text-center"
              />
              <div className="flex space-x-2 md:space-x-3">
                <button onClick={() => setIsGuestModalOpen(false)} className="flex-1 py-3 bg-white/5 text-neutral-400 font-bold rounded-xl text-xs md:text-sm">İptal</button>
                <button onClick={handleSaveGuestName} className="flex-1 py-3 bg-amber-500 text-black font-black rounded-xl text-xs md:text-sm">Kaydet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
