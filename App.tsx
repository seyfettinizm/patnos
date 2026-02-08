import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [view, setView] = useState<'home' | 'admin' | 'contact'>('home');
  const [isAuth, setIsAuth] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [pendingSongs, setPendingSongs] = useState<any[]>([]); // Onay bekleyenler
  const [settings, setSettings] = useState({ logo: '', banner: '' });
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  
  // Formlar
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
  const [guestForm, setGuestForm] = useState({ sender: '', title: '', artist: '', audioFile: null as File | null, coverFile: null as File | null });
  const [isUploading, setIsUploading] = useState(false);

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
    if (data?.value) {
      setSongs(data.value.songs || []);
      setPendingSongs(data.value.pendingSongs || []);
      setSettings(data.value.settings || { logo: '', banner: '' });
    }
  };

  const syncDB = async (newSongs: any[], newPending: any[], newSettings = settings) => {
    await supabase.from('settings').update({ 
      value: { songs: newSongs, pendingSongs: newPending, settings: newSettings } 
    }).eq('id', 'app_data');
  };

  const uploadFile = async (file: File, path: string) => {
    const name = `${Date.now()}_${file.name}`;
    await supabase.storage.from('patnos_files').upload(`${path}/${name}`, file);
    return supabase.storage.from('patnos_files').getPublicUrl(`${path}/${name}`).data.publicUrl;
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.audioFile) return alert("Müzik dosyası zorunludur!");
    setIsUploading(true);
    try {
      const aUrl = await uploadFile(guestForm.audioFile, 'music');
      const cUrl = guestForm.coverFile ? await uploadFile(guestForm.coverFile, 'covers') : '';
      const newPending = [...pendingSongs, { 
        id: Date.now(), title: guestForm.title, artist: guestForm.artist, sender: guestForm.sender,
        url: aUrl, cover: cUrl || 'https://via.placeholder.com/300'
      }];
      setPendingSongs(newPending);
      await syncDB(songs, newPending);
      alert("Eser yönetici onayına gönderildi!");
      setView('home');
    } catch (err) { alert("Yükleme başarısız!"); }
    finally { setIsUploading(false); }
  };

  const approveSong = async (pSong: any) => {
    const approved = { ...pSong, category: 'Sizden Gelenler', likes: 0 };
    const newSongs = [approved, ...songs];
    const newPending = pendingSongs.filter(s => s.id !== pSong.id);
    setSongs(newSongs);
    setPendingSongs(newPending);
    await syncDB(newSongs, newPending);
    alert("Eser yayına alındı!");
  };

  const handleAdminAction = async () => {
    let updatedSongs;
    if (editId) {
      updatedSongs = songs.map(s => s.id === editId ? { ...form, id: editId, likes: s.likes || 0 } : s);
    } else {
      updatedSongs = [{ ...form, id: Date.now(), likes: 0 }, ...songs];
    }
    setSongs(updatedSongs);
    await syncDB(updatedSongs, pendingSongs);
    setEditId(null);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    alert("Kaydedildi!");
  };

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);

  return (
    <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ color: 'orange', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setView('home')}>İZMİR PATNOSLULAR DERNEĞİ</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setView('contact')} style={navBtn}>📞 İletişim</button>
          <button onClick={() => setView('admin')} style={navBtn}>🔐 Yönetim</button>
        </div>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        
        {/* VIEW: İLETİŞİM */}
        {view === 'contact' && (
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Geri Dön</button>
            <div style={{ background: '#111', padding: '30px', borderRadius: '20px' }}>
              <h2 style={{ color: 'orange', textAlign: 'center' }}>SİZİN ŞARKILARINIZ</h2>
              <form onSubmit={handleGuestSubmit}>
                <input placeholder="Adınız Soyadınız" style={inputS} onChange={e => setGuestForm({...guestForm, sender: e.target.value})} required />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input placeholder="Şarkı Adı" style={inputS} onChange={e => setGuestForm({...guestForm, title: e.target.value})} required />
                  <input placeholder="Sanatçı" style={inputS} onChange={e => setGuestForm({...guestForm, artist: e.target.value})} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                  <div><label style={labS}>SES DOSYASI</label><input type="file" accept="audio/*" onChange={e => setGuestForm({...guestForm, audioFile: e.target.files?.[0] || null})} style={fileS} /></div>
                  <div><label style={labS}>KAPAK GÖRSELİ</label><input type="file" accept="image/*" onChange={e => setGuestForm({...guestForm, coverFile: e.target.files?.[0] || null})} style={fileS} /></div>
                </div>
                <button type="submit" disabled={isUploading} style={mainBtn}>{isUploading ? 'YÜKLENİYOR...' : 'YÖNETİME GÖNDER'}</button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: YÖNETİM PANELİ (TAM DONANIMLI) */}
        {view === 'admin' && (
          <div style={{ maxWidth: '900px', margin: 'auto' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Paneli Kapat</button>
            {!isAuth ? (
              <form onSubmit={e => { e.preventDefault(); if(passInput === "Mihriban04") setIsAuth(true); else alert("Hatalı!"); }} style={{textAlign:'center', marginTop:'50px'}}>
                <input type="password" placeholder="Şifre" style={inputS} onChange={e => setPassInput(e.target.value)} />
                <button type="submit" style={mainBtn}>GİRİŞ</button>
              </form>
            ) : (
              <div>
                {/* AYARLAR */}
                <div style={panelBox}>
                  <h4 style={{color:'orange'}}>Site Ayarları</h4>
                  <input placeholder="Logo URL" value={settings.logo} onChange={e => setSettings({...settings, logo: e.target.value})} style={inputS} />
                  <input placeholder="Banner URL" value={settings.banner} onChange={e => setSettings({...settings, banner: e.target.value})} style={inputS} />
                  <button onClick={() => syncDB(songs, pendingSongs, settings)} style={{...mainBtn, background:'blue'}}>AYARLARI KAYDET</button>
                </div>

                {/* YENİ ŞARKI EKLE / DÜZENLE */}
                <div style={panelBox}>
                  <h4 style={{color:'orange'}}>{editId ? 'Şarkıyı Düzenle' : 'Manuel Şarkı Ekle'}</h4>
                  <input placeholder="Şarkı Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                  <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  <input placeholder="Ses URL" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                  <input placeholder="Kapak URL" value={form.cover} style={inputS} onChange={e => setForm({...form, cover: e.target.value})} />
                  <select value={form.category} style={inputS} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.filter(c => c !== "Hepsi").map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAdminAction} style={mainBtn}>{editId ? 'GÜNCELLE' : 'LİSTEYE EKLE'}</button>
                </div>

                {/* ONAY BEKLEYENLER (YENİ) */}
                <div style={panelBox}>
                  <h4 style={{color:'yellow'}}>📩 Onay Bekleyen Misafir Şarkıları</h4>
                  {pendingSongs.length === 0 && <p style={{fontSize:'12px', color:'#666'}}>Şu an bekleyen dosya yok.</p>}
                  {pendingSongs.map(ps => (
                    <div key={ps.id} style={listItem}>
                      <div><b>{ps.title}</b> <br/> <small>{ps.sender} tarafından</small></div>
                      <div style={{display:'flex', gap:'5px'}}>
                        <button onClick={() => {navigator.clipboard.writeText(ps.url); alert("Ses URL kopyalandı!");}} style={miniBtn}>🔗 URL</button>
                        <button onClick={() => approveSong(ps)} style={{...miniBtn, background:'green'}}>YAYINLA</button>
                        <button onClick={async () => { const n = pendingSongs.filter(x => x.id !== ps.id); setPendingSongs(n); syncDB(songs, n); }} style={{...miniBtn, background:'red'}}>REDDET</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* MEVCUT ŞARKILAR */}
                <div style={panelBox}>
                  <h4 style={{color:'orange'}}>🎵 Kütüphane ({songs.length})</h4>
                  {songs.map(s => (
                    <div key={s.id} style={listItem}>
                      <span>{s.title} - <small style={{color:'orange'}}>{s.category}</small></span>
                      <div style={{display:'flex', gap:'5px'}}>
                        <button onClick={() => {setForm(s); setEditId(s.id);}} style={{...miniBtn, background:'blue'}}>Düzenle</button>
                        <button onClick={async () => { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n, pendingSongs); }} style={{...miniBtn, background:'red'}}>Sil</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: ANA SAYFA */}
        {view === 'home' && (
          <div>
            <div style={{textAlign:'center', marginBottom:'30px'}}>
              <h2 style={{letterSpacing:'5px', color:'orange'}}>MÜZİK KUTUSU</h2>
            </div>
            {settings.banner && <img src={settings.banner} style={{width:'100%', height:'250px', objectFit:'cover', borderRadius:'20px', marginBottom:'20px'}} />}
            
            <div style={{display:'flex', gap:'10px', overflowX:'auto', marginBottom:'20px', scrollbarWidth:'none'}}>
              {categories.map(c => <button key={c} onClick={() => setActiveTab(c)} style={{...catBtn, background: activeTab === c ? 'orange' : '#111', color: activeTab === c ? '#000' : '#fff'}}>{c}</button>)}
            </div>

            <div style={{display:'grid', gap:'10px'}}>
              {filteredSongs.map((s, i) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(i)} style={{background:'#111', padding:'15px', borderRadius:'15px', display:'flex', alignItems:'center', gap:'15px', cursor:'pointer', border: currentSongIndex === i ? '1px solid orange' : 'none'}}>
                  <img src={s.cover} style={{width:'50px', height:'50px', borderRadius:'10px'}} />
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'bold'}}>{s.title}</div>
                    <div style={{fontSize:'12px', color:'#666'}}>{s.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PLAYER */}
      {currentSongIndex !== null && (
        <div style={{position:'fixed', bottom:20, left:'5%', right:'5%', background:'#000', padding:'15px', borderRadius:'20px', border:'1px solid orange', display:'flex', alignItems:'center', gap:'15px'}}>
          <audio src={filteredSongs[currentSongIndex].url} autoPlay controls style={{flex:1, filter:'invert(1)'}} />
          <button onClick={() => setCurrentSongIndex(null)} style={{background:'none', border:'none', color:'#fff'}}>✕</button>
        </div>
      )}
    </div>
  );
}

// STYLES
const navBtn = { background:'#111', color:'white', border:'1px solid #333', padding:'8px 15px', borderRadius:'10px', cursor:'pointer', fontSize:'13px' };
const backBtn = { background:'none', border:'none', color:'orange', marginBottom:'15px', cursor:'pointer', fontWeight:'bold' };
const inputS = { width:'100%', padding:'12px', marginBottom:'10px', background:'#000', color:'#fff', border:'1px solid #222', borderRadius:'10px' };
const fileS = { fontSize:'10px', background:'#000', padding:'10px', borderRadius:'10px', width:'100%', border:'1px dashed #444' };
const labS = { fontSize:'11px', color:'orange', display:'block', marginBottom:'5px' };
const mainBtn = { width:'100%', padding:'12px', background:'orange', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer' };
const catBtn = { padding:'10px 20px', borderRadius:'20px', border:'none', cursor:'pointer', whiteSpace:'nowrap' };
const panelBox = { background:'#111', padding:'20px', borderRadius:'20px', marginBottom:'20px', border:'1px solid #222' };
const listItem = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px', borderBottom:'1px solid #222', fontSize:'13px' };
const miniBtn = { padding:'5px 10px', borderRadius:'5px', border:'none', color:'#fff', fontSize:'11px', cursor:'pointer' };
