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

  // --- 🛡️ KORUNAN YÖNETİM PANELİ MOTORU (DOKUNULMAZ) ---
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
    alert("İşlem Başarılı!");
  };

  // --- 🏠 ANA SAYFA VE MÜZİK ÇALAR ---
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
      
      <header style={{ padding: '30px 20px', textAlign: 'center' }}>
        {config.logo && <img src={config.logo} style={{ width: '70px', display: 'block', margin: '0 auto 10px' }} />}
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{config.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '8px' }}>
          <div style={{ height: '2px', width: '40px', background: 'linear-gradient(to right, transparent, orange)' }}></div>
          <span style={{ color: 'orange', fontSize: '11px', letterSpacing: '4px', fontWeight: 'bold' }}>MÜZİK KUTUSU</span>
          <div style={{ height: '2px', width: '40px', background: 'linear-gradient(to left, transparent, orange)' }}></div>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: 'auto', padding: '0 15px' }}>
        {view === 'admin' ? (
          /* 🛡️ GERİ YÜKLENEN TAM TEŞEKKÜLLÜ YÖNETİM PANELİ */
          <div style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
              <div>
                <section style={{ marginBottom: '30px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
                  <h3 style={{color:'orange'}}>Site Ayarları (Logo & Banner)</h3>
                  <input placeholder="Logo URL" value={config.logo} onChange={e=>setConfig({...config, logo:e.target.value})} style={inputS}/>
                  <input placeholder="Banner URL" value={config.banner} onChange={e=>setConfig({...config, banner:e.target.value})} style={inputS}/>
                  <button onClick={() => syncDB(songs, config)} style={saveBtnS}>AYARLARI KAYDET</button>
                </section>
                <section>
                  <h3 style={{color:'orange'}}>{editingId ? 'Şarkıyı Düzenle' : 'Yeni Şarkı Ekle'}</h3>
                  <div style={{display:'grid', gap:'10px'}}>
                    <input placeholder="Şarkı Adı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                    <input placeholder="Sanatçı" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} style={inputS}/>
                    <input placeholder="Müzik URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                    <input placeholder="Kapak URL" value={form.cover} onChange={e=>setForm({...form, cover:e.target.value})} style={inputS}/>
                    <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={inputS}>
                      {categories.filter(c=>c!=="Hepsi").map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={handleSaveSong} style={saveBtnS}>{editingId ? 'GÜNCELLE' : 'ŞARKIYI EKLE'}</button>
                    {editingId && <button onClick={() => {setEditingId(null); setForm({title:'', artist:'', url:'', cover:'', category:'Patnoslu Sanatçılar'});}} style={{color:'gray', background:'none', border:'none', cursor:'pointer'}}>İptal</button>}
                  </div>
                </section>
                <div style={{marginTop: '40px'}}>
                  <input placeholder="🔍 Listede Ara..." style={{...inputS, borderColor:'orange'}} onChange={(e) => setSearchTerm(e.target.value)} />
                  {songs.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                    <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid #222', alignItems:'center'}}>
                      <span>{s.title}</span>
                      <div>
                        <button onClick={() => {setEditingId(s.id); setForm(s); window.scrollTo(0,0);}} style={{color:'orange', marginRight:'15px', background:'none', border:'none', cursor:'pointer'}}>DÜZENLE</button>
                        <button onClick={() => confirm("Silinsin mi?") && syncDB(songs.filter(i=>i.id!==s.id))} style={{color:'red', background:'none', border:'none', cursor:'pointer'}}>SİL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : view === 'contact' ? (
          /* 📞 İLETİŞİM BÖLÜMÜ */
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ background: 'linear-gradient(45deg, #111, #000)', padding: '25px', borderRadius: '20px', border: '1px solid orange', textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'orange', margin: '0 0 10px 0' }}>Bize Katılın!</h3>
              <p style={{ fontSize: '14px', color: '#ccc' }}>Müziklerinizi bize gönderin, yayınlayalım!</p>
              <div style={{ background: 'orange', color: '#000', padding: '10px', borderRadius: '10px', fontWeight: 'bold', marginTop: '15px' }}>ŞİMDİ GÖNDER</div>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={contactBoxS}>📍 İzmir Patnoslular Derneği</div>
              <div style={contactBoxS}>📧 info@izmirpatnos.org</div>
              <div style={{ ...contactBoxS, color: '#25D366' }}>🟢 WhatsApp Destek</div>
            </div>
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
                    <div style={{overflow:'hidden'}}><div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.title}</div><div style={{ color: '#555', fontSize: '11px' }}>{s.artist}</div></div>
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

const navBtn = { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange' };
const inputS = { padding: '12px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '10px', width: '100%', marginBottom: '10px' };
const saveBtnS = { background: 'orange', color: '#000', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };
const searchBarS = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '15px', color: '#fff', outline: 'none' };
const tabBtnS = { background: '#111', color: '#666', border: '1px solid #222', padding: '12px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer' };
const activeTabS = { ...tabBtnS, background: 'orange', color: '#000', borderColor: 'orange', fontWeight: 'bold' };
const songCardS = { background: '#080808', padding: '12px 15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', border: '1px solid #111', cursor: 'pointer' };
const playerBarS = { position: 'fixed' as 'fixed', bottom: 0, width: '100%', background: 'rgba(5,5,5,0.98)', padding: '15px 20px', borderTop: '2px solid orange', zIndex: 1000 };
const contactBoxS = { background: '#0a0a0a', padding: '15px', borderRadius: '12px', border: '1px solid #222', fontSize: '14px' };
