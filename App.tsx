import React, { useState, useEffect, useMemo } from 'react';
import { Language, Song, Category } from './types';
import { UI_STRINGS, getSongs, initialSongs } from './constants';
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
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Verileri JSON dosyasından çekme
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

  const [guestName] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('guestName') || '' : '');
  const [guestAvatar] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('guestAvatar') || '' : '');
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const [banner] = useState({
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
    titleTr: "Patnos'tan İzmir'e Bir Melodi...",
    titleKu: "Ji Panosê Ber Bi Îzmîrê Melodiyek...",
    descTr: "Köklerinizi hissedin. En sevdiğiniz Dengbêjler ve yöresel ezgiler tek bir kutuda toplandı.",
    descKu: "Koka xwe hîs bikin. Dengbêjên we yên herî hezkirî û awazên herêmî di sindoqekê de hatin komkirin."
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredSongs = useMemo(() => {
    return songs.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.artist.toLowerCase().includes(searchTerm.toLowerCase());
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
        logo={null}
        onGuestLogin={() => setIsGuestModalOpen(true)}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="flex flex-col bg-neutral-950/90 backdrop-blur-2xl z-40 sticky top-0 border-b border-white/10 shrink-0">
          <div className="h-16 md:h-24 flex items-center justify-between px-4 md:px-10">
            <div className="flex items-center space-x-4 flex-1">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-full">
                <i className="fas fa-bars text-sm"></i>
              </button>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full max-w-[320px]">
                <i className="fas fa-search text-neutral-500 mr-2"></i>
                <input type="text" placeholder={UI_STRINGS.searchPlaceholder[lang]} className="bg-transparent border-none outline-none text-sm w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-white/5 rounded-full p-1">
                <button onClick={() => setLang('TR')} className={`px-4 py-1 rounded-full text-xs font-bold ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-neutral-400'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1 rounded-full text-xs font-bold ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-neutral-400'}`}>KU</button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          {activeTab === 'home' && (
            <section>
              {!selectedCategory && (
                <>
                  <div className="relative rounded-3xl overflow-hidden h-60 md:h-80 mb-8">
                    <img src={banner.image} alt="Banner" className="w-full h-full object-cover brightness-50" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <h2 className="text-3xl md:text-5xl font-black mb-2">{lang === 'TR' ? banner.titleTr : banner.titleKu}</h2>
                      <p className="text-neutral-300 max-w-xl text-sm md:text-lg">{lang === 'TR' ? banner.descTr : banner.descKu}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-black mb-6 uppercase tracking-tight">{UI_STRINGS.albumsTitle[lang]}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {ALBUMS.map((album) => (
                        <button key={album.id} onClick={() => setSelectedCategory(album.id as Category)} className={`h-40 rounded-3xl bg-gradient-to-br ${album.color} p-6 text-left flex flex-col justify-between shadow-xl`}>
                          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <i className={`fas ${album.icon} text-white`}></i>
                          </div>
                          <span className="font-black text-lg">{album.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="mb-12">
                <h3 className="text-xl font-black mb-6 uppercase tracking-tight">{selectedCategory || UI_STRINGS.popularNow[lang]}</h3>
                <div className="space-y-2">
                  {filteredSongs.map((song, idx) => (
                    <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 ${currentSong?.id === song.id ? 'bg-amber-500/10 text-amber-500' : ''}`}>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-bold text-neutral-600 w-4">{idx + 1}</span>
                        <img src={song.cover} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-black">{song.title}</p>
                          <p className="text-xs text-neutral-500">{song.artist}</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDownload(song); }} className="p-2 hover:text-amber-500">
                        {downloadingId === song.id.toString() ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-download"></i>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'admin' && (
            <div className="p-10 text-center">
              <h2 className="text-2xl font-black">Yönetici Paneli</h2>
              <p className="text-neutral-400 mt-2">Şarkı eklemek için songs.json dosyasını kullanın.</p>
              <button onClick={() => setIsAdmin(false)} className="mt-4 bg-white text-black px-6 py-2 rounded-full font-bold">Çıkış Yap</button>
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
