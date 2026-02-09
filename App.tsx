import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [view, setView] = useState<'home' | 'admin' | 'contact'>('home');
  const [isAuth, setIsAuth] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [config, setConfig] = useState({ logo: '', banner: '', title: 'İZMİR PATNOSLULAR DERNEĞİ' });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
    if (data?.value) {
      setSongs(data.value.songs || []);
      setConfig(data.value.config || { logo: '', banner: '', title: 'İZMİR PATNOSLULAR DERNEĞİ' });
    }
  };

  const syncDB = async (newSongs: any[], newConfig = config) => {
    await supabase.from('settings').update({ value: { songs: newSongs, config: newConfig } }).eq('id', 'app_data');
    setSongs(newSongs);
    setConfig(newConfig);
  };

  // --- 🛡️ ASLA DEĞİŞMEYEN YÖNETİM PANELİ FONKSİYONLARI ---
  const handleSaveSong = async () => {
    let updatedSongs = editingId 
      ? songs.map(s => s.id === editingId ? { ...form, id: editingId, likes: s.likes || 0 } : s)
      : [{ ...form, id: Date.now(), likes: 0 }, ...songs];
    await syncDB(updatedSongs);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    setEditingId(null);
    alert("İşlem Başarılı!");
  };

  const playSong = (song: any) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) audioRef.current?.pause(); else audioRef.current?.play();
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song); setIsPlaying(true);
      setTimeout(() => { if (audioRef.current) { audioRef.current.src = song.url; audioRef.current.play(); } }, 100);
    }
  };

  const handleLike = async (e: any, song: any) => {
    e.stopPropagation();
    const updated = songs.map(s => s.id === song.id ? { ...s, likes: (s.likes || 0) + 1 } : s);
    await syncDB(updated);
  };

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  const filteredSongs = songs
    .filter(s => {
      const mSearch = (s.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || (s.artist?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const mTab = activeTab === "Hepsi" || s.category === activeTab;
      return mSearch && mTab;
    })
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 8);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '160px' }}>
      
      {/* 1. BAŞLIK VE ÇİZGİLİ MÜZİK KUTUSU YAZISI */}
      <header style={{ padding: '30px 20px', textAlign: 'center' }}>
        {config.logo && <img src={config.logo} style={{ width: '70px', margin: '0 auto 10px', display: 'block' }} />}
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{config.title}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '8px' }}>
          <div style={{ height: '2px', width: '40px', background: 'linear-gradient(to right, transparent, orange)' }}></div>
          <span style={{ color: 'orange', fontSize: '12px', letterSpacing: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>Müzik Kutusu</span>
          <div style={{ height: '2px', width: '40px', background: 'linear-gradient(to left, transparent, orange)' }}></div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: 'auto', padding: '0 15px' }}>
        {view === 'admin' ? (
          /* 🛡️ KORUNAN YÖNETİM PANELİ (MİLİMETRİK AYNI) */
          <div style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
              <div>
                <h3 style={{color:'orange'}}>Yönetim Paneli</h3>
                <input placeholder="Logo URL" value={config.logo} onChange={e=>setConfig({...config, logo:e.target.value})} style={inputS}/>
                <input placeholder="Banner URL" value={config.banner} onChange={e=>setConfig({...config, banner:e.target.value})} style={inputS}/>
                <button onClick={() => syncDB(songs, config)} style={saveBtnS}>SİTEYİ GÜNCELLE</button>
                <div style={{marginTop:'30px', borderTop:'1px solid #222', paddingTop:'20px'}}>
                  <input placeholder="Şarkı Adı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                  <input placeholder="Müzik URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                  <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={inputS}>
                    {categories.filter(c=>c!=="Hepsi").map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleSaveSong} style={saveBtnS}>{editingId ? 'GÜNCELLE' : 'EKLE'}</button>
                </div>
                {songs.map(s => (
                  <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #222'}}>
                    <span>{s.title}</span>
                    <button onClick={() => syncDB(songs.filter(i=>i.id!==s.id))} style={{color:'red', background:'none', border:'none'}}>SİL</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : view === 'contact' ? (
          /* 📞 İLETİŞİM BÖLÜMÜ (HATIRLADIĞIN O TASARIM) */
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ background: 'linear-gradient(45deg, #111, #000)', padding: '25px', borderRadius: '20px', border: '1px solid orange', textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'orange', margin: '0 0 10px 0' }}>Bize Katılın!</h3>
              <p style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.6' }}>Kendi müziğiniz mi var? Ya da sevdiğiniz bir Patnos türküsünü herkes duysun mu istiyorsunuz? Şarkınızı bize gönderin, burada milyonlarla paylaşalım.</p>
              <div style={{ background: 'orange', color: '#000', padding: '10px', borderRadius: '10px', fontWeight: 'bold', marginTop: '15px', cursor: 'pointer' }}>Müziklerini Bize Gönder, Yayınlayalım!</div>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={contactBoxS}>📍 <b>Adres:</b> İzmir Patnoslular Derneği Merkezi</div>
              <div style={contactBoxS}>📧 <b>E-Posta:</b> info@izmirpatnos.org</div>
              <div style={{ ...contactBoxS, borderColor: '#25D366', color: '#25D366' }}>🟢 <b>WhatsApp:</b> +90 5XX XXX XX XX</div>
            </div>
            <button onClick={() => setView('home')} style={{ ...saveBtnS, marginTop: '20px', background: '#222', color: '#fff' }}>ANA SAYFAYA DÖN</button>
          </div>
        ) : (
          /* 🏠 ANA SAYFA */
          <div>
            {config.banner && <div style={{ width: '100%', height: '180px', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}><img src={config.banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
            
            {/* 2. KATEGORİLER VE İLETİŞİM KUTUSU */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} style={activeTab === cat ? activeTabS : tabBtnS}>{cat}</button>
              ))}
              <button onClick={() => setView('contact')} style={{ ...tabBtnS, borderColor: 'orange', color: 'orange' }}>📞 İletişim</button>
            </div>

            <input placeholder="🔍 Şarkı veya Sanatçı Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />

            <div style={{ marginTop: '20px' }}>
              {filteredSongs.map(s => (
                <div key={s.id} onClick={() => playSong(s)} style={{...songCardS, borderColor: currentSong?.id === s.id ? 'orange' : '#111'}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={s.cover || config.logo} style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
                    <div style={{overflow:'hidden'}}><div style={{ fontWeight: 'bold', fontSize: '15px' }}>{s.title}</div><div style={{ color: '#555', fontSize: '12px' }}>{s.artist}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={(e) => handleLike(e, s)} style={{background:'none', border:'none', color:'red', cursor:'pointer'}}>❤️ {s.likes || 0}</button>
                    <a href={s.url} download onClick={e=>e.stopPropagation()} style={{textDecoration:'none', fontSize:'18px'}}>📥</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {currentSong && (
        <div style={playerBarS}>
          <div style={{maxWidth: '600px', margin: 'auto'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px'}}>
              <img src={currentSong.cover || config.logo} style={{width:'40px', height:'40px', borderRadius:'5px', border:'1px solid orange'}} />
              <div style={{flex:1}}><div style={{fontSize:'14px', fontWeight:'bold', color:'orange'}}>{currentSong.title}</div></div>
              <button onClick={() => setIsPlaying(!isPlaying)} style={{background:'orange', border:'none', borderRadius:'50%', width:'35px', height:'35px', fontWeight:'bold'}}>{isPlaying ? 'II' : '▶'}</button>
            </div>
            <audio ref={audioRef} autoPlay onEnded={() => { const idx = songs.findIndex(s => s.id === currentSong.id); if(idx < songs.length - 1) playSong(songs[idx+1]); }} onPlay={()=>setIsPlaying(true)} onPause={()=>setIsPlaying(false)} controls style={{width:'100%', height:'32px', filter:'invert(1)'}} />
          </div>
        </div>
      )}
    </div>
  );
}

const navBtn = { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange' };
const inputS = { padding: '12px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '10px', width: '100%', marginBottom: '10px' };
const saveBtnS = { background: 'orange', color: '#000', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };
const searchBarS = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '15px', color: '#fff', outline: 'none' };
const tabBtnS = { background: '#111', color: '#666', border: '1px solid #222', padding: '12px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' };
const activeTabS = { ...tabBtnS, background: 'orange', color: '#000', borderColor: 'orange' };
const songCardS = { background: '#080808', padding: '10px 15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', border: '1px solid #111', cursor: 'pointer' };
const playerBarS = { position: 'fixed' as 'fixed', bottom: 0, width: '100%', background: 'rgba(5,5,5,0.95)', backdropFilter:'blur(10px)', padding: '15px 20px', borderTop: '2px solid orange', zIndex: 1000 };
const contactBoxS = { background: '#0a0a0a', padding: '15px', borderRadius: '12px', border: '1px solid #222', fontSize: '14px' };
