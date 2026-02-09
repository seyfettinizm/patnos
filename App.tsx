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

  // Gelişmiş Form State
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
    alert("Başarıyla Eklendi!");
  };

  const handleDelete = async (id: number) => {
    if(confirm("Silmek istediğinize emin misiniz?")) {
      const updated = songs.filter(s => s.id !== id);
      await syncDB(updated);
    }
  };

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  const filteredSongs = songs.filter(s => {
    const matchesSearch = (s.title?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim()) || 
                          (s.artist?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim());
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
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '120px' }}>
      
      {/* ÜST LOGO VE BAŞLIK */}
      <header style={{ padding: '40px 20px', textAlign: 'center' }}>
        <img src="https://docdtizfqeolqwwfaiyi.supabase.co/storage/v1/object/public/songs/logo.png" style={{ width: '80px', marginBottom: '10px' }} alt="Logo" />
        <h1 style={{ color: '#fff', fontSize: '26px', margin: '5px 0', fontWeight: 'bold' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <p style={{ color: 'orange', fontSize: '13px', letterSpacing: '4px', fontWeight: 'bold' }}>— MÜZİK KUTUSU —</p>
        
        <nav style={{ marginTop: '20px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button style={navBtn}>İletişim</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </nav>
      </header>

      <main style={{ maxWidth: '800px', margin: 'auto', padding: '0 20px' }}>
        {view === 'admin' ? (
          /* TAM YÖNETİM PANELİ */
          <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre Giriniz..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
              <div>
                <h2 style={{color: 'orange', marginBottom: '20px'}}>Yeni Şarkı Ekle</h2>
                <div style={{display: 'grid', gap: '10px'}}>
                  <input placeholder="Şarkı Adı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                  <input placeholder="Sanatçı" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} style={inputS}/>
                  <input placeholder="Müzik URL (mp3)" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                  <input placeholder="Kapak Resmi URL" value={form.cover} onChange={e=>setForm({...form, cover:e.target.value})} style={inputS}/>
                  <input placeholder="Süre (örn: 3:25)" value={form.duration} onChange={e=>setForm({...form, duration:e.target.value})} style={inputS}/>
                  <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={inputS}>
                    {categories.filter(c => c !== "Hepsi").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAdd} style={{background: 'orange', color: '#000', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'}}>KAYDET</button>
                </div>
                <div style={{marginTop: '40px'}}>
                  {songs.map(s => (
                    <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:'15px', borderBottom:'1px solid #222', alignItems:'center'}}>
                      <span>{s.title} - {s.artist}</span>
                      <button onClick={() => handleDelete(s.id)} style={{color:'red', background:'none', border:'none', cursor:'pointer'}}>SİL</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ANA SAYFA (GÖRSEL 2 + ARAMA) */
          <div>
            <div style={{ width: '100%', height: '220px', borderRadius: '25px', overflow: 'hidden', marginBottom: '25px' }}>
              <img src="https://docdtizfqeolqwwfaiyi.supabase.co/storage/v1/object/public/songs/patnos-manzara.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', marginBottom: '25px', paddingBottom: '10px' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} style={activeTab === cat ? {color:'orange', background:'none', border:'none', fontWeight:'bold', fontSize:'16px'} : {color:'#555', background:'none', border:'none', fontSize:'16px'}}>{cat}</button>
              ))}
            </div>

            <input placeholder="🔍 Şarkı veya Sanatçı Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />

            <div style={{ marginTop: '25px' }}>
              {filteredSongs.map(s => (
                <div key={s.id} onClick={() => playSong(s)} style={songCardS}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={s.cover || "https://docdtizfqeolqwwfaiyi.supabase.co/storage/v1/object/public/songs/logo.png"} style={{ width: '55px', height: '55px', borderRadius: '10px' }} />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{s.title}</div>
                      <div style={{ color: '#666', fontSize: '13px' }}>Söz Müzik: {s.artist}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{color:'#333', fontSize:'13px'}}>{s.duration}</span>
                    <span style={{color:'red'}}>❤️ {s.likes || 0}</span>
                    <a href={s.url} download onClick={e => e.stopPropagation()} style={{textDecoration:'none', color:'#007bff'}}>📥</a>
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
          <div style={{textAlign:'center', marginBottom: '10px'}}>
            <span style={{color:'orange', fontWeight:'bold'}}>{currentSong.title}</span> - {currentSong.artist}
          </div>
          <audio ref={audioRef} controls autoPlay style={{width:'100%', height:'35px'}} onEnded={() => {
            const index = songs.findIndex(s => s.id === currentSong.id);
            if(index < songs.length - 1) playSong(songs[index + 1]);
          }} />
        </div>
      )}
    </div>
  );
}

// STİLLER
const navBtn = { background: 'none', border: 'none', color: '#888', cursor: 'pointer', margin: '0 15px', fontSize: '15px' };
const activeNav = { ...navBtn, color: '#fff', borderBottom: '2px solid orange', paddingBottom: '5px' };
const inputS = { padding: '15px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '12px', outline: 'none' };
const searchBarS = { width: '100%', padding: '15px 20px', background: '#111', border: '1px solid #222', borderRadius: '15px', color: '#fff', outline: 'none' };
const songCardS = { background: '#0a0a0a', padding: '15px 20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', border: '1px solid #111', cursor: 'pointer' };
const playerBarS = { position: 'fixed' as 'fixed', bottom: 0, width: '100%', background: '#050505', padding: '20px', borderTop: '2px solid orange', zIndex: 1000 };
