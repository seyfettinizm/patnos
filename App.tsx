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
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Dengbêjler' });
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  // Otomatik Geçiş Mantığı
  const onSongEnd = () => {
    if (currentSongIndex !== null && currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(null);
    }
  };

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

  const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, sans-serif", paddingBottom: currentSong ? '120px' : '20px' }}>
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {settings.logo && <img src={settings.logo} style={{ height: '45px', width: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid orange' }} />}
          <span style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '1px', color: 'orange', textTransform: 'uppercase' }}>{settings.title}</span>
        </div>
        <button onClick={() => setIsAdmin(!isAdmin)} style={{ background: 'linear-gradient(45deg, orange, #ff4500)', border: 'none', padding: '10px 20px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', color: '#000', boxShadow: '0 4px 15px rgba(255,165,0,0.3)' }}>
          {isAdmin ? '🏠 SİTEYE DÖN' : '⚙️ PANEL'}
        </button>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        {isAdmin ? (
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <section style={{ background: '#111', padding: '25px', borderRadius: '20px', marginBottom: '25px', border: '1px solid #222' }}>
              <h3 style={{ color: 'orange', marginTop: 0 }}>🎨 Görsel Ayarlar</h3>
              <input placeholder="Logo URL" value={settings.logo} onChange={e => setSettings({...settings, logo: e.target.value})} style={inputStyle} />
              <input placeholder="Banner URL" value={settings.banner} onChange={e => setSettings({...settings, banner: e.target.value})} style={inputStyle} />
              <input placeholder="Ana Başlık" value={settings.title} onChange={e => setSettings({...settings, title: e.target.value})} style={inputStyle} />
              <input placeholder="Alt Başlık" value={settings.subTitle} onChange={e => setSettings({...settings, subTitle: e.target.value})} style={inputStyle} />
              <button onClick={() => saveAll(songs, settings)} style={{ background: '#2ecc71', color: '#fff', padding: '12px', width: '100%', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>GÜNCELLEMELERİ KAYDET</button>
            </section>

            <section style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
              <h3 style={{ color: 'orange', marginTop: 0 }}>🎵 {editId ? 'Düzenle' : 'Yeni Ekle'}</h3>
              <form onSubmit={handleAddOrUpdate}>
                <input placeholder="Şarkı Adı" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} required />
                <input placeholder="Sanatçı" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} style={inputStyle} required />
                <input placeholder="Ses (MP3) URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={inputStyle} required />
                <input placeholder="Kapak Resmi URL" value={form.cover} onChange={e => setForm({...form, cover: e.target.value})} style={inputStyle} />
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                  <option>Dengbêjler</option><option>Patnos Türküleri</option><option>Sizden Gelenler</option>
                </select>
                <button type="submit" style={{ background: 'orange', padding: '15px', width: '100%', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>{editId ? 'GÜNCELLE' : 'YAYINLA'}</button>
              </form>
            </section>
          </div>
        ) : (
          <div>
            <div style={{ height: '350px', borderRadius: '30px', position: 'relative', overflow: 'hidden', marginBottom: '40px', background: `linear-gradient(to bottom, transparent, #050505), url(${settings.banner || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745'}) center/cover`, boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
              <div style={{ position: 'absolute', bottom: '40px', left: '40px' }}>
                <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', margin: 0, fontWeight: '900', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>{settings.title}</h1>
                <p style={{ color: 'orange', fontSize: '20px', fontWeight: '500' }}>{settings.subTitle}</p>
              </div>
            </div>

            <h2 style={{ marginBottom: '25px', fontSize: '24px', letterSpacing: '1px' }}>HİT PARÇALAR</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {songs.map((song, index) => (
                <div key={song.id} 
                     onClick={() => setCurrentSongIndex(index)}
                     style={{ 
                       background: currentSongIndex === index ? '#1a1a1a' : '#111', 
                       padding: '12px 20px', 
                       borderRadius: '18px', 
                       display: 'flex', 
                       alignItems: 'center', 
                       gap: '20px', 
                       cursor: 'pointer',
                       border: currentSongIndex === index ? '1px solid orange' : '1px solid transparent',
                       transition: '0.3s ease'
                     }}>
                  <img src={song.cover || 'https://via.placeholder.com/60'} style={{ width: '55px', height: '55px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '17px', color: currentSongIndex === index ? 'orange' : '#fff' }}>{song.title}</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>{song.artist} • {song.category}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={(e) => { e.stopPropagation(); handleLike(song.id); }} style={{ background: 'none', border: 'none', color: likedSongs.includes(song.id) ? '#ff4757' : '#444', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      ♥ <span style={{fontSize: '14px'}}>{song.likes || 0}</span>
                    </button>
                    <a href={song.url} download onClick={e => e.stopPropagation()} style={{ color: '#444', textDecoration: 'none', fontSize: '20px' }}>⬇</a>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={(e) => { e.stopPropagation(); setForm(song); setEditId(song.id); }} style={{ background: '#3498db', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>✎</button>
                        <button onClick={(e) => { e.stopPropagation(); deleteSong(song.id); }} style={{ background: '#e74c3c', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>✕</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODERN DİNAMİK PLAYER */}
      {currentSong && (
        <div style={{ 
          position: 'fixed', bottom: '20px', left: '5%', right: '5%', 
          background: 'rgba(15, 15, 15, 0.85)', 
          backdropFilter: 'blur(20px)', 
          padding: '15px 30px', 
          borderRadius: '25px', 
          border: '1px solid rgba(255,165,0,0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          zIndex: 1000, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
            <img src={currentSong.cover} style={{ width: '50px', height: '50px', borderRadius: '12px', boxShadow: '0 0 15px rgba(255,165,0,0.3)' }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'orange' }}>{currentSong.title}</div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>{currentSong.artist}</div>
            </div>
          </div>
          
          <audio 
            ref={audioRef}
            src={currentSong.url} 
            autoPlay 
            onEnded={onSongEnd}
            controls 
            style={{ filter: 'invert(1) hue-rotate(180deg)', width: '40%', height: '35px' }} 
          />

          <div style={{ flex: 1, textAlign: 'right' }}>
            <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '14px', marginBottom: '15px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '10px', fontSize: '14px', outline: 'none' };
