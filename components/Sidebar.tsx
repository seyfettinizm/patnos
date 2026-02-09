import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [view, setView] = useState<'home' | 'admin'>('home');
  const [isAuth, setIsAuth] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [adminSearchTerm, setAdminSearchTerm] = useState(""); 
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
    if (data?.value) setSongs(data.value.songs || []);
  };

  const syncDB = async (newSongs: any[]) => {
    await supabase.from('settings').update({ value: { songs: newSongs } }).eq('id', 'app_data');
  };

  const handleAdminAction = async () => {
    if(!form.title || !form.url) return alert("Lütfen şarkı adı ve linki doldurun!");
    const updated = [{ ...form, id: Date.now(), likes: 0 }, ...songs];
    setSongs(updated);
    await syncDB(updated);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    alert("Başarıyla Eklendi!");
  };

  const filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(adminSearchTerm.toLowerCase()) || 
    s.artist.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* ÜST LOGO VE NAVİGASYON */}
      <header style={{ padding: '40px 20px', textAlign: 'center', background: 'linear-gradient(to bottom, #111, #050505)', borderBottom: '1px solid #222' }}>
        <h1 style={{ color: 'orange', fontSize: '28px', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 20px 0' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeTab : inactiveTab}>ANA SAYFA</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeTab : inactiveTab}>YÖNETİM</button>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        {view === 'admin' ? (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            {!isAuth ? (
              <div style={card}>
                <h3 style={{color: 'orange', textAlign: 'center', marginBottom: '20px'}}>Yönetici Paneli</h3>
                <input type="password" placeholder="Sistem Şifresi..." style={inputStyle} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hata!"))} />
              </div>
            ) : (
              <div>
                {/* YENİ ŞARKI EKLEME */}
                <div style={card}>
                  <h3 style={{color: 'orange', marginBottom: '15px'}}>Yeni Eser Ekle</h3>
                  <input placeholder="Eser Adı" value={form.title} style={inputStyle} onChange={e => setForm({...form, title: e.target.value})} />
                  <input placeholder="Sanatçı" value={form.artist} style={inputStyle} onChange={e => setForm({...form, artist: e.target.value})} />
                  <input placeholder="Müzik Linki (YouTube/Drive vb.)" value={form.url} style={inputStyle} onChange={e => setForm({...form, url: e.target.value})} />
                  <button onClick={handleAdminAction} style={buttonStyle}>LİSTEYE EKLE</button>
                </div>

                {/* ARŞİV YÖNETİMİ */}
                <div style={card}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{color: 'orange', margin: 0}}>Arşiv Yönetimi</h3>
                    <input 
                      type="text" 
                      placeholder="🔍 Arşivde ara..." 
                      style={{ ...inputStyle, width: '200px', marginBottom: 0, padding: '8px' }}
                      value={adminSearchTerm}
                      onChange={(e) => setAdminSearchTerm(e.target.value)}
                    />
                  </div>
                  <div style={{maxHeight: '400px', overflowY: 'auto', border: '1px solid #222', borderRadius: '8px'}}>
                    {filteredSongs.map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #111', background: '#0a0a0a' }}>
                        <span><b style={{color: 'orange'}}>{s.title}</b> - {s.artist}</span>
                        <button onClick={async () => { if(confirm("Silinsin mi?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n); } }} style={{color:'red', background:'none', border:'none', cursor:'pointer', fontWeight: 'bold'}}>SİL</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ANA SAYFA LİSTESİ */
          <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
            {songs.map(s => (
              <div key={s.id} style={songCard}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'orange' }}>{s.title}</div>
                  <div style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>{s.artist}</div>
                </div>
                <button onClick={() => window.open(s.url, '_blank')} style={playBtn}>OYNAT</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// TASARIM AYARLARI (STİLLER)
const card = { background: '#111', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '1px solid #222' };
const songCard = { background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', display: 'flex', alignItems: 'center', transition: '0.3s' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '15px', background: 'orange', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const playBtn = { padding: '10px 25px', borderRadius: '25px', border: '1px solid orange', color: 'orange', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' };
const activeTab = { background: 'none', border: 'none', borderBottom: '2px solid orange', color: 'orange', padding: '10px', cursor: 'pointer', fontWeight: 'bold' };
const inactiveTab = { background: 'none', border: 'none', color: '#666', padding: '10px', cursor: 'pointer', fontWeight: 'bold' };
