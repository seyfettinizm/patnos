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

  const adminFilteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(adminSearchTerm.toLowerCase()) || 
    s.artist.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #111' }}>
        <h1 style={{ color: 'orange' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => setView('home')} style={navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        {view === 'admin' && (
          <div>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hata!"))} />
            ) : (
              <div>
                <div style={panel}>
                  <h3 style={{color: 'orange'}}>Yeni Şarkı Ekle</h3>
                  <input placeholder="Şarkı Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                  <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  <input placeholder="URL" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                  <button onClick={handleAdminAction} style={mainBtn}>KAYDET</button>
                </div>

                <div style={panel}>
                  <h3 style={{color: 'orange'}}>Arşiv Yönetimi</h3>
                  {/* ARAMA ÇUBUĞU BURADA */}
                  <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid orange', borderRadius: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'orange', display: 'block', marginBottom: '5px' }}>🔍 ŞARKI VEYA SANATÇI ARA</label>
                    <input 
                      type="text" 
                      placeholder="İsim yazın..." 
                      style={{ ...inputS, marginBottom: 0 }}
                      value={adminSearchTerm}
                      onChange={(e) => setAdminSearchTerm(e.target.value)}
                    />
                  </div>
                  {adminFilteredSongs.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #222' }}>
                      <span>{s.title} - {s.artist}</span>
                      <button onClick={async () => { if(confirm("Silinsin mi?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n); } }} style={{color:'red', background:'none', border:'none', cursor:'pointer'}}>Sil</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const navBtn = { color: '#888', background: 'none', border: 'none', cursor: 'pointer', margin: '0 10px' };
const inputS = { width: '100%', padding: '12px', marginBottom: '10px', background: '#000', border: '1px solid #222', borderRadius: '8px', color: '#fff' };
const mainBtn = { width: '100%', padding: '12px', background: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const panel = { background: '#111', padding: '20px', borderRadius: '15px', marginBottom: '20px' };
