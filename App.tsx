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
    } catch (err) { console.error("Veri yüklenemedi"); }
  };

  const syncDB = async (newSongs: any[], newNotifs: any[], newSettings = settings) => {
    await supabase.from('settings').update({ 
      value: { songs: newSongs, notifications: newNotifs, settings: newSettings } 
    }).eq('id', 'app_data');
  };

  const handleAdminAction = async () => {
    let updated;
    if (editId) {
      updated = songs.map(s => s.id === editId ? { ...form, id: editId } : s);
    } else {
      updated = [{ ...form, id: Date.now() }, ...songs];
    }
    setSongs(updated);
    await syncDB(updated, notifications);
    setEditId(null);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    alert("İşlem Başarılı!");
  };

  return (
    <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ color: 'orange', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setView('home')}>
          {settings.logo && <img src={settings.logo} style={{height:'30px', borderRadius:'50%'}} />}
          PATNOSLULAR DERNEĞİ
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setView('contact')} style={navBtn}>📞 İletişim</button>
          <button onClick={() => setView('admin')} style={navBtn}>🔐 Yönetim</button>
        </div>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        
        {/* VIEW: İLETİŞİM (YENİ TASARIM) */}
        {view === 'contact' && (
          <div style={{ maxWidth: '900px', margin: 'auto', animation: 'fadeIn 0.5s ease' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Geri Dön</button>
            
            {/* GÖSTERİŞLİ DAVET KUTUSU */}
            <div style={glowBox}>
              <h2 style={{color: 'orange', margin: '0 0 15px 0'}}>🎶 Eserlerinizi Paylaşalım!</h2>
              <p style={{fontSize: '18px', lineHeight: '1.6'}}>
                Kıymetli hemşerilerimiz; kendinize ait veya arşivinizdeki özel eserleri bizimle paylaşın, bu platformda binlerce kişiye ulaştıralım. 
                <br/><br/>
                <b>Müzik ve görsel dosyalarınızı WhatsApp veya E-posta yoluyla bize ulaştırabilirsiniz.</b>
              </p>
            </div>

            <div style={contactGrid}>
              <div style={contactCard} onClick={() => window.open('https://wa.me/905052250655')}>
                <div style={iconCircle}>WP</div>
                <h3>WhatsApp Hattı</h3>
                <p>0505 225 06 55</p>
              </div>
              <div style={contactCard} onClick={() => window.location.href='mailto:patnosumuz@gmail.com'}>
                <div style={iconCircle}>@</div>
                <h3>E-posta</h3>
                <p>patnosumuz@gmail.com</p>
              </div>
              <div style={contactCard}>
                <div style={iconCircle}>📍</div>
                <h3>Adresimiz</h3>
                <p style={{fontSize:'13px'}}>Yeşilbağlar Mah. 637/33 Sok. <br/> No:25 Buca / İZMİR</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: YÖNETİM PANELİ (GERİ GELDİ) */}
        {view === 'admin' && (
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Paneli Kapat</button>
            {!isAuth ? (
              <div style={{textAlign:'center', marginTop:'100px'}}>
                <input type="password" placeholder="Yönetici Şifresi" style={inputS} onChange={e => setPassInput(e.target.value)} />
                <button onClick={() => passInput === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!")} style={mainBtn}>GİRİŞ YAP</button>
              </div>
            ) : (
              <div style={{animation: 'fadeIn 0.3s'}}>
                <div style={panelBox}>
                  <h3 style={{color:'orange', marginTop:0}}>🛠️ Site Görselleri</h3>
                  <input placeholder="Logo URL" value={settings.logo} style={inputS} onChange={e => setSettings({...settings, logo: e.target.value})} />
                  <input placeholder="Banner URL" value={settings.banner} style={inputS} onChange={e => setSettings({...settings, banner: e.target.value})} />
                  <button onClick={() => syncDB(songs, notifications, settings)} style={{...mainBtn, background:'#2980b9'}}>AYARLARI KAYDET</button>
                </div>

                <div style={panelBox}>
                  <h3 style={{color:'orange', marginTop:0}}>{editId ? 'Eseri Düzenle' : 'Yeni Eser Ekle'}</h3>
                  <input placeholder="Şarkı Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                  <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  <input placeholder="Ses Dosyası URL (MP3)" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                  <input placeholder="Kapak Resmi URL" value={form.cover} style={inputS} onChange={e => setForm({...form, cover: e.target.value})} />
                  <select value={form.category} style={inputS} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.filter(c => c !== "Hepsi").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAdminAction} style={mainBtn}>{editId ? 'GÜNCELLE' : 'YAYINLA'}</button>
                </div>

                <div style={panelBox}>
                  <h3 style={{color:'orange', marginTop:0}}>🎵 Mevcut Arşiv ({songs.length})</h3>
                  {songs.map(s => (
                    <div key={s.id} style={listItem}>
                      <span>{s.title} - <small style={{color:'orange'}}>{s.category}</small></span>
                      <div style={{display:'flex', gap:'10px'}}>
                        <button onClick={() => {setForm(s); setEditId(s.id); window.scrollTo(0,0);}} style={{...miniBtn, background:'blue'}}>Düzenle</button>
                        <button onClick={async () => { if(confirm("Silinsin mi?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n, notifications); }}} style={{...miniBtn, background:'red'}}>Sil</button>
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
            <div style={{textAlign:'center', marginBottom:'30px'}}>
              <h1 style={{letterSpacing:'10px', color:'orange', fontSize:'26px', fontWeight:'900'}}>MÜZİK ARŞİVİ</h1>
            </div>
            {settings.banner && <img src={settings.banner} style={{width:'100%', height:'250px', objectFit:'cover', borderRadius:'30px', marginBottom:'30px', border:'1px solid #222'}} />}
            
            <div style={{display:'flex', gap:'10px', overflowX:'auto', marginBottom:'25px', scrollbarWidth:'none', paddingBottom:'10px'}}>
              {categories.map(c => (
                <button key={c} onClick={() => setActiveTab(c)} style={{...catBtn, background: activeTab === c ? 'orange' : '#111', color: activeTab === c ? '#000' : '#fff'}}>{c}</button>
              ))}
            </div>

            <div style={{display:'grid', gap:'15px'}}>
              {songs.filter(s => activeTab === "Hepsi" || s.category === activeTab).map((s, i) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(i)} style={{background:'#111', padding:'15px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'15px', cursor:'pointer', border: currentSongIndex === i ? '1px solid orange' : '1px solid #1a1a1a', transition:'0.2s'}}>
                  <img src={s.cover} style={{width:'55px', height:'55px', borderRadius:'12px', objectFit:'cover'}} />
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'bold', color: currentSongIndex === i ? 'orange' : '#fff'}}>{s.title}</div>
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
          <div style={{display:'flex', alignItems:'center', gap:'15px', flex:1}}>
            <img src={songs[currentSongIndex].cover} style={{width:'40px', height:'40px', borderRadius:'8px'}} />
            <div style={{fontSize:'12px', fontWeight:'bold', color:'orange'}}>{songs[currentSongIndex].title}</div>
          </div>
          <audio src={songs[currentSongIndex].url} autoPlay controls style={{flex:2, filter:'invert(1)', height:'35px'}} />
          <button onClick={() => setCurrentSongIndex(null)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer', padding:'0 10px'}}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// STYLES
const navBtn = { background:'#111', color:'white', border:'1px solid #333', padding:'10px 18px', borderRadius:'12px', cursor:'pointer', fontWeight:'bold', fontSize:'13px' };
const backBtn = { background:'none', border:'none', color:'orange', cursor:'pointer', marginBottom:'20px', fontWeight:'bold' };
const inputS = { width:'100%', padding:'14px', marginBottom:'12px', background:'#000', color:'#fff', border:'1px solid #222', borderRadius:'12px', boxSizing:'border-box' as 'border-box' };
const mainBtn = { width:'100%', padding:'15px', background:'orange', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer', color:'#000' };
const catBtn = { padding:'12px 25px', borderRadius:'25px', border:'none', cursor:'pointer', whiteSpace:'nowrap', fontWeight:'bold', fontSize:'13px' };
const panelBox = { background:'#111', padding:'25px', borderRadius:'25px', marginBottom:'20px', border:'1px solid #222' };
const listItem = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', borderBottom:'1px solid #222' };
const miniBtn = { padding:'6px 15px', borderRadius:'8px', border:'none', color:'#fff', fontSize:'11px', cursor:'pointer', fontWeight:'bold' };
const playerBar = { position:'fixed' as 'fixed', bottom:20, left:'5%', right:'5%', background:'rgba(0,0,0,0.95)', backdropFilter:'blur(10px)', padding:'15px 25px', borderRadius:'30px', border:'1px solid orange', display:'flex', alignItems:'center', gap:'15px', zIndex:2000 };

const glowBox = {
  background: 'linear-gradient(145deg, #111, #000)',
  padding: '40px',
  borderRadius: '30px',
  textAlign: 'center' as 'center',
  marginBottom: '40px',
  border: '1px solid orange',
  boxShadow: '0 0 20px rgba(255, 165, 0, 0.2)'
};

const contactGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' };
const contactCard = {
  background: '#111',
  padding: '30px',
  borderRadius: '25px',
  textAlign: 'center' as 'center',
  border: '1px solid #222',
  cursor: 'pointer',
  transition: '0.3s'
};

const iconCircle = {
  width: '60px',
  height: '60px',
  background: 'orange',
  color: 'black',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 15px auto',
  fontSize: '20px',
  fontWeight: 'bold'
};
