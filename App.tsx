import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Music, Search, Heart, 
  Settings, Languages, Mail, Phone, MapPin, Plus, Trash2, Save, LogOut, Upload, Image as ImageIcon
} from 'lucide-react';
import { createClient } from '@supabase/supabase-client';

// SUPABASE BAĞLANTISI (Senin Bilgilerinle Güncellendi)
const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<'TR' | 'KU'>('TR');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // BULUTTAN GELECEK VERİLER
  const [songs, setSongs] = useState<any[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200");
  const [bannerTR, setBannerTR] = useState("İZMİR'DEN PATNOS'A SEVGİLER");
  const [bannerKU, setBannerKU] = useState("JI ÎZMÎRÊ JI BO PANOSÊ SILAV");

  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });

  // 1. VERİLERİ SUPABASE'DEN ÇEK
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

  // 2. VERİLERİ SUPABASE'E KAYDET (PANEL İÇİN)
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

    if (!error) alert("Değişiklikler Buluta Kaydedildi!");
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

  // TASARIM KISMI (SideBar, Banner, SongList vb.)
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans pb-32">
      {/* Buraya senin mevcut görselindeki tüm arayüz kodları gelecek */}
      <div className="flex">
        {/* Sol Menü */}
        <aside className="w-64 bg-black h-screen sticky top-0 border-r border-yellow-900/20 p-6">
           <div className="flex flex-col items-center mb-10">
              {logoUrl ? <img src={logoUrl} className="w-20 h-20 rounded-full border-2 border-yellow-600 mb-2 shadow-lg shadow-yellow-600/20" /> : <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mb-2"><Music size={40} /></div>}
              <h1 className="text-yellow-600 font-bold text-center text-xs tracking-widest uppercase mt-2">İZMİR PATNOSLULAR DERNEĞİ</h1>
              <p className="text-[10px] text-yellow-700 font-medium tracking-[0.2em] mt-1">MÜZİK KUTUSU</p>
           </div>
           {/* Menü Butonları */}
           <nav className="space-y-4">
              <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/30 font-bold' : 'hover:bg-yellow-900/20'}`}><Play size={20}/> Ana Sayfa</button>
              <button onClick={() => setIsAdmin(!isAdmin)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isAdmin ? 'bg-red-600 text-white' : 'hover:bg-red-900/20'}`}><Settings size={20}/> {isAdmin ? 'Çıkış Yap' : 'Yönetici'}</button>
           </nav>
        </aside>

        {/* Orta Alan */}
        <main className="flex-1 p-8">
           {isAdmin ? (
             <section className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="bg-yellow-900/10 p-8 rounded-3xl border border-yellow-600/20">
                   <h2 className="text-2xl font-bold text-yellow-600 mb-6 flex items-center gap-2 underline">GÖRSEL & DİL YÖNETİMİ</h2>
                   <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="bg-black/40 border border-yellow-900/30 p-3 rounded-lg" />
                      <input placeholder="Banner Resim URL" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} className="bg-black/40 border border-yellow-900/30 p-3 rounded-lg" />
                   </div>
                   <button onClick={() => saveAllData(songs)} className="mt-4 w-full bg-yellow-600 text-black py-3 rounded-xl font-bold">Tümünü Kaydet</button>
                </div>

                <div className="bg-yellow-900/10 p-8 rounded-3xl border border-yellow-600/20">
                   <h2 className="text-2xl font-bold text-yellow-600 mb-6 underline">YENİ ŞARKI EKLE</h2>
                   <form onSubmit={handleAddSong} className="space-y-4">
                      <input placeholder="Şarkı Adı" value={newSong.title} onChange={(e) => setNewSong({...newSong, title: e.target.value})} className="w-full bg-black/40 border border-yellow-900/30 p-3 rounded-lg" required />
                      <input placeholder="Müzik Dosya URL" value={newSong.url} onChange={(e) => setNewSong({...newSong, url: e.target.value})} className="w-full bg-black/40 border border-yellow-900/30 p-3 rounded-lg" required />
                      <button type="submit" className="w-full bg-yellow-600 text-black py-4 rounded-xl font-bold">Sisteme Ekle</button>
                   </form>
                </div>
             </section>
           ) : (
             <>
               <div className="relative h-80 rounded-[40px] overflow-hidden mb-12 shadow-2xl border-2 border-yellow-900/20 group">
                  <img src={bannerUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-12">
                     <h2 className="text-5xl font-black italic tracking-tighter text-yellow-500 drop-shadow-2xl">{lang === 'TR' ? bannerTR : bannerKU}</h2>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {songs.map(song => (
                   <div key={song.id} className="bg-yellow-900/5 p-4 rounded-2xl border border-yellow-600/10 hover:border-yellow-600/40 transition-all">
                     <img src={song.cover || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400"} className="w-full h-40 object-cover rounded-xl mb-4" />
                     <h3 className="font-bold text-lg">{song.title}</h3>
                     <p className="text-gray-400 text-sm mb-4">{song.artist}</p>
                     <button onClick={() => {setCurrentSong(song); setIsPlaying(true);}} className="bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold w-full">Dinle</button>
                   </div>
                 ))}
               </div>
             </>
           )}
        </main>
      </div>

      {/* Oynatıcı Barı */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-yellow-600/20 p-6 flex items-center justify-between z-50 animate-in slide-in-from-bottom duration-500">
           <div className="flex items-center gap-4">
              <img src={currentSong.cover} className="w-16 h-16 rounded-xl border border-yellow-600/40 object-cover" />
              <div>
                 <h4 className="font-bold text-yellow-500">{currentSong.title}</h4>
                 <p className="text-xs text-gray-400">{currentSong.artist}</p>
              </div>
           </div>
           <audio src={currentSong.url} autoPlay={isPlaying} controls className="w-1/2 accent-yellow-600" />
        </div>
      )}
    </div>
  );
}

export default App;
