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
    const load = async () => {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setLogoUrl(data.value.logoUrl || "");
        setBannerUrl(data.value.bannerUrl || "");
      }
    };
    load();
  }, []);

  const saveToCloud = async (updated: any[]) => {
    await supabase.from('settings').update({ 
      value: { songs: updated, logoUrl, bannerUrl } 
    }).eq('id', 'app_data');
    alert("BULUTA KAYDEDILDI!");
  };

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const up = [{ ...newSong, id: Date.now() }, ...songs];
    setSongs(up);
    saveToCloud(up);
    setNewSong({ title: '', url: '' });
  };

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <nav style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setIsAdmin(false)} style={{ padding: '10px', cursor: 'pointer' }}>GIRIS</button>
          <button onClick={() => setIsAdmin(true)} style={{ padding: '10px', color: 'red', cursor: 'pointer' }}>PANEL</button>
        </nav>
        <main style={{ flex: 1 }}>
          {isAdmin ? (
            <div style={{ maxWidth: '400px' }}>
              <input placeholder="Logo URL" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <input placeholder="Banner URL" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <button onClick={() => saveToCloud(songs)} style={{ width: '100%', background: 'orange', padding: '10px' }}>AYARLARI KAYDET</button>
              <form onSubmit={onAdd} style={{ marginTop: '20px', border: '1px solid #333', padding: '15px' }}>
                <input placeholder="Sarki Adi" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} required />
                <input placeholder="MP3 URL" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} required />
                <button style={{ width: '100%', background: 'green', color: 'white', padding: '10px' }}>BULUTA EKLE</button>
              </form>
            </div>
          ) : (
            <div>
              {bannerUrl && <img src={bannerUrl} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px' }} />}
              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {songs.map(s => (
                  <div key={s.id} style={{ background: '#111', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{s.title}</span>
                    <button onClick={() => setCurrentSong(s)} style={{ background: 'orange', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>▶</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      {currentSong && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#222', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b>{currentSong.title}</b>
          <audio src={currentSong.url} autoPlay controls />
          <button onClick={() => setCurrentSong(null)}>Kapat</button>
        </div>
      )}
    </div>
  );
}
