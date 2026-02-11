import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// Supabase Bağlantısı
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

  // PWA ve Yükleme Bildirimi
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
    if (isApple && !window.matchMedia('(display-mode: standalone)').matches) {
      setIsIOS(true);
      setShowInstallBanner(true);
    }
  }, []);

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
      alert("Başarıyla Kaydedildi!");
    };

    const audio = new Audio();
    audio.src = form.url;
    const timeout = setTimeout(() => { saveProcess("Süre Belirsiz"); }, 3000);
    audio.onloadedmetadata = () => {
      clearTimeout(timeout);
      const min = Math.floor(audio.duration / 60);
      const sec = Math.floor(audio.duration % 60);
      saveProcess(`${min}:${sec < 10 ? '0' : ''}${sec}`);
    };
    audio.onerror = () => { clearTimeout(timeout); saveProcess("Hatalı Link"); };
  };

  const playSong = (song: any) => {
    if (currentSong?.id === song.id) {
      if (audioRef.current?.paused) { audioRef.current.play(); setIsPlaying(true); } 
      else { audioRef.current?.pause(); setIsPlaying(false); }
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const handleNextSong = () => {
    const list = songs.filter(s => (activeTab === "Hepsi" || s.category === activeTab)).sort((a,b) => (b.likes || 0) - (a.likes || 0));
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
  const allFilteredSongs = songs.filter(s => (activeTab === "Hepsi" || s.category === activeTab) && (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.artist.toLowerCase().includes(searchTerm.toLowerCase()))).sort((a,b) => (b.likes || 0) - (a.likes || 0));
  const displayedSongs = showAll ? allFilteredSongs : allFilteredSongs.slice(0, 8);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', paddingBottom: currentSong ? '180px' : '40px', fontFamily: 'sans-serif' }}>
      
      {/* Üst Bildirim Alanı */}
      {showInstallBanner && (
        <div style={{ background: 'orange', color: '#000', padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>
          {isIOS ? "📲 Paylaş -> Ana Ekrana Ekle yapın." : "Patnos Müzik cebinize gelsin!"}
          <button onClick={() => setShowInstallBanner(false)} style={{ float: 'right', background: 'none', border: 'none', fontWeight: 'bold' }}>✕</button>
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
                <h3 style={{color: 'orange'}}>Uygulama Ayarları</h3>
                <input placeholder="Logo URL" value={config.logo} onChange={e=>setConfig({...config, logo:e.target.value})} style={inputS}/>
                <input placeholder="Banner URL" value={config.banner} onChange={e=>setConfig({...config, banner:e.target.value})} style={inputS}/>
                <button onClick={() => syncDB(songs, config)} style={saveBtnS}>AYARLARI KAYDET</button>
                
                <h3 style={{color: 'orange', marginTop: '30px'}}>Yeni Şarkı Ekle</h3>
                <input placeholder="Şarkı Adı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                <input placeholder="Sanatçı" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} style={inputS}/>
                <input placeholder="MP3 URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                <input placeholder="Kapak Resmi URL" value={form.cover} onChange={e=>setForm({...form, cover:e.target.value})} style={inputS}/>
                <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={inputS}>
                  {categories.filter(c=>c!=="Hepsi").map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={handleSaveSong} style={saveBtnS}>{editingId ? 'GÜNCELLE' : 'LİSTEYE EKLE'}</button>

                <div style={{marginTop: '30px'}}>
                  <input placeholder="🔍 Listede Ara..." style={{...inputS, borderColor: 'orange'}} onChange={(e) => setAdminSearchTerm(e.target.value)} />
                  {songs.filter(s => s.title.toLowerCase().includes(adminSearchTerm.toLowerCase())).map(s => (
                    <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #222'}}>
                      <span>{s.title}</span>
                      <div>
                        <button onClick={() => {setEditingId(s.id); setForm(s); window.scrollTo(0,0);}} style={{color:'orange', marginRight:'10px', background:'none', border:'none'}}>DÜZENLE</button>
                        <button onClick={() => { if(confirm('Silinsin mi?')) syncDB(songs.filter(i=>i.id!==s.id)) }} style={{color:'red', background:'none', border:'none'}}>SİL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : view === 'contact' ? (
          <div style={{textAlign: 'center'}}>
            <div style={{ background: '#111', padding: '30px', borderRadius: '25px', border: '1px solid orange', marginBottom: '20px' }}>
              <h3 style={{ color: 'orange' }}>İletişim Bilgileri</h3>
              <p>📍 Yeşilbağlar Mh. 637/33 Sk. NO:25 Buca/İZMİR</p>
              <p>📧 patnosumuz@gmail.com</p>
              <p style={{color: '#25D366'}}>🟢 WhatsApp: +90 505 225 06 55</p>
            </div>
            <button onClick={() => setView('home')} style={saveBtnS}>GERİ DÖN</button>
          </div>
        ) : (
          <div>
             {config.banner && <img src={config.banner} style={{ width: '100%', height: '170px', borderRadius: '18px', objectFit: 'cover', marginBottom: '20px' }} />}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => {setActiveTab(cat); setShowAll(false);}} style={activeTab === cat ? activeTabS : tabBtnS}>{cat}</button>
                ))}
                <button onClick={() => setView('contact')} style={{ ...tabBtnS, borderColor: 'orange', color: 'orange' }}>📞 İletişim</button>
             </div>
             <input placeholder="🔍 Şarkı veya sanatçı ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />
             <div style={{ marginTop: '20px' }}>
                {displayedSongs.map(s => (
                  <div key={s.id} onClick={() => playSong(s)} style={{...songCardS, borderColor: currentSong?.id === s.id ? 'orange' : '#111'}}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={s.cover || config.logo} style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.title}</div>
                        <div style={{ color: '#555', fontSize: '11px' }}>{s.artist} - {s.duration}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={(e) => {e.stopPropagation(); syncDB(songs.map(i=>i.id===s.id?{...i,likes:(i.likes||0)+1}:i));}} style={{background:'none', border:'none', color:'red'}}>❤️ {s.likes || 0}</button>
                      <button onClick={(e) => forceDownload(e, s.url, s.title)} style={{background:'none', border:'none', fontSize:'18px'}}>📥</button>
                    </div>
                  </div>
                ))}
             </div>
             {!showAll && allFilteredSongs.length > 8 && <button onClick={() => setShowAll(true)} style={{...saveBtnS, background: 'none', border: '1px solid orange', color: 'orange', marginTop: '10px'}}>Tümünü Gör ({allFilteredSongs.length})</button>}
          </div>
        )}
      </main>

      {currentSong && (
        <div style={playerBarS}>
          <div style={{maxWidth: '600px', margin: 'auto'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px'}}>
              <img src={currentSong.cover || config.logo} style={{width:'40px', height:'40px', borderRadius:'5px'}} />
              <div style={{flex:1}}><div style={{fontSize:'14px', color:'orange'}}>{currentSong.title}</div></div>
              <button onClick={() => playSong(currentSong)} style={{background:'orange', border:'none', borderRadius:'50%', width:'35px', height:'35px', fontWeight:'bold'}}>{isPlaying ? 'II' : '▶'}</button>
            </div>
            <audio ref={audioRef} src={currentSong.url} onEnded={handleNextSong} onPlay={()=>setIsPlaying(true)} onPause={()=>setIsPlaying(false)} controls style={{width:'100%', filter:'invert(1)'}} />
          </div>
        </div>
      )}
    </div>
  );
}

const navBtn = { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange' };
const inputS = { padding: '12px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '10px', width: '100%', marginBottom: '10px' };
const saveBtnS = { background: 'orange', color: '#000', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', width: '100%', cursor: 'pointer' };
const searchBarS = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '15px', color: '#fff' };
const tabBtnS = { background: '#111', color: '#666', border: '1px solid #222', padding: '12px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer' };
const activeTabS = { ...tabBtnS, background: 'orange', color: '#000', borderColor: 'orange' };
const songCardS = { background: '#080808', padding: '10px 15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', border: '1px solid #111', cursor: 'pointer' };
const playerBarS = { position: 'fixed' as 'fixed', bottom: 0, width: '100%', background: 'rgba(5,5,5,0.95)', padding: '15px 20px', borderTop: '2px solid orange', zIndex: 1000 };

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
