// Şarkıları yeni oluşturduğumuz API üzerinden veri tabanından çeker
export const getSongs = async () => {
  try {
    const response = await fetch('/api/songs');
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Şarkılar veri tabanından çekilemedi:", error);
    return [];
  }
};

// Başlangıç listesini boş bırakıyoruz, sistem veri tabanından beslenecek
export const initialSongs = [];
