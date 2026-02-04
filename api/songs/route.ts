import { kv } from '@vercel/kv';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Şarkıları veri tabanından (Redis) getiriyoruz
    const songs = await kv.get('patnos_songs');
    return NextResponse.json(songs || []);
  } catch (error) {
    return NextResponse.json({ error: "Veri çekilemedi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const audioFile = formData.get('audio') as File;
    const imageFile = formData.get('image') as File;

    // 1. Müzik dosyasını Blob'a (patnos-media) yüklüyoruz
    const audioBlob = await put(`music/${audioFile.name}`, audioFile, { access: 'public' });
    
    // 2. Görsel dosyasını Blob'a (patnos-media) yüklüyoruz
    const imageBlob = await put(`images/${imageFile.name}`, imageFile, { access: 'public' });

    // 3. Dosyaların internet linklerini ve şarkı bilgilerini Redis'e (patnos-db) kaydediyoruz
    const songs: any[] = (await kv.get('patnos_songs')) || [];
    const newSong = {
      id: Date.now(),
      title,
      artist,
      audioUrl: audioBlob.url,
      imageUrl: imageBlob.url
    };
    
    const updatedSongs = [...songs, newSong];
    await kv.set('patnos_songs', updatedSongs);

    return NextResponse.json({ success: true, song: newSong });
  } catch (error) {
    return NextResponse.json({ error: "Kayıt sırasında hata oluştu" }, { status: 500 });
  }
}
