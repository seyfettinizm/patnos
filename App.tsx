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
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [settings, setSettings] = useState({
    logo: '', banner: '', title: 'Patnos Müzik', subTitle: "Patnos'un Sesi"
  });
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

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
    if (currentSongIndex !== null && currentSongIndex < filteredSongs.length - 1) {
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
    } else {
      updated = [{ ...form, id: Date.now(), likes: 0 }, ...songs];
    }
    setSongs(updated);
    saveAll(updated);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    setEditId(null);
    alert("İşlem Başarılı!");
  };

  const deleteSong = (id: number) => {
    if(window.confirm("Silinsin mi?")) {
      const updated = songs.filter(s => s.id !== id);
      setSongs(updated);
      saveAll(updated);
    }
  };

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);
  const currentSong = currentSongIndex !== null ? filteredSongs[currentSongIndex] : null;

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: currentSong ? '120px' : '20px' }}>
      
      {/* HEADER: Minimalist Yönetici Girişi */}
      <nav style={{ padding: '10px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {settings.logo && <img src={settings.logo} style={{ height: '35px', borderRadius: '50%' }} />}
          <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'orange' }}>{settings.title}</span>
        </div>
        <button onClick={() => { setIsAdmin(!isAdmin); setIsAuth(false); }} style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '8px 12px', borderRadius: '12px', cursor: 'pointer' }}>
          {isAdmin ? '🏠' : '🔐'}
        </button>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        {isAdmin ? (
          <div style={{ maxWidth: '600px', margin: 'auto' }}>
            {!isAuth ? (
              <form onSubmit={handleAdminLogin} style={{ textAlign: 'center', marginTop: '50px', background: '#111', padding: '30px', borderRadius: '20px' }}>
                <h2 style={{ color: 'orange' }}>Panel Kilidini Aç</h2>
                <input type="password" placeholder="Şifre" value={passInput} onChange={e => setPassInput(e.target.value)} style={inputStyle} required />
                <button type="submit" style={{ width: '100%', padding: '12px', background: 'orange', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>GİRİŞ</button>
              </form>
            ) : (
              <div>
                <section style={{ background: '#111', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
                  <h3 style={{ color: 'orange' }}>⚙️ Görsel Ayarlar</h3>
                  <input placeholder="Logo URL" value={settings.logo} onChange={e => setSettings({...settings, logo: e.target.value})} style={inputStyle} />
                  <input placeholder="Banner URL" value={settings.banner} onChange={e => setSettings({...settings, banner: e.target.value})} style={inputStyle} />
                  <input placeholder="Başlık" value={settings.title} onChange={e => setSettings({...settings, title: e.target.value})} style={inputStyle} />
                  <button onClick={() => saveAll(songs, settings)} style={{ background: 'green', color: '#fff', padding: '10px', width: '100%', border: 'none', borderRadius: '5px' }}>KAYDET</button>
                </section>

                <section style={{ background: '#111', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
                  <h3 style={{ color: 'orange' }}>🎵 {editId ? 'Düzenle' : 'Ekle'}</h3>
                  <form onSubmit={handleAddOrUpdate}>
                    <input placeholder="Şarkı Adı" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} required />
                    <input placeholder="Sanatçı" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} style={inputStyle} required />
                    <input placeholder="Ses URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={inputStyle} required />
                    <input placeholder="Kapak URL" value={form.cover} onChange={e => setForm({...form, cover: e.target.value})} style={inputStyle} />
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                      {categories.filter(c => c !== "Hepsi").map(c => <option key={c}>{c}</option>)}
                    </select>
                    <button type="submit" style={{ background: 'orange', padding: '12px', width: '100%', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>{editId ? 'KAYDET' : 'YAYINLA'}</button>
                  </form>
                </section>

                <section style={{ background: '#111', padding: '20px', borderRadius: '15px' }}>
                  <h3 style={{ color: 'orange' }}>📋 Liste Yönetimi</h3>
                  {songs.map(song => (
                    <div key={song.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222' }}>
                      <span>{song.title}</span>
                      <div>
                        <button onClick={() => { setForm(song); setEditId(song.id); window.scrollTo(0,0); }} style={{ background: 'blue', color: '#fff', border: 'none', padding: '4px 8px', marginRight: '5px' }}>✎</button>
                        <button onClick={() => deleteSong(song.id)} style={{ background: 'red', color: '#fff', border: 'none', padding: '4px 8px' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* BANNER */}
            <div style={{ height: '250px', borderRadius: '25px', position: 'relative', overflow: 'hidden', marginBottom: '25px', background: `linear-gradient(transparent, #000), url(${settings.banner || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9'}) center/cover` }}>
              <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                <h1 style={{ margin: 0, fontSize: '32px' }}>{settings.title}</h1>
              </div>
            </div>

            {/* KATEGORİ BUTONLARI */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => {setActiveTab(cat); setCurrentSongIndex(null);}}
                  style={{ 
                    padding: '10px 20px', borderRadius: '20px', border: 'none', whiteSpace: 'nowrap', cursor: 'pointer',
                    background: activeTab === cat ? 'orange' : '#111',
                    color: activeTab === cat ? '#000' : '#fff',
                    fontWeight: 'bold', transition: '0.3s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* ŞARKI LİSTESİ */}
            <div style={{ display: 'grid', gap: '10px' }}>
              {filteredSongs.map((song, index) => (
                <div key={song.id} 
                     onClick={() => setCurrentSongIndex(index)}
                     style={{ 
                       background: currentSongIndex === index ? '#1a1a1a' : '#111', 
                       padding: '12px 18px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer',
                       border: currentSongIndex === index ? '1px solid orange' : '1px solid transparent'
                     }}>
                  <img src={song.cover || 'https://via.placeholder.com/50'} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: currentSongIndex === index ? 'orange' : '#fff' }}>{song.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{song.artist}</div>
                  </div>
                  <a href={song.url} download onClick={e => e.stopPropagation()} style={{ color: '#444', textDecoration: 'none', fontSize: '20px' }}>⬇️</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: '15px', left: '5%', right: '5%', background: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(10px)', padding: '15px', borderRadius: '25px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1000 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <img src={currentSong.cover} style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>{currentSong.title}</div>
              <div style={{ fontSize: '12px', color: 'orange' }}>{currentSong.artist}</div>
            </div>
          </div>
          <audio ref={audioRef} src={currentSong.url} autoPlay onEnded={onSongEnd} controls style={{ filter: 'invert(1)', width: '50%' }} />
          <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'none', border: 'none', color: '#555', marginLeft: '10px' }}>✕</button>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '12px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '10px', boxSizing: 'border-box' as 'border-box' };
