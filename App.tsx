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

  // --- MÜZİK MOTORU ---
  const playSong = (song: any) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) audioRef.current?.pause();
      else audioRef.current?.play();
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current.play();
      }
    }
  };

  const nextSong = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
    if (currentIndex !== -1 && currentIndex < songs.length - 1) {
      playSong(songs[currentIndex + 1]);
    }
  };

  // --- FİLTRELEME VE 8 ŞARKI SINIRI ---
  const filteredSongs = songs.filter(s => {
    const matchesSearch = (s.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (s.artist?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "Hepsi" || s.category === activeTab;
    return matchesSearch && matchesTab;
  }).slice(0, 8); // Kural 2: Sadece ilk 8 şarkı

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: currentSong ? '160px' : '40px' }}>
      
      {/* MOBİL UYUMLU HEADER */}
      <header style={{ padding: '20px', textAlign: 'center' }}>
        {config.logo && <img src={config.logo} style={{ width: '60px', marginBottom: '10px' }} />}
        <h1 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 'bold' }}>{config.title}</h1>
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: 'auto', padding: '0 15px' }}>
        {view === 'admin' ? (
          /* --- YÖNETİM PANELİ (KORUNDU) --- */
          <div style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
              <div>
                <section style={{ marginBottom: '20px' }}>
                  <input placeholder="Logo URL" value={config.logo} onChange={e=>setConfig({...config, logo:e.target.value})} style={inputS}/>
                  <input placeholder="Banner URL" value={config.banner} onChange={e=>setConfig({...config, banner:e.target.value})} style={inputS}/>
                  <button onClick={() => syncDB(songs, config)} style={saveBtnS}>AYARLARI KAYDET</button>
                </section>
                <input placeholder="Şarkı Adı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                <input placeholder="Sanatçı" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} style={inputS}/>
                <input placeholder="Müzik URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                <button onClick={async () => syncDB([{...form, id:Date.now(), likes:0}, ...songs])} style={saveBtnS}>EKLE</button>
                <div style={{marginTop:'20px'}}>
                  {songs.map(s => (
                    <div key={s.id} style={{padding:'10px', borderBottom:'1px solid #222', display:'flex', justifyContent:'space-between'}}>
                      <span>{s.title}</span>
                      <button onClick={() => syncDB(songs.filter(i=>i.id!==s.id))} style={{color:'red', background:'none', border:'none'}}>SİL</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --- ANA SAYFA (MOBİL UYUMLU VE 8 ŞARKI) --- */
          <div>
            {config.banner && (
              <div style={{ width: '100%', height: '180px', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
                <img src={config.banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '5px', scrollbarWidth: 'none' }}>
              {["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri"].map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} style={activeTab === cat ? activeTabS : tabBtnS}>{cat}</button>
              ))}
            </div>

            <input placeholder="🔍 Şarkı veya Sanatçı Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />

            <div style={{ marginTop: '20px' }}>
              {filteredSongs.map(s => (
                <div key={s.id} onClick={() => playSong(s)} style={{...songCardS, borderColor: currentSong?.id === s.id ? 'orange' : '#111'}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{position:'relative'}}>
                        <img src={s.cover || config.logo} style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
                        {currentSong?.id === s.id && isPlaying && <div className="playing-dot" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{s.title}</div>
                      <div style={{ color: '#555', fontSize: '12px' }}>{s.artist}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{color: '#444', fontSize: '11px'}}>{s.duration || "---"}</span>
                    <a href={s.url} download onClick={e => e.stopPropagation()} style={{textDecoration:'none', fontSize:'18px'}}>📥</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* GÖSTERİŞLİ MÜZİK PLAYER */}
      {currentSong && (
        <div style={playerBarS}>
          <div style={{maxWidth: '600px', margin: 'auto'}}>
            <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'10px'}}>
               <img src={currentSong.cover || config.logo} style={{width:'40px', height:'40px', borderRadius:'5px', border:'1px solid orange'}} />
               <div style={{flex:1, overflow:'hidden'}}>
                 <div style={{whiteSpace:'nowrap', fontWeight:'bold', fontSize:'14px', color:'orange'}}>{currentSong.title}</div>
                 <div style={{fontSize:'12px', color:'#888'}}>{currentSong.artist}</div>
               </div>
               <button onClick={() => setIsPlaying(!isPlaying)} style={{background:'orange', border:'none', borderRadius:'50%', width:'40px', height:'40px', fontWeight:'bold'}}>
                 {isPlaying ? 'II' : '▶'}
               </button>
            </div>
            <audio 
              ref={audioRef} 
              autoPlay 
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={nextSong} 
              controls 
              style={{width:'100%', height:'30px', filter: 'invert(100%) hue-rotate(180deg)'}} 
            />
          </div>
        </div>
      )}

      <style>{`
        .playing-dot { position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; background: orange; border-radius: 50%; border: 2px solid black; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

const navBtn = { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange' };
const inputS = { padding: '12px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '10px', width: '100%', marginBottom: '10px' };
const saveBtnS = { background: 'orange', color: '#000', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };
const searchBarS = { width: '100%', padding: '12px 15px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', color: '#fff', outline: 'none' };
const tabBtnS = { color: '#444', background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' };
const activeTabS = { ...tabBtnS, color: 'orange', fontWeight: 'bold' };
const songCardS = { background: '#080808', padding: '10px 15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', border: '1px solid #111', cursor: 'pointer' };
const playerBarS = { position: 'fixed' as 'fixed', bottom: 0, width: '100%', background: 'rgba(5,5,5,0.95)', backdropFilter:'blur(10px)', padding: '15px 20px', borderTop: '2px solid orange', zIndex: 1000 };
