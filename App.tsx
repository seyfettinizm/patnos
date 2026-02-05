import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  // --- HAFIZA YÖNETİMİ ---
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
      shareDesc: "Elinizde bulunan Patnos yöresine ait müzikleri veya görselleri bize ulaştırın. Uygun bulunan eserler arşivimizde yayınlanacaktır.",
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
    if (!newSong.title || !newSong.url) return alert("Şarkı adı ve URL boş olamaz!");
    const songToAdd = { ...newSong, id: Date.now(), cover: newSong.cover || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300" };
    setSongs([songToAdd, ...songs]);
    setNewSong({ title: '', artist: '', cover: '', url: '' });
    alert("Eklendi!");
    setActiveTab('home');
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} 
        adminPass={adminPass} setAdminPass={setAdminPass} 
        handleAdminLogin={handleAdminLogin} 
        lang={lang}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-20">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <span className="text-neutral-500 mr-3 text-sm">🔍</span>
            <input type="text" placeholder={t[lang].search} className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-400'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-400'}`}>KU</button>
             </div>
             <button onClick={() => setActiveTab('profile')} className="group flex items-center space-x-3 bg-neutral-800 hover:bg-neutral-700 p-1.5 pr-4 rounded-xl border border-white/5 transition-all shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black text-xs">P</div>
                <span className="text-[10px] font-black tracking-widest uppercase">{guestName}</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-48">
          
          {/* ANA SAYFA */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
              <div className="mb-12 rounded-[2.5rem] relative overflow-hidden h-72 flex items-center border border-white/5 shadow-2xl">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 p-12">
                   <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest shadow-lg">{t[lang].bannerSub}</span>
                   <h2 className="text-4xl font-black mb-4 tracking-tighter italic leading-tight">{t[lang].bannerTitle}</h2>
                </div>
              </div>
              <div className="space-y-2">
                {songs.map((song: any) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 border border-transparent group ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20 shadow-lg' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-2xl" alt="" />
                      <div>
                        <p className={`font-bold text-sm ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <button onClick={(e) => { e.stopPropagation(); setSongs(songs.filter((s:any) => s.id !== song.id)); }} className="text-neutral-600 hover:text-red-500 text-xs font-bold mr-4 transition-colors">🗑️ Sil</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* İLETİŞİM BÖLÜMÜ (GERİ GETİRİLEN KUTULARLA) */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-top-4 duration-500">
               {/* 1. KATILIM ÇAĞRISI */}
               <div className="bg-[#0a0a0a] border border-amber-500/20 rounded-[3rem] p-10 md:p-14 text-center mb-10 shadow-2xl">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">📥</div>
                  <h2 className="text-3xl font-black mb-4 italic tracking-tighter text-amber-500">{t[lang].shareTitle}</h2>
                  <p className="text-neutral-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10 italic">"{t[lang].shareDesc}"</p>
                  <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="inline-flex items-center px-10 py-5 bg-amber-500 text-black font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:scale-105 transition-all">
                     <span className="mr-3 text-xl font-bold">💬</span> {t[lang].shareButton}
                  </a>
               </div>

               {/* 2. BİLGİ KUTULARI (GERİ GELDİ) */}
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500 transition-all text-center">
                    <div className="text-2xl mb-4 opacity-50">📱</div>
                    <p className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-2">WhatsApp</p>
                    <p className="font-bold text-sm tracking-tighter">0505 225 06 55</p>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500 transition-all text-center">
                    <div className="text-2xl mb-4 opacity-50">📧</div>
                    <p className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-2">E-Posta</p>
                    <p className="font-bold text-sm italic">patnosumuz@gmail.com</p>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500 transition-all text-center">
                    <div className="text-2xl mb-4 opacity-50">📍</div>
                    <p className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-2">Adres</p>
                    <p className="font-bold text-[10px] leading-tight italic">{t[lang].address}</p>
                  </div>
               </div>
            </div>
          )}

          {/* YÖNETİM PANELİ (GÜNCELLENMİŞ DOSYA SEÇİMİ) */}
          {activeTab === 'admin' && (
            <div className="max-w-3xl mx-auto py-12 animate-in zoom-in duration-500">
               <div className="bg-neutral-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
                  <h2 className="text-3xl font-black italic text-amber-500 mb-8 tracking-tighter">⚙️ {t[lang].adminTitle}</h2>
                  <form onSubmit={handleAddSong} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Şarkı Adı" className="bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                      <input type="text" placeholder="Sanatçı" className="bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                    </div>
                    <input type="text" placeholder="Kapak Resmi Linki" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                    <input type="text" placeholder="Müzik Dosyası Linki (.mp3)" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500 font-mono text-amber-500" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    
                    <button type="submit" className="
