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

  const handleSave = async (updatedSongs: any[]) => {
    const { error } = await supabase.from('settings').update({ 
      value: { songs: updatedSongs, logoUrl, bannerUrl } 
    }).eq('id', 'app_data');
    if (!error) alert("Kaydedildi!");
  };

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [{ ...newSong, id: Date.now() }, ...songs];
    setSongs(updated);
    handleSave(updated);
    setNewSong({ title: '', url: '' });
  };

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <nav style={{ width: '150px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setIsAdmin(false)} style={{ padding: '10px', cursor: 'pointer', background: '#333', color: 'white', border: 'none' }}>Giriş</button>
          <button onClick={() => setIsAdmin(true)} style={{ padding: '10px', color: 'red', cursor: 'pointer', background: '#333', border: 'none' }}>Panel</button>
        </nav>

        <main style={{ flex: 1 }}>
          {isAdmin ? (
            <div style={{ maxWidth: '400px' }}>
              <input placeholder="Logo URL" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px', background: '#222', color: 'white' }} />
              <input placeholder="Banner URL" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px', background: '#222', color: 'white' }} />
              <button onClick={() => handleSave(songs)} style={{ width: '100%', background: 'orange', padding: '10px', fontWeight: 'bold', border: 'none' }}>KAYDET</button>
              <form onSubmit={onAdd} style={{ marginTop: '20px', border: '1px solid #333', padding: '15px' }}>
                <input placeholder="Sarki Adi" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} required />
                <input placeholder="MP3 Linki" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} required />
                <button style={{ width: '100%', background: 'green', color: 'white', padding: '10px', border: 'none' }}>BULUTA EKLE</button>
              </form>
            </div>
          ) : (
            <div>
              {bannerUrl && <img src={bannerUrl} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px' }} />}
              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {songs.map(s => (
                  <div key={s.id} style={{ background: '#111', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', border: '1px solid #222' }}>
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
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111', padding: '20px', display: 'flex', justifyContent: 'space-between', borderTop: '2px solid orange' }}>
          <b>{currentSong.title}</b>
          <audio src={currentSong.url} autoPlay controls style={{ filter: 'invert(1)' }} />
          <button onClick={() => setCurrentSong(null)} style={{ background: 'none', color: 'white', border: 'none' }}>Kapat</button>
        </div>
      )}
    </div>
  );
}
