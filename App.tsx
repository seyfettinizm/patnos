import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Music, Search, Heart, 
  Settings, Languages, Mail, Phone, MapPin, Plus, Trash2, Save, LogOut, Upload, Image as ImageIcon
} from 'lucide-react';
import { createClient } from '@supabase/supabase-client';

// SUPABASE BAĞLANTISI
const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<'TR' | 'KU'>('TR');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [songs, setSongs] = useState<any[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200");
  const [bannerTR, setBannerTR] = useState("İZMİR'DEN PATNOS'A SEVGİLER");
  const [bannerKU, setBannerKU] = useState("JI ÎZMÎRÊ JI BO PANOSÊ SILAV");

  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });

  // BULUTTAN VERİ ÇEKME
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
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

  // BULUTA KAYDETME
  const saveAllData = async (updatedSongs: any[]) => {
    const fullData = { songs: updatedSongs, logoUrl, bannerUrl, bannerTR, bannerKU };
    const { error } = await supabase.from('settings').update({ value: fullData }).eq('id', 'app_data');
    if (!error) alert("Başarıyla Buluta Kaydedildi!");
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [{ ...newSong, id: Date.now(), likes: 0 }, ...songs];
    setSongs(updated);
    await saveAllData(updated);
    setNewSong({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans pb-32">
      <div className="flex">
        {/* SOL MENÜ */}
        <aside className="w-64 bg-black h-screen sticky top-0 border-r border-yellow-900/20 p-6 text-center">
           <div className="mb-10 flex flex-col items-center">
              {logoUrl ? <img src={logoUrl} className="w-20 h-20 rounded-full border-2 border-yellow-600 mb-2" /> : <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mb-2"><Music size={40} className="text-black"/></div>}
              <h1 className="text-yellow-600 font-bold text-[10px] tracking-widest uppercase">İZMİR PATNOSLULAR DERNEĞİ</h1>
           </div>
           <nav className="space-y-4">
              <button onClick={() => {setActiveTab('home'); setIsAdmin(false);}} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' && !isAdmin ? 'bg-yellow-600 text-black font-bold' : 'hover:bg-yellow-900/20'}`}><Play size={20}/> Ana Sayfa</button>
              <button onClick={() => setIsAdmin(!isAdmin)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isAdmin ? 'bg-red-600 text-white' : 'hover:bg-red-900/20'}`}><Settings size={20}/> {isAdmin ? 'Panelden Çık' : 'Yönetici'}</button>
           </nav>
        </aside>

        {/* ANA ALAN */}
        <main className="flex-1 p-8">
           {isAdmin ? (
             <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-yellow-900/10 p-6 rounded-3xl border border-yellow-600/20">
                   <h2 className="text-xl font-bold text-yellow-600 mb-4">GÖRSEL AYARLAR</h2>
                   <input placeholder="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full bg-black/40 border border-yellow-900/30 p-3 rounded-lg mb-2" />
                   <input placeholder="Banner URL" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} className="w-full bg-black/40 border border-yellow-900/30 p-3 rounded-lg mb-2" />
                   <button onClick={() => saveAllData(songs)} className="w-full bg-yellow-600 text-black py-3 rounded-xl font-bold">Ayarları Buluta Kaydet</button>
                </div>
                <div className="bg-yellow-900/10 p-6 rounded-3xl border border-yellow-600/20">
                   <h2 className="text-xl font-bold text-yellow-600 mb-4">ŞARKI EKLE</h2>
                   <form onSubmit={handleAddSong} className="space-y-3">
                      <input placeholder="Şarkı Adı" value={newSong.title} onChange={(e) => setNewSong({...newSong, title: e.target.value})} className="w-full bg-black/40 border border-yellow-900/30 p-3 rounded-lg" required />
                      <input placeholder="Ses Dosyası (MP3) URL" value={newSong.url} onChange={(e) => setNewSong({...newSong, url: e.target.value})} className="w-full bg-black/40 border border-yellow-900/30 p-3 rounded-lg" required />
                      <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Şarkıyı Buluta Ekle</button>
                   </form>
                </div>
             </div>
           ) : (
             <>
               <div className="relative h-64 rounded-[40px] overflow-hidden mb-8 border-2 border-yellow-900/20">
                  <img src={bannerUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-10">
                     <h2 className="text-4xl font-black text-yellow-500 uppercase">{lang === 'TR' ? bannerTR : bannerKU}</h2>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {songs.map(song => (
                   <div key={song.id} className="bg-yellow-900/5 p-4 rounded-3xl border border-yellow-600/10">
                     <h3 className="font-bold text-lg">{song.title}</h3>
                     <button onClick={() => {setCurrentSong(song); setIsPlaying(true);}} className="mt-3 bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold w-full">Oynat</button>
                   </div>
                 ))}
               </div>
             </>
           )}
        </main>
      </div>

      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-yellow-600/20 p-6 flex items-center justify-between z-50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center"><Music className="text-black"/></div>
              <h4 className="font-bold text-yellow-500">{currentSong.title}</h4>
           </div>
           <audio src={currentSong.url} autoPlay={isPlaying} controls className="w-1/2 invert" />
           <button onClick={() => setCurrentSong(null)} className="text-gray-500 hover:text-white"><LogOut/></button>
        </div>
      )}
    </div>
  );
}

export default App;
