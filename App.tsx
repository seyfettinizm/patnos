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
  const [searchTerm, setSearchTerm] = useState(""); // Arama kelimesi için

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
    if (data?.value) setSongs(data.value.songs || []);
  };

  // Arama filtresi: Hem şarkı adında hem sanatçıda arar
  const filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '30px', textAlign: 'center', background: '#050505', borderBottom: '2px solid orange' }}>
        <h1 style={{ color: 'orange', letterSpacing: '2px', textTransform: 'uppercase' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <div style={{ marginTop: '15px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>ANA SAYFA</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>YÖNETİM</button>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        {view === 'admin' ? (
          <div style={{ textAlign: 'center', background: '#111', padding: '40px', borderRadius: '15px' }}>
            {!isAuth ? (
              <div>
                <h3 style={{color: 'orange'}}>Yönetim Paneli Girişi</h3>
                <input type="password" placeholder="Şifre Giriniz..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı Şifre!"))} />
              </div>
            ) : (
               <div style={{ color: 'orange' }}>
                 <h2>Hoşgeldiniz</h2>
                 <p>Şu an yönetim yetkiniz aktif. Eski düzeniniz korunuyor.</p>
               </div>
            )}
          </div>
        ) : (
          <div>
            {/* TASARIMI BOZMAYAN ARAMA ÇUBUĞU */}
            <div style={{ marginBottom: '25px' }}>
              <input 
                type="text" 
                placeholder="🔍 Şarkı veya Sanatçı Ara..." 
                style={searchBarS}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              {filteredSongs.map(s => (
                <div key={s.id} style={songCardS}>
                  <div>
                    <div style={{ color: 'orange', fontWeight: 'bold', fontSize: '18px' }}>{s.title}</div>
                    <div style={{ color: '#888', fontSize: '14px' }}>{s.artist}</div>
                  </div>
                  <button onClick={() => window.open(s.url, '_blank')} style={playBtnS}>OYNAT</button>
                </div>
              ))}
              {filteredSongs.length === 0 && <p style={{textAlign:'center', color:'#555'}}>Sonuç bulunamadı...</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// STİLLER
const navBtn = { background: 'none', border: 'none', color: '#666', cursor: 'pointer', margin: '0 15px', fontWeight: 'bold', fontSize: '16px' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange', paddingBottom: '5px' };
const inputS = { padding: '12px', background: '#000', border: '1px solid orange', color: '#fff', borderRadius: '8px', width: '250px', textAlign: 'center' };
const searchBarS = { width: '100%', padding: '15px', background: '#111', border: '1px solid #222', borderRadius: '12px', color: '#fff', fontSize: '16px', outline: 'none' };
const songCardS = { background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const playBtnS = { padding: '10px 25px', borderRadius: '25px', border: '1px solid orange', color: 'orange', background: 'none', cursor: 'pointer', fontWeight: 'bold' };
