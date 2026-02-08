import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    logo: '', banner: '', title: 'Patnos Müzik', subTitle: "Patnos'un Sesi"
  });
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
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

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === "Mihriban04") {
      setIsAuth(true);
      setPassInput("");
    } else {
      alert("Hatalı Şifre!");
    }
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editId) {
      updated = songs.map(s => s.id === editId ? { ...form, id: editId, likes: s.likes || 0 } : s);
      alert("Şarkı Güncellendi!");
    } else {
      updated = [{ ...form, id: Date.now(), likes: 0 }, ...songs];
      alert("Yeni Şarkı Eklendi!");
    }
    setSongs(updated);
    saveAll(updated);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    setEditId(null);
  };

  const deleteSong = (id: number) => {
    if(window.confirm("Bu şarkıyı kalıcı olarak silmek istediğinize emin misiniz?")) {
      const updated = songs.filter(s => s.id !== id);
      setSongs(updated);
      saveAll(updated);
    }
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

  const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", paddingBottom: currentSong ? '120px' : '20px' }}>
      
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {settings.logo && <img src={settings.logo} style={{ height: '40px', width: '40px', borderRadius: '50%', border: '2px solid orange', objectFit: 'cover' }} />}
          <span style={{ fontWeight: '800', fontSize: '18px', color: 'orange' }}>{settings.title}</span>
        </div>
        <button onClick={() => { setIsAdmin(!isAdmin); setIsAuth(false); }} style={{ background: 'orange', border: 'none', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isAdmin ? '🏠 ANA SAYFAYA DÖN' : '🔐 YÖNETİCİ PANELİ'}
        </button>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        {isAdmin ? (
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            {!isAuth ? (
              <form onSubmit={handleAdminLogin} style={{ textAlign: 'center', marginTop: '100px', background: '#111', padding: '40px', borderRadius: '20px', border: '1px solid #222' }}>
                <h2 style={{ color: 'orange' }}>Yönetici Girişi</h2>
                <input type="password" placeholder="Şifreyi Girin" value={passInput} onChange={e => setPassInput(e.target.value)} style={inputStyle} required />
                <button type="submit" style={{ width: '100%', padding: '15px', background: 'orange', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>PANELİ AÇ</button>
              </form>
            ) : (
              <div>
                {/* GENEL AYARLAR */}
                <section style={{ background: '#111', padding: '25px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #222' }}>
                  <h3 style={{ color: 'orange', marginTop: 0 }}>🖼️ Genel Görsel Ayarları</h3>
                  <div style={{marginBottom: '15px'}}>
                    <label style={{fontSize: '12px', color: '#888'}}>DÜZENLENECEK LOGO URL</label>
                    <input placeholder="https://...png" value={settings.logo} onChange={e => setSettings({...settings, logo: e.target.value})} style={inputStyle} />
                  </div>
                  <div style={{marginBottom: '15px'}}>
                    <label style={{fontSize: '12px', color: '#888'}}>DÜZENLENECEK BANNER URL</label>
                    <input placeholder="https://...jpg" value={settings.banner} onChange={e => setSettings({...settings, banner: e.target.value})} style={inputStyle} />
                  </div>
                  <input placeholder="Site Başlığı" value={settings.title} onChange={e => setSettings({...settings, title: e.target.value})} style={inputStyle} />
                  <input placeholder="Alt Slogan" value={settings.subTitle} onChange={e => setSettings({...settings, subTitle: e.target.value})} style={inputStyle} />
                  <button onClick={() => {saveAll(songs, settings); alert("Ayarlar Güncellendi!");}} style={{ background: '#2ecc71', color: '#fff', padding: '12px', width: '100%', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>GÖRSELLERİ VE METİNLERİ KAYDET</button>
                </section>

                {/* ŞARKI EKLEME FORMU */}
                <section style={{ background: '#111', padding: '25px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #222' }}>
                  <h3 style={{ color: 'orange', marginTop: 0 }}>🎵 {editId ? 'Şarkıyı Güncelle' : 'Yeni Şarkı Ekle'}</h3>
                  <form onSubmit={handleAddOrUpdate}>
                    <input placeholder="Şarkı Adı" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} required />
                    <input placeholder="Sanatçı" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} style={inputStyle} required />
                    <input placeholder="Ses (MP3) URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={inputStyle} required />
                    <input placeholder="Şarkı Kapağı URL" value={form.cover} onChange={e => setForm({...form, cover: e.target.value})} style={inputStyle} />
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                      <option>Patnoslu Sanatçılar</option>
                      <option>Dengbêjler</option>
                      <option>Patnos Türküleri</option>
                      <option>Sizden Gelenler</option>
                    </select>
                    <button type="submit" style={{ background: 'orange', padding: '15px', width: '100%', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>{editId ? 'DEĞİŞİKLİKLERİ KAYDET' : 'ŞARKIYI YAYINLA'}</button>
                    {editId && <button onClick={() => {setEditId(null); setForm({title:'', artist:'', url:'', cover:'', category:'Patnoslu Sanatçılar'});}} style={{ width: '100%', background: '#333', marginTop: '10px', border: 'none', padding: '10px', borderRadius: '10px', color: '#fff' }}>VAZGEÇ</button>}
                  </form>
                </section>

                {/* DÜZENLENECEK/SİLİNECEK ŞARKI LİSTESİ */}
                <section style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
                  <h3 style={{ color: 'orange', marginTop: 0 }}>📋 Mevcut Şarkı Listesi (Düzenle/Sil)</h3>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {songs.map(song => (
                      <div key={song.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #222' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{song.title}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{song.artist}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => { setForm(song); setEditId(song.id); window.scrollTo(0,0); }} style={{ background: '#3498db', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>DÜZENLE</button>
                          <button onClick={() => deleteSong(song.id)} style={{ background: '#e74c3c', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>SİL</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        ) : (
          /* ANA SAYFA GÖRÜNÜMÜ */
          <div>
            <div style={{ height: '350px', borderRadius: '30px', position: 'relative', overflow: 'hidden', marginBottom: '40px', background: `linear-gradient(to bottom, transparent, #050505), url(${settings.banner || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9'}) center/cover`, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ position: 'absolute', bottom: '40px', left: '40px' }}>
                <h1 style={{ fontSize: 'clamp(28px, 5vw, 55px)', margin: 0, fontWeight: '900' }}>{settings.title}</h1>
                <p style={{ color: 'orange', fontWeight: '600', fontSize: '20px' }}>{settings.subTitle}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {songs.map((song, index) => (
                <div key={song.id} 
                     onClick={() => setCurrentSongIndex(index)}
                     style={{ 
                       background: currentSongIndex === index ? '#1a1a1a' : '#111', 
                       padding: '15px 25px', borderRadius: '20px', 
                       display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer',
                       border: currentSongIndex === index ? '1px solid orange' : '1px solid transparent',
                       transition: '0.3s ease'
                     }}>
                  <img src={song.cover || 'https://via.placeholder.com/60'} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: currentSongIndex === index ? 'orange' : '#fff' }}>{song.title}</div>
                    <div style={{ fontSize: '14px', color: '#777' }}>{song.artist} • <span style={{color: '#999'}}>{song.category}</span></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleLike(song.id)} style={{ background: 'none', border: 'none', color: likedSongs.includes(song.id) ? '#ff4757' : '#444', cursor: 'pointer', fontSize: '20px' }}>
                      ♥ {song.likes || 0}
                    </button>
                    <a href={song.url} download target="_blank" style={{ color: '#444', textDecoration: 'none', fontSize: '22px' }}>⬇️</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODERN DİNAMİK PLAYER */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: '20px', left: '5%', right: '5%', background: 'rgba(15,15,15,0.9)', backdropFilter: 'blur(20px)', padding: '20px 30px', borderRadius: '30px', border: '1px solid rgba(255,165,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000, boxShadow: '0 25px 50px rgba(0,0,0,0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
            <img src={currentSong.cover} style={{ width: '55px', height: '55px', borderRadius: '12px', border: '1px solid orange' }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'orange', whiteSpace: 'nowrap' }}>{currentSong.title}</div>
              <div style={{ fontSize: '13px', color: '#fff' }}>{currentSong.artist}</div>
            </div>
          </div>
          <audio ref={audioRef} src={currentSong.url} autoPlay onEnded={onSongEnd} controls style={{ filter: 'invert(1)', width: '45%', height: '40px' }} />
          <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer', marginLeft: '15px' }}>✕</button>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '14px', marginBottom: '15px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '12px', outline: 'none', boxSizing: 'border-box' as 'border-box' };
