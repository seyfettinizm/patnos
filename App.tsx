import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Music, Search, Heart, 
  Settings, Languages, Mail, Phone, MapPin, Plus, Trash2, Save, LogOut, Upload, Image as ImageIcon
} from 'lucide-react';
import { createClient } from '@supabase/supabase-client';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
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

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setLogoUrl(data.value.logoUrl || "");
        setBannerUrl(data.value.bannerUrl || "");
        setBannerTR(data.value.bannerTR || "");
        setBannerKU(data.value.bannerKU || "");
      }
    };
    fetchSettings();
  }, []);

  const saveAllData = async (updatedSongs: any[]) => {
    const fullData = { songs: updatedSongs, logoUrl, bannerUrl, bannerTR, bannerKU };
    const { error } = await supabase.from('settings').update({ value: fullData }).eq('id', 'app_data');
    if (!error) alert("Başarıyla Buluta Kaydedildi!");
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [{ ...newSong, id: Date.now() }, ...songs];
    setSongs(updated);
    await saveAllData(updated);
    setNewSong({ title: '', artist: '', cover: '', url: '', category: 'Patnos Türküleri' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32">
      <div className="flex">
        <aside className="w-64 bg-black h-screen sticky top-0 p-6 border-r border-yellow-900/20">
          <div className="flex flex-col items-center mb-10">
            {logoUrl ? <img src={logoUrl} className="w-20 h-20 rounded-full border-2 border-yellow-600 mb-2" /> : <Music className="text-yellow-600" size={40} />}
            <h1 className="text-yellow-600 font-bold text-[10px] text-center uppercase mt-2">İZMİR PATNOSLULAR DERNEĞİ</h1>
          </div>
          <button onClick={() => setIsAdmin(false)} className="w-full text-left p-3 hover:bg-yellow-900/20 rounded-xl mb-2 flex items-center gap-2"><Play size={18}/> Ana Sayfa</button>
          <button onClick={() => setIsAdmin(true)} className="w-full text-left p-3 hover:bg-red-900/20 rounded-xl flex items-center gap-2"><Settings size={18}/> Yönetici</button>
        </aside>

        <main className="flex-1 p-8">
          {isAdmin ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-yellow-900/10 p-6 rounded-2xl border border-yellow-600/20">
                <h2 className="text-xl font-bold mb-4 text-yellow-600">Site Ayarları</h2>
                <input placeholder="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full bg-black border border-white/10 p-2 rounded mb-2" />
                <input placeholder="Banner URL" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} className="w-full bg-black border border-white/10 p-2 rounded mb-2" />
                <button onClick={() => saveAllData(songs)} className="w-full bg-yellow-600 text-black py-2 rounded font-bold">Ayarları Kaydet</button>
              </div>
              <div className="bg-yellow-900/10 p-6 rounded-2xl border border-yellow-600/20">
                <h2 className="text-xl font-bold mb-4 text-yellow-600">Yeni Şarkı</h2>
                <form onSubmit={handleAddSong} className="space-y-2">
                  <input placeholder="Şarkı Adı" value={newSong.title} onChange={(e) => setNewSong({...newSong, title: e.target.value})} className="w-full bg-black border border-white/10 p-2 rounded" required />
                  <input placeholder="MP3 Linki" value={newSong.url} onChange={(e) => setNewSong({...newSong, url: e.target.value})} className="w-full bg-black border border-white/10 p-2 rounded" required />
                  <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold">Şarkıyı Buluta Ekle</button>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="relative h-64 rounded-3xl overflow-hidden mb-8">
                <img src={bannerUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-8">
                  <h2 className="text-4xl font-black text-yellow-500">{lang === 'TR' ? bannerTR : bannerKU}</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {songs.map(song => (
                  <div key={song.id} className="bg-yellow-900/5 p-4 rounded-2xl border border-yellow-600/10 flex justify-between items-center">
                    <span className="font-bold">{song.title}</span>
                    <button onClick={() => {setCurrentSong(song); setIsPlaying(true);}} className="bg-yellow-600 text-black p-2 rounded-full"><Play size={16}/></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-yellow-600/20 p-6 flex items-center justify-between">
          <span className="text-yellow-500 font-bold">{currentSong.title}</span>
          <audio src={currentSong.url} autoPlay controls className="invert" />
          <button onClick={() => setCurrentSong(null)} className="text-gray-500">Kapat</button>
        </div>
      )}
    </div>
  );
}
