import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

function App() {
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
    const timeout = setTimeout(() => { saveProcess("Süre Belirsiz"); }, 3000);
    audio.onloadedmetadata = () => {
      clearTimeout(timeout);
      const min = Math.floor(audio.duration / 60);
      const sec = Math.floor(audio.duration % 60);
      const duration = `${min}:${sec < 10 ? '0' : ''}${sec}`;
      saveProcess(duration);
    };
    audio.onerror = () => { clearTimeout(timeout); saveProcess("Hatalı Link"); };
  };

  const playSong = (song: any) => {
    if (currentSong?.id === song.id) {
      if (audioRef.current?.paused) { audioRef.current.play().catch(() => {}); setIsPlaying(true); } 
      else { audioRef.current?.pause(); setIsPlaying(false); }
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
    const list = songs.filter(s => (activeTab === "Hepsi" || s.category === activeTab)).sort((a,b) => (b.likes || 0) - (a.likes || 0));
    const idx = list.findIndex(s => s.id === currentSong?.id);
    if (idx !== -1 && idx < list.length - 1) { playSong(list[idx + 1]); } 
    else { setIsPlaying(false); }
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
  const allFilteredSongs = songs.filter(s => (activeTab === "Hepsi" || s.category === activeTab) && (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.artist.toLowerCase().includes(searchTerm.toLowerCase()))).sort((a,b) => (b.likes || 0) - (a.likes || 0));
  const displayedSongs = showAll ? allFilteredSongs : allFilteredSongs.slice(0, 8);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', paddingBottom: currentSong ? '180px' : '40px', fontFamily: 'sans-serif' }}>
      {showInstallBanner && (
        <div style={{ background: 'orange', color: '#000', padding: '15px 20px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px', borderBottom: '2px solid #000' }}>
          {isIOS ? <span>📲 Yüklemek için alttaki Paylaş simgesine dokunun ve "Ana Ekrana Ekle" deyin.</span> : <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Patnos Müzik cebinize gelsin!</span><button onClick={handleInstallClick} style={{ background: '#000', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '5px' }}>YÜKLE</button></div>}
          <button onClick={() => setShowInstallBanner(false)} style={{ position: 'absolute', right: '10px', top: '15px', background: 'none', border: 'none' }}>✕</button>
        </div>
      )}
      <header style={{ padding: '25px', textAlign: 'center' }}>
        {config.logo && <img src={config.logo} style={{ width: '65px', margin: '0 auto 10px', display: 'block' }} alt="Logo" />}
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>{config.title}</h1>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </div>
      </header>
      <main style={{ maxWidth: '600px', margin: 'auto', padding: '0 15px' }}>
        {view === 'admin' ? (
          <div style={{ background: '#111', padding: '25px', borderRadius: '20px' }}>
            {!isAuth ? <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} /> : (
              <div>
                <input placeholder="Logo URL" value={config.logo} onChange={e=>setConfig({...config, logo:e.target.value})} style={inputS}/><button onClick={() => syncDB(songs, config)} style={saveBtnS}>AYARLARI KAYDET</button>
                <div style={{marginTop:'30px', paddingTop:'20px', borderTop:'1px solid #222'}}>
                  <input placeholder="Şarkı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                  <input placeholder="URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                  <button onClick={handleSaveSong} style={saveBtnS}>KAYDET</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>{categories.map(cat => <button key={cat} onClick={() => setActiveTab(cat)} style={activeTab === cat ? activeTabS : tabBtnS}>{cat}</button>)}</div>
             <input placeholder="🔍 Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />
             <div style={{ marginTop: '20px' }}>{displayedSongs.map(s => (<div key={s.id} onClick={() => playSong(s)} style={{...songCardS, borderColor: currentSong?.id === s.id ? 'orange' : '#111'}}><span>{s.title}</span><button onClick={(e) => forceDownload(e, s.url, s.title)}>📥</button></div>))}</div>
          </div>
        )}
      </main>
      {currentSong && (
        <div style={playerBarS}>
          <audio ref={audioRef} src={currentSong.url} onEnded={handleNextSong} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} controls style={{width:'100%', filter:'invert(1)'}} />
        </div>
      )}
    </div>
  );
}

const navBtn = { background: 'none', border: 'none', color: '#555', fontWeight: 'bold' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange' };
const inputS = { padding: '12px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '10px', width: '100%', marginBottom: '10px' };
const saveBtnS = { background: 'orange', color: '#000', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', width: '100%' };
const searchBarS = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '15px', color: '#fff' };
const tabBtnS = { background: '#111', color: '#666', border: '1px solid #222', padding: '12px', borderRadius: '10px', fontSize: '12px' };
const activeTabS = { ...tabBtnS, background: 'orange', color: '#000', borderColor: 'orange' };
const songCardS = { background: '#080808', padding: '10px 15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', marginBottom: '8px', border: '1px solid #111' };
const playerBarS = { position: 'fixed' as 'fixed', bottom: 0, width: '100%', background: 'rgba(5,5,5,0.95)', padding: '15px 20px', borderTop: '2px solid orange' };

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
