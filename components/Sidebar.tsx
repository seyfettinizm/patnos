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
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '50px' }}>
      <header style={{ padding: '30px', textAlign: 'center', background: '#000', borderBottom: '2px solid orange' }}>
        <h1 style={{ color: 'orange', letterSpacing: '2px', marginBottom: '15px' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '25px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>ANA SAYFA</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>YÖNETİM</button>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
        {view === 'admin' ? (
          <div>
            {!isAuth ? (
              <div style={panel}>
                <h3 style={{color: 'orange', textAlign: 'center'}}>Yönetim Girişi</h3>
                <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hata!"))} />
              </div>
            ) : (
              <div>
                <div style={panel}>
                  <h3 style={{color: 'orange', marginBottom: '15px'}}>Yeni Eser Ekle</h3>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    <input placeholder="Şarkı Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                    <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  </div>
                  <input placeholder="Müzik Linki" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                  <button onClick={handleAdminAction} style={mainBtn}>KAYDET</button>
                </div>

                <div style={panel}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                    <h3 style={{color: 'orange', margin: 0}}>Arşiv Yönetimi</h3>
                    <input 
                      type="text" 
                      placeholder="🔍 Hızlı Ara..." 
                      style={{...inputS, width: '200px', marginBottom: 0, padding: '8px'}}
                      value={adminSearchTerm}
                      onChange={(e) => setAdminSearchTerm(e.target.value)}
                    />
                  </div>
                  {filteredSongs.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #222', background: '#0a0a0a', marginBottom: '5px' }}>
                      <span><b style={{color: 'orange'}}>{s.title}</b> - {s.artist}</span>
                      <button onClick={async () => { if(confirm("Silinsin mi?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n); } }} style={{color:'red', background:'none', border:'none', cursor:'pointer'}}>SİL</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {songs.map(s => (
              <div key={s.id} style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'orange' }}>{s.title}</div>
                   <div style={{ color: '#888' }}>{s.artist}</div>
                </div>
                <button onClick={() => window.open(s.url, '_blank')} style={{padding: '10px 20px', border: '1px solid orange', color: 'orange', background: 'none', cursor: 'pointer', borderRadius: '20px'}}>OYNAT</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const navBtn = { color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange' };
const inputS = { width: '100%', padding: '12px', marginBottom: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' };
const mainBtn = { width: '100%', padding: '15px', background: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const panel = { background: '#111', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '1px solid #1a1a1a' };
