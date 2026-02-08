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
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar', duration: '3:45' });

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
    if (likedSongs.includes(id)) {
      alert("Bu şarkıyı zaten beğendiniz!");
      return;
    }
    const updatedSongs = songs.map(s => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s);
    setSongs(updatedSongs);
    likedSongs.push(id);
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    await syncDB(updatedSongs);
  };

  const handleAdminAction = async () => {
    let updated;
    if (editId) {
      updated = songs.map(s => s.id === editId ? { ...form, id: editId, likes: s.likes || 0 } : s);
    } else {
      updated = [{ ...form, id: Date.now(), likes: 0 }, ...songs];
    }
    setSongs(updated);
    await syncDB(updated);
    setEditId(null);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar', duration: '3:45' });
    alert("Kütüphane Güncellendi!");
  };

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.8)', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 1000, backdropFilter:'blur(10px)' }}>
        <div style={brandStyle} onClick={() => setView('home')}>
          {settings.logo && <img src={settings.logo} style={{height:'40px', borderRadius:'50%', border:'2px solid orange'}} />}
          <span className="premium-title">İZMİR PATNOSLULAR DERNEĞİ</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setView('contact')} style={navBtn}>📞 İletişim</button>
          <button onClick={() => setView('admin')} style={navBtn}>🔐 Yönetim</button>
        </div>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        
        {/* VIEW: İLETİŞİM */}
        {view === 'contact' && (
          <div style={{ maxWidth: '900px', margin: 'auto', animation: 'fadeIn 0.5s ease' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Ana Sayfaya Dön</button>
            <div style={glowBox}>
              <h2 style={{color: 'orange', marginBottom: '15px'}}>🎶 Eserlerinizi Paylaşalım!</h2>
              <p style={{fontSize: '18px'}}>Dosyalarınızı WhatsApp veya E-posta ile bize gönderin, burada yayınlayalım.</p>
            </div>
            <div style={contactGrid}>
              <div style={contactCard} onClick={() => window.open('https://wa.me/905052250655')}>
                <div style={iconCircle}>WP</div>
                <h3>WhatsApp</h3>
                <p>0505 225 06 55</p>
              </div>
              <div style={contactCard} onClick={() => window.location.href='mailto:patnosumuz@gmail.com'}>
                <div style={iconCircle}>@</div>
                <h3>E-posta</h3>
                <p>patnosumuz@gmail.com</p>
              </div>
              <div style={contactCard}>
                <div style={iconCircle}>📍</div>
                <h3>Adres</h3>
                <p style={{fontSize:'13px'}}>Yeşilbağlar Mah. 637/33 Sok. <br/> No:25 Buca / İZMİR</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: YÖNETİM */}
        {view === 'admin' && (
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Paneli Kapat</button>
            {!isAuth ? (
              <div style={{textAlign:'center', marginTop:'100px'}}>
                <input type="password" placeholder="Şifre" style={inputS} onChange={e => setPassInput(e.target.value)} />
                <button onClick={() => passInput === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!")} style={mainBtn}>GİRİŞ</button>
              </div>
            ) : (
              <div style={{animation: 'fadeIn 0.3s'}}>
                <div style={{...panelBox, border:'1px dashed orange'}}>
                  <h3 style={{color:'orange', marginTop:0}}>🖼️ Görsel & Banner Ayarları</h3>
                  <div style={grid2}>
                    <input placeholder="Logo URL" value={settings.logo} style={inputS} onChange={e => setSettings({...settings, logo: e.target.value})} />
                    <input placeholder="Banner URL" value={settings.banner} style={inputS} onChange={e => setSettings({...settings, banner: e.target.value})} />
                  </div>
                  <textarea placeholder="Banner Üzerindeki Kısa Not" value={settings.bannerNote} style={{...inputS, height:'60px'}} onChange={e => setSettings({...settings, bannerNote: e.target.value})} />
                  <button onClick={() => syncDB(songs, settings)} style={{...mainBtn, background:'#2980b9'}}>AYARLARI KAYDET</button>
                </div>

                <div style={panelBox}>
                  <h3 style={{color:'orange', marginTop:0}}>➕ Şarkı Ekle/Düzenle</h3>
                  <div style={grid2}>
                    <input placeholder="Şarkı Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                    <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  </div>
                  <div style={grid2}>
                    <input placeholder="Ses URL (MP3)" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                    <input placeholder="Kapak URL" value={form.cover} style={inputS} onChange={e => setForm({...form, cover: e.target.value})} />
                  </div>
                  <div style={grid2}>
                    <input placeholder="Süre (örn: 4:20)" value={form.duration} style={inputS} onChange={e => setForm({...form, duration: e.target.value})} />
                    <select value={form.category} style={inputS} onChange={e => setForm({...form, category: e.target.value})}>
                      {categories.filter(c => c !== "Hepsi").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button onClick={handleAdminAction} style={mainBtn}>KÜTÜPHANEYE EKLE</button>
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
                {settings.bannerNote && <div style={bannerNoteStyle}>{settings.bannerNote}</div>}
              </div>
            )}
            
            <div style={{display:'flex', gap:'10px', overflowX:'auto', marginBottom:'25px', scrollbarWidth:'none'}}>
              {categories.map(c => (
                <button key={c} onClick={() => setActiveTab(c)} style={{...catBtn, background: activeTab === c ? 'orange' : '#111', color: activeTab === c ? '#000' : '#fff'}}>{c}</button>
              ))}
            </div>

            <div style={{display:'grid', gap:'12px'}}>
              {songs.filter(s => activeTab === "Hepsi" || s.category === activeTab).map((s, i) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(i)} style={{...songRow, border: currentSongIndex === i ? '1px solid orange' : '1px solid #111'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'15px', flex: 2}}>
                    <img src={s.cover} style={rowImg} />
                    <div style={{minWidth:0}}>
                      <div style={{fontWeight:'bold', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{s.title}</div>
                      <div style={{fontSize:'12px', color:'#666'}}>{s.artist}</div>
                    </div>
                  </div>
                  
                  <div style={rowActions}>
                    <span style={{fontSize:'12px', color:'#444'}}>{s.duration || '3:30'}</span>
                    <div style={actionIcon} onClick={(e) => handleLike(e, s.id)}>
                      ❤️ <span style={{fontSize:'11px'}}>{s.likes || 0}</span>
                    </div>
                    <a href={s.url} download target="_blank" onClick={(e) => e.stopPropagation()} style={{textDecoration:'none'}}>
                      <div style={actionIcon}>📥</div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PLAYER BAR */}
      {currentSongIndex !== null && songs[currentSongIndex] && (
        <div style={playerBar}>
          <div style={{display:'flex', alignItems:'center', gap:'15px', flex:1, minWidth:0}}>
            <img src={songs[currentSongIndex].cover} style={{width:'40px', height:'40px', borderRadius:'8px'}} />
            <div style={{fontSize:'12px', fontWeight:'bold', color:'orange', overflow:'hidden'}}>{songs[currentSongIndex].title}</div>
          </div>
          <audio src={songs[currentSongIndex].url} autoPlay controls style={{flex:2, filter:'invert(1)', height:'30px'}} />
          <button onClick={() => setCurrentSongIndex(null)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:'20px'}}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .premium-title {
          font-family: 'Georgia', serif;
          font-weight: 900;
          font-size: 20px;
          letter-spacing: 2px;
          background: linear-gradient(to right, #fff, orange, #fff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(255,165,0,0.3);
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// STYLES
const brandStyle = { display:'flex', alignItems:'center', gap:'15px', cursor:'pointer' };
const navBtn = { background:'#111', color:'white', border:'1px solid #333', padding:'10px 15px', borderRadius:'12px', cursor:'pointer', fontSize:'12px', fontWeight:'bold' };
const backBtn = { background:'none', border:'none', color:'orange', cursor:'pointer', marginBottom:'20px', fontWeight:'bold' };
const inputS = { width:'100%', padding:'12px', marginBottom:'10px', background:'#000', color:'#fff', border:'1px solid #222', borderRadius:'10px', fontSize:'14px' };
const mainBtn = { width:'100%', padding:'15px', background:'orange', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer', color:'#000' };
const catBtn = { padding:'10px 22px', borderRadius:'25px', border:'none', cursor:'pointer', whiteSpace:'nowrap', fontWeight:'bold', transition:'0.3s' };
const panelBox = { background:'#0f0f0f', padding:'25px', borderRadius:'20px', marginBottom:'20px', border:'1px solid #222' };
const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px' };
const playerBar = { position:'fixed' as 'fixed', bottom:15, left:'5%', right:'5%', background:'rgba(0,0,0,0.95)', backdropFilter:'blur(15px)', padding:'15px 25px', borderRadius:'40px', border:'1px solid rgba(255,165,0,0.5)', display:'flex', alignItems:'center', gap:'20px', zIndex:2000 };
const songRow = { background:'#111', padding:'12px 20px', borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', transition:'0.2s' };
const rowImg = { width:'50px', height:'50px', borderRadius:'12px', objectFit:'cover' as 'cover' };
const rowActions = { display:'flex', alignItems:'center', gap:'15px' };
const actionIcon = { background:'#1a1a1a', padding:'8px 12px', borderRadius:'12px', fontSize:'14px', border:'1px solid #222', display:'flex', alignItems:'center', gap:'5px', transition:'0.2s' };
const bannerWrapper = { position:'relative' as 'relative', width:'100%', height:'280px', marginBottom:'30px', borderRadius:'35px', overflow:'hidden' };
const bannerImg = { width:'100%', height:'100%', objectFit:'cover' as 'cover', filter:'brightness(0.6)' };
const bannerNoteStyle = { position:'absolute' as 'absolute', bottom:30, left:30, right:30, color:'#fff', fontSize:'22px', fontWeight:'bold', textShadow:'2px 2px 10px rgba(0,0,0,0.8)' };
const glowBox = { background: '#111', padding: '30px', borderRadius: '30px', textAlign: 'center' as 'center', marginBottom: '30px', border: '1px solid orange' };
const contactGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' };
const contactCard = { background: '#111', padding: '25px', borderRadius: '25px', textAlign: 'center' as 'center', border: '1px solid #222', cursor:'pointer' };
const iconCircle = { width: '50px', height: '50px', background: 'orange', color: 'black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontWeight: 'bold' };
const listItem = { display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #222' };
const miniBtn = { padding:'5px 12px', borderRadius:'5px', border:'none', color:'#fff', fontSize:'11px', cursor:'pointer' };
