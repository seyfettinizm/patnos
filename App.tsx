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
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });

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

  const handleAdminAction = () => {
    const audio = new Audio(form.url);
    audio.onloadedmetadata = async () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      const duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      
      const newSong = { ...form, id: Date.now(), likes: 0, duration };
      const updated = [newSong, ...songs];
      setSongs(updated);
      await syncDB(updated);
      alert("Eser otomatik süre ölçümü ile eklendi: " + duration);
    };
  };

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);
  const displayedSongs = (!showFullArchive && activeTab === "Hepsi") ? filteredSongs.slice(0, 6) : filteredSongs;

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: "'Open Sans', sans-serif" }}>
      {/* Google Font Entegrasyonu */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&family=Open+Sans:wght@400;600&display=swap');
        .main-title { font-family: 'Baloo 2', cursive; font-weight: 800; font-size: 28px; color: #fff; margin: 0; }
        .sub-title { font-family: 'Open Sans', sans-serif; letter-spacing: 4px; color: orange; font-size: 12px; font-weight: 600; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* HEADER: LOGO + BAŞLIK + BUTONLAR */}
      <header style={headerWrapper}>
        <div style={{ textAlign: 'center' }}>
          {settings.logo && <img src={settings.logo} style={logoStyle} alt="Logo" />}
          <h1 className="main-title">İZMİR PATNOSLULAR DERNEĞİ</h1>
          <div style={titleDecoration}>
            <div style={hLine} /> <span className="sub-title">MÜZİK KUTUSU</span> <div style={hLine} />
          </div>
          <div style={navGroup}>
            <button onClick={() => setView('contact')} style={navLink}>İletişim</button>
            <div style={{ width: '1px', background: '#333', height: '15px' }} />
            <button onClick={() => setView('admin')} style={navLink}>Yönetim</button>
          </div>
        </div>
      </header>

      <main style={{ padding: '20px 5%', maxWidth: '900px', margin: 'auto' }}>
        
        {/* İLETİŞİM VE KÜLTÜREL ÇAĞRI */}
        {view === 'contact' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Geri Dön</button>
            <div style={culturalBox}>
              <h2 style={{ fontFamily: "'Baloo 2'", color: 'orange' }}>Kültür Mirasımıza Ses Olun</h2>
              <p style={{ fontStyle: 'italic', lineHeight: '1.8' }}>
                "Söz uçar, tel kalır; süzülür gönülden sese ulaşır." <br/>
                Patnos'un ruhunu, ezgilerini ve sesini yarınlara taşımak için eserlerinizi bekliyoruz. 
                Siz de bu müzik kutusuna bir anı bırakın.
              </p>
              <div style={legalNote}>Önemli Not: Gönderilen eserlerin telif sorumluluğu tamamen gönderen kişiye aittir.</div>
            </div>
            <div style={contactGrid}>
              <div style={cCard}><b>WP:</b> 0505 225 06 55</div>
              <div style={cCard}><b>E-Posta:</b> patnosumuz@gmail.com</div>
              <div style={cCard}><b>Adres:</b> Yeşilbağlar Mah. 637/33 Sk. No:25 Buca/İzmir</div>
            </div>
          </div>
        )}

        {/* ANA SAYFA LİSTESİ */}
        {view === 'home' && (
          <div>
            {settings.banner && (
              <div style={bannerContainer}>
                <img src={settings.banner} style={bannerImg} />
                <div style={bannerText}>{settings.bannerNote}</div>
              </div>
            )}
            
            <div style={tabs}>
              {["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Sizden Gelenler"].map(c => (
                <button key={c} onClick={() => setActiveTab(c)} style={{...tBtn, color: activeTab === c ? 'orange' : '#666'}}>{c}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {displayedSongs.map((s, i) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(songs.findIndex(x => x.id === s.id))} style={sRow}>
                  <img src={s.cover} style={sImg} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{s.title}</div>
                    <div style={{ fontSize: '12px', color: '#555' }}>{s.artist}</div>
                  </div>
                  <div style={sMeta}>
                    <span>{s.duration || "0:00"}</span>
                    <button style={actionI}>❤️ {s.likes || 0}</button>
                    <a href={s.url} download onClick={e => e.stopPropagation()} style={{textDecoration:'none'}}>📥</a>
                  </div>
                </div>
              ))}
            </div>

            {activeTab === "Hepsi" && !showFullArchive && songs.length > 6 && (
              <button onClick={() => setShowFullArchive(true)} style={loadMore}>DAHA FAZLA ESER YÜKLE</button>
            )}
          </div>
        )}

        {/* YÖNETİM PANELİ */}
        {view === 'admin' && (
           <div style={panelBox}>
             {!isAuth ? (
               <input type="password" placeholder="Şifre" style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı"))} />
             ) : (
               <div>
                 <input placeholder="Şarkı Adı" style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                 <input placeholder="Sanatçı" style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                 <input placeholder="Ses URL" style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                 <input placeholder="Kapak URL" style={inputS} onChange={e => setForm({...form, cover: e.target.value})} />
                 <button onClick={handleAdminAction} style={mainBtn}>SÜREYİ ÖLÇ VE KAYDET</button>
                 <button onClick={() => setView('home')} style={{...mainBtn, background: '#222', marginTop: '10px'}}>ÇIKTI</button>
               </div>
             )}
           </div>
        )}
      </main>

      {/* PLAYER BAR */}
      {currentSongIndex !== null && songs[currentSongIndex] && (
        <div style={playerContainer}>
          <audio src={songs[currentSongIndex].url} autoPlay controls style={{ flex: 1, filter: 'invert(1)' }} />
          <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'none', border: 'none', color: '#fff' }}>✕</button>
        </div>
      )}
    </div>
  );
}

