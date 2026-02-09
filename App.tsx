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

  const audioRef = useRef<HTMLAudioElement>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });

  useEffect(() => { 
    loadData();
    // Aplikasyon başlığı için
    document.title = config.title;
  }, [config.title]);

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

  // --- 🛡️ 2026-02-09 KORUMALI YÖNETİM PANELİ ---
  const handleSaveSong = async () => {
    const audio = new Audio(); audio.src = form.url;
    audio.onloadedmetadata = async () => {
      const min = Math.floor(audio.duration / 60);
      const sec = Math.floor(audio.duration % 60);
      const duration = `${min}:${sec < 10 ? '0' : ''}${sec}`;
      let updatedSongs = editingId 
        ? songs.map(s => s.id === editingId ? { ...form, id: editingId, duration, likes: s.likes || 0 } : s)
        : [{ ...form, id: Date.now(), duration, likes: 0 }, ...songs];
      await syncDB(updatedSongs);
      setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
      setEditingId(null);
      alert("Başarıyla Kaydedildi!");
    };
  };

  // --- 🎵 PLAYER & OTOMATİK GEÇİŞ SİSTEMİ (KORUMALI) ---
  const playSong = (song: any) => {
    if (currentSong?.id === song.id) {
      if (audioRef.current?.paused) audioRef.current.play(); else audioRef.current?.pause();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = song.url;
          audioRef.current.load();
          audioRef.current.play().catch(() => {});
        }
      }, 50);
    }
  };

  const handleNextSong = () => {
    const list = songs
      .filter(s => (activeTab === "Hepsi" || s.category === activeTab))
      .sort((a,b) => (b.likes || 0) - (a.likes || 0));
    const idx = list.findIndex(s => s.id === currentSong?.id);
    if (idx !== -1 && idx < list.length - 1) playSong(list[idx + 1]);
    else setIsPlaying(false);
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

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', paddingBottom: currentSong ? '180px' : '40px', fontFamily: 'sans-serif' }}>
      
      <header style={{ padding: '25px', textAlign: 'center' }}>
        {config.logo && <img src={config.logo} style={{ width: '65px', margin: '0 auto 10px', display: 'block', borderRadius: '15px' }} />}
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{config.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '8px' }}>
          <span style={{ color: 'orange', fontSize: '10px', letterSpacing: '3px', fontWeight: 'bold' }}>MÜZİK KUTUSU</span>
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
                <button onClick={() => syncDB(songs, config)} style={saveBtnS}>AYARLARI KAYDET</button>
                <div style={{marginTop:'30px', paddingTop:'20px', borderTop:'1px solid #222'}}>
                  <input placeholder="Şarkı Adı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                  <input placeholder="Müzik URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                  <button onClick={handleSaveSong} style={saveBtnS}>KAYDET</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveTab(cat)} style={activeTab === cat ? activeTabS : tabBtnS}>{cat}</button>
                ))}
                <button onClick={() => setView('contact')} style={{ ...tabBtnS, borderColor: 'orange', color: 'orange' }}>📞 İletişim</button>
             </div>
             <input placeholder="🔍 Listede Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />
             <div style={{ marginTop: '20px' }}>
                {songs.filter(s => (activeTab === "Hepsi" || s.category === activeTab) && (s.title.toLowerCase().includes(searchTerm.toLowerCase()))).sort((a,b) => (b.likes || 0) - (a.likes || 0)).map(s => (
                  <div key={s.id} onClick={() => playSong(s)} style={{...songCardS, borderColor: currentSong?.id === s.id ? 'orange' : '#111'}}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={s.cover || config.logo} style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.title}</div>
                    </div>
                    <button onClick={(e) => forceDownload(e, s.url, s.title)} style={{background:'none', border:'none', fontSize:'18px'}}>📥</button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {currentSong && (
        <div style={playerBarS}>
          <div style={{maxWidth: '600px', margin: 'auto'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px'}}>
              <img src={currentSong.cover || config.logo} style={{width:'40px', height:'40px', borderRadius:'5px'}} />
              <div style={{flex:1, color:'orange', fontWeight:'bold', fontSize:'14px', overflow:'hidden', whiteSpace:'nowrap'}}>{currentSong.title}</div>
              <button onClick={() => audioRef.current?.paused ? audioRef.current.play() : audioRef.current?.pause()} style={{background:'orange', border:'none', borderRadius:'50%', width:'35px', height:'35px'}}>{isPlaying ? 'II' : '▶'}</button>
            </div>
            <audio ref={audioRef} src={currentSong.url} onEnded={handleNextSong} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} controls style={{width:'100%', height:'32px', filter:'invert(1)'}} />
          </div>
        </div>
      )}
    </div>
  );
}

// STİLLER (KORUNMUŞ)
const navBtn = { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange' };
const inputS = { padding: '12px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '10px', width: '100%', marginBottom: '10px' };
const saveBtnS = { background: 'orange', color: '#000', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };
const searchBarS = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '15px', color: '#fff', outline: 'none' };
const tabBtnS = { background: '#111', color: '#666', border: '1px solid #222', padding: '12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' };
const activeTabS = { ...tabBtnS, background: 'orange', color: '#000', borderColor: 'orange' };
const songCardS = { background: '#080808', padding: '10px 15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', border: '1px solid #111', cursor: 'pointer' };
const playerBarS = { position: 'fixed' as 'fixed', bottom: 0, width: '100%', background: 'rgba(5,5,5,0.95)', padding: '15px 20px', borderTop: '2px solid orange', zIndex: 1000 };
const contactBoxS = { background: '#0a0a0a', padding: '15px', borderRadius: '12px', border: '1px solid #222', fontSize: '14px' };
