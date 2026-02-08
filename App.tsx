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
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button onClick={() => setIsAdmin(false)} style={{ padding: '10px 20px', cursor: 'pointer', background: isAdmin ? '#333' : 'orange', border: 'none', borderRadius: '5px', color: '#000', fontWeight: 'bold' }}>ANA SAYFA</button>
        <button onClick={() => setIsAdmin(true)} style={{ padding: '10px 20px', cursor: 'pointer', background: isAdmin ? 'red' : '#333', border: 'none', borderRadius: '5px', color: '#fff' }}>YONETICI PANELI</button>
      </div>

      <main>
        {isAdmin ? (
          <div style={{ maxWidth: '500px', background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
            <h3 style={{ color: 'orange' }}>Site Gorselleri</h3>
            <input placeholder="Logo Linki" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #444' }} />
            <input placeholder="Banner Linki" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #444' }} />
            <button onClick={() => handleSave(songs)} style={{ width: '100%', padding: '10px', background: 'orange', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>GÖRSELLERİ KAYDET</button>
            
            <form onSubmit={onAdd} style={{ marginTop: '30px' }}>
              <h3 style={{ color: '#4CAF50' }}>Yeni Sarki Ekle</h3>
              <input placeholder="Sarki Adi" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #444' }} required />
              <input placeholder="Ses Dosyasi (MP3) Linki" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #444' }} required />
              <button type="submit" style={{ width: '100%', padding: '10px', background: '#4CAF50', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>LISTEYE EKLE</button>
            </form>
          </div>
        ) : (
          <div>
            {bannerUrl && <img src={bannerUrl} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '20px', marginBottom: '20px' }} alt="banner" />}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
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

      {currentSong && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#000', padding: '20px', borderTop: '3px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b style={{ color: 'orange' }}>{currentSong.title}</b>
          <audio src={currentSong.url} autoPlay controls style={{ width: '60%', filter: 'invert(1)' }} />
          <button onClick={() => setCurrentSong(null)} style={{ background: 'none', color: '#fff', border: '1px solid #444', padding: '5px 10px', cursor: 'pointer' }}>Kapat</button>
        </div>
      )}
    </div>
  );
}
