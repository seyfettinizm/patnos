import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [view, setView] = useState<'home' | 'admin' | 'contact'>('home');
  const [passInput, setPassInput] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [settings, setSettings] = useState({
    logo: '', banner: '', title: 'İzmir Patnoslular Derneği', subTitle: "Müzik Kutusu"
  });
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
  const [guestForm, setGuestForm] = useState({ sender: '', title: '', artist: '', url: '', cover: '' });
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

  const saveAll = async (newSongs: any[], newSettings = settings) => {
    await supabase.from('settings').update({ value: { songs: newSongs, settings: newSettings } }).eq('id', 'app_data');
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSong = { 
      id: Date.now(), 
      title: guestForm.title, 
      artist: `${guestForm.artist} (Gönderen: ${guestForm.sender})`, 
      url: guestForm.url, 
      cover: guestForm.cover || 'https://via.placeholder.com/150', 
      category: 'Sizden Gelenler',
      likes: 0 
    };
    const updated = [newSong, ...songs];
    setSongs(updated);
    saveAll(updated);
    alert("Eseriniz başarıyla ulaştırıldı!");
    setGuestForm({ sender: '', title: '', artist: '', url: '', cover: '' });
    setView('home');
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

  const deleteSong = (id: number) => {
    if(window.confirm("Silmek istediğinize emin misiniz?")) {
      const updated = songs.filter(s => s.id !== id);
      setSongs(updated);
      saveAll(updated);
    }
  };

  const handleLike = (id: number) => {
    if (likedSongs.includes(id)) return;
    const updated = songs.map(s => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s);
    setSongs(updated);
    setLikedSongs([...likedSongs, id]);
    localStorage.setItem('patnos_likes', JSON.stringify([...likedSongs, id]));
    saveAll(updated);
  };

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);
  const currentSong = currentSongIndex !== null ? filteredSongs[currentSongIndex] : null;

  return (
    <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setView('home')}>
          {settings.logo && <img src={settings.logo} style={{ height: '35px', borderRadius: '50%' }} alt="Logo" />}
          <span style={{ fontWeight: '800', fontSize: '14px', color: 'orange' }}>İZMİR PATNOSLULAR DERNEĞİ</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setView('contact')} style={navBtnStyle}>📞</button>
          <button onClick={() => setView('admin')} style={navBtnStyle}>🔐</button>
        </div>
      </nav>

      {/* RENDER VIEWS */}
      <main style={{ padding: '20px 5%', paddingBottom: currentSong ? '140px' : '40px' }}>
        
        {/* VIEW: İLETİŞİM */}
        {view === 'contact' && (
          <div style={{ maxWidth: '900px', margin: 'auto', animation: 'fadeIn 0.4s ease' }}>
            <button onClick={() => setView('home')} style={backBtnStyle}>← Ana Sayfaya Dön</button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={contactBoxStyle}>
                  <h4 style={{ color: 'orange', margin: '0 0 10px 0' }}>ADRES</h4>
                  <p style={{ fontSize: '13px', color: '#ccc' }}>Yeşilbağlar Mah. 637/33 Sok. No:25 Buca/İzmir</p>
                </div>
                <div style={{ ...contactBoxStyle, borderLeft: '4px solid #25d366' }}>
                  <h4 style={{ color: '#25d366', margin: '0 0 5px 0' }}>WHATSAPP</h4>
                  <p style={{ fontSize: '16px', fontWeight: 'bold' }}>0505 225 06 55</p>
                </div>
              </div>
              <div style={{ background: '#111', padding: '30px', borderRadius: '25px', border: '1px solid #222' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>SİZİN ŞARKILARINIZ</h3>
                <form onSubmit={handleGuestSubmit}>
                  <input placeholder="Adınız" value={guestForm.sender} onChange={e => setGuestForm({...guestForm, sender: e.target.value})} style={inputStyle} required />
                  <input placeholder="Eser Adı" value={guestForm.title} onChange={e => setGuestForm({...guestForm, title: e.target.value})} style={inputStyle} required />
                  <input placeholder="Sanatçı" value={guestForm.artist} onChange={e => setGuestForm({...guestForm, artist: e.target.value})} style={inputStyle} required />
                  <input placeholder="Ses Linki (MP3 URL)" value={guestForm.url} onChange={e => setGuestForm({...guestForm, url: e.target.value})} style={inputStyle} required />
                  <button type="submit" style={{ width: '100%', padding: '15px', background: 'orange', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>GÖNDER</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: YÖNETİM */}
        {view === 'admin' && (
          <div style={{ maxWidth: '800px', margin: 'auto', animation: 'fadeIn 0.4s ease' }}>
            <button onClick={() => setView('home')} style={backBtnStyle}>← Ana Sayfaya Dön</button>
            {!isAuth ? (
              <form onSubmit={handleAdminLogin} style={{ textAlign: 'center', marginTop: '60px', background: '#111', padding: '40px', borderRadius: '30px' }}>
                <h2 style={{ color: 'orange' }}>Yönetici Girişi</h2>
                <input type="password" placeholder="Şifrenizi Giriniz" value={passInput} onChange={e => setPassInput(e.target.value)} style={inputStyle} required />
                <button type="submit" style={{ width: '100%', padding: '15px', background: 'orange', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>GİRİŞ</button>
              </form>
            ) : (
              <div style={{ marginTop: '20px' }}>
                <section style={{ background: '#111', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
                  <h3 style={{ color: 'orange', marginTop: 0 }}>Yeni Eser Ekle</h3>
                  <input placeholder="Başlık" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} />
                  <input placeholder="Sanatçı" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} style={inputStyle} />
                  <input placeholder="MP3 URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={inputStyle} />
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                    {categories.filter(c => c !== "Hepsi").map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button onClick={() => {
                    const updated = [{...form, id: Date.now(), likes: 0}, ...songs];
                    setSongs(updated); saveAll(updated); alert("Eklendi!");
                  }} style={{ width: '100%', padding: '12px', background: 'green', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 'bold' }}>LİSTEYE EKLE</button>
                </section>
                <div style={{ background: '#111', padding: '20px', borderRadius: '20px' }}>
                  {songs.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222' }}>
                      <span style={{fontSize:'13px'}}>{s.title}</span>
                      <button onClick={() => deleteSong(s.id)} style={{ background: 'red', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>SİL</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: ANA SAYFA */}
        {view === 'home' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, orange)', flex: 1, maxWidth: '150px' }}></div>
                <span style={{ color: 'orange', fontSize: '20px', fontWeight: '800', letterSpacing: '4px' }}>MÜZİK KUTUSU</span>
                <div style={{ height: '1px', background: 'linear-gradient(to left, transparent, orange)', flex: 1, maxWidth: '150px' }}></div>
              </div>
            </div>

            <div style={{ height: '280px', borderRadius: '30px', background: `linear-gradient(to bottom, transparent, #080808), url(${settings.banner || 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad'}) center/cover`, marginBottom: '30px' }} />

            {/* KATEGORİLER - MOBİL UYUMLU SCROLL */}
            <div style={{ 
              display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', 
              scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' 
            }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveTab(cat)} 
                  style={{ 
                    padding: '10px 22px', borderRadius: '25px', border: 'none', whiteSpace: 'nowrap',
                    background: activeTab === cat ? 'orange' : '#151515',
                    color: activeTab === cat ? '#000' : '#fff',
                    fontWeight: 'bold', cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {filteredSongs.map((song, index) => (
                <div key={song.id} onClick={() => setCurrentSongIndex(index)} style={{ background: currentSongIndex === index ? '#121212' : '#0d0d0d', padding: '12px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', border: currentSongIndex === index ? '1px solid orange' : '1px solid #1a1a1a' }}>
                  <img src={song.cover || 'https://via.placeholder.com/50'} style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: currentSongIndex === index ? 'orange' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{song.artist}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleLike(song.id)} style={{ background: 'none', border: 'none', color: likedSongs.includes(song.id) ? 'red' : '#333', fontSize: '16px' }}>❤️ {song.likes || 0}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: '15px', left: '15px', right: '15px', background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(15px)', padding: '15px', borderRadius: '25px', border: '1px solid orange', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 2000 }}>
          <img src={currentSong.cover} style={{ width: '45px', height: '45px', borderRadius: '10px' }} />
          <audio ref={audioRef} src={currentSong.url} autoPlay onEnded={() => setCurrentSongIndex(null)} controls style={{ filter: 'invert(1)', flex: 1, height: '35px' }} />
          <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'none', border: 'none', color: '#555', fontSize: '18px' }}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        main::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

const navBtnStyle = { background: '#111', border: '1px solid #222', color: '#fff', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' };
const backBtnStyle = { background: 'none', border: 'none', color: 'orange', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '14px', marginBottom: '12px', background: '#000', color: '#fff', border: '1px solid #222', borderRadius: '12px', boxSizing: 'border-box' as 'border-box' };
const contactBoxStyle = { background: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222' };
