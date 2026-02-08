import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [newSong, setNewSong] = useState({ title: '', url: '' });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) setSongs(data.value.songs || []);
    };
    load();
  }, []);

  const save = async (updated: any[]) => {
    await supabase.from('settings').update({ value: { songs: updated } }).eq('id', 'app_data');
    alert("Kaydedildi!");
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const up = [{ ...newSong, id: Date.now() }, ...songs];
    setSongs(up);
    save(up);
    setNewSong({ title: '', url: '' });
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <button onClick={() => setIsAdmin(!isAdmin)} style={{ marginBottom: '20px', padding: '10px' }}>
        {isAdmin ? "SİTEYE DÖN" : "YÖNETİCİ PANELİ"}
      </button>

      {isAdmin ? (
        <form onSubmit={add} style={{ maxWidth: '400px', border: '1px solid #333', padding: '20px' }}>
          <input placeholder="Şarkı Adı" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} style={{ width: '100%', marginBottom: '10px' }} required />
          <input placeholder="MP3 Linki" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} style={{ width: '100%', marginBottom: '10px' }} required />
          <button type="submit" style={{ width: '100%', background: 'green', color: '#fff' }}>EKLE</button>
        </form>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {songs.map(s => (
            <div key={s.id} style={{ background: '#111', padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{s.title}</span>
              <button onClick={() => setCurrentSong(s)} style={{ background: 'orange' }}>OYNAT</button>
            </div>
          ))}
        </div>
      )}

      {currentSong && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#222', padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <b>{currentSong.title}</b>
          <audio src={currentSong.url} autoPlay controls />
          <button onClick={() => setCurrentSong(null)}>Kapat</button>
        </div>
      )}
    </div>
  );
}
