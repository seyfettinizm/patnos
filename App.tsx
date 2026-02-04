import React, { useState, useEffect, useMemo } from 'react';
import { Language, Song, Category } from './types';
import { UI_STRINGS, getSongs, initialSongs } from './constants'; // getSongs eklendi
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
  const [songs, setSongs] = useState<Song[]>(initialSongs); // Başlangıçta boş
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Verileri Veri Tabanından Çekme (Açılışta çalışır)
  useEffect(() => {
    const loadSongs = async () => {
      const data = await getSongs();
      if (data && data.length > 0) {
        setSongs(data);
        setCurrentSong(data[0]);
      }
    };
    loadSongs();
  }, []);

  const [guestName, setGuestName] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('guestName') || '' : '');
  const [guestAvatar, setGuestAvatar] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('guestAvatar') || '' : '');
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [tempGuestName, setTempGuestName] = useState('');
  const [tempGuestAvatar, setTempGuestAvatar] = useState('');

  const [songLikers, setSongLikers] = useState<Record<string, Liker[]>>({});
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

  const filteredSongs = useMemo(() => {
    return songs
      .filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             s.artist.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }, [songs, searchTerm, selectedCategory]);

  // YENİ: Sisteme Kaydet Fonksiyonu (Vercel Blob & KV Bağlantısı)
  const handleAddOrUpdateSong = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setIsUploading(true);
    setUploadProgress(20);

    try {
      // API'ye (Vercel'e) gönderiyoruz
      const response = await fetch('/api/songs', {
        method: 'POST',
        body: formData, // Dosyalar ve metinler beraber gider
      });

      if (response.ok) {
        setUploadProgress(100);
        const result = await response.json();
        
        // Listeyi anında güncelle
        const updatedSongs = await getSongs();
        setSongs(updatedSongs);
        
        alert(lang === 'TR' ? "Sisteme Başarıyla Kaydedildi!" : "Bi Serkeftî Hat Qeydkirin!");
        setEditingSong(null);
        e.currentTarget.reset();
      } else {
        alert("Bir hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bağlantı hatası.");
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
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

  // (Aşağıdaki return kısmı senin orijinal tasarımındır, aynen korunmuştur)
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
          <div className="h-16 md:h-24 flex items-center justify-between px-4 md:px-10">
            <div className="flex items-center space-x-3 md:space-x-4 flex-1 overflow-hidden mr-2">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-full shrink-0 border border-white/10 active:scale-95 transition-all hover:bg-white/10">
                <i className="fas fa-bars text-sm"></i>
              </button>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2.5 w-full max-w-[140px] xs:max-w-[200px] md:max-w-[320px] group shadow-inner focus-within:border-amber-500/50 transition-colors">
                <i className="fas fa-search text-neutral-500 mr-2 text-[11px] group-focus-within:text-amber-500"></i>
                <input type="text" placeholder={UI_STRINGS.searchPlaceholder[lang]} className="bg-transparent border-none outline-none text-[11px] md:text-[13px] w-full placeholder:text-neutral-600 font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-6">
              <div className="flex items-center space-x-1 bg-white/5 rounded-full p-1 border border-white/10">
                <button onClick={() => setLang('TR')} className={`px-2.5 md:px-4 py-1.5 rounded-full text-[10px] md:text-[11px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-neutral-400 hover:text-white'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-2.5 md:px-4 py-1.5 rounded-full text-[10px] md:text-[11px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-neutral-400 hover:text-white'}`}>KU</button>
              </div>
              
              <button onClick={() => setIsGuestModalOpen(true)} className="flex items-center group cursor-pointer bg-white/5 p-1 md:px-5 md:py-2.5 rounded-full md:rounded-[2rem] border border-white/10 hover:border-amber-500/50 transition-all shadow-xl shrink-0">
                <div className="text-right hidden md:block mr-4">
                  <p className="text-[12px] font-black uppercase tracking-wider">{guestName || UI_STRINGS.defaultGuestName[lang]}</p>
                </div>
                <div className="w-8 h-8 md:w-11 md:h-11 rounded-full md:rounded-xl overflow-hidden border border-white/20 shadow-lg bg-neutral-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {guestAvatar ? <img src={guestAvatar} className="w-full h-full object-cover" alt="Profile" /> : <i className="fas fa-user text-neutral-500 text-xs md:text-base"></i>}
                </div>
              </button>
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
                        <button key={album.id} onClick={() => setSelectedCategory(album.id as Category)} className={`relative h-36 md:h-48 rounded-xl md:rounded-[2rem] overflow-hidden group transition-all hover:scale-[1.03] bg-gradient-to-br ${album.color} p-3 md:p-6 text-left flex flex-col justify-between shadow-xl`}>
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
                  {filteredSongs.map((song, idx) => (
                    <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`group grid grid-cols-[32px_1fr_110px] md:grid-cols-[50px_1fr_1fr_80px_120px_80px_80px] gap-2 md:gap-4 items-center px-3 md:px-6 py-2 md:py-4 rounded-lg md:rounded-2xl transition-all cursor-pointer hover:bg-white/5 border border-transparent ${currentSong?.id === song.id ? 'bg-amber-500/10 text-amber-500' : ''}`}>
                      <div className="text-center text-[10px] md:text-sm font-black text-neutral-600">{idx + 1}</div>
                      <div className="flex items-center space-x-2 md:space-x-4 overflow-hidden">
                        <img src={song.coverUrl} className="w-8 h-8 md:w-12 md:h-12 rounded md:rounded-xl object-cover shrink-0" />
                        <div className="truncate">
                          <p className="text-xs md:text-sm font-black tracking-tight truncate">{song.title}</p>
                          <p className="text-[9px] md:text-[10px] text-neutral-500 font-bold truncate">{song.artist}</p>
                        </div>
                      </div>
                      <div className="hidden md:block text-sm font-bold text-neutral-400 truncate">{song.artist}</div>
                      <div className="hidden md:block text-xs text-neutral-500 text-center font-black">{song.duration}</div>
                      <div className="hidden md:flex justify-center -space-x-2.5 py-1">...</div>
                      <div className="hidden md:flex justify-center">
                        <button onClick={(e) => { e.stopPropagation(); handleDownload(song); }} className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all text-neutral-500">
                          {downloadingId === song.id ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-download text-xs"></i>}
                        </button>
                      </div>
                      <div className="flex items-center justify-end pr-1 md:pr-4">
                         <i className="far fa-heart text-xs md:text-sm text-neutral-500"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'admin' && isAdmin && (
            <section className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
               <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 md:p-10 rounded-2xl md:rounded-[3rem] shadow-xl text-black flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-4xl font-black tracking-tighter">Yönetici Paneli</h2>
                  <p className="text-black/70 text-[9px] md:text-sm font-bold">Patnos dijital arşivini Vercel üzerinden yönetin.</p>
                </div>
                <button onClick={() => setIsAdmin(false)} className="bg-black text-white px-4 py-2 md:px-8 md:py-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase">Çıkış</button>
              </div>

              <div className="glass-panel p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] space-y-4 md:space-y-6">
                <h3 className="text-base md:text-xl font-black uppercase tracking-tighter">Sisteme Yeni Eser Ekle</h3>
                <form onSubmit={handleAddOrUpdateSong} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input name="title" required placeholder="Eser Adı" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold" />
                    <input name="artist" required placeholder="Sanatçı" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold" />
                    <select name="category" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-400">
                      {ALBUMS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">Müzik Dosyası (MP3)</label>
                      <input type="file" name="audio" accept="audio/*" required className="text-xs file:bg-amber-500 file:border-none file:px-3 file:py-1 file:rounded-lg file:text-black file:font-bold" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">Kapak Görseli</label>
                      <input type="file" name="image" accept="image/*" required className="text-xs file:bg-amber-500 file:border-none file:px-3 file:py-1 file:rounded-lg file:text-black file:font-bold" />
                    </div>
                    <button type="submit" disabled={isUploading} className="w-full bg-amber-500 text-black font-black py-4 rounded-2xl hover:bg-amber-400 transition-all shadow-lg uppercase tracking-widest text-xs">
                      {isUploading ? `Yükleniyor %${uploadProgress}...` : 'Sisteme Kalıcı Olarak Kaydet'}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}
        </div>

        {currentSong && (
          <Player 
            song={currentSong} 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying} 
            onNext={playNextSong} 
            onPrev={playPrevSong} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
