export const UI_STRINGS: any = {
  searchPlaceholder: { TR: "Eser veya sanatçı ara...", KU: "Li berhem an hunermend bigere..." },
  album1: { TR: "Patnos Türküleri", KU: "Stranên Panosê" },
  album2: { TR: "Patnoslu Sanatçılar", KU: "Hunermendên Panosê" },
  album3: { TR: "Dengbêjler", KU: "Dengbêj" },
  album4: { TR: "Sizden Gelenler", KU: "Ji We Hatine" },
  albumsTitle: { TR: "ALBÜMLER", KU: "ALBÛM" },
  popularNow: { TR: "Şu An Popüler", KU: "Niha Populer" },
  defaultGuestName: { TR: "Misafir Kullanıcı", KU: "Bikarhênerê Mêvan" }
};

export const initialSongs = [];

export const getSongs = async () => {
  try {
    const BLOB_JSON_URL = "https://x5akq2yprlo5hmez.public.blob.vercel-storage.com/songs.json";
    const response = await fetch(BLOB_JSON_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error('Veri çekilemedi');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Hata:", error);
    return [];
  }
};
