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

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #111' }}>
        <h1 style={{ color: 'orange', fontSize: '24px' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => setView('home')} style={navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        {view === 'admin' ? (
          <div>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hata!"))} />
            ) : (
              <div style={panel}>
                <h3 style={{color: 'orange'}}>Yeni Şarkı Ekle</h3>
                <input placeholder="Şarkı Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                <input placeholder="Sanatçı" value={form.artist} style={inputStyle} onChange={e => setForm({...form, artist: e.target.value})} />
                <input placeholder="URL" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                <button onClick={handleAdminAction} style={mainBtn}>KAYDET</button>
                <div style={{ marginTop: '20px' }}>
                  {songs.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #222' }}>
                      <span>{s.title}</span>
                      <button onClick={async () => { if(confirm("Silinsin mi?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n); } }} style={{color:'red', background:'none', border:'none'}}>Sil</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {songs.map(s => (
              <div key={s.id} style={cardStyle}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'orange' }}>{s.title}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{s.artist}</div>
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

const navBtn = { color: '#888', background: 'none', border: 'none', cursor: 'pointer', margin: '0 10px' };
const inputS = { width: '100%', padding: '10px', marginBottom: '10px', background: '#111', border: '1px solid #222', color: '#fff' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', background: '#111', border: '1px solid #222', color: '#fff' };
const mainBtn = { width: '100%', padding: '10px', background: 'orange', border: 'none', fontWeight: 'bold', cursor: 'pointer' };
const panel = { background: '#050505', padding: '20px', borderRadius: '8px' };
const cardStyle = { background: '#111', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const playBtn = { padding: '5px 15px', borderRadius: '15px', border: '1px solid orange', color: 'orange', background: 'none', cursor: 'pointer' };
