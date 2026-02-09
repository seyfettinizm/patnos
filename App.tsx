import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [view, setView] = useState<'home' | 'admin' | 'contact'>('home');
  const [isAuth, setIsAuth] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [settings, setSettings] = useState({ logo: '', banner: '', bannerNote: '' });
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [showFullArchive, setShowFullArchive] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
  const [adminSearchTerm, setAdminSearchTerm] = useState(""); 
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
    if (data?.value) {
      setSongs(data.value.songs || []);
      setSettings(data.value.settings || { logo: '', banner: '', bannerNote: '' });
    }
  };

  const syncDB = async (newSongs: any[], newSettings = settings) => {
    await supabase.from('settings').update({ value: { songs: newSongs, settings: newSettings } }).eq('id', 'app_data');
  };

  const getDuration = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = url;
      audio.addEventListener('loadedmetadata', () => {
        const min = Math.floor(audio.duration / 60);
        const sec = Math.floor(audio.duration % 60);
        resolve(`${min}:${sec < 10 ? '0' : ''}${sec}`);
      });
      audio.addEventListener('error', () => resolve("3:15"));
    });
  };

  const handleAdminAction = async () => {
    const duration = await getDuration(form.url);
    let updated;
    if (editId) {
      updated = songs.map(s => s.id === editId ? { ...form, id: editId, duration, likes: s.likes || 0 } : s);
    } else {
      updated = [{ ...form, id: Date.now(), likes: 0, duration }, ...songs];
    }
    setSongs(updated);
    await syncDB(updated);
    setEditId(null);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    alert("Başarıyla Kaydedildi!");
  };

  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const likedSongs = JSON.parse(localStorage.getItem('p_likes') || '[]');
    if (likedSongs.includes(id)) return alert("Zaten beğendiniz.");
    const updated = songs.map(s => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s);
    setSongs(updated);
    likedSongs.push(id);
    localStorage.setItem('p_likes', JSON.stringify(likedSongs));
    await syncDB(updated);
  };

  const handleDownload = async (e: React.MouseEvent, url: string, title: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${title}.mp3`;
      link.click();
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  const sortedSongs = [...songs].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  const filteredSongs = activeTab === "Hepsi" ? sortedSongs : sortedSongs.filter(s => s.category === activeTab);
  const displayedSongs = (!showFullArchive && activeTab === "Hepsi") ? filteredSongs.slice(0, 6) : filteredSongs;

  const adminFilteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(adminSearchTerm.toLowerCase()) || 
    s.artist.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: "'Open Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&family=Open+Sans:wght@400;600&display=swap');
        .main-title { font-family: 'Baloo 2', cursive; font-size: 24px; color: #fff; margin: 5px 0; }
        .sub-title { letter-spacing: 5px; color: orange; font-size: 11px; font-weight: 700; }
        .label-text { display: block; font-size: 12px; color: orange; margin-bottom: 5px; font-weight: bold; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <header style={{ padding: '25px 0', borderBottom: '1px solid #111', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {settings.logo && <img src={settings.logo} style={{ height: '55px', width: '55px', borderRadius: '50%', marginBottom: '8px', objectFit: 'cover' }} alt="Logo" />}
          <h1 className="main-title">İZMİR PATNOSLULAR DERNEĞİ</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <div style={{ height: '1px', width: '30px', background: 'orange' }} />
            <span className="sub-title">MÜZİK KUTUSU</span>
            <div style={{ height: '1px', width: '30px', background: 'orange' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button onClick={() => setView('home')} style={navLink}>Ana Sayfa</button>
          <button onClick={() => setView('contact')} style={navLink}>İletişim</button>
          <button onClick={() => setView('admin')} style={navLink}>Yönetim</button>
        </div>
      </header>

      <main style={{ padding: '20px 5%', maxWidth: '850px', margin: 'auto' }}>
        
        {view === 'contact' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={culturalBox}>
              <h2 style={{ fontFamily: "'Baloo 2'", color: 'orange', marginBottom: '10px' }}>Kültür Mirasımıza Ses Olun</h2>
              <p style={{ fontStyle: 'italic', lineHeight: '1.6', fontSize: '15px', color: '#ccc' }}>"Söz uçar, tel kalır; süzülür gönülden sese ulaşır." <br/> Patnos'un kadim seslerini yarınlara taşımak en büyük gayemizdir.</p>
              <div style={{ color: '#FFD700', fontWeight: 'bold', marginTop: '20px', fontSize: '12px', background: 'rgba(255,215,0,0.1)', padding: '10px', borderRadius: '10px' }}>⚠️ Önemli Not: Telif sorumluluğu gönderene aittir.</div>
            </div>
            <div style={contactGrid}>
              <div style={{ ...cCard, borderLeft: '4px solid #25D366' }} onClick={() => window.open('https://wa.me/905052250655')}><b>WhatsApp</b><br/>0505 225 06 55</div>
              <div style={{ ...cCard, borderLeft: '4px solid #3498db' }} onClick={() => window.location.href='mailto:patnosumuz@gmail.com'}><b>E-Posta</b><br/>patnosumuz@gmail.com</div>
              <div style={{ ...cCard, borderLeft: '4px solid #e67e22' }}><b>Adres</b><br/><span style={{fontSize:'12px'}}>Yeşilbağlar Mah. 637/33 Sok. No 25. Buca İZMİR</span></div>
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div style={{ animation: 'fadeIn 0.3s' }}>
            {!isAuth ? (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hata!"))} />
              </div>
            ) : (
              <div>
                <div style={panelBox}>
                  <h3 style={{ color: 'orange', marginTop: 0 }}>🖼️ Genel Ayarlar</h3>
                  <label className="label-text">Logo Görsel URL</label>
                  <input value={settings.logo} style={inputS} onChange={e => setSettings({ ...settings, logo: e.target.value })} />
                  <label className="label-text">Banner Görsel URL</label>
                  <input value={settings.banner} style={inputS} onChange={e => setSettings({ ...settings, banner: e.target.value })} />
                  <label className="label-text">Banner Notu</label>
                  <input value={settings.bannerNote} style={inputS} onChange={e => setSettings({ ...settings, bannerNote: e.target.value })} />
                  <button onClick={() => syncDB(songs, settings)} style={mainBtn}>AYARLARI KAYDET</button>
                </div>

                <div style={panelBox}>
                  <h3 style={{ color: 'orange' }}>🎵 Şarkı {editId ? 'Düzenle' : 'Ekle'}</h3>
                  <label className="label-text">Şarkı Adı</label>
                  <input value={form.title} style={inputS} onChange={e => setForm({ ...form, title: e.target.value })} />
                  <label className="label-text">Sanatçı</label>
                  <input value={form.artist} style={inputS} onChange={e => setForm({ ...form, artist: e.target.value })} />
                  <label className="label-text">Ses Bağlantısı (URL)</label>
                  <input value={form.url} style={inputS} onChange={e => setForm({ ...form, url: e.target.value })} />
                  <label className="label-text">Kapak URL</label>
                  <input value={form.cover} style={inputS} onChange={e => setForm({ ...form, cover: e.target.value })} />
                  <label className="label-text">Kategori</label>
                  <select value={form.category} style={inputS} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.filter(c => c !== "Hepsi").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAdminAction} style={mainBtn}>KAYDET</button>
                </div>

                <div style={panelBox}>
                  <h3 style={{ color: 'orange', marginBottom: '15px' }}>⚙️ Arşiv Yönetimi</h3>
                  <label className="label-text">🔍 Arşivde Hızlı Ara</label>
                  <input 
                    type="text" 
                    placeholder="Şarkı veya sanatçı yazın..." 
                    style={{ ...inputS, borderColor: 'orange', marginBottom: '20px' }}
                    value={adminSearchTerm}
                    onChange={(e) => setAdminSearchTerm(e.target.value)}
                  />
                  {adminFilteredSongs.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #222' }}>
                      <span style={{fontSize:'14px'}}>{s.title} ({s.likes || 0} beğeni)</span>
                      <div>
                        <button onClick={() => { setForm(s); setEditId(s.id); window.scrollTo(0, 0); }} style={{ color: '#3498db', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✏️</button>
                        <button onClick={async () => { if (confirm("Silinsin mi?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n); } }} style={{ color: '#e74c3c', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', marginLeft: '15px' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'home' && (
          <div>
            {settings.banner && (
              <div style={bannerWrapper}>
                <img src={settings.banner} style={bannerImg} />
                <div style={bannerOverlay}>{settings.bannerNote}</div>
              </div>
            )}
            <div style={tabs}>
              {categories.map(c => (
                <button key={c} onClick={() => { setActiveTab(c); setShowFullArchive(true); }} style={{ ...tBtn, color: activeTab === c ? 'orange' : '#555' }}>{c}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {displayedSongs.map((s) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(sortedSongs.findIndex(x => x.id === s.id))} style={{ ...sRow, border: sortedSongs[currentSongIndex]?.id === s.id ? '1px solid orange' : '1px solid transparent' }}>
                  <img src={s.cover} style={sImg} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{s.title}</div>
                    <div style={{ fontSize: '12px', color: '#555' }}>{s.artist}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '11px', color: '#444' }}>{s.duration || '0:00'}</span>
                    <button onClick={(e) => handleLike(e, s.id)} style={{ background: 'none', border: 'none', color: '#fff' }}>❤️ {s.likes || 0}</button>
                    <button onClick={(e) => handleDownload(e, s.url, s.title)} style={{ background: 'none', border: 'none', fontSize: '18px' }}>📥</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {currentSongIndex !== null && sortedSongs[currentSongIndex] && (
        <div style={playerContainer}>
          <audio ref={audioRef} src={sortedSongs[currentSongIndex].url} autoPlay controls onEnded={() => currentSongIndex < sortedSongs.length - 1 && setCurrentSongIndex(currentSongIndex + 1)} style={{ flex: 1, height: '32px', filter: 'invert(1)' }} />
          <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'none', border: 'none', color: '#fff' }}>✕</button>
        </div>
      )}
    </div>
  );
}

const navLink = { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px', fontWeight: '600' };
const inputS = { width: '100%', padding: '12px', marginBottom: '15px', background: '#000', border: '1px solid #222', borderRadius: '8px', color: '#fff' };
const mainBtn = { width: '100%', padding: '14px', background: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#000' };
const culturalBox = { background: '#0a0a0a', padding: '30px', borderRadius: '25px', border: '1px solid #111', textAlign: 'center' as 'center', marginBottom: '25px' };
const contactGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' };
const cCard = { background: '#111', padding: '20px', borderRadius: '15px', textAlign: 'center' as 'center' };
const tabs = { display: 'flex', gap: '20px', overflowX: 'auto' as 'auto', marginBottom: '25px', paddingBottom: '10px' };
const tBtn = { background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' as 'nowrap' };
const sRow = { background: '#111', padding: '12px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' };
const sImg = { width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover' as 'cover' };
const bannerWrapper = { position: 'relative' as 'relative', height: '200px', borderRadius: '25px', overflow: 'hidden', marginBottom: '30px', border: '1px solid #111' };
const bannerImg = { width: '100%', height: '100%', objectFit: 'cover' as 'cover', opacity: 0.4 };
const bannerOverlay = { position: 'absolute' as 'absolute', bottom: '25px', left: '25px', fontSize: '18px', fontWeight: 'bold', color: 'orange' };
const playerContainer = { position: 'fixed' as 'fixed', bottom: 0, left: 0, right: 0, background: '#000', borderTop: '2px solid orange', padding: '12px 5%', display: 'flex', gap: '20px', zIndex: 1000 };
const panelBox = { background: '#111', padding: '25px', borderRadius: '20px', marginBottom: '20px' };
