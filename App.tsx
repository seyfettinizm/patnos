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
  const [newSong, setNewSong] = useState({ title: '', url: '', category: 'Genel' });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) setSongs(data.value.songs || []);
    };
    load();
  }, []);

  const save = async (up: any[]) => {
    await supabase.from('settings').update({ value: { songs: up } }).eq('id', 'app_data');
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const up = [{ ...newSong, id: Date.now() }, ...songs];
    setSongs(up);
    save(up);
    setNewSong({ title: '', url: '', category: 'Genel' });
    alert("Koleksiyona Eklendi!");
  };

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* SOL MENÜ */}
      <nav style={{ width: '240px', background: '#000', padding: '30px', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '20px', marginBottom: '20px' }}>PATNOS MÜZİK</div>
        <button onClick={() => setIsAdmin(false)} style={{ background: !isAdmin ? '#f39c12' : 'transparent', color: !isAdmin ? '#000' : '#fff', border: 'none', padding: '12px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold' }}>🏠 Ana Sayfa</button>
        <button onClick={() => setIsAdmin(true)} style={{ background: isAdmin ? '#f39c12' : 'transparent', color: isAdmin ? '#000' : '#fff', border: 'none', padding: '12px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold' }}>⚙️ Yönetim Paneli</button>
      </nav>

      {/* ANA İÇERİK */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {isAdmin ? (
          <div style={{ maxWidth: '500px' }}>
            <h2 style={{ color: '#f39c12' }}>Yeni Eser Ekle</h2>
            <form onSubmit={add} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input placeholder="Eser Adı" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} required />
              <input placeholder="Ses Linki (MP3)" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} required />
              <select value={newSong.category} onChange={e => setNewSong({...newSong, category: e.target.value})} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}>
                <option>Patnos Türküleri</option>
                <option>Dengbêjler</option>
                <option>Sizden Gelenler</option>
              </select>
              <button style={{ background: '#f39c12', color: '#000', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>KAYDET</button>
            </form>
          </div>
        ) : (
          <div>
            {/* BANNER */}
            <div style={{ background: 'linear-gradient(rgba(0,0,0,0.3), #000), url("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad")', height: '300px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px', marginBottom: '40px', backgroundSize: 'cover' }}>
              <span style={{ background: '#f39c12', color: '#000', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', width: 'fit-content' }}>HAFTANIN SEÇİMİ</span>
              <h1 style={{ fontSize: '42px', margin: '15px 0' }}>Patnos'tan İzmir'e Bir Melodi...</h1>
              <p style={{ color: '#ccc', maxWidth: '500px' }}>Köklerinizi hissedin. En sevdiğiniz Dengbêjler ve yöresel ezgiler tek bir kutuda toplandı.</p>
            </div>

            {/* KOLEKSİYONLAR */}
            <h2 style={{ marginBottom: '20px' }}>ÖZEL KOLEKSİYONLAR</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
              {[ {t:'Patnos Türküleri', c:'#3498db'}, {t:'Patnoslu Sanatçılar', c:'#9b59b6'}, {t:'Dengbêjler', c:'#e67e22'}, {t:'Sizden Gelenler', c:'#2ecc71'} ].map(item => (
                <div key={item.t} style={{ background: item.c, height: '180px', borderRadius: '15px', padding: '20px', display: 'flex', alignItems: 'flex-end', fontWeight: 'bold', fontSize: '18px' }}>{item.t}</div>
              ))}
            </div>

            {/* LİSTE */}
            <h2>ŞU AN POPÜLER</h2>
            <div style={{ background: '#111', borderRadius: '15px', padding: '10px' }}>
              {songs.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #222', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: '#555' }}>{i + 1}</span>
                    <span style={{ fontWeight: 'bold' }}>{s.title}</span>
                    <span style={{ color: '#f39c12', fontSize: '12px' }}>{s.category}</span>
                  </div>
                  <button onClick={() => setCurrentSong(s)} style={{ background: 'transparent', color: '#f39c12', border: '1px solid #f39c12', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer' }}>▶</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ALT PLAYER */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111', padding: '15px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid #f39c12', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', background: '#333', borderRadius: '5px' }}></div>
            <div>
              <div style={{ fontWeight: 'bold' }}>{currentSong.title}</div>
              <div style={{ fontSize: '12px', color: '#777' }}>Patnos'un Sesi</div>
            </div>
          </div>
          <audio src={currentSong.url} autoPlay controls style={{ filter: 'invert(1)', width: '40%' }} />
          <button onClick={() => setCurrentSong(null)} style={{ background: 'none', color: '#555', border: 'none', cursor: 'pointer' }}>Kapat</button>
        </div>
      )}
    </div>
  );
}
