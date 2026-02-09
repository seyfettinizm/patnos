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
    alert("Başarıyla Güncellendi!");
  };

  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const likedSongs = JSON.parse(localStorage.getItem('p_likes') || '[]');
    if (likedSongs.includes(id)) return alert("Bu eseri zaten beğendiniz.");
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

  // ARAMA FİLTRESİ
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
              <p style={{ fontStyle: 'italic', lineHeight: '1.6', fontSize: '15px', color: '#ccc' }}>"Söz uçar, tel kalır; süzülür gönülden sese ulaşır."</p>
            </div>
            <div style={contactGrid}>
              <div style={cCard} onClick={() => window.open('https://wa.me/905052250655')}><b>WhatsApp</b><br/>0505 225 06 55</div>
              <div style={cCard}><b>E-Posta</b><br/>patnosumuz@gmail.com</div>
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
                  <h3 style={{ color: 'orange' }}>⚙️ Ayarlar ve Şarkı Ekle</h3>
                  <input placeholder="Şarkı Adı" value={form.title} style={inputS} onChange={e => setForm({ ...form, title: e.target.value })} />
                  <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({ ...form, artist: e.target.value })} />
                  <input placeholder="Ses URL" value={form.url} style={inputS} onChange={e => setForm({ ...form, url: e.target.value })} />
                  <input placeholder="Kapak URL" value={form.cover} style={inputS} onChange={e => setForm({ ...form, cover: e.target.value })} />
                  <button onClick={handleAdminAction} style={mainBtn}>KAYDET</button>
                </div>

                <div style={panelBox}>
                  <h3 style={{ color: 'orange', marginBottom: '15px' }}>⚙️ Arşiv Yönetimi</h3>
                  
                  {/* ARAMA ÇUBUĞU BURADA! */}
                  <div style={{ background: '#000', padding: '10px', borderRadius: '10px', border: '1px solid orange', marginBottom: '20px' }}>
                    <label style={{color: 'orange', fontSize: '12px', fontWeight: 'bold'}}>🔍 ARŞİVDE ARA</label>
                    <input 
                      type="text" 
                      placeholder="Şarkı veya sanatçı ismini buraya yazın..." 
                      style={{ ...inputS, marginBottom: 0, marginTop: '5px' }}
                      value={adminSearchTerm}
                      onChange={(e) => setAdminSearchTerm(e.target.value)}
                    />
                  </div>

                  {adminFilteredSongs.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #222' }}>
                      <span>{s.title}</span>
                      <div>
                        <button onClick={() => { setForm(s); setEditId(s.id); window.scrollTo(0,0); }} style={{ color: '#3498db', background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                        <button onClick={async () => { if(confirm("Silinsin mi?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n); } }} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>🗑️</button>
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
            <div style={tabs}>
              {categories.map(c => <button key={c} onClick={() => setActiveTab(c)} style={{ ...tBtn, color: activeTab === c ? 'orange' : '#555' }}>{c}</button>)}
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {displayedSongs.map((s) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(sortedSongs.findIndex(x => x.id === s.id))} style={sRow}>
                  <img src={s.cover} style={sImg} />
                  <div style={{ flex: 1 }}>{s.title}<br/><small style={{color:'#555'}}>{s.artist}</small></div>
                  <button onClick={(e) => handleLike(e, s.id)} style={{ background: 'none', border: 'none', color: '#fff' }}>❤️ {s.likes || 0}</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const navLink = { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' };
const inputS = { width: '100%', padding: '12px', marginBottom: '15px', background: '#000', border: '1px solid #222', borderRadius: '8px', color: '#fff' };
const mainBtn = { width: '100%', padding: '14px', background: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const culturalBox = { background: '#111', padding: '20px', borderRadius: '15px', textAlign: 'center' as 'center', marginBottom: '20px' };
const contactGrid = { display: 'grid', gap: '10px' };
const cCard = { background: '#111', padding: '15px', borderRadius: '10px', textAlign: 'center' as 'center' };
const tabs = { display: 'flex', gap: '15px', overflowX: 'auto' as 'auto', marginBottom: '20px' };
const tBtn = { background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' };
const sRow = { background: '#111', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' };
const sImg = { width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' as 'cover' };
const panelBox = { background: '#111', padding: '20px', borderRadius: '15px', marginBottom: '20px' };
