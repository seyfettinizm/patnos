import React, { useState, useEffect } from 'react';
import { Play, Music, Settings, LogOut } from 'lucide-react';
import { createClient } from '@supabase/supabase-client';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200");
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [newSong, setNewSong] = useState({ title: '', url: '' });

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setLogoUrl(data.value.logoUrl || "");
        setBannerUrl(data.value.bannerUrl || "");
      }
    };
    loadData();
  }, []);

  const handleSave = async (updatedSongs: any[]) => {
    const { error } = await supabase.from('settings').update({ 
      value: { songs: updatedSongs, logoUrl, bannerUrl } 
    }).eq('id', 'app_data');
    if (!error) alert("Kaydedildi!");
  };

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [{ ...newSong, id: Date.now() }, ...songs];
    setSongs(updated);
    handleSave(updated);
    setNewSong({ title: '', url: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <nav className="w-full md:w-48 space-y-2">
          <button onClick={() => setIsAdmin(false)} className="w-full text-left p-3 hover:bg-zinc-800 rounded">Giriş</button>
          <button onClick={() => setIsAdmin(true)} className="w-full text-left p-3 hover:bg-zinc-800 rounded text-red-500">Panel</button>
        </nav>
        <main className="flex-1">
          {isAdmin ? (
            <div className="max-w-md space-y-4">
              <div className="p-4 border border-zinc-800 rounded">
                <input placeholder="Logo URL" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="w-full bg-zinc-900 p-2 mb-2 rounded" />
                <input placeholder="Banner URL" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} className="w-full bg-zinc-900 p-2 mb-2 rounded" />
                <button onClick={() => handleSave(songs)} className="w-full bg-yellow-600 text-black p-2 rounded font-bold">Kaydet</button>
              </div>
              <form onSubmit={onAdd} className="p-4 border border-zinc-800 rounded">
                <input placeholder="Şarkı Adı" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} className="w-full bg-zinc-900 p-2 mb-2 rounded" required />
                <input placeholder="Ses URL (MP3)" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} className="w-full bg-zinc-900 p-2 mb-2 rounded" required />
                <button className="w-full bg-green-600 p-2 rounded font-bold">Şarkı Ekle</button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-48 rounded-xl overflow-hidden"><img src={bannerUrl} className="w-full h-full object-cover" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {songs.map(s => (
                  <div key={s.id} className="p-4 bg-zinc-900 rounded-xl flex justify-between items-center">
                    <span>{s.title}</span>
                    <button onClick={() => setCurrentSong(s)} className="p-2 bg-yellow-600 text-black rounded-full"><Play size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 p-4 flex items-center justify-between border-t border-zinc-800">
          <span className="text-yellow-500 font-bold">{currentSong.title}</span>
          <audio src={currentSong.url} autoPlay controls className="invert" />
          <button onClick={() => setCurrentSong(null)}><LogOut/></button>
        </div>
      )}
    </div>
  );
}
