import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [view, setView] = useState<'home' | 'admin' | 'contact'>('home');
  const [isAuth, setIsAuth] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [config, setConfig] = useState({ logo: '', banner: '', title: 'İZMİR PATNOSLULAR DERNEĞİ' });
  const [searchTerm, setSearchTerm] = useState("");
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // --- AKILLI YÜKLEME ASİSTANI ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });

  useEffect(() => { 
    loadData();
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    });

    const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isApple && !isStandalone) {
      setIsIOS(true);
      setShowInstallBanner(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
    if (data?.value) {
      setSongs(data.value.songs || []);
      setConfig(data.value.config || { logo: '', banner: '', title: 'İZMİR PATNOSLULAR DERNEĞİ' });
    }
  };

  const syncDB = async (newSongs: any[], newConfig = config) => {
    await supabase.from('settings').update({ value: { songs: newSongs, config: newConfig } }).eq('id', 'app_data');
    setSongs(newSongs);
    setConfig(newConfig);
  };

  // --- TAMİR EDİLEN KAYDETME FONKSİYONU ---
  const handleSaveSong = async () => {
    if (!form.title || !form.url) {
      alert("Lütfen en azından Şarkı Adı ve URL alanlarını doldurun!");
      return;
    }

    const saveProcess = async (duration = "0:00") => {
      let updatedSongs = editingId 
        ? songs.map(s => s.id === editingId ? { ...form, id: editingId, duration, likes: s.likes || 0 } : s)
        : [{ ...form, id: Date.now(), duration, likes: 0 }, ...songs];
      
      await syncDB(updatedSongs);
      setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
      setEditingId(null);
      alert("İşlem Başarılı!");
    };

    const audio = new Audio();
    audio.src = form.url;
    
    const timeout = setTimeout(() => {
      saveProcess("Süre Belirsiz");
    }, 3000);

    audio.onloadedmetadata = () => {
      clearTimeout(timeout);
      const min = Math.floor(audio.duration / 60);
      const sec = Math.floor(audio.duration % 60);
      const duration = `${min}:${sec < 10 ? '0' : ''}${sec}`;
      saveProcess(duration);
    };

    audio.onerror = () => {
      clearTimeout(timeout);
      saveProcess("Hatalı Link");
    };
  };

  const playSong = (song: any) => {
    if (currentSong?.id === song.id) {
      if (audioRef.current?.paused) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.load();
          audioRef.current.play().catch(e => console.error("Oynatma hatası:", e));
        }
      }, 50);
    }
  };

  const handleNextSong = () => {
    const list = songs
      .filter(s => (activeTab === "Hepsi" || s.category === activeTab))
      .sort((a,b) => (b.likes || 0) - (a.likes || 0));
    const idx = list.findIndex(s => s.id === currentSong?.id);
    if (idx !== -1 && idx < list.length - 1) {
      playSong(list[idx + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  const forceDownload = async (e: any, url: string, title: string) => {
    e.stopPropagation();
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${title}.mp3`;
      a.click();
    } catch { window.open(url, '_blank'); }
  };

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  const allFilteredSongs = songs
    .filter(s => (activeTab === "Hepsi" || s.category === activeTab) && (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.artist.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a,b) => (b.likes || 0) - (a.likes || 0));

  const displayedSongs = showAll ? allFilteredSongs : allFilteredSongs.slice(0, 8);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', paddingBottom: currentSong ? '180px' : '40px', fontFamily: 'sans-serif' }}>
      
      {showInstallBanner && (
        <div style={{ background: 'orange', color: '#000', padding: '15px 20px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px', borderBottom: '2px solid #000' }}>
          {isIOS ? (
            <span>📲 Yüklemek için alttaki <b>Paylaş (⬆️)</b> simgesine dokunun ve <b>"Ana Ekrana Ekle"</b> deyin.</span>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Patnos Müzik cebinize gelsin!</span>
              <button onClick={handleInstallClick} style={{ background: '#000', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '5px', fontSize: '12px', fontWeight:'bold' }}>YÜKLE</button>
            </div>
          )}
          <button onClick={() => setShowInstallBanner(false)} style={{ position: 'absolute', right: '10px', top: isIOS ? '45px' : '15px', background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold' }}>✕</button>
        </div>
      )}

      <header style={{ padding: '25px', textAlign: 'center' }}>
        {config.logo && <img src={config.logo} style={{ width: '65px', margin: '0 auto 10px', display: 'block' }} />}
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{config.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '8px' }}>
          <div style={{ height: '2px', width: '35px', background: 'linear-gradient(to right, transparent, orange)' }}></div>
          <span style={{ color: 'orange', fontSize: '10px', letterSpacing: '3px', fontWeight: 'bold' }}>MÜZİK KUTUSU</span>
          <div style={{ height: '2px', width: '35px', background: 'linear-gradient(to left, transparent, orange)' }}></div>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: 'auto', padding: '0 15px' }}>
        
        {view === 'admin' ? (
          <div style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
              <div>
                <input placeholder="Logo URL" value={config.logo} onChange={e=>setConfig({...config, logo:e.target.value})} style={inputS}/>
                <input placeholder="Banner URL" value={config.banner} onChange={e=>setConfig({...config, banner:e.target.value})} style={inputS}/>
                <button onClick={() => syncDB(songs, config)} style={saveBtnS}>AYARLARI KAYDET</button>
                <div style={{marginTop:'30px', paddingTop:'20px', borderTop:'1px solid #222'}}>
                  <input placeholder="Şarkı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                  <input placeholder="Sanatçı" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} style={inputS}/>
                  <input placeholder="URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                  <input placeholder="Kapak" value={form.cover} onChange={e=>setForm({...form, cover:e.target.value})} style={inputS}/>
                  <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={inputS}>
                    {categories.filter(c=>c!=="Hepsi").map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleSaveSong} style={saveBtnS}>KAYDET</button>
                </div>
                <div style={{marginTop: '30px'}}>
                  <input placeholder="🔍 Listede Ara..." style={{...inputS, borderColor: 'orange'}} onChange={(e) => setAdminSearchTerm(e.target.value)} />
                  {songs.filter(s => s.title.toLowerCase().includes(adminSearchTerm.toLowerCase())).map(s => (
                    <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #222'}}>
                      <span>{s.title}</span>
                      <div>
                        <button onClick={() => {setEditingId(s.id); setForm(s); window.scrollTo(0,0);}} style={{color:'orange', marginRight:'10px', background:'none', border:'none'}}>DÜZENLE</button>
                        <button onClick={() => syncDB(songs.filter(i=>i.id!==s.id))} style={{color:'red', background:'none', border:'none'}}>SİL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : view === 'contact' ? (
          <div>
            <div style={{ background: '#111', padding: '30px', borderRadius: '25px', border: '1px solid orange', textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'orange', margin: 0 }}>Gönül Köprümüz</h3>
              <p style={{ fontSize: '14px', fontStyle: 'italic', marginTop: '10px' }}>Müziklerinizi ulaştırın, yayınlayalım!</p>
            </div>
            <div style={contactBoxS}>📍 <b>Adres:</b> Yeşilbağlar Mh. 637/33 Sk. NO:25 Buca/İZMİR</div>
            <div style={contactBoxS}>📧 <b>E-Posta:</b> patnosumuz@gmail.com</div>
            <div style={{ ...contactBoxS, color: '#25D366' }}>🟢 <b>WhatsApp:</b> +90 505 225 06 55</div>
            <button onClick={() => setView('home')} style={{ ...saveBtnS, marginTop: '20px', background: '#222', color: '#fff' }}>GERİ DÖN</button>
          </div>
        ) : (
          <div>
             {config.banner && <div style={{ width: '100%', height: '170px', borderRadius: '18px', overflow: 'hidden', marginBottom: '20px' }}><img src={config.banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => {setActiveTab(cat); setShowAll(false);}} style={activeTab === cat ? activeTabS : tabBtnS}>{cat}</button>
                ))}
                <button onClick={() => setView('contact')} style={{ ...tabBtnS, borderColor: 'orange', color: 'orange' }}>📞 İletişim</button>
             </div>
             <input placeholder="🔍 Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />
             <div style={{ marginTop: '20px' }}>
                {displayedSongs.map(s => (
                  <div key={s.id} onClick={() => playSong(s)} style={{...songCardS, borderColor: currentSong?.id === s.id ? 'orange' : '#111'}}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={s.cover || config.logo} style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
                      <div><div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.title}</div><div style={{ color: '#555', fontSize: '11px' }}>{s.artist}</div></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{color:'#666', fontSize:'11px'}}>{s.duration}</span>
                      <button onClick={(e) => {e.stopPropagation(); syncDB(songs.map(i=>i.id===s.id?{...i,likes:(i.likes||0)+1}:i));}} style={{background:'none', border:'none', color:'red', cursor:'pointer'}}>❤️ {s.likes || 0}</button>
                      <button onClick={(e) => forceDownload(e, s.url, s.title)} style={{background:'none', border:'none', fontSize:'18px', cursor:'pointer'}}>📥</button>
                    </div>
                  </div>
                ))}
             </div>

             {!showAll && allFilteredSongs.length > 8 && (
                <button onClick={() => setShowAll(true)} style={{...saveBtnS, background: 'none', border: '1px solid orange', color: 'orange', marginTop: '10px'}}>
                  👇 Tümünü Gör ({allFilteredSongs.length} Şarkı)
                </button>
             )}
             {showAll && (
                <button onClick={() => setShowAll(false)} style={{...saveBtnS, background: 'none', border: '1px solid #222', color: '#666', marginTop: '10px'}}>
                  👆 Daha Az Göster
                </button>
             )}
          </div>
        )}
      </main>

      {currentSong && (
        <div style={playerBarS}>
          <div style={{maxWidth: '600px', margin: 'auto'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px'}}>
              <img src={currentSong.cover || config.logo} style={{width:'40
