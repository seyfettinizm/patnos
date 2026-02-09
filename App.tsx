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

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
    if (data?.value) setSongs(data.value.songs || []);
  };

  // Eski düzeni koruyarak arama yapma fonksiyonu
  const filteredSongs = songs.filter(s => 
    (s.title?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim()) || 
    (s.artist?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* ÜST BAŞLIK VE NAVİGASYON */}
      <header style={{ padding: '30px', textAlign: 'center', borderBottom: '2px solid orange', background: '#050505' }}>
        <h1 style={{ color: 'orange', letterSpacing: '2px', margin: 0, fontSize: '24px' }}>İZMİR PATNOSLULAR DERNEĞİ</h1>
        <div style={{ marginTop: '15px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>ANA SAYFA</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>YÖNETİM</button>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        {view === 'admin' ? (
          /* YÖNETİM PANELİ DÜZENİ */
          <div style={{ textAlign: 'center', background: '#111', padding: '40px', borderRadius: '15px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre Giriniz..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
               <div style={{ color: 'orange' }}>
                 <h2 style={{margin: 0}}>Hoşgeldiniz</h2>
                 <p style={{color: '#888'}}>Şu an yönetim yetkiniz aktif. Şarkı ekleme özelliği yakında burada olacak.</p>
                 <button onClick={() => setIsAuth(false)} style={{color:'red', background:'none', border:'none', cursor:'pointer'}}>Çıkış Yap</button>
               </div>
            )}
          </div>
        ) : (
          /* ANA SAYFA (ESKİ ŞIK DÜZEN) */
          <div>
            {/* TASARIMI BOZMAYAN ARAMA ÇUBUĞU */}
            <div style={{ position: 'relative', marginBottom: '25px' }}>
              <input 
                type="text" 
                placeholder="🔍 Şarkı veya Sanatçı Ara..." 
                style={searchBarS}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              {filteredSongs.length > 0 ? (
                filteredSongs.map(s => (
                  /* İŞTE O ESKİ ŞIK ŞARKI KARTLARI */
                  <div key={s.id} style={songCardS}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'orange', fontWeight: 'bold', fontSize: '18px' }}>{s.title}</div>
                      <div style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>{s.artist}</div>
                    </div>
                    <button onClick={() => window.open(s.url, '_blank')} style={playBtnS}>OYNAT</button>
                  </div>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '50px', color: '#444'}}>
                  {searchTerm ? "Aradığınız kriterde şarkı bulunamadı." : "Şarkılar yükleniyor..."}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// STİL TANIMLAMALARI (ESKİ DÜZENİN SIRRI BURADA)
const navBtn = { background: 'none', border: 'none', color: '#888', cursor: 'pointer', margin: '0 15px', fontWeight: 'bold', fontSize: '14px', transition: '0.3s' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange', paddingBottom: '5px' };
const inputS = { padding: '12px', background: '#000', border: '1px solid orange', color: '#fff', borderRadius: '8px', width: '250px', textAlign: 'center' };
const searchBarS = { width: '100%', padding: '15px 20px', background: '#111', border: '1px solid #222', borderRadius: '15px', color: '#fff', fontSize: '16px', outline: 'none', transition: '0.3s' };
const songCardS = { background: '#111', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222', transition: '0.2s' };
const playBtnS = { padding: '10px 25px', borderRadius: '25px', border: '1px solid orange', color: 'orange', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
