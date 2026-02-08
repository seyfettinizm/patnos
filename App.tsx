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
    logo: '', banner: '', title: 'İzmir Patnoslular Derneği', subTitle: "Müzik Kutusu"
  });
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    alert("Başarıyla Kaydedildi!");
  };

  const deleteSong = (id: number) => {
    if(window.confirm("Bu eseri silmek istediğinize emin misiniz?")) {
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

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);
  const currentSong = currentSongIndex !== null ? filteredSongs[currentSongIndex] : null;

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif", paddingBottom: currentSong ? '130px' : '40px' }}>
      
      {/* ÜST ŞERİT (NAVBAR) */}
      <nav style={{ padding: '12px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {settings.logo && <img src={settings.logo} style={{ height: '38px', borderRadius: '50%', border: '1.5px solid orange' }} alt="Logo" />}
          <span style={{ fontWeight: '800', fontSize: '15px', color: 'orange', letterSpacing: '0.5px' }}>İZMİR PATNOSLULAR DERNEĞİ</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={scrollToContact} style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}>📞</button>
          <button onClick={() => { setIsAdmin(!isAdmin); setIsAuth(false); }} style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}>
            {isAdmin ? '🏠' : '🔐'}
          </button>
        </div>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        {isAdmin ? (
          <div style={{ maxWidth: '750px', margin: 'auto' }}>
            {!isAuth ? (
              <form onSubmit={handleAdminLogin} style={{ textAlign: 'center', marginTop: '100px', background: '#111', padding: '40px', borderRadius: '25px', border: '1px solid #222' }}>
                <h2 style={{ color: 'orange', marginBottom: '20px' }}>Yönetici Girişi</h2>
                <input type="password" placeholder="Şifreniz" value={passInput} onChange={e => setPassInput(e.target.value)} style={inputStyle} required />
                <button type="submit" style={{ width: '100%', padding: '14px', background: 'orange', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>GİRİŞ YAP</button>
              </form>
            ) : (
              <div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                   <h2 style={{color:'orange', margin:0}}>Yönetim Paneli</h2>
                   <button onClick={() => setIsAdmin(false)} style={{padding:'8px 15px', background:'#333', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer'}}>Siteye Dön</button>
                </div>

                {/* AYARLAR */}
                <section style={{ background: '#111', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #222' }}>
                  <h4 style={{ color: 'orange', marginTop: 0 }}>Görsel Ayarları</h4>
                  <label style={labelStyle}>Logo URL</label>
                  <input placeholder="https://..." value={settings.logo} onChange={e => setSettings({...settings, logo: e.target.value})} style={inputStyle} />
                  <label style={labelStyle}>Banner URL</label>
                  <input placeholder="https://..." value={settings.banner} onChange={e => setSettings({...settings, banner: e.target.value})} style={inputStyle} />
                  <button onClick={() => saveAll(songs, settings)} style={{ background: '#27ae60', color: '#fff', padding: '10px', width: '100%', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>GÜNCELLE</button>
                </section>

                {/* ŞARKI EKLE */}
                <section style={{ background: '#111', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #222' }}>
                  <h4 style={{ color: 'orange', marginTop: 0 }}>{editId ? 'Eseri Güncelle' : 'Yeni Eser Ekle'}</h4>
                  <form onSubmit={handleAddOrUpdate}>
                    <input placeholder="Eser Adı" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} required />
                    <input placeholder="Sanatçı" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} style={inputStyle} required />
                    <input placeholder="Ses Linki (MP3)" value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={inputStyle} required />
                    <input placeholder="Kapak Linki" value={form.cover} onChange={e => setForm({...form, cover: e.target.value})} style={inputStyle} />
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                      {categories.filter(c => c !== "Hepsi").map(c => <option key={c}>{c}</option>)}
                    </select>
                    <button type="submit" style={{ background: 'orange', padding: '12px', width: '100%', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>{editId ? 'KAYDET' : 'YAYINLA'}</button>
                  </form>
                </section>

                {/* LİSTE */}
                <section style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' }}>
                   <h4 style={{ color: 'orange', marginTop: 0 }}>Arşiv Yönetimi</h4>
                   {songs.map(song => (
                    <div key={song.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222', alignItems:'center' }}>
                      <span style={{fontSize:'14px'}}>{song.title}</span>
                      <div>
                        <button onClick={() => { setForm(song); setEditId(song.id); window.scrollTo(0,0); }} style={{ background: '#2980b9', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', marginRight: '5px' }}>✎</button>
                        <button onClick={() => deleteSong(song.id)} style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            )}
          </div>
        ) : (
          /* ANA SAYFA */
          <div>
            {/* ÇİZGİLİ MÜZİK KUTUSU BAŞLIĞI */}
            <div style={{ textAlign: 'center', margin: '30px 0 40px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, orange)', flex: 1, maxWidth: '200px' }}></div>
                <span style={{ color: 'orange', fontSize: '24px', fontWeight: '800', letterSpacing: '6px', textTransform: 'uppercase' }}>Müzik Kutusu</span>
                <div style={{ height: '2px', background: 'linear-gradient(to left, transparent, orange)', flex: 1, maxWidth: '200px' }}></div>
              </div>
            </div>

            {/* BANNER */}
            <div style={{ height: '320px', borderRadius: '30px', position: 'relative', overflow: 'hidden', marginBottom: '30px', background: `linear-gradient(to bottom, transparent, #050505), url(${settings.banner || 'https://images.unsplash.com/photo-1514525253344-991c0555b082'}) center/cover` }}>
              <div style={{ position: 'absolute', bottom: '30px', left: '30px' }}>
                <span style={{ background: 'orange', color: '#000', padding: '3px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold' }}>ÖZEL ARŞİV</span>
                <h2 style={{ fontSize: '30px', margin: '8px 0', fontWeight: '800' }}>Patnos'un Sesine Kulak Verin</h2>
              </div>
            </div>

            {/* KATEGORİLER */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => {setActiveTab(cat); setCurrentSongIndex(null);}}
                  style={{ 
                    padding: '10px 22px', borderRadius: '20px', border: 'none', whiteSpace: 'nowrap', cursor: 'pointer',
                    background: activeTab === cat ? 'orange' : '#151515',
                    color: activeTab === cat ? '#000' : '#fff',
                    fontWeight: 'bold', transition: '0.3s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* ŞARKI LİSTESİ */}
            <div style={{ display: 'grid', gap: '12px' }}>
              {filteredSongs.map((song, index) => (
                <div key={song.id} 
                     onClick={() => setCurrentSongIndex(index)}
                     style={{ 
                       background: currentSongIndex === index ? '#121212' : '#0d0d0d', 
                       padding: '14px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer',
                       border: currentSongIndex === index ? '1px solid orange' : '1px solid #1a1a1a'
                     }}>
                  <img src={song.cover || 'https://via.placeholder.com/55'} style={{ width: '55px', height: '55px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: currentSongIndex === index ? 'orange' : '#fff' }}>{song.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{song.artist} • <span style={{color:'#888'}}>{song.category}</span></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleLike(song.id)} style={{ background: 'none', border: 'none', color: likedSongs.includes(song.id) ? 'red' : '#333', cursor: 'pointer', fontSize: '18px' }}>
                      ♥ <span style={{fontSize:'13px'}}>{song.likes || 0}</span>
                    </button>
                    <a href={song.url} download style={{ color: '#333', textDecoration: 'none', fontSize: '18px' }}>⬇️</a>
                  </div>
                </div>
              ))}
            </div>

            {/* İLETİŞİM BÖLÜMÜ */}
            <div ref={contactRef} style={{ marginTop: '80px', borderTop: '1px solid #1a1a1a', paddingTop: '50px' }}>
               <div style={{textAlign:'center', marginBottom:'30px'}}>
                  <h3 style={{color:'orange', fontSize:'24px'}}>Bize Gönderin</h3>
                  <p style={{color:'#666', fontSize:'14px'}}>Tozlu raflarda bekleyen kayıtlarınızı ve eserlerinizi ulaştırın dünya duysun.</p>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div className="card" style={cCard}>
                    <div style={{fontSize:'24px', marginBottom:'10px'}}>📍</div>
                    <h5 style={{margin:'0 0 5px 0', color:'orange'}}>Adres</h5>
                    <p style={{fontSize:'13px', color:'#999'}}>Yeşilbağlar Mah. 637/33 Sok. No:25 Buca/İzmir</p>
                  </div>
                  <a href="https://wa.me/905052250655" target="_blank" style={{textDecoration:'none'}} className="card">
                    <div style={{...cCard, border:'1px solid #25d366'}}>
                      <div style={{fontSize:'24px', marginBottom:'10px'}}>💬</div>
                      <h5 style={{margin:'0 0 5px 0', color:'#25d366'}}>WhatsApp</h5>
                      <p style={{fontSize:'16px', color:'#fff', fontWeight:'bold'}}>0505 225 06 55</p>
                    </div>
                  </a>
                  <div className="card" style={cCard}>
                    <div style={{fontSize:'24px', marginBottom:'10px'}}>📧</div>
                    <h5 style={{margin:'0 0 5px 0', color:'orange'}}>E-Posta</h5>
                    <p style={{fontSize:'14px', color:'#fff'}}>patnosumuz@gmail.com</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: '20px', left: '5%', right: '5%', background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)', padding: '15px 25px', borderRadius: '25px', border: '1px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <img src={currentSong.cover} style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'orange' }}>{currentSong.title}</div>
              <div style={{ fontSize: '12px', color: '#fff' }}>{currentSong.artist}</div>
            </div>
          </div>
          <audio ref={audioRef} src={currentSong.url} autoPlay onEnded={onSongEnd} controls style={{ filter: 'invert(1)', width: '45%' }} />
          <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'none', border: 'none', color: '#444', marginLeft: '10px' }}>✕</button>
        </div>
      )}

      <style>{`
        .card { transition: 0.3s; cursor: pointer; }
        .card:hover { transform: translateY(-5px); background: #1a1a1a !important; border-color: orange !important; }
      `}</style>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '12px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '10px', boxSizing: 'border-box' as 'border-box' };
const labelStyle = { fontSize: '11px', color: '#666', marginBottom: '4px', display: 'block' };
const cCard = { background: '#111', padding: '25px', borderRadius: '20px', textAlign: 'center' as 'center', border: '1px solid #1a1a1a' };
