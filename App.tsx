import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [view, setView] = useState<'home' | 'admin'>('home');
  const [isAuth, setIsAuth] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [config, setConfig] = useState({ logo: '', banner: '', title: 'İZMİR PATNOSLULAR DERNEĞİ' });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Hepsi");
  const [editingId, setEditingId] = useState<number | null>(null);

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

  // YÖNETİM PANELİ FONKSİYONLARINI (DÜZENLE/SİL/EKLE) AYNEN KORUYORUZ
  const handleSaveSong = async () => {
    let updatedSongs;
    if (editingId) {
      updatedSongs = songs.map(s => s.id === editingId ? { ...form, id: editingId, likes: s.likes || 0 } : s);
      setEditingId(null);
    } else {
      updatedSongs = [{ ...form, id: Date.now(), likes: 0 }, ...songs];
    }
    await syncDB(updatedSongs);
    setForm({ title: '', artist: '', url: '', cover: '', category: 'Patnoslu Sanatçılar' });
    alert("İşlem Başarılı!");
  };

  const categories = ["Hepsi", "Patnoslu Sanatçılar", "Dengbêjler", "Patnos Türküleri", "Sizden Gelenler"];

  const filteredSongs = songs.filter(s => {
    const matchesSearch = (s.title?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim()) || 
                          (s.artist?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim());
    const matchesTab = activeTab === "Hepsi" || s.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* ÜST KISIM - LOGO VE BAŞLIK */}
      <header style={{ padding: '30px 20px', textAlign: 'center' }}>
        {config.logo && <img src={config.logo} style={{ width: '70px', display: 'block', margin: '0 auto 10px' }} />}
        <h1 style={{ color: '#fff', fontSize: '22px', margin: 0, fontWeight: 'bold' }}>{config.title}</h1>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: 'auto', padding: '0 20px 100px' }}>
        {view === 'admin' ? (
          /* --- YÖNETİM PANELİ (SENİN ONAY VERDİĞİN KORUNAN BÖLÜM) --- */
          <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
              <div>
                <section style={{ marginBottom: '30px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
                  <h4 style={{color:'orange'}}>Site Ayarları (Logo & Banner)</h4>
                  <input placeholder="Logo URL" value={config.logo} onChange={e=>setConfig({...config, logo:e.target.value})} style={inputS}/>
                  <input placeholder="Banner URL" value={config.banner} onChange={e=>setConfig({...config, banner:e.target.value})} style={inputS}/>
                  <button onClick={() => syncDB(songs, config)} style={saveBtnS}>AYARLARI KAYDET</button>
                </section>

                <h4 style={{color:'orange'}}>{editingId ? 'Şarkıyı Düzenle' : 'Yeni Şarkı Ekle'}</h4>
                <div style={{display:'grid', gap:'10px'}}>
                  <input placeholder="Şarkı Adı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                  <input placeholder="Sanatçı" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} style={inputS}/>
                  <input placeholder="Müzik URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                  <button onClick={handleSaveSong} style={saveBtnS}>{editingId ? 'GÜNCELLE' : 'EKLE'}</button>
                </div>

                <div style={{marginTop:'30px'}}>
                   <input placeholder="🔍 Listede Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />
                   {songs.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                     <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #222'}}>
                       <span>{s.title}</span>
                       <div>
                         <button onClick={() => {setEditingId(s.id); setForm(s);}} style={{color:'orange', marginRight:'10px', background:'none', border:'none'}}>DÜZENLE</button>
                         <button onClick={() => syncDB(songs.filter(i=>i.id!==s.id))} style={{color:'red', background:'none', border:'none'}}>SİL</button>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --- ANA SAYFA (YENİLENEN GÖRSEL 2 TASARIMI) --- */
          <div>
            {config.banner && (
              <div style={{ width: '100%', height: '230px', borderRadius: '25px', overflow: 'hidden', marginBottom: '25px', border: '1px solid #111' }}>
                <img src={config.banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', marginBottom: '25px', paddingBottom: '10px' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} style={activeTab === cat ? activeTabS : tabBtnS}>{cat}</button>
              ))}
            </div>

            <input placeholder="🔍 Şarkı veya Sanatçı Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />

            <div style={{ marginTop: '20px' }}>
              {filteredSongs.map(s => (
                <div key={s.id} style={songCardS}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={s.cover || config.logo} style={{ width: '50px', height: '50px', borderRadius: '10px' }} />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{s.title}</div>
                      <div style={{ color: '#555', fontSize: '13px' }}>{s.artist}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{color: 'red'}}>❤️ {s.likes || 0}</span>
                    <button style={playBtnS}>OYNAT</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// STİLLER (KORUNAN PANEL VE YENİ ANA SAYFA İÇİN)
const navBtn = { background: 'none', border: 'none', color: '#555', cursor: 'pointer', margin: '0 12px', fontWeight: 'bold' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange' };
const inputS = { padding: '12px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '10px', width: '100%', marginBottom: '10px' };
const saveBtnS = { background: 'orange', color: '#000', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };
const searchBarS = { width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #111', borderRadius: '15px', color: '#fff', outline: 'none' };
const tabBtnS = { color: '#444', background: 'none', border: 'none', fontSize: '15px', cursor: 'pointer', whiteSpace: 'nowrap' };
const activeTabS = { ...tabBtnS, color: 'orange', fontWeight: 'bold' };
const songCardS = { background: '#080808', padding: '12px 20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', border: '1px solid #111' };
const playBtnS = { padding: '8px 20px', borderRadius: '20px', border: '1px solid orange', color: 'orange', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' };
