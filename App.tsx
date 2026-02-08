import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [view, setView] = useState<'home' | 'admin' | 'contact'>('home');
  const [isAuth, setIsAuth] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [settings, setSettings] = useState({ logo: '', banner: '', bannerNote: '' });
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [showFullArchive, setShowFullArchive] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar', duration: '3:40' });

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setSettings(data.value.settings || { logo: '', banner: '', bannerNote: '' });
      }
    } catch (err) { console.error("Veri yüklenemedi"); }
  };

  const syncDB = async (newSongs: any[], newSettings = settings) => {
    await supabase.from('settings').update({ 
      value: { songs: newSongs, settings: newSettings } 
    }).eq('id', 'app_data');
  };

  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
    if (likedSongs.includes(id)) return alert("Zaten beğendiniz!");
    const updated = songs.map(s => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s);
    setSongs(updated);
    likedSongs.push(id);
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    await syncDB(updated);
  };

  const handleAdminAction = async () => {
    let updated = editId ? songs.map(s => s.id === editId ? { ...form, id: editId } : s) : [{ ...form, id: Date.now(), likes: 0 }, ...songs];
    setSongs(updated);
    await syncDB(updated);
    setEditId(null);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar', duration: '3:40' });
    alert("Kütüphane Güncellendi!");
  };

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);
  const displayedSongs = (activeTab === "Hepsi" && !showFullArchive) ? filteredSongs.slice(0, 6) : filteredSongs;

  return (
    <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', fontFamily: 'serif' }}>
      
      {/* BAŞLIK VE ÜST ÇUBUK */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '1px' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
          <div style={subTitleContainer}>
            <div style={line} />
            <span style={subTitleText}>MÜZİK KUTUSU</span>
            <div style={line} />
          </div>
        </div>
        <div style={navButtons}>
          <button onClick={() => setView('contact')} style={iconBtn}>📞</button>
          <button onClick={() => setView('admin')} style={iconBtn}>🔐</button>
        </div>
      </header>

      <main style={{ padding: '20px 5%', maxWidth: '1200px', margin: 'auto' }}>
        
        {/* İLETİŞİM */}
        {view === 'contact' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Ana Sayfa</button>
            <div style={infoBox}>
              <h2 style={{color: 'orange'}}>Paylaşalım!</h2>
              <p>Eserlerinizi WhatsApp veya E-posta ile bize ulaştırın, burada yayınlayalım.</p>
            </div>
            <div style={contactGrid}>
              <div style={cCard} onClick={() => window.open('https://wa.me/905052250655')}>
                <b>WhatsApp</b><br/>0505 225 06 55
              </div>
              <div style={cCard} onClick={() => window.location.href='mailto:patnosumuz@gmail.com'}>
                <b>E-posta</b><br/>patnosumuz@gmail.com
              </div>
              <div style={cCard}>
                <b>Adres</b><br/><small>Yeşilbağlar Mah. 637/33 Sok. No:25 Buca / İZMİR</small>
              </div>
            </div>
          </div>
        )}

        {/* YÖNETİM */}
        {view === 'admin' && (
          <div>
            <button onClick={() => setView('home')} style={backBtn}>← Kapat</button>
            {!isAuth ? (
              <div style={{textAlign:'center', marginTop:'50px'}}>
                <input type="password" placeholder="Şifre" style={inputS} onChange={e => setPassInput(e.target.value)} />
                <button onClick={() => passInput === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!")} style={mainBtn}>GİRİŞ</button>
              </div>
            ) : (
              <div style={{display:'grid', gap:'20px'}}>
                <div style={panelBox}>
                  <h3 style={{color:'orange'}}>Logo & Banner</h3>
                  <input placeholder="Logo URL" value={settings.logo} style={inputS} onChange={e => setSettings({...settings, logo: e.target.value})} />
                  <input placeholder="Banner URL" value={settings.banner} style={inputS} onChange={e => setSettings({...settings, banner: e.target.value})} />
                  <input placeholder="Banner Notu" value={settings.bannerNote} style={inputS} onChange={e => setSettings({...settings, bannerNote: e.target.value})} />
                  <button onClick={() => syncDB(songs, settings)} style={mainBtn}>KAYDET</button>
                </div>
                <div style={panelBox}>
                  <h3>{editId ? 'Düzenle' : 'Yeni Ekle'}</h3>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <input placeholder="Şarkı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                    <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  </div>
                  <input placeholder="Ses URL" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                  <input placeholder="Kapak URL" value={form.cover} style={inputS} onChange={e => setForm({...form, cover: e.target.value})} />
                  <select value={form.category} style={inputS} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAdminAction} style={mainBtn}>KÜTÜPHANEYE EKLE</button>
                </div>
                <div style={panelBox}>
                  <h3>Arşiv</h3>
                  {songs.map(s => (
                    <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #222'}}>
                      <span>{s.title}</span>
                      <div>
                        <button onClick={() => {setForm(s); setEditId(s.id);}} style={{color:'cyan', background:'none', border:'none'}}>Düzenle</button>
                        <button onClick={async () => { if(confirm("Sil?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n); }}} style={{color:'red', background:'none', border:'none', marginLeft:'10px'}}>Sil</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANA SAYFA */}
        {view === 'home' && (
          <div>
            {settings.banner && (
              <div style={bannerWrapper}>
                <img src={settings.banner} style={bannerImg} />
                <div style={bannerOverlay}>{settings.bannerNote}</div>
              </div>
            )}
            
            <div style={catNav}>
              {categories.map(c => (
                <button key={c} onClick={() => {setActiveTab(c); setShowFullArchive(true);}} style={{...catBtn, background: activeTab === c ? 'orange' : '#111', color: activeTab === c ? '#000' : '#fff'}}>{c}</button>
              ))}
            </div>

            <div style={{display:'grid', gap:'10px'}}>
              {displayedSongs.map((s, i) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(songs.findIndex(x => x.id === s.id))} style={songRow}>
                  <img src={s.cover} style={rowImg} />
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontWeight:'bold', fontSize:'14px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{s.title}</div>
                    <div style={{fontSize:'12px', color:'#666'}}>{s.artist}</div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                    <span style={{fontSize:'11px', color:'#444'}}>{s.duration}</span>
                    <div onClick={(e) => handleLike(e, s.id)} style={actionBtn}>❤️ {s.likes || 0}</div>
                    <a href={s.url} download onClick={e => e.stopPropagation()} style={actionBtn}>📥</a>
                  </div>
                </div>
              ))}
            </div>

            {activeTab === "Hepsi" && !showFullArchive && songs.length > 6 && (
              <button onClick={() => setShowFullArchive(true)} style={moreBtn}>TÜM ARŞİVİ GÖR ({songs.length})</button>
            )}
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSongIndex !== null && songs[currentSongIndex] && (
        <div style={playerBar}>
          <audio src={songs[currentSongIndex].url} autoPlay controls style={{width:'100%', height:'35px', filter:'invert(1)'}} />
          <button onClick={() => setCurrentSongIndex(null)} style={{background:'none', border:'none', color:'#fff', padding:'10px'}}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// MOBİL UYUMLU STİLLER
const headerStyle = { padding: '20px 5%', background: '#000', display: 'flex', justifyContent: 'center', position: 'relative' as 'relative', borderBottom: '1px solid #111' };
const subTitleContainer = { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' };
const line = { height: '1px', width: '30px', background: 'orange' };
const subTitleText = { fontSize: '12px', letterSpacing: '3px', color: 'orange' };
const navButtons = { position: 'absolute' as 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '10px' };
const iconBtn = { background: '#111', border: '1px solid #222', borderRadius: '50%', width: '35px', height: '35px', color: '#fff', cursor: 'pointer' };
const backBtn = { background: 'none', border: 'none', color: 'orange', marginBottom: '15px', cursor: 'pointer' };
const inputS = { width: '100%', padding: '12px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #222', borderRadius: '8px' };
const mainBtn = { width: '100%', padding: '12px', background: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const panelBox = { background: '#111', padding: '20px', borderRadius: '15px' };
const catNav = { display: 'flex', gap: '8px', overflowX: 'auto' as 'auto', marginBottom: '20px', paddingBottom: '5px' };
const catBtn = { padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' as 'nowrap', fontSize: '12px' };
const songRow = { background: '#111', padding: '10px 15px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '8px' };
const rowImg = { width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover' as 'cover' };
const actionBtn = { background: '#1a1a1a', padding: '5px 8px', borderRadius: '8px', fontSize: '12px', color: '#fff', border: '1px solid #333', textDecoration: 'none' };
const bannerWrapper = { position: 'relative' as 'relative', height: '200px', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' };
const bannerImg = { width: '100%', height: '100%', objectFit: 'cover' as 'cover', filter: 'brightness(0.5)' };
const bannerOverlay = { position: 'absolute' as 'absolute', bottom: '20px', left: '20px', color: '#fff', fontWeight: 'bold' };
const playerBar = { position: 'fixed' as 'fixed', bottom: 0, left: 0, right: 0, background: '#000', padding: '10px 5%', display: 'flex', alignItems: 'center', borderTop: '1px solid orange', zIndex: 3000 };
const moreBtn = { width: '100%', padding: '15px', background: 'none', border: '1px dashed #333', color: '#666', borderRadius: '15px', marginTop: '10px', cursor: 'pointer' };
const contactGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '20px' };
const cCard = { background: '#111', padding: '15px', borderRadius: '15px', textAlign: 'center' as 'center', fontSize: '13px', border: '1px solid #222' };
const infoBox = { background: '#111', padding: '20px', borderRadius: '20px', border: '1px solid orange', textAlign: 'center' as 'center' };
