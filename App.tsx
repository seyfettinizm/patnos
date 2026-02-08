import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    logo: '', banner: '', title: 'Patnos Müzik', subTitle: "Patnos'un Sesi"
  });
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Dengbêjler' });
  const [likedSongs, setLikedSongs] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setSettings(data.value.settings || settings);
      }
      const localLikes = JSON.parse(localStorage.getItem('patnos_likes') || '[]');
      setLikedSongs(localLikes);
    };
    load();
  }, []);

  const saveAll = async (newSongs: any[], newSettings = settings) => {
    await supabase.from('settings').update({ value: { songs: newSongs, settings: newSettings } }).eq('id', 'app_data');
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editId) {
      updated = songs.map(s => s.id === editId ? { ...form, id: editId, likes: s.likes || 0 } : s);
    } else {
      updated = [{ ...form, id: Date.now(), likes: 0 }, ...songs];
    }
    setSongs(updated);
    saveAll(updated);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Dengbêjler' });
    setEditId(null);
  };

  const handleLike = (id: number) => {
    if (likedSongs.includes(id)) return;
    const updated = songs.map(s => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s);
    const newLikes = [...likedSongs, id];
    setSongs(updated);
    setLikedSongs(newLikes);
    localStorage.setItem('patnos_likes', JSON.stringify(newLikes));
    saveAll(updated);
  };

  const deleteSong = (id: number) => {
    const updated = songs.filter(s => s.id !== id);
    setSongs(updated);
    saveAll(updated);
  };

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* ÜST BAR */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {settings.logo && <img src={settings.logo} style={{ height: '40px', borderRadius: '50%' }} />}
          <span style={{ fontWeight: 'bold', color: 'orange' }}>{settings.title}</span>
        </div>
        <button onClick={() => setIsAdmin(!isAdmin)} style={{ background: 'orange', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isAdmin ? 'SİTEYE DÖN' : 'YÖNETİM'}
        </button>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        {isAdmin ? (
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <section style={{ background: '#111', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
              <h3>🎨 Site Görünümü</h3>
              <input placeholder="Logo URL" value={settings.logo} onChange={e => setSettings({...settings, logo: e.target.value})} style={inputStyle} />
              <input placeholder="Banner URL" value={settings.banner} onChange={e => setSettings({...settings, banner: e.target.value})} style={inputStyle} />
              <input placeholder="Ana Başlık" value={settings.title} onChange={e => setSettings({...settings, title: e.target.value})} style={inputStyle} />
              <input placeholder="Alt Başlık" value={settings.subTitle} onChange={e => setSettings({...settings, subTitle: e.target.value})} style={inputStyle} />
              <button onClick={() => saveAll(songs, settings)} style={{ background: 'green', color: '#fff', padding: '10px', width: '100%', border: 'none', borderRadius: '5px' }}>AYARLARI KAYDET</button>
            </section>

            <section style={{ background: '#111', padding: '20px', borderRadius: '15px' }}>
              <h3>🎵 {editId ? 'Şarkıyı Düzenle' : 'Yeni Şarkı Ekle'}</h3>
              <form onSubmit={handleAddOrUpdate}>
                <input placeholder="Şarkı Adı" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} required />
                <input placeholder="Sanatçı" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} style={inputStyle} required />
                <input placeholder="Ses (MP3) URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={inputStyle} required />
                <input placeholder="Kapak Resmi URL" value={form.cover} onChange={e => setForm({...form, cover: e.target.value})} style={inputStyle} />
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                  <option>Dengbêjler</option><option>Patnos Türküleri</option><option>Sizden Gelenler</option>
                </select>
                <button type="submit" style={{ background: 'orange', padding: '12px', width: '100%', border: 'none', fontWeight: 'bold' }}>{editId ? 'GÜNCELLE' : 'LİSTEYE EKLE'}</button>
              </form>
            </section>
          </div>
        ) : (
          <div>
            {/* BANNER AREA */}
            <div style={{ height: '300px', borderRadius: '25px', position: 'relative', overflow: 'hidden', marginBottom: '30px', background: `linear-gradient(transparent, #000), url(${settings.banner || 'https://images.unsplash.com/photo-1514525253344-991c0555b082'}) center/cover` }}>
              <div style={{ position: 'absolute', bottom: '30px', left: '30px' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 48px)', margin: 0 }}>{settings.title}</h1>
                <p style={{ color: '#ccc' }}>{settings.subTitle}</p>
              </div>
            </div>

            {/* SONG LIST */}
            <div style={{ display: 'grid', gap: '15px' }}>
              {songs.map(song => (
                <div key={song.id} style={{ background: '#111', padding: '15px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                  <img src={song.cover || 'https://via.placeholder.com/60'} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <div style={{ fontWeight: 'bold' }}>{song.title}</div>
                    <div style={{ fontSize: '13px', color: '#777' }}>{song.artist} • <span style={{ color: 'orange' }}>{song.category}</span></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => handleLike(song.id)} style={{ background: 'none', border: 'none', color: likedSongs.includes(song.id) ? 'red' : '#fff', cursor: 'pointer', fontSize: '18px' }}>
                      ❤️ {song.likes || 0}
                    </button>
                    <a href={song.url} download target="_blank" style={{ color: '#fff', textDecoration: 'none', fontSize: '20px' }}>📥</a>
                    <button onClick={() => setCurrentSong(song)} style={{ background: 'orange', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}>▶</button>
                    {isAdmin && (
                      <>
                        <button onClick={() => { setForm(song); setEditId(song.id); }} style={{ background: 'blue', color: '#fff', border: 'none', padding: '5px' }}>Düzenle</button>
                        <button onClick={() => deleteSong(song.id)} style={{ background: 'red', color: '#fff', border: 'none', padding: '5px' }}>Sil</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.95)', padding: '20px', borderTop: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000, flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={currentSong.cover} style={{ width: '40px', height: '40px', borderRadius: '5px' }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentSong.title}</div>
              <div style={{ fontSize: '12px', color: '#777' }}>{currentSong.artist}</div>
            </div>
          </div>
          <audio src={currentSong.url} autoPlay controls style={{ filter: 'invert(1)', maxWidth: '100%' }} />
          <button onClick={() => setCurrentSong(null)} style={{ background: 'none', color: '#fff', border: 'none' }}>✖</button>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '5px', boxSizing: 'border-box' as 'border-box' };
