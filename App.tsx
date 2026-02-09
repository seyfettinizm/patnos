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

  const handleAdminAction = async () => {
    let updated;
    if (editId) {
      updated = songs.map(s => s.id === editId ? { ...form, id: editId, likes: s.likes || 0, duration: s.duration } : s);
    } else {
      updated = [{ ...form, id: Date.now(), likes: 0, duration: "3:15" }, ...songs];
    }
    setSongs(updated);
    await syncDB(updated);
    setEditId(null);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    alert("Başarıyla Güncellendi!");
  };

  const adminFilteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(adminSearchTerm.toLowerCase()) || 
    s.artist.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', borderBottom: '1px solid #111', textAlign: 'center' }}>
        <h1 style={{ color: 'orange', margin: 0 }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
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
                  <h3 style={{color:'orange'}}>Yeni Şarkı Ekle</h3>
                  <input placeholder="Şarkı Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                  <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  <input placeholder="URL" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                  <button onClick={handleAdminAction} style={mainBtn}>KAYDET</button>
                </div>

                <div style={panel}>
                  <h3 style={{color:'orange'}}>Arşiv Yönetimi</h3>
                  {/* BEKLENEN ARAMA ÇUBUĞU */}
                  <input 
                    type="text" 
                    placeholder="🔍 Şarkı veya sanatçı ara..." 
                    style={{...inputS, borderColor: 'orange'}}
                    value={adminSearchTerm}
                    onChange={(e) => setAdminSearchTerm(e.target.value)}
                  />
                  {adminFilteredSongs.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #222' }}>
                      <span>{s.title} - {s.artist}</span>
                      <button onClick={async () => { if(confirm("Silinsin mi?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n); } }} style={{color:'red', background:'none', border:'none'}}>Sil</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'home' && (
          <div style={{ display: 'grid', gap: '10px' }}>
            {songs.map(s => (
              <div key={s.id} style={{ background: '#111', padding: '15px', borderRadius: '10px' }}>
                {s.title} - {s.artist}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const navBtn = { background: 'none', border: 'none', color: '#888', cursor: 'pointer' };
const inputS = { width: '100%', padding: '12px', marginBottom: '10px', background: '#000', border: '1px solid #222', borderRadius: '8px', color: '#fff' };
const mainBtn = { width: '100%', padding: '12px', background: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold' };
const panel = { background: '#111', padding: '20px', borderRadius: '15px', marginBottom: '20px' };
