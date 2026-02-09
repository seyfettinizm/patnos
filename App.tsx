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

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
    if (data?.value) setSongs(data.value.songs || []);
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '30px', textAlign: 'center', background: '#050505', borderBottom: '2px solid orange' }}>
        <h1 style={{ color: 'orange', letterSpacing: '2px' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <div style={{ marginTop: '15px' }}>
          <button onClick={() => setView('home')} style={navBtn}>ANA SAYFA</button>
          <button onClick={() => setView('admin')} style={navBtn}>YÖNETİM</button>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        {view === 'admin' ? (
          <div style={{ textAlign: 'center' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hata!"))} />
            ) : (
               <div style={{ background: '#111', padding: '20px', borderRadius: '10px' }}>
                 <h2 style={{ color: 'orange' }}>Yönetim Paneli Açık</h2>
                 <p>Eski düzenine döndü. Şarkıların güvende.</p>
               </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {songs.map(s => (
              <div key={s.id} style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'orange', fontWeight: 'bold', fontSize: '18px' }}>{s.title}</div>
                  <div style={{ color: '#888' }}>{s.artist}</div>
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

const navBtn = { background: 'none', border: 'none', color: 'orange', cursor: 'pointer', margin: '0 15px', fontWeight: 'bold' };
const inputS = { padding: '10px', background: '#000', border: '1px solid orange', color: '#fff', borderRadius: '5px' };
const playBtn = { padding: '8px 20px', borderRadius: '20px', border: '1px solid orange', color: 'orange', background: 'none', cursor: 'pointer' };
