import React, { useState, useEffect } from 'react';
import { initialSongs } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'TR');
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guestName') || 'Misafir Kullanıcı');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [currentSong, setCurrentSong] = useState(initialSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => { localStorage.setItem('appLang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('guestName', guestName); }, [guestName]);

  const t: any = {
    TR: {
      search: "Şarkı veya sanatçı ara...",
      bannerTitle: "İzmir Patnoslular Derneği Müzik Kutusu",
      bannerSub: "KÜLTÜR ARŞİVİ",
      contactTitle: "İletişim ve Paylaşım",
      profileTitle: "Profilini Düzenle",
      save: "KAYDET",
      adminTitle: "Müzik Yükleme Konsolu",
      populer: "ŞU AN POPÜLER",
      shareTitle: "Kendi Müziğini Gönder",
      shareDesc: "Elinizde bulunan Patnos yöresine ait müzikleri veya görselleri bize WhatsApp üzerinden ulaştırın. Uygun bulunan eserler arşivimizde adınızla yayınlanacaktır.",
      shareButton: "WhatsApp ile Gönder",
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
      populer: "YÊN POPULER",
      shareTitle: "Muzîka Xwe Bişînin",
      shareDesc: "Muzîk an jî wêneyên herêma Patnosê yên ku di destê we de hene, bi rêya WhatsAppê ji me re bişînin. Berhemên guncav dê di arşîva me de bi navê we werin weşandin.",
      shareButton: "Bi WhatsApp bişîne",
      address: "Mah. Yeşilbağlar. 637/33 Sok. No: 25 Buca/Îzmîr"
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'Mihriban04') { setIsAdmin(true); setAdminPass(''); setActiveTab('admin'); } else { alert('Şifre Yanlış!'); }
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
        {/* ÜST BAR */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-20">
          <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full px-4 py-2 w-full max-w-md">
            <span className="text-neutral-500 mr-3 text-sm">🔍</span>
            <input type="text" placeholder={t[lang].search} className="bg-transparent border-none outline-none text-xs w-full text-white" />
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex bg-neutral-800 rounded-full p-1 border border-white/5">
                <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'TR' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}>TR</button>
                <button onClick={() => setLang('KU')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'KU' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}>KU</button>
             </div>
             <button onClick={() => setActiveTab('profile')} className="group flex items-center space-x-3 bg-neutral-800 hover:bg-neutral-700 p-1.5 pr-4 rounded-xl border border-white/5 transition-all shadow-lg active:scale-95">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black text-xs">P</div>
                <span className="text-[10px] font-black tracking-widest uppercase">{guestName}</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-48">
          {/* ANA SAYFA */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-1000">
              <div className="mb-12 rounded-[2.5rem] relative overflow-hidden h-80 flex items-center border border-white/5 shadow-2xl group">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 p-12 max-w-2xl">
                   <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest shadow-lg">{t[lang].bannerSub}</span>
                   <h2 className="text-5xl font-black mb-4 tracking-tighter italic leading-tight">{t[lang].bannerTitle}</h2>
                </div>
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-neutral-500 flex items-center italic">
                <span className="w-1.5 h-4 bg-amber-500 mr-4 rounded-full"></span> {t[lang].populer}
              </h3>
              <div className="space-y-2">
                {initialSongs.map((song) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 border border-transparent group ${currentSong?.id === song.id ? 'bg-amber-500/10 border-amber-500/20' : ''}`}>
                    <div className="flex items-center space-x-5">
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-2xl" alt="" />
                      <div><p className={`font-bold text-sm ${currentSong?.id === song.id ? 'text-amber-500' : 'text-white'}`}>{song.title}</p><p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{song.artist}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* İLETİŞİM VE PAYLAŞIM (GÜNCELLENDİ) */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-top-4 duration-500">
               {/* PAYLAŞIM ÇAĞRISI KUTUSU */}
               <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-[1px] rounded-[3rem] mb-12 shadow-2xl shadow-amber-500/10">
                  <div className="bg-[#0a0a0a] rounded-[3rem] p-10 md:p-14 text-center">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">📥</div>
                    <h2 className="text-3xl font-black mb-6 italic tracking-tighter">{t[lang].shareTitle}</h2>
                    <p className="text-neutral-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10 italic">"{t[lang].shareDesc}"</p>
                    <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="inline-flex items-center px-10 py-5 bg-amber-500 text-black font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:scale-105 transition-all">
                       <span className="mr-3 text-xl">💬</span> {t[lang].shareButton}
                    </a>
                  </div>
               </div>

               {/* İLETİŞİM BİLGİLERİ */}
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex items-center space-x-6">
                    <div className="text-2xl opacity-50">📧</div>
                    <div><p className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-1">E-Posta</p><p className="font-bold text-sm italic">patnosumuz@gmail.com</p></div>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex items-center space-x-6">
                    <div className="text-2xl opacity-50">📍</div>
                    <div><p className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-1">Adres</p><p className="font-bold text-[10px] leading-tight">{t[lang].address}</p></div>
                  </div>
               </div>
            </div>
          )}

          {/* PROFİL VE ADMİN TABLARI (Aynı Kalacak) */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto py-12 text-center animate-in zoom-in duration-500">
               <div className="bg-neutral-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
                <h3 className="text-2xl font-black mb-10 italic text-amber-500 uppercase">{t[lang].profileTitle}</h3>
                <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-center font-bold mb-6 focus:border-amber-500 outline-none" />
                <button onClick={() => setActiveTab('home')} className="w-full bg-amber-500 text-black font-black py-4 rounded-2xl uppercase">{t[lang].save}</button>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-12">
               <div className="bg-neutral-900/60 p-12 rounded-[4rem] border border-white/5 shadow-2xl">
                  <h2 className="text-3xl font-black italic text-amber-500 mb-10 tracking-tighter">⚙️ {t[lang].adminTitle}</h2>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-6">
                      <input type="text" placeholder="Stran / Şarkı" className="bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500" />
                      <input type="text" placeholder="Hunermend / Sanatçı" className="bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500" />
                    </div>
                    <div className="h-48 bg-black/40 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-neutral-500 text-xs">
                       <span className="text-4xl mb-4">📤</span> MP3 & Görsel Sürükle
                    </div>
                    <button onClick={() => alert('Başarılı!')} className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest">{t[lang].save}</button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/95 border-t border-white/5 h-24 px-8 backdrop-blur-xl flex items-center">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
