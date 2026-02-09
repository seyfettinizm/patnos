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
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
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

  // --- 🛡️ KORUNAN YÖNETİM PANELİ FONKSİYONLARI ---
  const getDuration = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio(); audio.src = url;
      audio.addEventListener('loadedmetadata', () => {
        const min = Math.floor(audio.duration / 60);
        const sec = Math.floor(audio.duration % 60);
        resolve(`${min}:${sec < 10 ? '0' : ''}${sec}`);
      });
      audio.addEventListener('error', () => resolve("0:00"));
    });
  };

  const handleSaveSong = async () => {
    const duration = await getDuration(form.url);
    let updatedSongs;
    if (editingId) {
      updatedSongs = songs.map(s => s.id === editingId ? { ...form, id: editingId, duration, likes: s.likes || 0 } : s);
      setEditingId(null);
    } else {
      updatedSongs = [{ ...form, id: Date.now(), duration, likes: 0 }, ...songs];
    }
    await syncDB(updatedSongs);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    alert("Kayıt Başarılı!");
  };

  // --- 🏠 OTOMATİK GEÇİŞ DÜZELTMESİ (GÜNCELLENDİ) ---
  const playSong = (song: any) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) audioRef.current?.pause(); else audioRef.current?.play();
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current.play();
      }
    }
  };

  const handleNextSong = () => {
    // Mevcut filtreye göre listeyi alıyoruz
    const currentList = songs
      .filter(s => (activeTab === "Hepsi" || s.category === activeTab))
      .sort((a,b) => (b.likes || 0) - (a.likes || 0));
    
    const currentIndex = currentList.findIndex(s => s.id === currentSong?.id);
    if (currentIndex !== -1 && currentIndex < currentList.length - 1) {
      playSong(currentList[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  const forceDownload = async (e: React.MouseEvent, url: string, title: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${title}.mp3`;
      link.click();
    } catch (err) { window.open(url, '_blank'); }
  };

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  const filteredSongs = songs
    .filter(s => (activeTab === "Hepsi" || s.category === activeTab) && (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.artist.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a,b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 8);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', paddingBottom: currentSong ? '160px' : '40px', fontFamily: 'sans-serif' }}>
      
      <header style={{ padding: '25px', textAlign: 'center' }}>
        {config.logo && <img src={config.logo} style={{ width: '65px', margin: '0 auto 10px', display: 'block' }} />}
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{config.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '8px' }}>
          <div style={{ height: '2px', width: '35px', background: 'linear-gradient(to right, transparent, orange)' }}></div>
          <span style={{ color: 'orange', fontSize: '10px', letterSpacing: '3px', fontWeight: 'bold' }}>MÜZİK KUTUSU</span>
          <div style={{ height: '2px', width: '35px', background: 'linear-gradient(to left, transparent, orange)' }}></div>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: 'auto', padding: '0 15px' }}>
        
        {view === 'admin' ? (
          /* 🛡️ YÖNETİM PANELİ (MÜDAHALE EDİLMEDİ) */
          <div style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
              <div>
                <h4 style={{color:'orange', marginTop:0}}>Genel Ayarlar</h4>
                <input placeholder="Logo URL" value={config.logo} onChange={e=>setConfig({...config, logo:e.target.value})} style={inputS}/>
                <input placeholder="Banner URL" value={config.banner} onChange={e=>setConfig({...config, banner:e.target.value})} style={inputS}/>
                <button onClick={() => syncDB(songs, config)} style={saveBtnS}>KAYDET</button>
                <div style={{marginTop:'30px', paddingTop:'20px', borderTop:'1px solid #222'}}>
                  <h4 style={{color:'orange'}}>{editingId ? 'Şarkıyı Güncelle' : 'Yeni Ekle'}</h4>
                  <input placeholder="Şarkı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                  <input placeholder="Sanatçı" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} style={inputS}/>
                  <input placeholder="Müzik URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                  <input placeholder="Kapak URL" value={form.cover} onChange={e=>setForm({...form, cover:e.target.value})} style={inputS}/>
                  <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={inputS}>
                    {categories.filter(c=>c!=="Hepsi").map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleSaveSong} style={saveBtnS}>KAYDET</button>
                </div>
                <div style={{marginTop: '30px'}}>
                  <input placeholder="🔍 Listede Ara..." style={{...inputS, borderColor: 'orange'}} onChange={(e) => setAdminSearchTerm(e.target.value)} />
                  {songs.filter(s => s.title.toLowerCase().includes(adminSearchTerm.toLowerCase())).map(s => (
                    <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #222'}}>
                      <span>{s.title}</span>
                      <div>
                        <button onClick={() => {setEditingId(s.id); setForm(s); window.scrollTo(0,0);}} style={{color:'orange', marginRight:'10px', background:'none', border:'none'}}>DÜZENLE</button>
                        <button onClick={() => syncDB(songs.filter(i=>i.id!==s.id))} style={{color:'red', background:'none', border:'none'}}>SİL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : view === 'contact' ? (
          /* 🛡️ İLETİŞİM BÖLÜMÜ (MÜDAHALE EDİLMEDİ) */
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ background: '#111', padding: '30px', borderRadius: '25px', border: '1px solid orange', textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'orange', margin: '0 0 10px 0' }}>Bize Katılın!</h3>
              <p style={{ fontSize: '14px', fontStyle: 'italic' }}>Müziklerinizi bize ulaştırın, yayınlayalım!</p>
            </div>
            <div style={contactBoxS}>📍 <b>Adres:</b> Yeşilbağlar Mh. 637/33 Sk. NO:25 Buca/İZMİR</div>
            <div style={contactBoxS}>📧 <b>E-Posta:</b> patnosumuz@gmail.com</div>
            <div style={{ ...contactBoxS, color: '#25D366' }}>🟢 <b>WhatsApp:</b> +90 505 225 06 55</div>
            <button onClick={() => setView('home')} style={{ ...saveBtnS, marginTop: '20px', background: '#222', color: '#fff' }}>GERİ DÖN</button>
          </div>
        ) : (
          /* 🏠 ANA SAYFA */
          <div>
             {config.banner && <div style={{ width: '100%', height: '170px', borderRadius: '18px', overflow: 'hidden', marginBottom: '20px' }}><img src={config.banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={s.cover || config.logo} style={{ width: '45px', height: '45px', borderRadius: '8px' }} />
                      <div><div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.title}</div><div style={{ color: '#555', fontSize: '11px' }}>{s.artist}</div></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{color:'#666', fontSize:'11px'}}>{s.duration}</span>
                      <button onClick={(e) => {e.stopPropagation(); const up=songs.map(i=>i.id===s.id?{...i,likes:(i.likes||0)+1}:i); syncDB(up);}} style={{background:'none', border:'none', color:'red', cursor:'pointer'}}>❤️ {s.likes || 0}</button>
                      <button onClick={(e) => forceDownload(e, s.url, s.title)} style={{background:'none', border:'none', fontSize:'18px', cursor:'pointer'}}>📥</button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* 🎵 PLAYER VE GARANTİLENMİŞ OTOMATİK GEÇİŞ */}
      {currentSong && (
        <div style={playerBarS}>
          <div style={{maxWidth: '600px', margin: 'auto'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px'}}>
              <img src={currentSong.cover || config.logo} style={{width:'40px', height:'40px', borderRadius:'5px', border:'1px solid orange'}} />
              <div style={{flex:1, overflow:'hidden'}}><div style={{fontSize:'14px', fontWeight:'bold', color:'orange', whiteSpace:'nowrap'}}>{currentSong.title}</div></div>
              <button onClick={() => setIsPlaying(!isPlaying)} style={{background:'orange', border:'none', borderRadius:'50%', width:'35px', height:'35px', fontWeight:'bold'}}>{isPlaying ? 'II' : '▶'}</button>
            </div>
            <audio 
              ref={audioRef} 
              autoPlay 
              onEnded={handleNextSong} // Bu fonksiyon sıradaki şarkıyı garanti eder
              onPlay={()=>setIsPlaying(true)} 
              onPause={()=>setIsPlaying(false)} 
              controls 
              style={{width:'100%', height:'32px', filter:'invert(1)'}} 
            />
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
const contactBoxS = { background: '#0a0a0a', padding: '15px', borderRadius: '12px', border: '1px solid #222', fontSize: '14px', marginBottom: '10px' };