// STİLLER
const headerWrapper = { padding: '40px 0 20px 0', borderBottom: '1px solid #151515' };
const logoStyle = { height: '60px', marginBottom: '15px', borderRadius: '50%' };
const titleDecoration = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', margin: '5px 0 15px 0' };
const hLine = { height: '1px', width: '40px', background: 'orange' };
const navGroup = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' };
const navLink = { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', fontWeight: '600' };
const culturalBox = { background: '#111', padding: '30px', borderRadius: '25px', border: '1px solid #222', textAlign: 'center' as 'center', marginBottom: '30px' };
const legalNote = { fontSize: '11px', color: '#444', marginTop: '20px', borderTop: '1px solid #222', paddingTop: '10px' };
const contactGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' };
const cCard = { background: '#0a0a0a', padding: '15px', borderRadius: '15px', border: '1px solid #151515', fontSize: '13px' };
const tabs = { display: 'flex', gap: '20px', overflowX: 'auto' as 'auto', marginBottom: '30px', paddingBottom: '10px' };
const tBtn = { background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' as 'nowrap' };
const sRow = { background: '#111', padding: '12px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px', cursor: 'pointer' };
const sImg = { width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' as 'cover' };
const sMeta = { display: 'flex', alignItems: 'center', gap: '15px', fontSize: '12px' };
const actionI = { background: 'none', border: 'none', color: '#fff', cursor: 'pointer' };
const bannerContainer = { position: 'relative' as 'relative', height: '220px', borderRadius: '30px', overflow: 'hidden', marginBottom: '30px' };
const bannerImg = { width: '100%', height: '100%', objectFit: 'cover' as 'cover', opacity: 0.5 };
const bannerText = { position: 'absolute' as 'absolute', bottom: '25px', left: '25px', fontSize: '18px', fontWeight: 'bold' };
const loadMore = { width: '100%', padding: '15px', background: 'none', border: '1px dashed #333', color: '#444', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' };
const inputS = { width: '100%', padding: '15px', marginBottom: '10px', background: '#000', border: '1px solid #222', borderRadius: '10px', color: '#fff' };
const mainBtn = { width: '100%', padding: '15px', background: 'orange', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const playerContainer = { position: 'fixed' as 'fixed', bottom: 0, left: 0, right: 0, background: '#000', borderTop: '1px solid orange', padding: '10px 5%', display: 'flex', gap: '20px', zIndex: 1000 };
const backBtn = { background: 'none', border: 'none', color: 'orange', marginBottom: '20px', cursor: 'pointer' };
const panelBox = { background: '#111', padding: '20px', borderRadius: '20px' };
