import React, { useState } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [songs, setSongs] = useState(initialSongs);
  const [currentSong, setCurrentSong] = useState(initialSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [lang, setLang] = useState('TR');

  // Misafir Profil State
  const [guestName, setGuestName] = useState('Misafir Kullanıcı');
  const [guestImg, setGuestImg] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setAdminPass(''); setActiveTab('admin'); } 
    else { alert('Hatalı Şifre!'); }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Panel kaybolmasın diye preventDefault kullandık
    alert("Şarkı veritabanına kaydedildi! (Simülasyon)");
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} 
        adminPass={adminPass} setAdminPass={setAdminPass} 
        handleAdminLogin={handleAdminLogin} 
        isOpen={false} setIsOpen={() => {}} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* ÜST BAR */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-20">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <span className="text-neutral-500 mr-3 text-sm">🔍</span>
            <input type="text" placeholder={lang === 'TR' ? "Şarkı ara..." : "Li stranê bigere..."} className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500'}`}>KU</button>
             </div>
             {/* Misafir Girişi Butonu */}
             <button onClick={() => setActiveTab('profile')} className="group flex items-center space-x-3 bg-neutral-800 hover:bg-neutral-700 p-1.5 pr-4 rounded-xl border border-white/5 transition-all">
                <img src={guestImg} className="w-8 h-8 rounded-lg object-cover border border-white/10" alt="Profil" />
                <span className="text-[10px] font-black tracking-widest uppercase">{guestName.split(' ')[0]}</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-48">
          
          {/* ANA SAYFA TAB */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-700">
              <div className="mb-12 rounded-[2.5rem] relative overflow-hidden h-72 flex items-center border border-white/5 shadow-2xl">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Süphan Dağı" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 p-12">
                   <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest shadow-lg">HAFTANIN SEÇİMİ</span>
                   <h2 className="text-5xl font-black mb-4 tracking-tighter italic">
                     {lang === 'TR' ? "İzmir Patnoslular Müzik Arşivi" : "Arşîva Muzîkê ya Patnosiyên Îzmîrê"}
                   </h2>
                   <p className="text-neutral-400 font-bold italic text-sm">Gelenekten Geleceğe...</p>
                </div>
              </div>

              <div className="space-y-2">
                {songs.map((song) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 border border-transparent ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-xl" alt="" />
                      <div>
                        <p className={`font-bold text-sm ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MİSAFİR PROFİL TAB */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto py-12 animate-in slide-in-from-bottom-8 duration-500">
              <div className="bg-neutral-900/60 p-10 rounded-[3rem] border border-white/5 text-center">
                <h3 className="text-2xl font-black mb-8 italic text-amber-500 uppercase tracking-tighter">Profilini Düzenle</h3>
                <div className="relative w-32 h-32 mx-auto mb-8 group cursor-pointer" onClick={() => alert('Resim seçme penceresi (Simülasyon)')}>
                  <img src={guestImg} className="w-full h-full rounded-[2rem] object-cover border-2 border-amber-500 shadow-2xl transition-transform group-hover:scale-105" alt="Profil" />
                  <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">📸</div>
                </div>
                <input 
                  type="text" 
                  value={guestName} 
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-center font-bold focus:border-amber-500 outline-none mb-6"
                  placeholder="İsim Giriniz..."
                />
                <button onClick={() => setActiveTab('home')} className="w-full bg-amber-500 text-black font-black py-4 rounded-2xl shadow-lg hover:brightness-110">DEĞİŞİKLİKLERİ KAYDET</button>
              </div>
            </div>
          )}

          {/* YÖNETİM PANELİ TAB */}
          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-12 animate-in zoom-in duration-500">
               <form onSubmit={handleUpload} className="bg-neutral-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-black italic text-amber-500">Müzik Yükleme Konsolu</h2>
                    <span className="text-[10px] font-black text-neutral-500 border border-white/10 px-3 py-1 rounded-full uppercase">Admin Yetkisi</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <input type="text" placeholder="Şarkı Adı" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-amber-500 outline-none" />
                      <input type="text" placeholder="Sanatçı" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-amber-500 outline-none" />
                      <div className="bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-neutral-500 flex justify-between items-center cursor-pointer hover:border-amber-500/50">
                        <span>Kapak Görseli Seç (JPG)</span>
                        <span>🖼️</span>
                      </div>
                    </div>
                    <div className="bg-amber-500/5 border-2 border-dashed border-amber-500/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8">
                      <p className="text-4xl mb-4">🎵</p>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-relaxed">MP3 Dosyasını Buraya Bırakın<br/><span className="text-amber-500">veya dosyaları seçin</span></p>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] shadow-xl hover:bg-amber-400 transition-all">SİSTEME KAYDET VE YAYINLA</button>
               </form>
            </div>
          )}

          {/* İLETİŞİM TAB */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 text-center shadow-2xl">
                  <h2 className="text-3xl font-black mb-10 tracking-tighter italic text-white uppercase">İletişim Bilgilerimiz</h2>
                  <div className="grid md:grid-cols-3 gap-8 text-white">
                    <div className="bg-black/60 p-8 rounded-[2rem] border border-white/5">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-3">WhatsApp</p>
                      <p className="font-bold">0505 225 06 55</p>
                    </div>
                    <div className="bg-black/60 p-8 rounded-[2rem] border border-white/5">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-3">E-Posta</p>
                      <p className="text-sm font-bold italic">patnosumuz@gmail.com</p>
                    </div>
                    <div className="bg-black/60 p-8 rounded-[2rem] border border-white/5">
                      <p className="text-amber-500 font-black text-[10px] uppercase mb-3 text-[9px]">Adres</p>
                      <p className="text-[10px] font-bold leading-relaxed">Buca/İzmir</p>
                    </div>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* PLAYER */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-white/5 backdrop-blur-2xl h-24 px-8">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
