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

  const handleNextSong = () => {
    if (currentSongIndex !== null && currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(null); // Liste bitti
    }
  };

  const handleAdminAction = () => {
    const audio = new Audio(form.url);
    audio.onloadedmetadata = async () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      const duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      
      let updated;
      if (editId) {
        updated = songs.map(s => s.id === editId ? { ...form, id: editId, duration } : s);
      } else {
        updated = [{ ...form, id: Date.now(), likes: 0, duration }, ...songs];
      }
      
      setSongs(updated);
      await syncDB(updated);
      setEditId(null);
      setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
      alert("İşlem Başarılı!");
    };
  };

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);
  const displayedSongs = (!showFullArchive && activeTab === "Hepsi") ? filteredSongs.slice(0, 6) : filteredSongs;

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: "'Open Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&family=Open+Sans:wght@400;600&display=swap');
        .main-title { font-family: 'Baloo 2', cursive; font-weight: 800; font-size: 26px; color: #fff; margin: 5px 0; }
        .sub-title { font-family: 'Open Sans', sans-serif; letter-spacing: 4px; color: orange; font-size: 11px; font-weight: 700; }
        ::-webkit-scrollbar { display: none; }
        .contact-card:hover { transform: scale(1.02); }
      `}</style>

      {/* HEADER */}
      <header style={{ padding: '30px 0', borderBottom: '1px solid #151515', textAlign: 'center' }}>
        {settings.logo && <img src={settings.logo} style={{ height: '70px', borderRadius: '50%', marginBottom: '10px' }} alt="Logo" />}
        <h1 className="main-title">İZMİR PATNOSLULAR DERNEĞİ</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
          <div style={{ height: '1px', width: '40px', background: 'orange' }} />
          <span className="sub-title">MÜZİK KUTUSU</span>
          <div style={{ height: '1px', width: '40px', background: 'orange' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '25px' }}>
          <button onClick={() => setView('home')} style={navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('contact')} style={navBtn}>İletişim</button>
          <button onClick={() => setView('admin')} style={navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ padding: '20px 5%', maxWidth: '900px', margin: 'auto' }}>
        
        {/* VIEW: İLETİŞİM */}
        {view === 'contact' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={culturalBox}>
              <h2 style={{ fontFamily: "'Baloo 2'", color: 'orange' }}>Kültür Mirasımıza Ses Olun</h2>
              <p style={{ fontStyle: 'italic', lineHeight: '1.6', fontSize: '15px' }}>"Söz uçar, tel kalır; süzülür gönülden sese ulaşır."</p>
              <div style={{ color: '#FFD700', fontWeight: 'bold', marginTop: '15px', fontSize: '13px' }}>
                ⚠️ Önemli Not: Gönderilen eserlerin telif sorumluluğu tamamen gönderen kişiye aittir.
              </div>
            </div>
            <div style={contactGrid}>
              <div style={{ ...cCard, background: '#25D366' }} onClick={() => window.open('https://wa.me/905052250655')}>
                <span style={cIcon}>📱</span> <b>WhatsApp</b> <br/> 0505 225 06 55
              </div>
              <div style={{ ...cCard, background: '#3498db' }} onClick={() => window.location.href='mailto:patnosumuz@gmail.com'}>
                <span style={cIcon}>📧</span> <b>E-Posta</b> <br/> patnosumuz@gmail.com
              </div>
              <div style={{ ...cCard, background: '#e67e22' }}>
                <span style={cIcon}>📍</span> <b>Adres</b> <br/> Buca / İZMİR
              </div>
            </div>
          </div>
        )}

        {/* VIEW: YÖNETİM PANELİ (TAMAMEN GERİ GELDİ) */}
        {view === 'admin' && (
          <div style={{ animation: 'fadeIn 0.3s' }}>
            {!isAuth ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <input type="password" placeholder="Yönetici Şifresi" style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı"))} />
                <p style={{ fontSize: '12px', color: '#444' }}>Giriş yapmak için şifreyi yazıp Enter'a basın.</p>
              </div>
            ) : (
              <div>
                <div style={panelBox}>
                  <h3 style={{ color: 'orange', marginTop: 0 }}>🖼️ Görsel Ayarları</h3>
                  <input placeholder="Logo URL" value={settings.logo} style={inputS} onChange={e => setSettings({ ...settings, logo: e.target.value })} />
                  <input placeholder="Banner URL" value={settings.banner} style={inputS} onChange={e => setSettings({ ...settings, banner: e.target.value })} />
                  <input placeholder="Banner Yazısı" value={settings.bannerNote} style={inputS} onChange={e => setSettings({ ...settings, bannerNote: e.target.value })} />
                  <button onClick={() => { syncDB(songs, settings); alert("Görseller güncellendi!"); }} style={mainBtn}>AYARLARI KAYDET</button>
                </div>

                <div style={panelBox}>
                  <h3 style={{ color: 'orange', marginTop: 0 }}>🎵 {editId ? 'Şarkıyı Düzenle' : 'Yeni Şarkı Ekle'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input placeholder="Şarkı Adı" value={form.title} style={inputS} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({ ...form, artist: e.target.value })} />
                  </div>
                  <input placeholder="Ses Dosyası (MP3 URL)" value={form.url} style={inputS} onChange={e => setForm({ ...form, url: e.target.value })} />
                  <input placeholder="Kapak Resmi URL" value={form.cover} style={inputS} onChange={e => setForm({ ...form, cover: e.target.value })} />
                  <select value={form.category} style={inputS} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.filter(c => c !== "Hepsi").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAdminAction} style={mainBtn}>{editId ? 'GÜNCELLE' : 'KÜTÜPHANEYE EKLE'}</button>
                  {editId && <button onClick={() => { setEditId(null); setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' }); }} style={{ ...mainBtn, background: '#444', marginTop: '5px' }}>İPTAL</button>}
                </div>

                <div style={panelBox}>
                  <h3 style={{ color: 'orange' }}>📑 Mevcut Şarkılar (Düzenle/Sil)</h3>
                  {songs.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #222', fontSize: '14px' }}>
                      <span>{s.title} - <small style={{ color: '#666' }}>{s.artist}</small></span>
                      <div>
                        <button onClick={() => { setForm(s); setEditId(s.id); window.scrollTo(0, 0); }} style={{ color: 'cyan', background: 'none', border: 'none', cursor: 'pointer' }}>📝</button>
                        <button onClick={async () => { if (confirm("Bu eseri silmek istediğinize emin misiniz?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n); } }} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: ANA SAYFA */}
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
              {displayedSongs.map((s, i) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(songs.findIndex(x => x.id === s.id))} style={{ ...sRow, border: songs[currentSongIndex]?.id === s.id ? '1px solid orange' : '1px solid transparent' }}>
                  <img src={s.cover} style={sImg} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                    <div style={{ fontSize: '12px', color: '#555' }}>{s.artist}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#444', fontWeight: 'bold' }}>{s.duration}</span>
                    <a href={s.url} download={`${s.title}.mp3`} onClick={e => e.stopPropagation()} style={actionI}>💾</a>
                  </div>
                </div>
              ))}
            </div>

            {activeTab === "Hepsi" && !showFullArchive && songs.length > 6 && (
              <button onClick={() => setShowFullArchive(true)} style={loadMore}>TÜM LİSTEYİ GÖR ({songs.length})</button>
            )}
          </div>
        )}
      </main>

      {/* PLAYER (OTOMATİK GEÇİŞ SİSTEMİ) */}
      {currentSongIndex !== null && songs[currentSongIndex] && (
        <div style={playerContainer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            <img src={songs[currentSongIndex].cover} style={{ width: '35px', height: '35px', borderRadius: '5px' }} />
            <div style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{songs[currentSongIndex].title}</div>
          </div>
          <audio 
            ref={audioRef}
            src={songs[currentSongIndex].url} 
            autoPlay 
            controls 
            onEnded={handleNextSong}
            style={{ flex: 3, height: '30px', filter: 'invert(1)' }} 
          />
          <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </div>
  );
}

// STİLLER
const navBtn = { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: '0.3s' };
const inputS = { width: '100%', padding: '12px', marginBottom: '10px', background: '#000', border: '1px solid #222', borderRadius: '8px', color: '#fff', fontSize: '14px' };
const mainBtn = { width: '100%', padding: '12px', background: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#000' };
const culturalBox = { background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222', textAlign: 'center' as 'center', marginBottom: '20px' };
const contactGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' };
const cCard = { padding: '15px', borderRadius: '15px', textAlign: 'center' as 'center', color: '#fff', cursor: 'pointer', transition: '0.3s', fontSize: '13px' };
const cIcon = { display: 'block', fontSize: '20px', marginBottom: '5px' };
const tabs = { display: 'flex', gap: '20px', overflowX: 'auto' as 'auto', marginBottom: '20px', paddingBottom: '10px' };
const tBtn = { background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' as 'nowrap', fontSize: '13px' };
const sRow = { background: '#111', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: '0.2s' };
const sImg = { width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' as 'cover' };
const actionI = { fontSize: '18px', textDecoration: 'none', cursor: 'pointer' };
const bannerWrapper = { position: 'relative' as 'relative', height: '180px', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' };
const bannerImg = { width: '100%', height: '100%', objectFit: 'cover' as 'cover', opacity: 0.4 };
const bannerOverlay = { position: 'absolute' as 'absolute', bottom: '20px', left: '20px', fontSize: '16px', fontWeight: 'bold', color: 'orange' };
const playerContainer = { position: 'fixed' as 'fixed', bottom: 0, left: 0, right: 0, background: '#000', borderTop: '2px solid orange', padding: '10px 5%', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 3000 };
const loadMore = { width: '100%', padding: '12px', background: 'none', border: '1px dashed #333', color: '#555', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };
const panelBox = { background: '#111', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #222' };
