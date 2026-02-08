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
    if (!guestForm.audioFile) return alert("Müzik dosyası seçilmedi!");
    setIsUploading(true);
    try {
      const aUrl = await uploadFile(guestForm.audioFile, 'music');
      const cUrl = guestForm.coverFile ? await uploadFile(guestForm.coverFile, 'covers') : '';
      const newPending = [{ 
        id: Date.now(), title: guestForm.title, artist: guestForm.artist, sender: guestForm.sender,
        url: aUrl, cover: cUrl || 'https://via.placeholder.com/300'
      }, ...pendingSongs];
      setPendingSongs(newPending);
      await syncDB(songs, newPending);
      alert("Eseriniz yönetici onayına gönderildi!");
      setView('home');
    } catch (err) { alert("Yükleme hatası!"); }
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
    alert("Başarıyla kaydedildi!");
  };

  const filteredSongs = activeTab === "Hepsi" ? songs : songs.filter(s => s.category === activeTab);

  return (
    <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', background: '#000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ color: 'orange', fontWeight: 'bold', cursor: 'pointer', display:'flex', alignItems:'center', gap:'10px' }} onClick={() => setView('home')}>
          {settings.logo && <img src={settings.logo} style={{height:'30px', borderRadius:'50%'}} />}
          İZMİR PATNOSLULAR DERNEĞİ
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setView('contact')} style={navBtn}>📞 İletişim</button>
          <button onClick={() => setView('admin')} style={navBtn}>🔐 Yönetim {pendingSongs.length > 0 && <span style={badgeStyle}>{pendingSongs.length}</span>}</button>
        </div>
      </nav>

      <main style={{ padding: '20px 5%' }}>
        
        {/* VIEW: İLETİŞİM / GÖNDERİM */}
        {view === 'contact' && (
          <div style={{ maxWidth: '800px', margin: 'auto', animation: 'fadeIn 0.3s' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Ana Sayfaya Dön</button>
            <div style={{ background: '#111', padding: '30px', borderRadius: '25px', border:'1px solid #222' }}>
              <h2 style={{ color: 'orange', textAlign: 'center', marginBottom:'30px' }}>SİZİN ŞARKILARINIZ</h2>
              <form onSubmit={handleGuestSubmit}>
                <div style={grid2}><input placeholder="Adınız Soyadınız" style={inputS} onChange={e => setGuestForm({...guestForm, sender: e.target.value})} required /></div>
                <div style={grid2}>
                  <input placeholder="Şarkı Adı" style={inputS} onChange={e => setGuestForm({...guestForm, title: e.target.value})} required />
                  <input placeholder="Sanatçı" style={inputS} onChange={e => setGuestForm({...guestForm, artist: e.target.value})} required />
                </div>
                <div style={grid2}>
                  <div><label style={labS}>🎵 MÜZİK DOSYASI</label><input type="file" accept="audio/*" style={fileS} onChange={e => setGuestForm({...guestForm, audioFile: e.target.files?.[0] || null})} required /></div>
                  <div><label style={labS}>🖼️ KAPAK GÖRSELİ</label><input type="file" accept="image/*" style={fileS} onChange={e => setGuestForm({...guestForm, coverFile: e.target.files?.[0] || null})} /></div>
                </div>
                <button type="submit" disabled={isUploading} style={mainBtn}>{isUploading ? 'YÜKLENİYOR...' : 'YÖNETİME GÖNDER'}</button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: YÖNETİM PANELİ */}
        {view === 'admin' && (
          <div style={{ maxWidth: '900px', margin: 'auto', animation: 'fadeIn 0.3s' }}>
            <button onClick={() => setView('home')} style={backBtn}>← Ana Sayfaya Dön</button>
            {!isAuth ? (
              <form onSubmit={e => { e.preventDefault(); if(passInput === "Mihriban04") setIsAuth(true); else alert("Hatalı!"); }} style={{textAlign:'center', marginTop:'100px'}}>
                <input type="password" placeholder="Yönetici Şifresi" style={inputS} onChange={e => setPassInput(e.target.value)} />
                <button type="submit" style={mainBtn}>GİRİŞ YAP</button>
              </form>
            ) : (
              <div>
                {/* ONAY BEKLEYENLER - ÖN İZLEMELİ */}
                <div style={panelBox}>
                  <h3 style={{color:'yellow', marginTop:0}}>📩 Onay Bekleyenler ({pendingSongs.length})</h3>
                  {pendingSongs.map(ps => (
                    <div key={ps.id} style={pendingCard}>
                      <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                        <img src={ps.cover} style={{width:'80px', height:'80px', borderRadius:'10px', objectFit:'cover'}} />
                        <div style={{flex:1}}>
                          <div style={{fontWeight:'bold', fontSize:'16px'}}>{ps.title}</div>
                          <div style={{fontSize:'13px', color:'orange'}}>{ps.artist} <small style={{color:'#666'}}>• Gönderen: {ps.sender}</small></div>
                        </div>
                      </div>
                      <div style={previewPlayer}>
                        <span style={{fontSize:'10px', color:'#555'}}>ÖN DİNLEME:</span>
                        <audio src={ps.url} controls style={{height:'30px', flex:1, filter:'invert(1)'}} />
                      </div>
                      <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                        <button onClick={() => approveSong(ps)} style={{...miniBtn, background:'#27ae60'}}>✅ ONAYLA VE YAYINLA</button>
                        <button onClick={async () => { if(confirm("Reddet?")) { const n = pendingSongs.filter(x => x.id !== ps.id); setPendingSongs(n); syncDB(songs, n); }}} style={{...miniBtn, background:'#c0392b'}}>❌ REDDET</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SİTE AYARLARI */}
                <div style={panelBox}>
                  <h4 style={{color:'orange'}}>Site Görselleri</h4>
                  <input placeholder="Logo URL" value={settings.logo} style={inputS} onChange={e => setSettings({...settings, logo: e.target.value})} />
                  <input placeholder="Banner URL" value={settings.banner} style={inputS} onChange={e => setSettings({...settings, banner: e.target.value})} />
                  <button onClick={() => syncDB(songs, pendingSongs, settings)} style={{...mainBtn, background:'#2980b9'}}>AYARLARI KAYDET</button>
                </div>

                {/* MANUEL EKLEME */}
                <div style={panelBox}>
                  <h4 style={{color:'orange'}}>{editId ? 'Eseri Düzenle' : 'Manuel Eser Ekle'}</h4>
                  <input placeholder="Eser Adı" value={form.title} style={inputS} onChange={e => setForm({...form, title: e.target.value})} />
                  <input placeholder="Sanatçı" value={form.artist} style={inputS} onChange={e => setForm({...form, artist: e.target.value})} />
                  <input placeholder="Ses URL (MP3)" value={form.url} style={inputS} onChange={e => setForm({...form, url: e.target.value})} />
                  <input placeholder="Kapak URL" value={form.cover} style={inputS} onChange={e => setForm({...form, cover: e.target.value})} />
                  <select value={form.category} style={inputS} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.filter(c => c !== "Hepsi").map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAdminAction} style={mainBtn}>{editId ? 'GÜNCELLE' : 'YAYINLA'}</button>
                </div>

                {/* ARŞİV LİSTESİ */}
                <div style={panelBox}>
                  <h4 style={{color:'orange'}}>Kütüphane Yönetimi</h4>
                  {songs.map(s => (
                    <div key={s.id} style={listItem}>
                      <span>{s.title} <small style={{color:'orange'}}>({s.category})</small></span>
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

        {/* VIEW: ANA SAYFA */}
        {view === 'home' && (
          <div style={{animation: 'fadeIn 0.5s'}}>
            <div style={{textAlign:'center', marginBottom:'40px'}}>
              <h1 style={{letterSpacing:'8px', color:'orange', fontSize:'22px'}}>MÜZİK KUTUSU</h1>
            </div>
            {settings.banner && <img src={settings.banner} style={{width:'100%', height:'260px', object
