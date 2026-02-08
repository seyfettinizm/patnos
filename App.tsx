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
    <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", paddingBottom: currentSong ? '130px' : '40px' }}>
      
      {/* NAV BAR */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {settings.logo && <img src={settings.logo} style={{ height: '45px', borderRadius: '50%', border: '2px solid orange' }} alt="Logo" />}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '800', fontSize: '16px', color: 'orange', letterSpacing: '1px' }}>İZMİR PATNOSLULAR</span>
            <span style={{ fontSize: '10px', color: '#888' }}>DERNEĞİ RESMİ PORTALI</span>
          </div>
        </div>
        <button onClick={() => { setIsAdmin(!isAdmin); setIsAuth(false); }} style={{ background: '#111', border: '1px solid #333', color: 'orange', padding: '10px 15px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>
          {isAdmin ? '🏠' : '🔐'}
        </button>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        {isAdmin ? (
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            {!isAuth ? (
              <form onSubmit={handleAdminLogin} style={{ textAlign: 'center', marginTop: '100px', background: '#111', padding: '50px', borderRadius: '30px', border: '1px solid #222' }}>
                <h2 style={{ color: 'orange', marginBottom: '30px' }}>Yönetici Kilidini Aç</h2>
                <input type="password" placeholder="Şifrenizi Giriniz" value={passInput} onChange={e => setPassInput(e.target.value)} style={inputStyle} required />
                <button type="submit" style={{ width: '100%', padding: '15px', background: 'linear-gradient(45deg, orange, #ff4500)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>YÖNETİME GİRİŞ YAP</button>
              </form>
            ) : (
              <div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
                   <h2 style={{color:'orange'}}>Yönetim Merkezi</h2>
                   <button onClick={() => setIsAdmin(false)} style={{padding:'10px 20px', background:'#333', color:'#fff', border:'none', borderRadius:'10px', cursor:'pointer'}}>Anasayfaya Dön</button>
                </div>

                <section style={{ background: '#111', padding: '25px', borderRadius: '20px', marginBottom: '25px', border: '1px solid #222' }}>
                  <h4 style={{ color: 'orange', marginTop: 0 }}>🖼️ Görsel ve Başlık Ayarları</h4>
                  <label style={labelStyle}>Logo URL (Kare/Daire Resim)</label>
                  <input placeholder="https://..." value={settings.logo} onChange={e => setSettings({...settings, logo: e.target.value})} style={inputStyle} />
                  <label style={labelStyle}>Banner URL (Geniş Resim)</label>
                  <input placeholder="https://..." value={settings.banner} onChange={e => setSettings({...settings, banner: e.target.value})} style={inputStyle} />
                  <button onClick={() => saveAll(songs, settings)} style={{ background: '#2ecc71', color: '#fff', padding: '12px', width: '100%', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>GÖRSELLERİ KAYDET</button>
                </section>

                <section style={{ background: '#111', padding: '25px', borderRadius: '20px', marginBottom: '25px', border: '1px solid #222' }}>
                  <h4 style={{ color: 'orange', marginTop: 0 }}>🎵 {editId ? 'Eseri Düzenle' : 'Yeni Eser Yükle'}</h4>
                  <form onSubmit={handleAddOrUpdate}>
                    <input placeholder="Eser Adı" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} required />
                    <input placeholder="Sanatçı İsmi" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} style={inputStyle} required />
                    <input placeholder="MP3 Linki" value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={inputStyle} required />
                    <input placeholder="Kapak Resmi URL" value={form.cover} onChange={e => setForm({...form, cover: e.target.value})} style={inputStyle} />
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                      {categories.filter(c => c !== "Hepsi").map(c => <option key={c}>{c}</option>)}
                    </select>
                    <button type="submit" style={{ background: 'orange', padding: '15px', width: '100%', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>{editId ? 'DEĞİŞİKLİKLERİ YAYINLA' : 'ESERİ LİSTEYE EKLE'}</button>
                  </form>
                </section>

                <section style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
                   <h4 style={{ color: 'orange', marginTop: 0 }}>📋 Eserleri Yönet (Düzenle/Sil)</h4>
                   {songs.map(song => (
                    <div key={song.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #222', alignItems:'center' }}>
                      <span>{song.title} - <small style={{color:'#666'}}>{song.artist}</small></span>
                      <div>
                        <button onClick={() => { setForm(song); setEditId(song.id); window.scrollTo(0,0); }} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', marginRight: '8px', cursor: 'pointer' }}>✎</button>
                        <button onClick={() => deleteSong(song.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            )}
          </div>
        ) : (
          /* ANA SAYFA TASARIMI */
          <div>
            {/* ÖZEL BAŞLIK ALANI */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ margin: '0 0 10px 0', fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: '900', letterSpacing: '2px' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, orange)', flex: 1, maxWidth: '150px' }}></div>
                <span style={{ color: 'orange', fontSize: '18px', fontWeight: '600', letterSpacing: '5px', textTransform: 'uppercase' }}>Müzik Kutusu</span>
                <div style={{ height: '2px', background: 'linear-gradient(to left, transparent, orange)', flex: 1, maxWidth: '150px' }}></div>
              </div>
            </div>

            {/* BANNER */}
            <div style={{ height: '350px', borderRadius: '35px', position: 'relative', overflow: 'hidden', marginBottom: '30px', background: `linear-gradient(to bottom, transparent, #080808), url(${settings.banner || 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad'}) center/cover`, boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
              <div style={{ position: 'absolute', bottom: '30px', left: '30px', right: '30px' }}>
                <span style={{ background: 'orange', color: '#000', padding: '4px 12px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>GÜNCEL ARŞİV</span>
                <h2 style={{ fontSize: '32px', margin: '10px 0' }}>Patnos'un Ezgileri İzmir'de Yankılanıyor</h2>
              </div>
            </div>

            {/* KATEGORİLER */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '25px', scrollbarWidth: 'none' }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => {setActiveTab(cat); setCurrentSongIndex(null);}}
                  style={{ 
                    padding: '12px 25px', borderRadius: '30px', border: 'none', whiteSpace: 'nowrap', cursor: 'pointer',
                    background: activeTab === cat ? 'orange' : '#151515',
                    color: activeTab === cat ? '#000' : '#fff',
                    fontWeight: 'bold', transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: activeTab === cat ? '0 10px 20px rgba(255,165,0,0.3)' : 'none'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* ŞARKI LİSTESİ */}
            <div style={{ display: 'grid', gap: '15px', maxWidth: '1000px', margin: '0 auto' }}>
              {filteredSongs.map((song, index) => (
                <div key={song.id} 
                     onClick={() => setCurrentSongIndex(index)}
                     style={{ 
                       background: currentSongIndex === index ? '#1a1a1a' : '#111', 
                       padding: '15px 25px', borderRadius: '22px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer',
                       border: currentSongIndex === index ? '1px solid orange' : '1px solid transparent',
                       transition: '0.3s'
                     }}>
                  <img src={song.cover || 'https://via.placeholder.com/60'} style={{ width: '60px', height: '60px', borderRadius: '15px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: currentSongIndex === index ? 'orange' : '#fff' }}>{song.title}</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>{song.artist} • <span style={{color:'orange'}}>{song.category}</span></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleLike(song.id)} style={{ background: 'none', border: 'none', color: likedSongs.includes(song.id) ? '#ff4757' : '#444', cursor: 'pointer', fontSize: '18px', display:'flex', alignItems:'center', gap:5 }}>
                      ❤️ <span style={{fontSize:14}}>{song.likes || 0}</span>
                    </button>
                    <a href={song.url} download style={{ color: '#444', textDecoration: 'none', fontSize: '20px' }}>📥</a>
                  </div>
                </div>
              ))}
            </div>

            {/* İLETİŞİM BÖLÜMÜ */}
            <section style={{ marginTop: '80px', borderTop: '1px solid #1a1a1a', paddingTop: '60px' }}>
               <div style={{textAlign:'center', marginBottom:'40px'}}>
                  <h2 style={{color:'orange', fontSize:'28px', marginBottom:'10px'}}>Bize Gönderin</h2>
                  <p style={{color:'#888', maxWidth:'600px', margin:'0 auto'}}>Tozlu raflarda bekleyen kayıtlarınızı, eski dengbêj arşivlerinizi ve eserlerinizi bize ulaştırın; Patnos'un sesini tüm dünya duysun!</p>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                  {/* ADRES KUTUSU */}
                  <div className="contact-card" style={contactCardStyle}>
                    <div style={{fontSize:'30px', marginBottom:'15px'}}>📍</div>
                    <h4 style={{margin:'0 0 10px 0', color:'orange'}}>Adresimiz</h4>
                    <p style={{fontSize:'14px', lineHeight:'1.6', color:'#ccc'}}>Yeşilbağlar Mahallesi 637/33 Sok. No: 25 Buca / İzmir</p>
                  </div>

                  {/* WHATSAPP KUTUSU */}
                  <a href="https://wa.me/905052250655" target="_blank" style={{textDecoration:'none'}} className="contact-card">
                    <div style={{...contactCardStyle, border:'1px solid #25d366'}}>
                      <div style={{fontSize:'30px', marginBottom:'15px'}}>💬</div>
                      <h4 style={{margin:'0 0 10px 0', color:'#25d366'}}>WhatsApp İletişim</h4>
                      <p style={{fontSize:'18px', fontWeight:'bold', color:'#fff'}}>0505 225 06 55</p>
                      <small style={{color:'#25d366'}}>Tıkla, Mesaj Gönder</small>
                    </div>
                  </a>

                  {/* E-POSTA KUTUSU */}
                  <div className="contact-card" style={contactCardStyle}>
                    <div style={{fontSize:'30px', marginBottom:'15px'}}>📧</div>
                    <h4 style={{margin:'0 0 10px 0', color:'orange'}}>E-Posta</h4>
                    <p style={{fontSize:'16px', fontWeight:'bold', color:'#fff'}}>patnosumuz@gmail.com</p>
                  </div>
               </div>
            </section>
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: '20px', left: '5%', right: '5%', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', padding: '20px 30px', borderRadius: '30px', border: '1px solid rgba(255,165,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000, boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
            <img src={currentSong.cover} style={{ width: '55px', height: '55px', borderRadius: '12px', border:'1px solid orange' }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'orange', whiteSpace: 'nowrap' }}>{currentSong.title}</div>
              <div style={{ fontSize: '13px', color: '#fff' }}>{currentSong.artist}</div>
            </div>
          </div>
          <audio ref={audioRef} src={currentSong.url} autoPlay onEnded={onSongEnd} controls style={{ filter: 'invert(1)', width: '45%' }} />
          <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer', marginLeft: '20px' }}>✕</button>
        </div>
      )}

      {/* CSS HOVER EFFECT SIMULATION */}
      <style>{`
        .contact-card { transition: all 0.3s ease; cursor: pointer; }
        .contact-card:hover { transform: translateY(-10px); background: #1a1a1a !important; border-color: orange !important; box-shadow: 0 15px 30px rgba(255,165,0,0.1); }
      `}</style>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '14px', marginBottom: '15px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '12px', outline: 'none', boxSizing: 'border-box' as 'border-box' };
const labelStyle = { fontSize: '12px', color: '#666', marginBottom: '5px', display: 'block' };
const contactCardStyle = { background: '#111', padding: '30px', borderRadius: '25px', textAlign: 'center' as 'center', border: '1px solid #222', height:'100%', boxSizing:'border-box' as 'border-box' };
