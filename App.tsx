import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-client';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [newSong, setNewSong] = useState({ title: '', url: '' });

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setLogoUrl(data.value.logoUrl || "");
        setBannerUrl(data.value.bannerUrl || "");
      }
    };
    loadData();
  }, []);

  const handleSave = async (updated: any[]) => {
    await supabase.from('settings').update({ 
      value: { songs: updated, logoUrl, bannerUrl } 
    }).eq('id', 'app_data');
    alert("BULUTA KAYDEDILDI!");
  };

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const up = [{ ...newSong, id: Date.now() }, ...songs];
    setSongs(up);
    handleSave(up);
    setNewSong({ title: '', url: '' });
  };

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <nav style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setIsAdmin(false)} style={{ padding: '12px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>GIRIS</button>
          <button onClick={() => setIsAdmin(true)} style={{ padding: '12px', color: '#ff4d4d', cursor: 'pointer', background: '#333', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>PANEL</button>
        </nav>

        <main style={{ flex: 1 }}>
          {isAdmin ? (
            <div style={{ maxWidth: '450px' }}>
              <h2 style={{ color: 'orange' }}>Yönetici Paneli</h2>
              <input placeholder="Logo Linki" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '10px', background: '#111', color: 'white', border: '1px solid #444' }} />
              <input placeholder="Banner Linki" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '10px', background: '#111', color: 'white', border: '1px solid #444' }} />
              <button onClick={() => handleSave(songs)} style={{ width: '100%', background: 'orange', padding: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>AYARLARI KAYDET</button>
              
              <form onSubmit={onAdd} style={{ marginTop: '30px', border: '1px solid #333', padding: '20px', borderRadius: '10px' }}>
                <h3 style={{ color: '#4CAF50', marginTop: '0' }}>Yeni Şarkı Ekle</h3>
                <input placeholder="Şarkı Adı" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '10px', background: '#111', color: 'white', border: '1px solid #444' }} required />
                <input placeholder="Ses Linki (MP3)" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '10px', background: '#111', color: 'white', border: '1px solid #444' }} required />
                <button type="submit" style={{ width: '100%', background: '#4CAF50', color: 'white', padding: '12px', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>LISTEYE EKLE</button>
              </form>
            </div>
          ) : (
            <div>
              {bannerUrl && <img src={bannerUrl} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '20px', border: '1px solid #333' }} alt="banner" />}
              <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {songs.map(s => (
                  <div key={s.id} style={{ background: '#111', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222' }}>
                    <span style={{ fontSize: '18px' }}>{s.title}</span>
                    <button onClick={() => setCurrentSong(s)} style={{ background: 'orange', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px' }}>▶</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {currentSong && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0a0a0a', padding: '25px', borderTop: '3px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -10px 30px rgba(0,0,0,0.5)' }}>
          <span style={{ color: 'orange', fontWeight: 'bold', fontSize: '20px' }}>{currentSong.title}</span>
          <audio src={currentSong.url} autoPlay controls style={{ filter: 'invert(1)', width: '50%' }} />
          <button onClick={() => setCurrentSong(null)} style={{ background: 'transparent', color: 'white', border: '1px solid #444', padding: '8px 15px', cursor: 'pointer', borderRadius: '5px' }}>Kapat</button>
        </div>
      )}
    </div>
  );
}
