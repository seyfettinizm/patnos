export const getSongs = async () => {
  try {
    // BURADAKİ URL: Vercel Blob'a yüklediğin songs.json dosyasının kopyaladığın URL'si olmalı
    const BLOB_JSON_URL = "BURAYA_SONGS_JSON_URLSINI_YAPISTIR"; 
    
    const response = await fetch(BLOB_JSON_URL, {
      cache: 'no-store' // Her zaman güncel veriyi çekmesi için
    });
    
    if (!response.ok) throw new Error('Veri çekilemedi');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Hata:", error);
    return [];
  }
};
