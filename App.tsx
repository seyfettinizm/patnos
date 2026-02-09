import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [view, setView] = useState<'home' | 'admin'>('home');
  const [isAuth, setIsAuth] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [config, setConfig] = useState({ logo: '', banner: '', title: 'İZMİR PATNOSLULAR DERNEĞİ' });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });

  useEffect(() => { loadData(); }, []);

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

  // --- YÖNETİM PANELİ KORUNAN FONKSİYONLAR ---
  const getDuration = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio(); audio.src = url;
      audio.addEventListener('loadedmetadata', () => {
        const min = Math.floor(audio.duration / 60);
        const sec = Math.floor(audio.duration % 60);
        resolve(`${min}:${sec < 10 ? '0' : ''}${sec}`);
      });
      audio.addEventListener('error', () => resolve("0:00"));
    });
  };

  const handleSaveSong = async () => {
    const duration = await getDuration(form.url);
    let updatedSongs = editingId 
      ? songs.map(s => s.id === editingId ? { ...form, id: editingId, duration, likes: s.likes || 0 } : s)
      : [{ ...form, id: Date.now(), duration, likes: 0 }, ...songs];
    await syncDB(updatedSongs);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    setEditingId(null);
    alert("Başarılı!");
  };

  // --- ANA SAYFA MÜZİK MOTORU ---
  const playSong = (song: any) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) audioRef.current?.pause(); else audioRef.current?.play();
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song); setIsPlaying(true);
      if (audioRef.current) { audioRef.current.src = song.url; audioRef.current.play(); }
    }
  };

  const nextSong = () => {
    const idx = songs.findIndex(s => s.id === currentSong?.id);
    if (idx !== -1 && idx < songs.length - 1) playSong(songs[idx + 1]);
  };

  const filteredSongs = songs.filter(s => {
    const mSearch = (s.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || (s.artist?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const mTab = activeTab === "Hepsi" || s.category === activeTab;
    return mSearch && mTab;
  }).slice(0, 8);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: currentSong ? '140px' : '20px' }}>
      
      <header style={{ padding: '30px 20px', textAlign: 'center' }}>
        {config.logo && <img src={config.logo} style={{ width: '70px', display: 'block', margin: '0 auto 10px' }} />}
        <h1 style={{ color: '#fff', fontSize: '22px', margin: 0, fontWeight: 'bold' }}>{config.title}</h1>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: 'auto', padding: '0 15px' }}>
        {view === 'admin' ? (
          /* KORUNAN YÖNETİM PANELİ */
          <div style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
              <div>
                <h4 style={{color:'orange'}}>Site Ayarları</h4>
                <input placeholder="Logo URL" value={config.logo} onChange={e=>setConfig({...config, logo:e.target.value})} style={inputS}/>
                <input placeholder="Banner URL" value={config.banner} onChange={e=>setConfig({...config, banner:e.target.value})} style={inputS}/>
                <button onClick={() => syncDB(songs, config)} style={saveBtnS}>KAYDET</button>
                <h4 style={{color:'orange', marginTop:'20px'}}>{editingId ? 'Düzenle' : 'Ekle'}</h4>
                <input placeholder="Şarkı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                <input placeholder="URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                <button onClick={handleSaveSong} style={saveBtnS}>ŞARKIYI KAYDET</button>
                <div style={{marginTop:'30px'}}>
                  {songs.map(s => (
                    <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #222'}}>
                      <span>{s.title}</span>
                      <div>
                        <button onClick={() => {setEditingId(s.id); setForm(s);}} style={{color:'orange', marginRight:'10px', background:'none', border:'none'}}>DÜZENLE</button>
                        <button onClick={() => syncDB(songs.filter(i=>i.id!==s.id))} style={{color:'red', background:'none', border:'none'}}>SİL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* GELİŞTİRİLEN ANA SAYFA */
          <div>
            {config.banner && <div style={{ width: '100%', height: '200px', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}><img src={config.banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', scrollbarWidth: 'none' }}>
              {["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri"].map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} style={activeTab === cat ? activeTabS : tabBtnS}>{cat}</button>
              ))}
            </div>
            <input placeholder="🔍 Şarkı veya Sanatçı Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />
            <div style={{ marginTop: '20px' }}>
              {filteredSongs.map(s => (
                <div key={s.id} onClick={() => playSong(s)} style={{...songCardS, borderColor: currentSong?.id === s.id ? 'orange' : '#111'}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={s.cover || config.logo} style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
                    <div><div style={{ fontWeight: 'bold' }}>{s.title}</div><div style={{ color: '#555', fontSize: '12px' }}>{s.artist}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{color:'#444', fontSize:'11px'}}>{s.duration}</span>
                    <a href={s.url} download onClick={e => e.stopPropagation()} style={{textDecoration:'none', fontSize:'20px'}}>📥</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {currentSong && (
        <div style={playerBarS}>
          <div style={{maxWidth: '600px', margin: 'auto', display:'flex', alignItems:'center', gap:'15px'}}>
            <img src={currentSong.cover || config.logo} style={{width:'45px', height:'45px', borderRadius:'8px', border:'1px solid orange'}} />
            <div style={{flex:1, overflow:'hidden'}}>
              <div style={{fontWeight:'bold', color:'orange', fontSize:'14px'}}>{currentSong.title}</div>
              <audio ref={audioRef} autoPlay onEnded={nextSong} onPlay={()=>setIsPlaying(true)} onPause={()=>setIsPlaying(false)} controls style={{width:'100%', height:'30px', marginTop:'5px', filter:'invert(1)'}} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const navBtn = { background: 'none', border: 'none', color: '#555', cursor: 'pointer', margin: '0 12px', fontWeight: 'bold' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange' };
const inputS = { padding: '12px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '10px', width: '100%', marginBottom: '10px' };
const saveBtnS = { background: 'orange', color: '#000', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };
const searchBarS = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #111', borderRadius: '15px', color: '#fff', outline: 'none' };
const tabBtnS = { color: '#444', background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' };
const activeTabS = { ...tabBtnS, color: 'orange', fontWeight: 'bold' };
const songCardS = { background: '#080808', padding: '12px 15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', border: '1px solid #111', cursor: 'pointer' };
const playerBarS = { position: 'fixed' as 'fixed', bottom: 0, width: '100%', background: 'rgba(5,5,5,0.98)', padding: '15px 20px', borderTop: '2px solid orange', zIndex: 1000 };
