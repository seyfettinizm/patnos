import React, { useState, useEffect } from 'react';
import { Play, Music, Settings, Save, LogOut } from 'lucide-react';
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
    const load = async () => {
      const { data } = await supabase.from('settings').select('value').eq('id', 'app_data').single();
      if (data?.value) {
        setSongs(data.value.songs || []);
        setLogoUrl(data.value.logoUrl || "");
        setBannerUrl(data.value.bannerUrl || "");
      }
    };
    load();
  }, []);

  const save = async (updatedSongs: any[]) => {
    const { error } = await supabase.from('settings').update({ 
      value: { songs: updatedSongs, logoUrl, bannerUrl } 
    }).eq('id', 'app_data');
    if (!error) alert("Buluta Kaydedildi!");
  };

  const addSong = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [{ ...newSong, id: Date.now() }, ...songs];
    setSongs(updated);
    save(updated);
    setNewSong({ title: '', url: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex gap-8">
        <aside className="w-48 space-y-4">
          <button onClick={() => setIsAdmin(false)} className="block w-full text-left p-2 hover:bg-white/10 rounded">Ana Sayfa</button>
          <button onClick={() => setIsAdmin(true)} className="block w-full text-left p-2 hover:bg-white/10 rounded text-red-500">Yönetici</button>
        </aside>

        <main className="flex-1">
          {isAdmin ? (
            <div className="space-y-6 max-w-md">
              <div className="p-4 border border-white/10 rounded">
                <h2 className="mb-4 font-bold">Ayarlar</h2>
                <input placeholder="Logo URL" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="w-full bg-zinc-900 p-2 mb-2 rounded" />
                <input placeholder="Banner URL" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} className="w-full bg-zinc-900 p-2 mb-2 rounded" />
                <button onClick={() => save(songs)} className="w-full bg-yellow-600 text-black p-2 rounded font-bold">Kaydet</button>
              </div>
              <form onSubmit={addSong} className="p-4 border border-white/10 rounded">
                <h2 className="mb-4 font-bold">Yeni Şarkı</h2>
                <input placeholder="Şarkı Adı" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} className="w-full bg-zinc-900 p-2 mb-2 rounded" required />
                <input placeholder="MP3 URL" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} className="w-full bg-zinc-900 p-2 mb-2 rounded" required />
                <button className="w-full bg-green-600 p-2 rounded font-bold">Ekle</button>
              </form>
            </div>
          ) : (
            <>
              <div className="h-48 rounded-xl overflow-hidden mb-8 border border-white/10">
                <img src={bannerUrl} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {songs.map(s => (
                  <div key={s.id} className="p-4 bg-zinc-900 rounded-lg flex justify-between items-center">
                    <span>{s.title}</span>
                    <button onClick={() => setCurrentSong(s)} className="p-2 bg-yellow-600 rounded-full text-black"><Play size={16}/></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 p-4 border-t border-white/10 flex items-center justify-between">
          <span className="font-bold text-yellow-500">{currentSong.title}</span>
          <audio src={currentSong.url} autoPlay controls className="invert" />
          <button onClick={() => setCurrentSong(null)}><LogOut/></button>
        </div>
      )}
    </div>
  );
}
