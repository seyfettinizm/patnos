import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

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

  const save = async (updatedSongs: any[]) => {
    const { error } = await supabase.from('settings').update({ 
      value: { songs: updatedSongs, logoUrl, bannerUrl } 
    }).eq('id', 'app_data');
    if (!error) alert("✅ Bulut Başarıyla Güncellendi!");
  };

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const up = [{ ...newSong, id: Date.now() }, ...songs];
    setSongs(up);
    save(up);
    setNewSong({ title: '', url: '' });
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Üst Menü */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #222', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {logoUrl ? <img src={logoUrl} style={{ height: '50px', borderRadius: '50%' }} alt="Logo" /> : <div style={{width:50, height:50, background:'orange', borderRadius:'50%'}} />}
          <h1 style={{ margin: 0, fontSize: '24px', color: 'orange' }}>Patnos Müzik Kutusu</h1>
        </div>
        <button onClick={() => setIsAdmin(!isAdmin)} style={{ background: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isAdmin ? "🏠 SİTEYE DÖN" : "⚙️ YÖNETİCİ PANELİ"}
        </button>
      </header>

      <main>
        {isAdmin ? (
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#111', padding: '25px', borderRadius: '15px', border: '1px solid #333' }}>
            <h2 style={{ color: 'orange', marginTop: 0 }}>🎨 Tasarım Ayarları</h2>
            <div style={{ marginBottom: '15px' }}>
              <label style={{display:'block', marginBottom:5}}>Logo Resim Linki:</label>
              <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '5px' }} placeholder="https://...png" />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{display:'block', marginBottom:5}}>Ana Banner Resim Linki:</label>
              <input value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '5px' }} placeholder="https://...jpg" />
            </div>
            <button onClick={() => save(songs)} style={{ width: '100%', background: 'orange', padding: '15px', fontWeight: 'bold', cursor: 'pointer', border:'none', borderRadius:'5px', color:'#000', fontSize:'16px' }}>GÖRSELLERİ BULUTA KAYDET</button>

            <hr style={{margin:'40px 0', borderColor:'#222'}} />

            <h2 style={{ color: '#4CAF50', marginTop: 0 }}>🎵 Yeni Şarkı Ekle</h2>
            <form onSubmit={onAdd}>
              <input placeholder="Şarkı Adı" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', background:'#000', color:'#fff', border:'1px solid #444' }} required />
              <input placeholder="MP3 Dosya Linki" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', background:'#000', color:'#fff', border:'1px solid #444' }} required />
              <button style={{ width: '100%', background: '#4CAF50', color: '#fff', padding: '15px', fontWeight: 'bold', border:'none', borderRadius:'5px', cursor:'pointer' }}>LİSTEYE EKLE</button>
            </form>
          </div>
        ) : (
          <div>
            {/* Banner Alanı */}
            {bannerUrl ? (
              <div style={{ position: 'relative', height: '350px', borderRadius: '25px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                <img src={bannerUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Banner" />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, #000)', padding: '40px 20px' }}>
                  <h2 style={{ margin: 0, fontSize: '36px' }}>Patnos'un Sesi</h2>
                </div>
              </div>
            ) : (
              <div style={{height: 200, background: '#111', borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30, border: '2px dashed #333'}}>
                <span style={{color: '#555'}}>Henüz bir banner görseli eklenmedi (Panelden ekleyin)</span>
              </div>
            )}

            {/* Şarkı Listesi */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {songs.map(s => (
                <div key={s.id} style={{ background: '#111', padding: '25px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #222', transition: '0.3s' }}>
                  <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                    <div style={{fontSize:'24px'}}>🎵</div>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{s.title}</span>
                  </div>
                  <button onClick={() => setCurrentSong(s)} style={{ background: 'orange', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', fontSize: '22px', display:'flex', alignItems:'center', justifyContent:'center', color:'#000' }}>▶</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modern Oynatıcı Çubuğu */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(15px)', padding: '25px', borderTop: '3px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
          <div style={{flex: 1}}>
            <div style={{ color: 'orange', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>ŞİMDİ OYNATILIYOR</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{currentSong.title}</div>
          </div>
          <audio src={currentSong.url} autoPlay controls style={{ width: '40%', filter: 'invert(1)' }} />
          <div style={{flex: 1, textAlign: 'right'}}>
            <button onClick={() => setCurrentSong(null)} style={{ background: 'none', color: '#777', border: '1px solid #333', padding: '8px 20px', cursor: 'pointer', borderRadius: '20px' }}>✖ KAPAT</button>
          </div>
        </div>
      )}
    </div>
  );
}
