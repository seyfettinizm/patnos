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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Hepsi");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
    if (data?.value) setSongs(data.value.songs || []);
  };

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  const filteredSongs = songs.filter(s => {
    const matchesSearch = (s.title?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim());
    const matchesTab = activeTab === "Hepsi" || s.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* ÜST LOGO VE BAŞLIK (Görsel 2'deki gibi) */}
      <header style={{ padding: '40px 20px', textAlign: 'center', background: 'linear-gradient(to bottom, #050505, #000)' }}>
        <img src="https://docdtizfqeolqwwfaiyi.supabase.co/storage/v1/object/public/songs/logo.png" alt="Logo" style={{ width: '80px', marginBottom: '15px' }} />
        <h1 style={{ color: '#fff', fontSize: '28px', margin: '5px 0', letterSpacing: '1px' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <p style={{ color: 'orange', fontSize: '14px', fontWeight: 'bold', letterSpacing: '3px' }}>— MÜZİK KUTUSU —</p>
        
        <nav style={{ marginTop: '20px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button style={navBtn}>İletişim</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </nav>
      </header>

      <main style={{ maxWidth: '800px', margin: 'auto', padding: '0 20px 40px' }}>
        {view === 'admin' ? (
          /* YÖNETİM PANELİ */
          <div style={{ textAlign: 'center', background: '#111', padding: '40px', borderRadius: '20px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre Giriniz..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
               <div style={{ color: 'orange' }}><h2>Yönetim Paneli Aktif</h2><button onClick={() => setIsAuth(false)} style={{color:'#555', background:'none', border:'none', cursor:'pointer'}}>Çıkış</button></div>
            )}
          </div>
        ) : (
          /* ANA SAYFA (Görsel 2 Düzeni) */
          <div>
            {/* MANZARA RESMİ */}
            <div style={{ width: '100%', height: '250px', borderRadius: '30px', overflow: 'hidden', marginBottom: '30px', border: '1px solid #222' }}>
              <img src="https://docdtizfqeolqwwfaiyi.supabase.co/storage/v1/object/public/songs/patnos-manzara.jpg" alt="Patnos" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* KATEGORİ SEKMELERİ */}
            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '20px' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} style={activeTab === cat ? activeTabS : tabBtnS}>{cat}</button>
              ))}
            </div>

            {/* ARAMA ÇUBUĞU (Görsel 1'deki özellik) */}
            <input 
              type="text" 
              placeholder="🔍 Şarkı veya Sanatçı Ara..." 
              style={searchBarS}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* ŞARKI LİSTESİ */}
            <div style={{ display: 'grid', gap: '15px', marginTop: '30px' }}>
              {filteredSongs.map(s => (
                <div key={s.id} style={songCardS}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={s.cover || "https://docdtizfqeolqwwfaiyi.supabase.co/storage/v1/object/public/songs/default-art.png"} style={{ width: '50px', height: '50px', borderRadius: '8px' }} />
                    <div>
                      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '17px' }}>{s.title}</div>
                      <div style={{ color: '#666', fontSize: '13px' }}>Söz Müzik: {s.artist}</div>
                    </div>
                  </div>
                  <button onClick={() => window.open(s.url, '_blank')} style={playBtnS}>OYNAT</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// GÖRSEL 2 STİLLERİ
const navBtn = { background: 'none', border: 'none', color: '#888', cursor: 'pointer', margin: '0 15px', fontSize: '15px' };
const activeNav = { ...navBtn, color: '#fff', borderBottom: '2px solid orange', paddingBottom: '5px' };
const tabBtnS = { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '16px', whiteSpace: 'nowrap' };
const activeTabS = { ...tabBtnS, color: 'orange', fontWeight: 'bold' };
const searchBarS = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', color: '#fff', outline: 'none' };
const songCardS = { background: '#080808', padding: '15px 20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #111' };
const playBtnS = { padding: '8px 20px', borderRadius: '20px', border: '1px solid orange', color: 'orange', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };
const inputS = { padding: '12px', background: '#000', border: '1px solid orange', color: '#fff', borderRadius: '8px', textAlign: 'center' };
