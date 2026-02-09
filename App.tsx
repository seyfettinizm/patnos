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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [currentSong, setCurrentSong] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Form State
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', duration: '', category: 'Patnoslu Sanatçılar' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
    if (data?.value) setSongs(data.value.songs || []);
  };

  const syncDB = async (newSongs: any[]) => {
    await supabase.from('settings').update({ value: { songs: newSongs } }).eq('id', 'app_data');
    setSongs(newSongs);
  };

  const handleAdd = async () => {
    const newSong = { ...form, id: Date.now(), likes: 0 };
    const updated = [newSong, ...songs];
    await syncDB(updated);
    setForm({ title: '', artist: '', url: '', cover: '', duration: '', category: 'Patnoslu Sanatçılar' });
  };

  const handleDelete = async (id: number) => {
    if(confirm("Silmek istediğinize emin misiniz?")) {
      const updated = songs.filter(s => s.id !== id);
      await syncDB(updated);
    }
  };

  const filteredSongs = songs.filter(s => {
    const matchesSearch = (s.title?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim());
    const matchesTab = activeTab === "Hepsi" || s.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const playSong = (song: any) => {
    setCurrentSong(song);
    if (audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.play();
    }
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '100px' }}>
      
      {/* HEADER & LOGO */}
      <header style={{ padding: '30px', textAlign: 'center', borderBottom: '1px solid #111' }}>
        <img src="https://docdtizfqeolqwwfaiyi.supabase.co/storage/v1/object/public/songs/logo.png" style={{ width: '60px', display: 'block', margin: '0 auto 10px' }} />
        <h1 style={{ color: '#fff', fontSize: '22px', margin: 0 }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <p style={{ color: 'orange', fontSize: '12px', letterSpacing: '4px', margin: '5px 0' }}>— MÜZİK KUTUSU —</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
        {view === 'admin' ? (
          <div style={{ background: '#111', padding: '30px', borderRadius: '15px' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
              <div>
                <h3 style={{color:'orange'}}>Yeni Şarkı Ekle</h3>
                <div style={{display:'grid', gap:'10px', marginBottom:'30px'}}>
                  <input placeholder="Şarkı Adı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                  <input placeholder="Sanatçı" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} style={inputS}/>
                  <input placeholder="Müzik URL (mp3)" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                  <input placeholder="Süre (örn: 3:45)" value={form.duration} onChange={e=>setForm({...form, duration:e.target.value})} style={inputS}/>
                  <button onClick={handleAdd} style={playBtnS}>KAYDET</button>
                </div>
                <hr style={{borderColor:'#222'}}/>
                {songs.map(s => (
                  <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #222'}}>
                    <span>{s.title} - {s.artist}</span>
                    <button onClick={() => handleDelete(s.id)} style={{color:'red', background:'none', border:'none'}}>SİL</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ width: '100%', height: '200px', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
              <img src="https://docdtizfqeolqwwfaiyi.supabase.co/storage/v1/object/public/songs/patnos-manzara.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', marginBottom: '20px' }}>
              {["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri"].map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} style={activeTab === cat ? {color:'orange', border:'none', background:'none', fontWeight:'bold'} : {color:'#555', border:'none', background:'none'}}>{cat}</button>
              ))}
            </div>

            <input placeholder="🔍 Şarkı veya Sanatçı Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />

            <div style={{ marginTop: '20px' }}>
              {filteredSongs.map(s => (
                <div key={s.id} style={songCardS}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={s.cover || "https://docdtizfqeolqwwfaiyi.supabase.co/storage/v1/object/public/songs/logo.png"} style={{ width: '45px', height: '45px', borderRadius: '5px' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{s.title}</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>{s.artist}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{color:'#444', fontSize:'12px'}}>{s.duration || "3:20"}</span>
                    <span style={{color:'red', fontSize:'14px'}}>❤️ {s.likes || 0}</span>
                    <button onClick={() => playSong(s)} style={playBtnS}>OYNAT</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER PLAYER */}
      {currentSong && (
        <div style={playerBarS}>
          <div style={{fontSize:'14px', fontWeight:'bold', color:'orange'}}>{currentSong.title} çalıyor...</div>
          <audio ref={audioRef} controls autoPlay onEnded={() => { /* sonraki şarkı mantığı buraya */ }} style={{height:'30px'}} />
        </div>
      )}
    </div>
  );
}

// STİLLER
const navBtn = { background: 'none', border: 'none', color: '#555', cursor: 'pointer', margin: '0 10px' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '1px solid orange' };
const inputS = { padding: '12px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '8px' };
const searchBarS = { width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #111', borderRadius: '10px', color: '#fff' };
const songCardS = { background: '#080808', padding: '12px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', border: '1px solid #111' };
const playBtnS = { padding: '6px 15px', borderRadius: '15px', border: '1px solid orange', color: 'orange', background: 'none', cursor: 'pointer', fontSize: '11px' };
const playerBarS = { position: 'fixed' as 'fixed', bottom: 0, width: '100%', background: '#050505', padding: '15px', borderTop: '2px solid orange', display: 'flex', justifyContent: 'space-around', alignItems: 'center' };
