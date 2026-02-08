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
  const [showContact, setShowContact] = useState(false);
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
    alert("Eseriniz başarıyla ulaştırıldı ve listeye eklendi!");
    setGuestForm({ sender: '', title: '', artist: '', url: '', cover: '' });
    setShowContact(false);
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
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", paddingBottom: currentSong ? '140px' : '40px' }}>
      
      {/* NAV BAR */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {settings.logo && <img src={settings.logo} style={{ height: '42px', borderRadius: '50%', border: '2px solid #f39c12' }} alt="Logo" />}
          <span style={{ fontWeight: '800', fontSize: '15px', color: '#f39c12', letterSpacing: '1px' }}>İZMİR PATNOSLULAR DERNEĞİ</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowContact(!showContact)} style={{ background: showContact ? '#f39c12' : '#111', border: 'none', color: showContact ? '#000' : '#fff', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', transition: '0.3s' }}>{showContact ? '✕' : '📞 İletişim'}</button>
          <button onClick={() => { setIsAdmin(!isAdmin); setIsAuth(false); }} style={{ background: '#111', border: '1px solid #333', color: '#f39c12', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer' }}>{isAdmin ? '🏠' : '🔐'}</button>
        </div>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        
        {/* İLETİŞİM VE ŞARKI GÖNDERME BÖLÜMÜ (Görseldeki Tasarım) */}
        {showContact && !isAdmin && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px', animation: 'fadeIn 0.5s ease' }}>
            {/* SOL KOLON: İletişim Kartları */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={contactBoxStyle}>
                <div style={{ fontSize: '24px', background: '#f39c12', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>📍</div>
                <h4 style={{ color: '#f39c12', margin: '0 0 10px 0' }}>İLETİŞİM ADRESİ</h4>
                <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>İzmir Patnoslular Derneği. 637/33 sok. No 25 Yeşilbağlar Mah. Buca/İzmir</p>
              </div>
              <div style={{ ...contactBoxStyle, borderLeft: '4px solid #25d366' }}>
                <h4 style={{ color: '#25d366', margin: '0 0 5px 0', fontSize: '12px' }}>WHATSAPP</h4>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>0505 225 06 55</p>
              </div>
              <div style={{ ...contactBoxStyle, borderLeft: '4px solid #3498db' }}>
                <h4 style={{ color: '#3498db', margin: '0 0 5px 0', fontSize: '12px' }}>E-POSTA</h4>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>patnosumuz@gmail.com</p>
              </div>
            </div>

            {/* SAĞ KOLON: Şarkı Gönder Formu */}
            <div style={{ background: '#111', padding: '40px', borderRadius: '30px', border: '1px solid #222' }}>
              <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '28px' }}>SİZİN ŞARKILARINIZ</h2>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '30px' }}>Arşivimize katkıda bulunun, şarkılarınız platformumuzda yer alsın!</p>
              <form onSubmit={handleGuestSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ gridColumn: 'span 1' }}>
                  <label style={labelStyle}>GÖNDEREN KİŞİ ADI</label>
                  <input placeholder="Adınız" value={guestForm.sender} onChange={e => setGuestForm({...guestForm, sender: e.target.value})} style={inputStyle} required />
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <label style={labelStyle}>ŞARKI ADI</label>
                  <input placeholder="Şarkı Adı" value={guestForm.title} onChange={e => setGuestForm({...guestForm, title: e.target.value})} style={inputStyle} required />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>SÖYLEYEN KİŞİ ADI</label>
                  <input placeholder="Sanatçı" value={guestForm.artist} onChange={e => setGuestForm({...guestForm, artist: e.target.value})} style={inputStyle} required />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>ŞARKI LİNKİ (SES DOSYASI)</label>
                  <input placeholder="https://..." value={guestForm.url} onChange={e => setGuestForm({...guestForm, url: e.target.value})} style={inputStyle} required />
                </div>
                <button type="submit" style={{ gridColumn: 'span 2', background: '#f39c12', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>GÖNDER</button>
              </form>
              <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(243, 156, 18, 0.1)', borderRadius: '15px', border: '1px solid rgba(243, 156, 18, 0.2)' }}>
                <p style={{ fontSize: '11px', color: '#f39c12', margin: 0 }}>⚠️ <b>YASAL UYARI:</b> Gönderdiğiniz şarkılar sizin veya bir yakınınızın eseri olmalıdır. Telif sorumluluğu gönderene aittir.</p>
              </div>
            </div>
          </div>
        )}

        {isAdmin ? (
          /* YÖNETİCİ PANELİ KODLARI BURADA (Giriş yapılmışsa) */
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            {!isAuth ? (
              <form onSubmit={handleAdminLogin} style={{ textAlign: 'center', marginTop: '50px', background: '#111', padding: '40px', borderRadius: '30px' }}>
                <h2 style={{ color: '#f39c12' }}>Yönetici Girişi</h2>
                <input type="password" placeholder="Şifre" value={passInput} onChange={e => setPassInput(e.target.value)} style={inputStyle} required />
                <button type="submit" style={{ width: '100%', padding: '15px', background: '#f39c12', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>PANELİ AÇ</button>
              </form>
            ) : (
              <div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
                  <h2 style={{color:'#f39c12'}}>Yönetim Paneli</h2>
                  <button onClick={() => setIsAdmin(false)} style={{padding:'10px 20px', background:'#333', border:'none', borderRadius:'10px', color:'#fff'}}>SİTEYE DÖN</button>
                </div>
                {/* Form ve liste kodları öncekiyle aynı kalacak şekilde buraya eklenmiştir */}
                <section style={{ background: '#111', padding: '25px', borderRadius: '20px', marginBottom: '25px' }}>
                  <h4 style={{ color: '#f39c12', marginTop: 0 }}>🎵 {editId ? 'Eseri Düzenle' : 'Eser Ekle'}</h4>
                  <form onSubmit={handleAddOrUpdate}>
                    <input placeholder="Eser Adı" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} required />
                    <input placeholder="Sanatçı" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} style={inputStyle} required />
                    <input placeholder="MP3 Linki" value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={inputStyle} required />
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                      {categories.filter(c => c !== "Hepsi").map(c => <option key={c}>{c}</option>)}
                    </select>
                    <button type="submit" style={{ background: '#f39c12', padding: '15px', width: '100%', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>KAYDET</button>
                  </form>
                </section>
                <section style={{ background: '#111', padding: '25px', borderRadius: '20px' }}>
                  <h4 style={{ color: '#f39c12', marginTop: 0 }}>📋 Mevcut Eserler</h4>
                  {songs.map(song => (
                    <div key={song.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222' }}>
                      <span style={{fontSize:'14px'}}>{song.title} - <small style={{color:'#666'}}>{song.category}</small></span>
                      <div>
                        <button onClick={() => { setForm(song); setEditId(song.id); window.scrollTo(0,0); }} style={{ background: '#3498db', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '5px', marginRight: '5px' }}>✎</button>
                        <button onClick={() => deleteSong(song.id)} style={{ background: '#e74c3c', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>✕</button>
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
            <div style={{ textAlign: 'center', margin: '40px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, #f39c12)', flex: 1, maxWidth: '200px' }}></div>
                <span style={{ color: '#f39c12', fontSize: '22px', fontWeight: '800', letterSpacing: '6px' }}>MÜZİK KUTUSU</span>
                <div style={{ height: '2px', background: 'linear-gradient(to left, transparent, #f39c12)', flex: 1, maxWidth: '200px' }}></div>
              </div>
            </div>

            <div style={{ height: '300px', borderRadius: '40px', background: `linear-gradient(to bottom, transparent, #0a0a0a), url(${settings.banner || 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad'}) center/cover`, marginBottom: '40px' }} />

            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} style={{ padding: '12px 25px', borderRadius: '30px', border: 'none', background: activeTab === cat ? '#f39c12' : '#151515', color: activeTab === cat ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>{cat}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {filteredSongs.map((song, index) => (
                <div key={song.id} onClick={() => setCurrentSongIndex(index)} style={{ background: currentSongIndex === index ? '#1a1a1a' : '#111', padding: '15px 25px', borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', border: currentSongIndex === index ? '1px solid #f39c12' : '1px solid transparent' }}>
                  <img src={song.cover || 'https://via.placeholder.com/60'} style={{ width: '60px', height: '60px', borderRadius: '15px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: currentSongIndex === index ? '#f39c12' : '#fff' }}>{song.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{song.artist}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleLike(song.id)} style={{ background: 'none', border: 'none', color: likedSongs.includes(song.id) ? '#e74c3c' : '#333', cursor: 'pointer', fontSize: '18px' }}>❤️ {song.likes || 0}</button>
                    <a href={song.url} download style={{ color: '#333', textDecoration: 'none', fontSize: '20px' }}>📥</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: '20px', left: '5%', right: '5%', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(15px)', padding: '20px', borderRadius: '30px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2000 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
            <img src={currentSong.cover} style={{ width: '50px', height: '50px', borderRadius: '12px' }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#f39c12' }}>{currentSong.title}</div>
              <div style={{ fontSize: '12px' }}>{currentSong.artist}</div>
            </div>
          </div>
          <audio ref={audioRef} src={currentSong.url} autoPlay onEnded={onSongEnd} controls style={{ filter: 'invert(1)', width: '40%' }} />
          <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'none', border: 'none', color: '#555', marginLeft: '15px', cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '15px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #222', borderRadius: '15px', outline: 'none', fontSize: '14px' };
const labelStyle = { fontSize: '10px', color: '#f39c12', fontWeight: 'bold', marginBottom: '5px', display: 'block', letterSpacing: '1px' };
const contactBoxStyle = { background: '#111', padding: '25px', borderRadius: '25px', border: '1px solid #222', transition: '0.3s' };
