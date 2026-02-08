import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Bağlantısı
const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  // Görünüm ve Kimlik Doğrulama
  const [view, setView] = useState<'home' | 'admin' | 'contact'>('home');
  const [isAuth, setIsAuth] = useState(false);
  const [passInput, setPassInput] = useState("");
  
  // Veri Durumları (Hata almamak için boş dizilerle başlatıldı)
  const [songs, setSongs] = useState<any[]>([]);
  const [pendingSongs, setPendingSongs] = useState<any[]>([]);
  const [settings, setSettings] = useState({ logo: '', banner: '' });
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  
  // Form Durumları
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
  const [guestForm, setGuestForm] = useState({ sender: '', title: '', artist: '', audioFile: null as File | null, coverFile: null as File | null });
  const [isUploading, setIsUploading] = useState(false);

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  // Verileri Yükle
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setPendingSongs(data.value.pendingSongs || []);
        setSettings(data.value.settings || { logo: '', banner: '' });
      }
    } catch (err) {
      console.error("Veri yükleme hatası:", err);
    }
  };

  // Veritabanını Güncelle
  const syncDB = async (newSongs: any[], newPending: any[], newSettings = settings) => {
    await supabase.from('settings').update({ 
      value: { songs: newSongs, pendingSongs: newPending, settings: newSettings } 
    }).eq('id', 'app_data');
  };

  // Dosya Yükleme (Storage)
  const uploadFile = async (file: File, path: string) => {
    const name = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const { error } = await supabase.storage.from('patnos_files').upload(`${path}/${name}`, file);
    if (error) throw error;
    return supabase.storage.from('patnos_files').getPublicUrl(`${path}/${name}`).data.publicUrl;
  };

  // Misafir Gönderimi
  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.audioFile) return alert("Lütfen müzik dosyasını seçin!");
    setIsUploading(true);
    try {
      const aUrl = await uploadFile(guestForm.audioFile, 'music');
      const cUrl = guestForm.coverFile ? await uploadFile(guestForm.coverFile, 'covers') : 'https://via.placeholder.com/300';
      
      const newPending = [{ 
        id: Date.now(), title: guestForm.title, artist: guestForm.artist, sender: guestForm.sender,
        url: aUrl, cover: cUrl
      }, ...pendingSongs];
      
      setPendingSongs(newPending);
      await syncDB(songs, newPending);
      alert("Şarkınız başarıyla yöneticiye iletildi!");
      setView('home');
      setGuestForm({ sender: '', title: '', artist: '', audioFile: null, coverFile: null });
    } catch (err) {
      alert("Yükleme sırasında bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  // Şarkı Onaylama
  const approveSong = async (pSong: any) => {
    const approved = { ...pSong, category: 'Sizden Gelenler', likes: 0 };
    const newSongs = [approved, ...songs];
    const newPending = pendingSongs.filter(s => s.id !== pSong.id);
    setSongs(newSongs);
    setPendingSongs(newPending);
    await syncDB(newSongs, newPending);
    alert("Şarkı yayına alındı!");
  };

  // Admin Manuel İşlem (Ekle/Düzenle)
  const handleAdminAction = async () => {
    let updated;
    if (editId) {
      updated = songs.map(s => s.id === editId ? { ...form, id: editId, likes: s.likes || 0 } : s);
    } else {
      updated = [{ ...form, id: Date.now(), likes: 0 }, ...songs];
    }
    setSongs(updated);
    await syncDB(updated, pendingSongs);
    setEditId(null);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    alert("İşlem başarılı!");
  };

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);

  return (
    <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* ÜST MENÜ */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ color: 'orange', fontWeight: 'bold', cursor: 'pointer', display:'flex', alignItems:'center', gap:'10px' }} onClick={() => setView('home')}>
          {settings.logo && <img src={settings.logo} style={{height:'35px', borderRadius:'50%'}} alt="logo" />}
          <span style={{fontSize:'14px'}}>İZMİR PATNOSLULAR DERNEĞİ</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setView('contact')} style={navBtn}>📞 İletişim</button>
          <button onClick={() => setView('admin')} style={navBtn}>
            🔐 Yönetim {pendingSongs.length > 0 && <span style={badgeStyle}>{pendingSongs.length}</span>}
          </button>
        </div>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        
        {/* İLETİŞİM / GÖNDERİM SAYFASI */}
        {view === 'contact' && (
          <div style={{ maxWidth: '850px', margin: 'auto', animation: 'fadeIn 0.4s' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Ana Sayfaya Dön</button>
            <div style={{ background: '#111', padding: '40px', borderRadius: '30px', border:'1px solid #222' }}>
              <h2 style={{ color: 'orange', textAlign: 'center', fontSize:'28px', marginBottom:'10px' }}>SİZİN ŞARKILARINIZ</h2>
              <p style={{textAlign:'center', color:'#666', marginBottom:'30px'}}>Arşivimize katkıda bulunun, şarkılarınız platformda yer alsın!</p>
              
              <form onSubmit={handleGuestSubmit}>
                <div style={{marginBottom:'20px'}}>
                   <label style={labS}>GÖNDEREN KİŞİ ADI</label>
                   <input placeholder="Adınız" style={inputS} value={guestForm.sender} onChange={e => setGuestForm({...guestForm, sender: e.target.value})} required />
                </div>
                
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px'}}>
                  <div><label style={labS}>ŞARKI ADI</label><input placeholder="Eser Adı" style={inputS} value={guestForm.title} onChange={e => setGuestForm({...guestForm, title: e.target.value})} required /></div>
                  <div><label style={labS}>SÖYLEYEN KİŞİ ADI</label><input placeholder="Sanatçı" style={inputS} value={guestForm.artist} onChange={e => setGuestForm({...guestForm, artist: e.target.value})} required /></div>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'30px'}}>
                  <div><label style={labS}>🎵 ŞARKI YÜKLE (SES)</label><input type="file" accept="audio/*" style={fileS} onChange={e => setGuestForm({...guestForm, audioFile: e.target.files?.[0] || null})} required /></div>
                  <div><label style={labS}>🖼️ GÖRSEL SEÇ (KAPAK)</label><input type="file" accept="image/*" style={fileS} onChange={e => setGuestForm({...guestForm, coverFile: e.target.files?.[0] || null})} /></div>
                </div>

                <button type="submit" disabled={isUploading} style={mainBtn}>
                  {isUploading ? 'YÜKLENİYOR...' : 'GÖNDER'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* YÖNETİM PANELİ */}
        {view === 'admin' && (
          <div style={{ maxWidth: '900px', margin: 'auto', animation: 'fadeIn 0.3s' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Paneli Kapat</button>
            {!isAuth ? (
              <form onSubmit={e => { e.preventDefault(); if(passInput === "Mihriban04") setIsAuth(true); else alert("Şifre Hatalı!"); }} style={{textAlign:'center', marginTop:'80px'}}>
                <h2 style={{color:'orange', marginBottom:'20px'}}>Yönetici Girişi</h2>
                <input type="password" placeholder="Şifreniz" style={inputS} onChange={e => setPassInput(e.target.value)} />
                <button type="submit" style={mainBtn}>PANELİ AÇ</button>
              </form>
            ) : (
              <div>
                {/* ONAY BEKLEYENLER */}
                <div style={panelBox}>
                  <h3 style={{color:'yellow', marginTop:0}}>📩 Onay Bekleyen Şarkılar ({pendingSongs.length})</h3>
                  {pendingSongs.length === 0 && <p style={{color:'#666'}}>Şu an bekleyen eser yok.</p>}
                  {pendingSongs.map(ps => (
                    <div key={ps.id} style={pendingCard}>
                      <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                        <img src={ps.cover} style={{width:'70px', height:'70px', borderRadius:'10px', objectFit:'cover'}} alt="cover" />
                        <div style={{flex:1}}>
                          <div style={{fontWeight:'bold', fontSize:'16px'}}>{ps.title}</div>
                          <div style={{fontSize:'13px', color:'orange'}}>{ps.artist} <span style={{color:'#555'}}>| Gönderen: {ps.sender}</span></div>
                        </div>
                      </div>
                      <div style={previewPlayer}>
                        <audio src={ps.url} controls style={{height:'30px', flex:1, filter:'invert(1)'}} />
                      </div>
                      <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                        <button onClick={() => approveSong(ps)} style={{...miniBtn, background:'#27ae60'}}>✅ YAYINLA</button>
                        <button onClick={async () => { if(confirm("Reddetmek istediğine emin misin?")) { const n = pendingSongs.filter(x => x.id !== ps.id); setPendingSongs(n); syncDB(songs, n); }}} style={{...miniBtn, background:'#c0392b'}}>❌ REDDET</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SİTE AYARLARI */}
                <div style={panelBox}>
                  <h4 style={{color:'orange', marginTop:0}}>Arayüz Ayarları</h4>
                  <input placeholder="Logo URL" value={settings.logo} style={inputS} onChange={e => setSettings({...settings, logo: e.target.value})} />
                  <input placeholder="Banner URL" value={settings.banner} style={inputS} onChange={e => setSettings({...settings, banner: e.target.value})} />
                  <button onClick={() => syncDB(songs, pendingSongs, settings)} style={{...mainBtn, background:'#2980b9'}}>GÖRSELLERİ KAYDET</button>
                </div>

                {/* DÜZENLEME VE EKLEME */}
                <div style={panelBox}>
                  <h4 style={{color:'orange', marginTop:0}}>{editId ? 'Şarkıyı Düzenle' : 'Yeni Şarkı Ekle'}</h4>
                  <input placeholder="Eser Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                  <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  <input placeholder="Ses URL" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                  <input placeholder="Kapak URL" value={form.cover} style={inputS} onChange={e => setForm({...form, cover: e.target.value})} />
                  <select value={form.category} style={inputS} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.filter(c => c !== "Hepsi").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAdminAction} style={mainBtn}>{editId ? 'GÜNCELLE' : 'EKLE'}</button>
                </div>

                {/* ARŞİV */}
                <div style={panelBox}>
                  <h4 style={{color:'orange', marginTop:0}}>Mevcut Arşiv</h4>
                  {songs.map(s => (
                    <div key={s.id} style={listItem}>
                      <span>{s.title} <small style={{color:'orange'}}>({s.category})</small></span>
                      <div style={{display:'flex', gap:'5px'}}>
                        <button onClick={() => {setForm(s); setEditId(s.id); window.scrollTo(0,0);}} style={{...miniBtn, background:'#2980b9'}}>Düzenle</button>
                        <button onClick={async () => { if(confirm("Silinsin mi?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n, pendingSongs); }}} style={{...miniBtn, background:'#c0392b'}}>Sil</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANA SAYFA */}
        {view === 'home' && (
          <div style={{animation: 'fadeIn 0.5s'}}>
             <div style={{textAlign:'center', marginBottom:'30px'}}>
              <h1 style={{letterSpacing:'8px', color:'orange', fontSize:'22px', fontWeight:'800'}}>MÜZİK KUTUSU</h1>
            </div>
            
            {settings.banner && <img src={settings.banner} style={{width:'100%', height:'250px', objectFit:'cover', borderRadius:'25px', marginBottom:'30px', border:'1px solid #111'}} alt="banner" />}

            <div style={{display:'flex', gap:'10px', overflowX:'auto', marginBottom:'25px', scrollbarWidth:'none'}}>
              {categories.map(c => (
                <button key={c} onClick={() => setActiveTab(c)} style={{...catBtn, background: activeTab === c ? 'orange' : '#111', color: activeTab === c ? '#000' : '#fff'}}>{c}</button>
              ))}
            </div>

            <div style={{display:'grid', gap:'12px'}}>
              {filteredSongs.map((s, i) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(i)} style={{background: currentSongIndex === i ? '#1a1a1a' : '#111', padding:'15px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'15px', cursor:'pointer', border: currentSongIndex === i ? '1px solid orange' : '1px solid transparent'}}>
                  <img src={s.cover} style={{width:'50px', height:'50px', borderRadius:'12px', objectFit:'cover'}} alt="cover" />
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'bold', color: currentSongIndex === i ? 'orange' : '#fff'}}>{s.title}</div>
                    <div style={{fontSize:'12px', color:'#666'}}>{s.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSongIndex !== null && filteredSongs[currentSongIndex] && (
        <div style={playerBar}>
          <img src={filteredSongs[currentSongIndex].cover} style={{width:'45px', height:'45px', borderRadius:'10px'}} alt="playing" />
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:'13px', fontWeight:'bold', color:'orange', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{filteredSongs[currentSongIndex].title}</div>
            <div style={{fontSize:'11px', color:'#888'}}>{filteredSongs[currentSongIndex].artist}</div>
          </div>
          <audio src={filteredSongs[currentSongIndex].url} autoPlay controls style={{flex:2, filter:'invert(1)', height:'35px'}} />
          <button onClick={() => setCurrentSongIndex(null)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:'18px'}}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// Stil Nesneleri
const navBtn = { background:'#111', color:'white', border:'1px solid #222', padding:'8px 15px', borderRadius:'12px', cursor:'pointer', fontSize:'13px', position:'relative' as 'relative' };
const badgeStyle = { position:'absolute' as 'absolute', top:'-5px', right:'-5px', background:'red', color:'white', fontSize:'10px', width:'18px', height:'18px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold' };
const backBtn = { background:'none', border:'none', color:'orange', marginBottom:'20px', cursor:'pointer', fontWeight:'bold' };
const inputS = { width:'100%', padding:'14px', marginBottom:'10px', background:'#000', color:'#fff', border:'1px solid #222', borderRadius:'12px', boxSizing:'border-box' as 'border-box' };
const fileS = { background:'#000', padding:'12px', borderRadius:'12px', width:'100%', border:'1px dashed #333', color:'#666', fontSize:'12px' };
const labS = { fontSize:'11px', color:'orange', fontWeight:'bold', marginBottom:'8px', display:'block', letterSpacing:'1px' };
const mainBtn = { width:'100%', padding:'16px', background:'orange', border:'none', borderRadius:'15px', fontWeight:'bold', cursor:'pointer', color:'#000' };
const catBtn = { padding:'10px 22px', borderRadius:'25px', border:'none', cursor:'pointer', whiteSpace:'nowrap', fontWeight:'bold', transition:'0.3s' };
const panelBox = { background:'#111', padding:'25px', borderRadius:'25px', marginBottom:'25px', border:'1px solid #222' };
const pendingCard = { background:'#050505', padding:'15px', borderRadius:'20px', border:'1px solid #333', marginBottom:'15px' };
const previewPlayer = { background:'#111', padding:'10px', borderRadius:'12px', margin:'10px 0' };
const listItem = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', borderBottom:'1px solid #222', fontSize:'14px' };
const miniBtn = { padding:'7px 15px', borderRadius:'8px', border:'none', color:'#fff', fontSize:'11px', cursor:'pointer', fontWeight:'bold' };
const playerBar = { position:'fixed' as 'fixed', bottom:20, left:'5%', right:'5%', background:'rgba(0,0,0,0.95)', backdropFilter:'blur(10px)', padding:'15px 20px', borderRadius:'25px', border:'1px solid orange', display:'flex', alignItems:'center', gap:'15px', zIndex:2000 };
