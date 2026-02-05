import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'TR');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || 'Misafir Kullanıcı');
  
  const [songs, setSongs] = useState(() => {
    const savedSongs = localStorage.getItem('myMusicList');
    return savedSongs ? JSON.parse(savedSongs) : initialSongs;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [currentSong, setCurrentSong] = useState(songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '' });

  useEffect(() => { localStorage.setItem('appLang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('guestName', guestName); }, [guestName]);
  useEffect(() => { localStorage.setItem('myMusicList', JSON.stringify(songs)); }, [songs]);

  const t: any = {
    TR: {
      search: "Şarkı ara...",
      bannerTitle: "İzmir Patnoslular Derneği Müzik Kutusu",
      bannerSub: "KÜLTÜR ARŞİVİ",
      contactTitle: "İletişim ve Paylaşım",
      profileTitle: "Profilini Düzenle",
      save: "KAYDET",
      adminTitle: "Müzik Yükleme Konsolu",
      shareTitle: "Kendi Müziğini Gönder",
      shareDesc: "Elinizde bulunan Patnos yöresine ait müzikleri bize ulaştırın. Uygun bulunan eserler yayınlanacaktır.",
      shareButton: "WhatsApp ile Gönder",
      uploadButton: "LİSTEYE EKLE VE YAYINLA",
      address: "Yeşilbağlar Mah. 637/33 Sok. No: 25 Buca/İzmir"
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
      shareDesc: "Muzîkên herêma Patnosê yên ku di destê we de hene ji me re bişînin. Berhemên guncav dê werin weşandin.",
      shareButton: "Bi WhatsApp bişîne",
      uploadButton: "LİSTEYÊ ZÊDE BIKE",
      address: "Mah. Yeşilbağlar. 637/33 Sok. No: 25 Buca/Îzmîr"
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setAdminPass(''); setActiveTab('admin'); } else { alert('Şifre Yanlış!'); }
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.title || !newSong.url) return alert("Hata!");
    const songToAdd = { ...newSong, id: Date.now(), cover: newSong.cover || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300" };
    setSongs([songToAdd, ...songs]);
    setNewSong({ title: '', artist: '', cover: '', url: '' });
    setActiveTab('home');
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} 
        adminPass={adminPass} setAdminPass={setAdminPass} 
        handleAdminLogin={handleAdminLogin} 
        lang={lang}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
        {/* HEADER */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-black/40 backdrop-blur-md z-30">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <span className="mr-2">🔍</span>
            <input type="text" placeholder={t[lang].search} className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1">
                <button onClick={() => setLang('TR')} className={`px-4 py-1 rounded-full text-[10px] font-bold ${lang === 'TR' ? 'bg-amber-500 text-black' : 'text-white'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1 rounded-full text-[10px] font-bold ${lang === 'KU' ? 'bg-amber-500 text-black' : 'text-white'}`}>KU</button>
             </div>
             <button onClick={() => setActiveTab('profile')} className="bg-neutral-800 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/5">{guestName}</button>
          </div>
        </header>

        {/* İÇERİK ALANI */}
        <div className="flex-1 overflow-y-auto p-6 pb-40">
          
          {/* ANA SAYFA */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in">
              <div className="mb-8 rounded-3xl relative overflow-hidden h-64 flex items-center border border-white/5 shadow-2xl bg-neutral-900">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
                <div className="relative z-10 p-10"><h2 className="text-3xl font-black italic">{t[lang].bannerTitle}</h2></div>
              </div>
              <div className="space-y-2">
                {songs.map((song: any) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-amber-500/30 cursor-pointer ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <img src={song.cover} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div><p className="font-bold text-sm">{song.title}</p><p className="text-[10px] text-neutral-500 uppercase">{song.artist}</p></div>
                    </div>
                    {isAdmin && <button onClick={(e) => { e.stopPropagation(); setSongs(songs.filter((s:any) => s.id !== song.id)); }} className="text-red-500 text-[10px] font-bold px-3">SİL</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* İLETİŞİM BÖLÜMÜ (KESİN GÖRÜNÜR TASARIM) */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
               {/* MÜZİK GÖNDER KUTUSU */}
               <div className="bg-neutral-900 border border-amber-500/30 rounded-[2.5rem] p-8 text-center shadow-2xl">
                  <h2 className="text-2xl font-black mb-4 text-amber-500">{t[lang].shareTitle}</h2>
                  <p className="text-neutral-400 text-sm mb-6 italic">{t[lang].shareDesc}</p>
                  <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="inline-block bg-amber-500 text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">
                    {t[lang].shareButton}
                  </a>
               </div>

               {/* BİLGİ KUTULARI (3'LÜ YAPI) */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-neutral-900 p-6 rounded-[2rem] border border-white/5 text-center">
                    <p className="text-amber-500 font-black text-[9px] uppercase mb-2">WhatsApp</p>
                    <p className="font-bold text-sm">0505 225 06 55</p>
                  </div>
                  <div className="bg-neutral-900 p-6 rounded-[2rem] border border-white/5 text-center">
                    <p className="text-amber-500 font-black text-[9px] uppercase mb-2">E-Posta</p>
                    <p className="font-bold text-sm">patnosumuz@gmail.com</p>
                  </div>
                  <div className="bg-neutral-900 p-6 rounded-[2rem] border border-white/5 text-center">
                    <p className="text-amber-500 font-black text-[9px] uppercase mb-2">Adres</p>
                    <p className="font-bold text-[10px] leading-tight">{t[lang].address}</p>
                  </div>
               </div>
            </div>
          )}

          {/* ADMİN VE PROFİL AYNI KALIYOR */}
          {activeTab === 'admin' && (
            <div className="max-w-2xl mx-auto bg-neutral-900 p-10 rounded-[2.5rem] border border-white/5">
              <h2 className="text-xl font-black text-amber-500 mb-6">{t[lang].adminTitle}</h2>
              <form onSubmit={handleAddSong} className="space-y-4">
                <input type="text" placeholder="Şarkı Adı" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                <input type="text" placeholder="Sanatçı" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                <input type="text" placeholder="Resim URL" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                <input type="text" placeholder="Müzik URL (.mp3)" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                <button type="submit" className="w-full bg-amber-500 text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest">{t[lang].uploadButton}</button>
              </form>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-md mx-auto bg-neutral-900 p-10 rounded-[2.5rem] border border-white/5 text-center">
              <h2 className="text-xl font-black text-amber-500 mb-8">{t[lang].profileTitle}</h2>
              <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl text-center font-bold mb-6" />
              <button onClick={() => setActiveTab('home')} className="w-full bg-amber-500 text-black font-black py-4 rounded-xl text-xs">{t[lang].save}</button>
            </div>
          )}
        </div>

        {/* PLAYER */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/5 h-24 px-8 z-50">
            <Player song={
