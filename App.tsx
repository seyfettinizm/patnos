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
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State (Süre kaldırıldı, otomatik algılanacak)
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

  // Otomatik Süre Algılama Fonksiyonu
  const getDuration = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = url;
      audio.addEventListener('loadedmetadata', () => {
        const min = Math.floor(audio.duration / 60);
        const sec = Math.floor(audio.duration % 60);
        resolve(`${min}:${sec < 10 ? '0' : ''}${sec}`);
      });
      audio.addEventListener('error', () => resolve("0:00"));
    });
  };

  const handleSaveSong = async () => {
    let updatedSongs;
    const duration = await getDuration(form.url);
    
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

  const handleEdit = (song: any) => {
    setForm({ title: song.title, artist: song.artist, url: song.url, cover: song.cover, category: song.category });
    setEditingId(song.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: number) => {
    if(confirm("Silmek istediğinize emin misiniz?")) {
      const updated = songs.filter(s => s.id !== id);
      await syncDB(updated);
    }
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ padding: '30px 20px', textAlign: 'center' }}>
        {config.logo && <img src={config.logo} style={{ width: '80px', display: 'block', margin: '0 auto 15px' }} alt="Logo" />}
        <h1 style={{ color: '#fff', fontSize: '24px', margin: 0 }}>{config.title}</h1>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setView('home')} style={view === 'home' ? activeNav : navBtn}>Ana Sayfa</button>
          <button onClick={() => setView('admin')} style={view === 'admin' ? activeNav : navBtn}>Yönetim</button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
        {view === 'admin' ? (
          <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #222' }}>
            {!isAuth ? (
              <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
            ) : (
              <div>
                {/* LOGO & BANNER YÜKLEME */}
                <section style={{ marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
                  <h3 style={{color:'orange'}}>Site Ayarları (Logo & Banner)</h3>
                  <input placeholder="Logo URL" value={config.logo} onChange={e=>setConfig({...config, logo:e.target.value})} style={inputS}/>
                  <input placeholder="Banner URL" value={config.banner} onChange={e=>setConfig({...config, banner:e.target.value})} style={inputS}/>
                  <button onClick={() => syncDB(songs, config)} style={saveBtnS}>AYARLARI KAYDET</button>
                </section>

                {/* ŞARKI EKLEME & DÜZENLEME */}
                <section>
                  <h3 style={{color:'orange'}}>{editingId ? 'Şarkıyı Düzenle' : 'Yeni Şarkı Ekle'}</h3>
                  <div style={{display:'grid', gap:'10px'}}>
                    <input placeholder="Şarkı Adı" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputS}/>
                    <input placeholder="Sanatçı" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} style={inputS}/>
                    <input placeholder="Müzik URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={inputS}/>
                    <input placeholder="Kapak URL" value={form.cover} onChange={e=>setForm({...form, cover:e.target.value})} style={inputS}/>
                    <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={inputS}>
                      <option value="Patnoslu Sanatçılar">Patnoslu Sanatçılar</option>
                      <option value="Dengbêjler">Dengbêjler</option>
                      <option value="Sizden Gelenler">Sizden Gelenler</option>
                    </select>
                    <button onClick={handleSaveSong} style={saveBtnS}>{editingId ? 'GÜNCELLE' : 'ŞARKIYI EKLE'}</button>
                    {editingId && <button onClick={() => {setEditingId(null); setForm({title:'', artist:'', url:'', cover:'', category:'Patnoslu Sanatçılar'});}} style={{color:'gray', background:'none', border:'none', marginTop:'5px', cursor:'pointer'}}>İptal Et</button>}
                  </div>
                </section>

                {/* LİSTE ÜSTÜ ARAMA ÇUBUĞU */}
                <div style={{marginTop: '40px'}}>
                  <input placeholder="🔍 Listede Ara..." style={searchBarS} onChange={(e) => setSearchTerm(e.target.value)} />
                  {songs.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                    <div key={s.id} style={adminListS}>
                      <span>{s.title} - {s.artist}</span>
                      <div>
                        <button onClick={() => handleEdit(s)} style={{color:'orange', marginRight:'15px', background:'none', border:'none', cursor:'pointer'}}>DÜZENLE</button>
                        <button onClick={() => handleDelete(s.id)} style={{color:'red', background:'none', border:'none', cursor:'pointer'}}>SİL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{textAlign:'center', padding:'50px', color:'orange', border:'1px dashed orange', borderRadius:'15px'}}>
             Yönetim Paneli Geri Yüklendi. <br/> Ana sayfa düzenine bir sonraki adımda geçeceğiz.
          </div>
        )}
      </main>
    </div>
  );
}

// STİLLER
const navBtn = { background: 'none', border: 'none', color: '#555', cursor: 'pointer', margin: '0 15px', fontWeight: 'bold' };
const activeNav = { ...navBtn, color: 'orange', borderBottom: '2px solid orange' };
const inputS = { padding: '12px', background: '#080808', border: '1px solid #222', color: '#fff', borderRadius: '8px', marginBottom: '10px', width: '100%' };
const saveBtnS = { background: 'orange', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };
const searchBarS = { ...inputS, borderColor: 'orange', marginTop: '20px' };
const adminListS = { display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #222', alignItems: 'center' };
