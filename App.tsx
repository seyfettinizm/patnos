import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Music, Search, Heart, 
  Settings, Languages, Mail, Phone, MapPin, Plus, Trash2, Save, LogOut, Upload, Image as ImageIcon
} from 'lucide-react';
import { createClient } from '@supabase/supabase-client';

// 1. SUPABASE BAĞLANTISI (Senin Bilgilerinle Hazırlandı)
const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<'TR' | 'KU'>('TR');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // 2. BULUTTAN GELECEK VERİLER
  const [songs, setSongs] = useState<any[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200");
  const [bannerTR, setBannerTR] = useState("İZMİR'DEN PATNOS'A SEVGİLER");
  const [bannerKU, setBannerKU] = useState("JI ÎZMÎRÊ JI BO PANOSÊ SILAV");

  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });

  // 3. VERİLERİ AÇILIŞTA BULUTTAN ÇEK
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('id', 'app_data')
        .single();

      if (data && data.value) {
        const v = data.value;
        setSongs(v.songs || []);
        setLogoUrl(v.logoUrl || "");
        setBannerUrl(v.bannerUrl || "");
        setBannerTR(v.bannerTR || "");
        setBannerKU(v.bannerKU || "");
      }
    };
    fetchSettings();
  }, []);

  // 4. VERİLERİ BULUTA KAYDETME FONKSİYONU
  const saveAllData = async (updatedSongs: any[]) => {
    const fullData = {
      songs: updatedSongs,
      logoUrl,
      bannerUrl,
      bannerTR,
      bannerKU
    };

    const { error } = await supabase
      .from('settings')
      .update({ value: fullData })
      .eq('id', 'app_data');

    if (!error) {
      alert("Değişiklikler Buluta Başarıyla Kaydedildi!");
    } else {
      alert("Hata oluştu: " + error.message);
    }
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [{ ...newSong, id: Date.now(), likes: 0 }, ...songs];
    setSongs(updated);
    await saveAllData(updated);
    setNewSong({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });
  };

  const handleDeleteSong = async (id: number) => {
    const updated = songs.filter(s => s.id !== id);
    setSongs(updated);
    await saveAllData(updated);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans pb-32">
      <div className="flex">
        {/* SOL MENÜ */}
        <aside className="w-64 bg-black h-screen sticky top-0 border-r border-yellow-900/20 p-6">
           <div className="flex flex-col items-center mb-10">
              {logoUrl ? (
                <img src={logoUrl} className="w-20 h-20 rounded-full border-2 border-yellow-600 mb-2 shadow-lg shadow-yellow-600/20" />
              ) : (
                <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mb-2"><Music size={40} className="text-black" /></div>
              )}
              <h1 className="text-yellow-600 font-bold text-center text-[10px] tracking-widest uppercase mt-2">İZMİR PATNOSLULAR DERNEĞİ</h1>
           </div>
           <nav className="space-y-4">
              <button onClick={() => {setActiveTab('home'); setIsAdmin(false);}} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' && !isAdmin ? 'bg-yellow-600 text-black font-bold' : 'hover:bg-yellow-900/20'}`}><Play size={20}/> Ana Sayfa</button>
              <button onClick={() => setIsAdmin(!isAdmin)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isAdmin ? 'bg-red-600 text-white' : 'hover:bg-red-900/20'}`}><Settings size={20}/> {isAdmin ? 'Panelden Çık' : 'Yönetici Paneli'}</button>
           </nav>
        </aside>

        {/* ANA ALAN */}
        <main className="flex-1 p-8">
           {isAdmin ? (
             <section className="max-w-4xl mx-auto space-y-8">
                <div className="bg-yellow-900/10 p-8 rounded-3xl border border-yellow-600/20">
                   <h2 className="text-2xl font-bold text-yellow-600 mb-6">SİTE AYARLARI</h2>
                   <div className="grid grid-cols-1 gap-4">
                      <input placeholder="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="bg-black/40 border border-yellow-900/30 p-3 rounded-lg w-full" />
                      <input placeholder="Banner Arkaplan URL" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} className="bg-black/40 border border-yellow-900/30 p-3 rounded-lg w-full" />
                      <input placeholder="Banner Metni (TR)" value={bannerTR} onChange={(e) => setBannerTR(e.target.value)} className="bg-black/40 border border-yellow-900/30 p-3 rounded-lg w-full" />
                      <input placeholder="Banner Metni (KU)" value={bannerKU} onChange={(e) => setBannerKU(e.target.value)} className="bg-black/40 border border-yellow-900/30 p-3 rounded-lg w-full" />
                   </div>
                   <button onClick={() => saveAllData(songs)} className="mt-4 w-full bg-yellow-600 text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={20}/> Ayarları Kaydet</button>
                </div>

                <div className="bg-yellow-900/10 p-8 rounded-3xl border border-yellow-600/20">
                   <h2 className="text-2xl font-bold text-yellow-600 mb-6">YENİ ŞARKI EKLE</h2>
                   <form onSubmit={handleAddSong} className="space-y-4">
                      <input placeholder="Şarkı Adı" value={newSong.title} onChange={(e) => setNewSong({...newSong, title: e.target.value})} className="w-full bg-black/40 border border-yellow-900/30 p-3 rounded-lg" required />
                      <input placeholder="Sanatçı" value={newSong.artist} onChange={(e) => setNewSong({...newSong, artist: e.target.value})} className="w-full bg-black/40 border border-yellow-900/30 p-3 rounded-lg" required />
                      <input placeholder="Kapak Resmi URL" value={newSong.cover} onChange={(e) => setNewSong({...newSong, cover: e.target.value})} className="w-full bg-black/40 border border-yellow-900/30 p-3 rounded-lg" />
                      <input placeholder="Ses Dosyası (MP3) URL" value={newSong.url} onChange={(e) => setNewSong({...newSong, url: e.target.value})} className="w-full bg-black/40 border border-yellow-900/30 p-3 rounded-lg" required />
                      <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold">Şarkıyı Buluta Ekle</button>
                   </form>
                </div>

                <div className="bg-black/40 p-6 rounded-3xl border border-red-900/20">
                  <h3 className="text-xl font-bold mb-4">Mevcut Şarkılar (Silme)</h3>
                  {songs.map(s => (
                    <div key={s.id} className="flex justify-between items-center p-3 border-b border-white/5">
                      <span>{s.title} - {s.artist}</span>
                      <button onClick={() => handleDeleteSong(s.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
             </section>
           ) : (
             <>
               {/* BANNER */}
               <div className="relative h-80 rounded-[40px] overflow-hidden mb-12 shadow-2xl border-2 border-yellow-900/20 group">
                  <img src={bannerUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-12">
                     <div className="flex justify-between items-end w-full">
                        <h2 className="text-5xl font-black italic tracking-tighter text-yellow-500 drop-shadow-2xl uppercase">
                          {lang === 'TR' ? bannerTR : bannerKU}
                        </h2>
                        <div className="flex gap-2">
                          <button onClick={() => setLang('TR')} className={`px-4 py-2 rounded-full font-bold ${lang === 'TR' ? 'bg-yellow-600 text-black' : 'bg-black/60 text-white'}`}>TR</button>
                          <button onClick={() => setLang('KU')} className={`px-4 py-2 rounded-full font-bold ${lang === 'KU' ? 'bg-yellow-600 text-black' : 'bg-black/60 text-white'}`}>KU</button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* ŞARKI LİSTESİ */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {songs.map(song => (
                   <div key={song.id} className="bg-yellow-900/5 p-4 rounded-3xl border border-yellow-600/10 hover:border-yellow-600/40 transition-all group">
                     <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square">
                        <img src={song.cover || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400"} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <button onClick={() => {setCurrentSong(song); setIsPlaying(true);}} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <div className="bg-yellow-600 p-4 rounded-full text-black shadow-xl shadow-yellow-600/40"><Play fill="currentColor" size={24}/></div>
                        </button>
                     </div>
                     <h3 className="font-bold text-lg truncate">{song.title}</h3>
                     <p className="text-gray-400 text-xs mb-4 uppercase tracking-widest">{song.artist}</p>
                   </div>
                 ))}
               </div>
             </>
           )}
        </main>
      </div>

      {/* OYNATICI ÇUBUĞU */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-yellow-600/20 p-6 flex items-center justify-between z-50">
           <div className="flex items-center gap-4 w-1/4">
              <img src={currentSong.cover} className="w-16 h-16 rounded-xl border border-yellow-600/40 shadow-lg shadow-yellow-600/10" />
              <div className="overflow-hidden">
                 <h4 className="font-bold text-yellow-500 truncate">{currentSong.title}</h4>
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest">{currentSong.artist}</p>
              </div>
           </div>
           <div className="flex-1 max-w-2xl px-8">
              <audio 
                src={currentSong.url} 
                autoPlay={isPlaying} 
                controls 
                className="w-full h-10 invert brightness-150" 
              />
           </div>
           <div className="w-1/4 flex justify-end">
              <button onClick={() => setCurrentSong(null)} className="text-gray-500 hover:text-white"><LogOut size={20}/></button>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;
