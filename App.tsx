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
  const [pendingSongs, setPendingSongs] = useState<any[]>([]);
  const [settings, setSettings] = useState({ logo: '', banner: '' });
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
  const [guestForm, setGuestForm] = useState({ sender: '', title: '', artist: '', audioFile: null as File | null, coverFile: null as File | null });
  const [isUploading, setIsUploading] = useState(false);

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setPendingSongs(data.value.pendingSongs || []);
        setSettings(data.value.settings || { logo: '', banner: '' });
      }
    } catch (err) { console.error("Yükleme hatası:", err); }
  };

  const syncDB = async (newSongs: any[], newPending: any[], newSettings = settings) => {
    await supabase.from('settings').update({ 
      value: { songs: newSongs, pendingSongs: newPending, settings: newSettings } 
    }).eq('id', 'app_data');
  };

  const uploadFile = async (file: File, path: string) => {
    const name = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const { error } = await supabase.storage.from('patnos_files').upload(`${path}/${name}`, file);
    if (error) throw error;
    return supabase.storage.from('patnos_files').getPublicUrl(`${path}/${name}`).data.publicUrl;
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.audioFile) return alert("Dosya seçilmedi!");
    setIsUploading(true);
    try {
      const aUrl = await uploadFile(guestForm.audioFile, 'music');
      const cUrl = guestForm.coverFile ? await uploadFile(guestForm.coverFile, 'covers') : 'https://via.placeholder.com/300';
      const newEntry = { id: Date.now(), sender: guestForm.sender, title: guestForm.title, artist: guestForm.artist, url: aUrl, cover: cUrl };
      const updatedPending = [newEntry, ...pendingSongs];
      setPendingSongs(updatedPending);
      await syncDB(songs, updatedPending);
      alert("Dosyalar yöneticiye iletildi!");
      setView('home');
    } catch (err) { alert("Yükleme başarısız."); }
    finally { setIsUploading(false); }
  };

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
    alert("Kütüphane güncellendi!");
  };

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);

  return (
    <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ color: 'orange', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setView('home')}>İZMİR PATNOSLULAR DERNEĞİ</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setView('contact')} style={navBtn}>📞 İletişim</button>
          <button onClick={() => setView('admin')} style={navBtn}>🔐 Yönetim {pendingSongs.length > 0 && <span style={badgeStyle}>{pendingSongs.length}</span>}</button>
        </div>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        
        {/* VIEW: İLETİŞİM / DOSYA GÖNDERİM */}
        {view === 'contact' && (
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Vazgeç</button>
            <div style={panelBox}>
              <h2 style={{ color: 'orange', textAlign: 'center' }}>DOSYA GÖNDER</h2>
              <form onSubmit={handleGuestSubmit}>
                <input placeholder="Adınız" style={inputS} onChange={e => setGuestForm({...guestForm, sender: e.target.value})} required />
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <input placeholder="Şarkı Adı" style={inputS} onChange={e => setGuestForm({...guestForm, title: e.target.value})} />
                  <input placeholder="Sanatçı" style={inputS} onChange={e => setGuestForm({...guestForm, artist: e.target.value})} />
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'15px'}}>
                  <div><label style={labS}>SES DOSYASI</label><input type="file" accept="audio/*" style={fileS} onChange={e => setGuestForm({...guestForm, audioFile: e.target.files?.[0] || null})} required /></div>
                  <div><label style={labS}>KAPAK GÖRSELİ</label><input type="file" accept="image/*" style={fileS} onChange={e => setGuestForm({...guestForm, coverFile: e.target.files?.[0] || null})} /></div>
                </div>
                <button type="submit" disabled={isUploading} style={mainBtn}>{isUploading ? 'YÜKLENİYOR...' : 'YÖNETİME GÖNDER'}</button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: YÖNETİM */}
        {view === 'admin' && (
          <div style={{ maxWidth: '900px', margin: 'auto' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Kapat</button>
            {!isAuth ? (
              <form onSubmit={e => { e.preventDefault(); if(passInput === "Mihriban04") setIsAuth(true); else alert("Hatalı!"); }} style={{textAlign:'center', marginTop:'50px'}}>
                <input type="password" placeholder="Şifre" style={inputS} onChange={e => setPassInput(e.target.value)} />
                <button type="submit" style={mainBtn}>GİRİŞ</button>
              </form>
            ) : (
              <div>
                {/* GELEN DOSYALAR HAVUZU */}
                <div style={{...panelBox, borderColor:'yellow'}}>
                  <h3 style={{color:'yellow', marginTop:0}}>📥 İnceleme Havuzu (Dosya Olarak Gelenler)</h3>
                  {pendingSongs.map(ps => (
                    <div key={ps.id} style={pendingCard}>
                      <div style={{display:'flex', gap:'15px', alignItems:'center', marginBottom:'10px'}}>
                        <img src={ps.cover} style={{width:'60px', height:'60px', borderRadius:'10px'}} />
                        <div style={{flex:1}}>
                          <div style={{fontWeight:'bold'}}>{ps.title || 'Adsız'} - {ps.artist || 'Bilinmiyor'}</div>
                          <div style={{fontSize:'12px', color:'#666'}}>Gönderen: {ps.sender}</div>
                        </div>
                      </div>
                      <audio src={ps.url} controls style={{width:'100%', height:'35px', filter:'invert(1)', marginBottom:'10px'}} />
                      <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                        <button onClick={() => {navigator.clipboard.writeText(ps.url); alert("Ses URL Kopyalandı!");}} style={{...miniBtn, background:'#2980b9'}}>🔗 SES URL</button>
                        <button onClick={() => {navigator.clipboard.writeText(ps.cover); alert("Görsel URL Kopyalandı!");}} style={{...miniBtn, background:'#2980b9'}}>🖼️ GÖRSEL URL</button>
                        <button onClick={async () => { if(confirm("Silinsin mi?")) { const n = pendingSongs.filter(x => x.id !== ps.id); setPendingSongs(n); syncDB(songs, n); }}} style={{...miniBtn, background:'#c0392b'}}>🗑️ KALDIR</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* MANUEL YAYINLAMA FORMU */}
                <div style={panelBox}>
                  <h4 style={{color:'orange', marginTop:0}}>🚀 Yayına Al (URL Yapıştır)</h4>
                  <input placeholder="Eser Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                  <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  <input placeholder="Ses URL (Yukarıdan Kopyaladığını Yapıştır)" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                  <input placeholder="Kapak URL (Yukarıdan Kopyaladığını Yapıştır)" value={form.cover} style={inputS} onChange={e => setForm({...form, cover: e.target.value})} />
                  <select value={form.category} style={inputS} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.filter(c => c !== "Hepsi").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAdminAction} style={mainBtn}>KÜTÜPHANEYE EKLE VE YAYINLA</button>
                </div>
                
                {/* ARŞİV DÜZENLEME VE SİLME */}
                <div style={panelBox}>
                    <h4 style={{color:'orange', marginTop:0}}>🎵 Mevcut Kütüphane</h4>
                    {songs.map(s => (
                        <div key={s.id} style={listItem}>
                            <span>{s.title} ({s.category})</span>
                            <div style={{display:'flex', gap:'5px'}}>
                                <button onClick={() => {setForm(s); setEditId(s.id); window.scrollTo(0,0);}} style={{...miniBtn, background:'#2980b9'}}>Düzenle</button>
                                <button onClick={async () => { if(confirm("Sil?")) { const n = songs.filter(x => x.id !== s.id); setSongs(n); syncDB(n, pendingSongs); }}} style={{...miniBtn, background:'#c0392b'}}>Sil</button>
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
          <div>
            <h1 style={{textAlign:'center', color:'orange', letterSpacing:'5px'}}>MÜZİK KUTUSU</h1>
            {settings.banner && <img src={settings.banner} style={{width:'100%', height:'200px', objectFit:'cover', borderRadius:'20px', margin:'20px 0'}} />}
            <div style={{display:'flex', gap:'10px', overflowX:'auto', marginBottom:'20px', scrollbarWidth:'none'}}>
              {categories.map(c => <button key={c} onClick={() => setActiveTab(c)} style={{...catBtn, background: activeTab === c ? 'orange' : '#111', color: activeTab === c ? '#000' : '#fff'}}>{c}</button>)}
            </div>
            <div style={{display:'grid', gap:'10px'}}>
              {filteredSongs.map((s, i) => (
                <div key={s.id} onClick={() => setCurrentSongIndex(i)} style={{background:'#111', padding:'15px', borderRadius:'15px', display:'flex', alignItems:'center', gap:'15px', cursor:'pointer', border: currentSongIndex === i ? '1px solid orange' : 'none'}}>
                  <img src={s.cover} style={{width:'50px', height:'50px', borderRadius:'10px'}} />
                  <div>
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
        <div style={playerBar}>
          <audio src={filteredSongs[currentSongIndex].url} autoPlay controls style={{flex:1, filter:'invert(1)'}} />
          <button onClick={() => setCurrentSongIndex(null)} style={{background:'none', border:'none', color:'#fff'}}>✕</button>
        </div>
      )}
    </div>
  );
}

// STYLES
const navBtn = { background:'#111', color:'white', border:'1px solid #333', padding:'8px 15px', borderRadius:'12px', cursor:'pointer', position:'relative' as 'relative' };
const badgeStyle = { position:'absolute' as 'absolute', top:'-5px', right:'-5px', background:'red', fontSize:'10px', width:'18px', height:'18px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' };
const backBtn = { background:'none', border:'none', color:'orange', cursor:'pointer', marginBottom:'15px' };
const inputS = { width:'100%', padding:'12px', marginBottom:'10px', background:'#000', color:'#fff', border:'1px solid #222', borderRadius:'10px' };
const fileS = { background:'#000', padding:'10px', borderRadius:'10px', width:'100%', border:'1px dashed #333', fontSize:'11px' };
const labS = { fontSize:'11px', color:'orange', display:'block', marginBottom:'5px' };
const mainBtn = { width:'100%', padding:'15px', background:'orange', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer' };
const catBtn = { padding:'10px 20px', borderRadius:'20px', border:'none', cursor:'pointer', whiteSpace:'nowrap' };
const panelBox = { background:'#111', padding:'25px', borderRadius:'25px', marginBottom:'20px', border:'1px solid #222' };
const pendingCard = { background:'#000', padding:'15px', borderRadius:'15px', marginBottom:'10px', border:'1px solid #222' };
const miniBtn = { padding:'5px 12px', borderRadius:'5px', border:'none', color:'#fff', fontSize:'11px', cursor:'pointer', fontWeight:'bold' };
const listItem = { display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #222' };
const playerBar = { position:'fixed' as 'fixed', bottom:20, left:'5%', right:'5%', background:'#000', padding:'15px', borderRadius:'20px', border:'1px solid orange', display:'flex', gap:'15px', zIndex:2000 };
