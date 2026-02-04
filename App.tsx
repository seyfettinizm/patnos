import React, { useState, useEffect, useMemo } from 'react';
import { Language, Song, Category } from './types';
import { UI_STRINGS, getSongs, initialSongs } from './constants';

// Bileşenleri hata payına karşı korumalı içe aktaralım
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

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await getSongs();
        if (data && Array.isArray(data) && data.length > 0) {
          setSongs(data);
          setCurrentSong(data[0]);
        }
      } catch (err) {
        console.error("Şarkılar yüklenirken hata oluştu:", err);
      }
    };
    loadSongs();
  }, []);

  const filteredSongs = useMemo(() => {
    if (!songs) return [];
    return songs.filter(s => {
      const title = s.title?.toLowerCase() || '';
      const artist = s.artist?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      const matchesSearch = title.includes(search) || artist.includes(search);
      const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [songs, searchTerm, selectedCategory]);

  // Albüm listesi (Hata almamak için UI_STRINGS kontrolü eklendi)
  const ALBUMS = [
    { id: 'Patnos Türküleri', label: UI_STRINGS?.album1?.[lang] || 'Albüm 1', icon: 'fa-guitar', color: 'from-blue-600 to-blue-400' },
    { id: 'Patnoslu Sanatçılar', label: UI_STRINGS?.album2?.[lang] || 'Albüm 2', icon: 'fa-microphone-lines', color: 'from-purple-600 to-purple-400' },
    { id: 'Dengbêjler', label: UI_STRINGS?.album3?.[lang] || 'Albüm 3', icon: 'fa-drum', color: 'from-amber-600 to-amber-400' },
    { id: 'Sizden Gelenler', label: UI_STRINGS?.album4?.[lang] || 'Albüm 4', icon: 'fa-users', color: 'from-emerald-600 to-emerald-400' },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Yan Menü */}
      <Sidebar 
        lang={lang} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={false} 
        setIsAdmin={() => {}} 
        adminPass="" 
        setAdminPass={() => {}} 
        handleAdminLogin={(e) => e.preventDefault()} 
        onGuestLogin={() => {}} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <i className="fas fa-bars"></i>
          </button>
          <div className="flex items-center bg-white/5 rounded-full px-4 py-1">
            <input 
              type="text" 
              placeholder="Ara..." 
              className="bg-transparent border-none outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setLang('TR')} className={`px-2 ${lang === 'TR' ? 'text-amber-500' : ''}`}>TR</button>
            <button onClick={() => setLang('KU')} className={`px-2 ${lang === 'KU' ? 'text-amber-500' : ''}`}>KU</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {!selectedCategory && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {ALBUMS.map(album => (
                <button key={album.id} onClick={() => setSelectedCategory(album.id as Category)} className={`p-4 rounded-2xl bg-gradient-to-br ${album.color} text-left h-32 flex flex-col justify-between`}>
                  <i className={`fas ${album.icon}`}></i>
                  <span className="font-bold">{album.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xl font-bold mb-4">{selectedCategory || "Tüm Şarkılar"}</h3>
            {filteredSongs.map(song => (
              <div 
                key={song.id} 
                onClick={() => { setCurrentSong(song); setIsPlaying(true); }}
                className="flex items-center p-3 hover:bg-white/5 rounded-xl cursor-pointer"
              >
                <img src={song.cover} className="w-12 h-12 rounded-lg mr-4 object-cover" alt="" />
                <div className="flex-1">
                  <div className="font-bold">{song.title}</div>
                  <div className="text-sm text-neutral-400">{song.artist}</div>
                </div>
              </div>
            ))}
          </div>
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
