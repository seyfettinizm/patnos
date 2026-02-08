import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [view, setView] = useState<'home' | 'admin' | 'contact'>('home');
  const [passInput, setPassInput] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [settings, setSettings] = useState({ logo: '', banner: '' });
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  
  // Formlar
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
  const [guestForm, setGuestForm] = useState({ sender: '', title: '', artist: '', audioFile: null as File | null, coverFile: null as File | null });
  const [isUploading, setIsUploading] = useState(false);

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setSettings(data.value.settings || settings);
      }
    };
    load();
  }, []);

  const saveAll = async (newSongs: any[]) => {
    await supabase.from('settings').update({ value: { songs: newSongs, settings } }).eq('id', 'app_data');
  };

  // DOSYA YÜKLEME FONKSİYONU
  const uploadToStorage = async (file: File, folder: string) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('patnos_files').upload(`${folder}/${fileName}`, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('patnos_files').getPublicUrl(`${folder}/${fileName}`);
    return urlData.publicUrl;
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.audioFile) return alert("Lütfen müzik dosyasını seçin!");
    
    setIsUploading(true);
    try {
      const audioUrl = await uploadToStorage(guestForm.audioFile, 'music');
      const coverUrl = guestForm.coverFile ? await uploadToStorage(guestForm.coverFile, 'covers') : '';

      const newSong = { 
        id: Date.now(), 
        title: guestForm.title, 
        artist: `${guestForm.artist} (Gönderen: ${guestForm.sender})`, 
        url: audioUrl, 
        cover: coverUrl || 'https://via.placeholder.com/300', 
        category: 'Sizden Gelenler',
        likes: 0 
      };

      const updated = [newSong, ...songs];
      setSongs(updated);
      await saveAll(updated);
      alert("Eser ve dosyalar başarıyla yüklendi!");
      setGuestForm({ sender: '', title: '', artist: '', audioFile: null, coverFile: null });
      setView('home');
    } catch (err) {
      alert("Yükleme hatası!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === "Mihriban04") { setIsAuth(true); setPassInput(""); }
    else { alert("Hatalı Şifre!"); }
  };

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);
  const currentSong = currentSongIndex !== null ? filteredSongs[currentSongIndex] : null;

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ÜST MENÜ */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setView('home')}>
          <span style={{ fontWeight: '800', fontSize: '14px', color: 'orange' }}>İZMİR PATNOSLULAR DERNEĞİ</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setView('contact')} style={navBtnStyle}>📞</button>
          <button onClick={() => setView('admin')} style={navBtnStyle}>🔐</button>
        </div>
      </nav>

      <main style={{ padding: '20px 5%', paddingBottom: currentSong ? '140px' : '40px' }}>
        
        {/* VIEW: İLETİŞİM / DOSYA GÖNDERME */}
        {view === 'contact' && (
          <div style={{ maxWidth: '600px', margin: 'auto', animation: 'fadeIn 0.3s ease' }}>
            <button onClick={() => setView('home')} style={backBtnStyle}>← Vazgeç</button>
            <div style={{ background: '#111', padding: '30px', borderRadius: '30px', border: '1px solid #222' }}>
              <h2 style={{ textAlign: 'center', color: 'orange', marginBottom: '10px' }}>SİZİN ŞARKILARINIZ</h2>
              <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginBottom: '25px' }}>Dosyalarınızı yükleyin, otomatik yayınlansın.</p>
              
              <form onSubmit={handleGuestSubmit}>
                <label style={labelStyle}>ADINIZ</label>
                <input placeholder="İsminiz" value={guestForm.sender} onChange={e => setGuestForm({...guestForm, sender: e.target.value})} style={inputStyle} required />
                
                <label style={labelStyle}>ESER ADI / SANATÇI</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input placeholder="Şarkı" value={guestForm.title} onChange={e => setGuestForm({...guestForm, title: e.target.value})} style={inputStyle} required />
                  <input placeholder="Sanatçı" value={guestForm.artist} onChange={e => setGuestForm({...guestForm, artist: e.target.value})} style={inputStyle} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>🎵 SES DOSYASI</label>
                    <input type="file" accept="audio/*" onChange={e => setGuestForm({...guestForm, audioFile: e.target.files?.[0] || null})} style={fileInputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>🖼️ KAPAK GÖRSELİ</label>
                    <input type="file" accept="image/*" onChange={e => setGuestForm({...guestForm, coverFile: e.target.files?.[0] || null})} style={fileInputStyle} />
                  </div>
                </div>

                <button type="submit" disabled={isUploading} style={{ ...submitBtnStyle, background: isUploading ? '#444' : 'orange' }}>
                  {isUploading ? 'YÜKLENİYOR...' : 'DOSYALARI GÖNDER'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: YÖNETİM PANELİ */}
        {view === 'admin' && (
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <button onClick={() => setView('home')} style={backBtnStyle}>← Ana Sayfa</button>
            {!isAuth ? (
              <form onSubmit={handleAdminLogin} style={{ textAlign: 'center', background: '#111', padding: '40px', borderRadius: '30px' }}>
                <input type="password" placeholder="Yönetici Şifresi" value={passInput} onChange={e => setPassInput(e.target.value)} style={inputStyle} required />
                <button type="submit" style={submitBtnStyle}>GİRİŞ YAP</button>
              </form>
            ) : (
              <div>
                <h2 style={{color:'orange'}}>Yönetim Paneli</h2>
                <div style={{ background: '#111', padding: '20px', borderRadius: '20px' }}>
                  <p style={{fontSize:'12px', color:'#666'}}>Gelen dosyaları URL kopyalayarak düzenleyebilirsiniz.</p>
                  {songs.map(s => (
                    <div key={s.id} style={{ padding: '15px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{fontWeight:'bold'}}>{s.title}</div>
                        <div style={{fontSize:'10px', color:'orange'}}>{s.category}</div>
                      </div>
                      <div style={{display:'flex', gap:'5px'}}>
                        <button onClick={() => {navigator.clipboard.writeText(s.url); alert("Ses URL Kopyalandı!");}} style={miniBtn}>🔗 Ses</button>
                        <button onClick={() => {navigator.clipboard.writeText(s.cover); alert("Kapak URL Kopyalandı!");}} style={miniBtn}>🖼️ Kapak</button>
                        <button onClick={async () => {
                          const updated = songs.filter(x => x.id !== s.id);
                          setSongs(updated); await saveAll(updated);
                        }} style={{...miniBtn, background:'#c0392b'}}>SİL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: ANA SAYFA (Sadece Müzik Kutusu ve Listeler) */}
        {view === 'home' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
               <h1 style={{ color: 'orange', letterSpacing: '8px', fontSize: '24px' }}>MÜZİK KUTUSU</h1>
            </div>

            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} style={{ ...catBtn, background: activeTab === cat ? 'orange' : '#151515', color: activeTab === cat ? '#000' : '#fff' }}>{cat}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {filteredSongs.map((song, index) => (
                <div key={song.id} onClick={() => setCurrentSongIndex(index)} style={{ background: currentSongIndex === index ? '#1a1a1a' : '#111', padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', border: currentSongIndex === index ? '1px solid orange' : '1px solid transparent' }}>
                  <img src={song.cover} style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: currentSongIndex === index ? 'orange' : '#fff' }}>{song.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{song.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: '20px', left: '10px', right: '10px', background: 'rgba(0,0,0,0.95)', padding: '15px', borderRadius: '25px', border: '1px solid orange', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 2000 }}>
          <img src={currentSong.cover} style={{ width: '45px', height: '45px', borderRadius: '10px' }} />
          <audio src={currentSong.url} autoPlay controls style={{ flex: 1, filter: 'invert(1)' }} />
          <button onClick={() => setCurrentSongIndex(null)} style={{ background: 'none', border: 'none', color: '#fff' }}>✕</button>
        </div>
      )}
    </div>
  );
}

// STYLES
const navBtnStyle = { background: '#111', border: '1px solid #222', padding: '10px', borderRadius: '12px', cursor: 'pointer' };
const backBtnStyle = { background: 'none', border: 'none', color: 'orange', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', background: '#000', color: '#fff', border: '1px solid #222', borderRadius: '12px' };
const fileInputStyle = { width: '100%', fontSize: '10px', color: '#666', background: '#000', padding: '10px', borderRadius: '10px', border: '1px dashed #333' };
const labelStyle = { fontSize: '10px', color: 'orange', fontWeight: 'bold', marginBottom: '5px', display: 'block' };
const submitBtnStyle = { width: '100%', padding: '15px', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
const catBtn = { padding: '10px 20px', borderRadius: '20px', border: 'none', whiteSpace: 'nowrap', cursor: 'pointer', fontWeight: 'bold' };
const miniBtn = { background: '#2980b9', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '5px', fontSize: '10px', cursor: 'pointer' };
