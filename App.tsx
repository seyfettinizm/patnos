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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [settings, setSettings] = useState({ logo: '', banner: '' });
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
  const [guestForm, setGuestForm] = useState({ sender: '', title: '', artist: '', platform: 'WhatsApp' });

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setNotifications(data.value.notifications || []);
        setSettings(data.value.settings || { logo: '', banner: '' });
      }
    } catch (err) { console.error("Veri yükleme hatası"); }
  };

  const syncDB = async (newSongs: any[], newNotifs: any[], newSettings = settings) => {
    await supabase.from('settings').update({ 
      value: { songs: newSongs, notifications: newNotifs, settings: newSettings } 
    }).eq('id', 'app_data');
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newNotif = { id: Date.now(), ...guestForm, date: new Date().toLocaleString() };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    await syncDB(songs, updatedNotifs);

    if (guestForm.platform === 'WhatsApp') {
      window.open(`https://wa.me/905052250655?text=Merhaba, ben ${guestForm.sender}. '${guestForm.title}' adlı eserimi gönderiyorum.`);
    } else {
      window.location.href = `mailto:patnosumuz@gmail.com?subject=Eser Gönderimi&body=Eser Bilgileri: ${guestForm.title}`;
    }
    alert("Bilgileriniz kaydedildi. Dosyayı aktarmak için yönlendiriliyorsunuz.");
    setView('home');
  };

  return (
    <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ color: 'orange', fontWeight: 'bold', cursor: 'pointer', fontSize:'14px' }} onClick={() => setView('home')}>İZMİR PATNOSLULAR DERNEĞİ</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setView('contact')} style={navBtn}>📩 Eser Gönder</button>
          <button onClick={() => setView('admin')} style={navBtn}>🔐 Panel {notifications.length > 0 && <span style={badgeStyle}>{notifications.length}</span>}</button>
        </div>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        
        {/* VIEW: İLETİŞİM & GÖNDERİM */}
        {view === 'contact' && (
          <div style={{ maxWidth: '900px', margin: 'auto', animation: 'fadeIn 0.5s ease' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Ana Sayfa</button>
            
            {/* İLETİŞİM KARTLARI */}
            <div style={contactGrid}>
              <div style={contactCard} onClick={() => window.open('https://wa.me/905052250655')}>
                <span style={{fontSize:'30px'}}>💬</span>
                <h3>WhatsApp Hattı</h3>
                <p>0505 225 06 55</p>
              </div>
              <div style={contactCard} onClick={() => window.location.href='mailto:patnosumuz@gmail.com'}>
                <span style={{fontSize:'30px'}}>✉️</span>
                <h3>E-posta Adresi</h3>
                <p>patnosumuz@gmail.com</p>
              </div>
              <div style={contactCard}>
                <span style={{fontSize:'30px'}}>📍</span>
                <h3>Dernek Adresi</h3>
                <p>Konak, İzmir</p>
              </div>
            </div>

            {/* GÖNDERİM FORMU */}
            <div style={panelBox}>
              <h2 style={{ color: 'orange', textAlign: 'center', marginBottom:'20px' }}>ESERİNİ GÖNDER</h2>
              <form onSubmit={handleGuestSubmit}>
                <div style={grid2}>
                  <input placeholder="Adınız Soyadınız" style={inputS} onChange={e => setGuestForm({...guestForm, sender: e.target.value})} required />
                  <input placeholder="Şarkı Adı" style={inputS} onChange={e => setGuestForm({...guestForm, title: e.target.value})} required />
                </div>
                
                <div style={grid2}>
                  <div><label style={labS}>🎵 MÜZİK DOSYASI SEÇ</label><input type="file" accept="audio/*" style={fileS} /></div>
                  <div><label style={labS}>🖼️ KAPAK RESMİ SEÇ</label><input type="file" accept="image/*" style={fileS} /></div>
                </div>

                <label style={labS}>DOSYALARI BİZE NASIL ULAŞTIRACAKSINIZ?</label>
                <select style={inputS} onChange={e => setGuestForm({...guestForm, platform: e.target.value})}>
                  <option>WhatsApp</option>
                  <option>E-posta</option>
                </select>

                <button type="submit" style={mainBtn}>BİLGİLERİ KAYDET VE DOSYALARI AT</button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: YÖNETİM (BİLDİRİM ODAKLI) */}
        {view === 'admin' && (
          <div style={{ maxWidth: '900px', margin: 'auto' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Paneli Kapat</button>
            {!isAuth ? (
              <form onSubmit={e => { e.preventDefault(); if(passInput === "Mihriban04") setIsAuth(true); else alert("Hatalı!"); }} style={{textAlign:'center', marginTop:'50px'}}>
                <input type="password" placeholder="Şifre" style={inputS} onChange={e => setPassInput(e.target.value)} />
                <button type="submit" style={mainBtn}>GİRİŞ</button>
              </form>
            ) : (
              <div>
                <div style={{...panelBox, borderColor:'orange'}}>
                  <h3 style={{color:'orange', marginTop:0}}>🔔 Yeni Gelen Bildirimler</h3>
                  {notifications.map(n => (
                    <div key={n.id} style={notifCard}>
                      <div><strong>{n.sender}</strong>, "{n.title}" eserini <b>{n.platform}</b> üzerinden gönderdi.</div>
                      <button onClick={async () => { const up = notifications.filter(x => x.id !== n.id); setNotifications(up); syncDB(songs, up); }} style={{background:'red', border:'none', padding:'5px 10px', borderRadius:'5px', color:'white', cursor:'pointer'}}>Sil</button>
                    </div>
                  ))}
                </div>

                <div style={panelBox}>
                  <h4 style={{color:'orange', marginTop:0}}>🚀 Manuel Ekleme (E-posta/WP'den Gelenleri Buraya Yaz)</h4>
                  <input placeholder="Eser Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                  <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  <input placeholder="Ses URL" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                  <input placeholder="Kapak URL" value={form.cover} style={inputS} onChange={e => setForm({...form, cover: e.target.value})} />
                  <select value={form.category} style={inputS} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.filter(c => c !== "Hepsi").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAdminAction} style={mainBtn}>KÜTÜPHANEYE KAYDET</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: ANA SAYFA */}
        {view === 'home' && (
          <div>
            <h1 style={{textAlign:'center', color:'orange', letterSpacing:'5px', fontWeight:'800'}}>MÜZİK KUTUSU</h1>
            {settings.banner && <img src={settings.banner} style={{width:'100%', height:'220px', objectFit:'cover', borderRadius:'25px', margin:'20px 0', border:'1px solid #111'}} />}
            <div style={{display:'flex', gap:'10px', overflowX:'auto', marginBottom:'20px', scrollbarWidth:'none'}}>
              {categories.map(c => <button key={c} onClick={() => setActiveTab(c)} style={{...catBtn, background: activeTab === c ? 'orange' : '#111', color: activeTab === c ? '#000' : '#fff'}}>{c}</button>)}
            </div>
            <div style={{display:'grid', gap:'10px'}}>
              {songs.filter(s => activeTab === "Hepsi" || s.category === activeTab).map((s, i) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(i)} style={{background:'#111', padding:'15px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'15px', cursor:'pointer', border: currentSongIndex === i ? '1px solid orange' : '1px solid transparent'}}>
                  <img src={s.cover} style={{width:'50px', height:'50px', borderRadius:'12px'}} />
                  <div>
                    <div style={{fontWeight:'bold'}}>{s.title}</div>
                    <div style={{fontSize:'12px', color:'#666'}}>{s.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSongIndex !== null && songs[currentSongIndex] && (
        <div style={playerBar}>
          <audio src={songs[currentSongIndex].url} autoPlay controls style={{flex:1, filter:'invert(1)'}} />
          <button onClick={() => setCurrentSongIndex(null)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// STYLES
const navBtn = { background:'#111', color:'white', border:'1px solid #222', padding:'8px 12px', borderRadius:'10px', cursor:'pointer', position:'relative' as 'relative', fontSize:'12px' };
const badgeStyle = { position:'absolute' as 'absolute', top:'-5px', right:'-5px', background:'red', fontSize:'10px', width:'18px', height:'18px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' };
const backBtn = { background:'none', border:'none', color:'orange', cursor:'pointer', marginBottom:'15px', fontWeight:'bold' };
const inputS = { width:'100%', padding:'12px', marginBottom:'10px', background:'#000', color:'#fff', border:'1px solid #222', borderRadius:'12px' };
const labS = { fontSize:'10px', color:'orange', display:'block', marginBottom:'5px', fontWeight:'bold' };
const fileS = { background:'#000', padding:'10px', borderRadius:'10px', width:'100%', border:'1px dashed #333', fontSize:'11px', color:'#666' };
const mainBtn = { width:'100%', padding:'15px', background:'orange', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer' };
const catBtn = { padding:'10px 20px', borderRadius:'20px', border:'none', cursor:'pointer', whiteSpace:'nowrap', fontWeight:'bold' };
const panelBox = { background:'#111', padding:'25px', borderRadius:'25px', marginBottom:'20px', border:'1px solid #222' };
const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'10px' };
const contactGrid = { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'15px', marginBottom:'30px' };
const contactCard = { 
  background:'#111', padding:'20px', borderRadius:'20px', textAlign:'center' as 'center', 
  border:'1px solid #222', cursor:'pointer', transition:'0.3s', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
};
// Hover efekti için inline CSS yerine şık bir yaklaşım:
const notifCard = { background:'#000', padding:'15px', borderRadius:'15px', marginBottom:'10px', border:'1px solid #333', display:'flex', justifyContent:'space-between', alignItems:'center' };
const miniBtn = { padding:'5px 12px', borderRadius:'5px', border:'none', background:'#c0392b', color:'#fff', fontSize:'11px', cursor:'pointer' };
const listItem = { display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #222' };
const playerBar = { position:'fixed' as 'fixed', bottom:20, left:'5%', right:'5%', background:'#000', padding:'15px', borderRadius:'25px', border:'1px solid orange', display:'flex', gap:'15px', zIndex:2000 };
