
import { Song, TranslationStrings } from './types';

export const UI_STRINGS: TranslationStrings = {
  appName: { TR: "İzmir Patnoslular Derneği", KU: "Komeleya Panosiyên Îzmîrê" },
  musicBox: { TR: "Müzik Kutusu", KU: "Sindiqa Muzîkê" },
  home: { TR: "Ana Sayfa", KU: "Serûpel" },
  library: { TR: "Kitaplığım", KU: "Pirtûkxaneya Min" },
  playlists: { TR: "Çalma Listeleri", KU: "Lîsteyên Stranan" },
  searchPlaceholder: { TR: "Şarkı, sanatçı veya albüm ara...", KU: "Stran, hunermend an albûmê bigere..." },
  popularNow: { TR: "Şu An Popüler", KU: "Niha Populer" },
  recentPlays: { TR: "Son Çalınanlar", KU: "Yên Dawî hatine lîstin" },
  playingNow: { TR: "Şu an çalıyor", KU: "Niha tê lîstin" },
  albumsTitle: { TR: "Özel Koleksiyonlar", KU: "Koleksiyonên Taybet" },
  album1: { TR: "Patnos Türküleri", KU: "Kilamên Panosê" },
  album2: { TR: "Patnoslu Sanatçılar", KU: "Hunermendên Panosî" },
  album3: { TR: "Dengbêjler", KU: "Dengbêj" },
  album4: { TR: "Sizden Gelenler", KU: "Ji We Hatine" },
  album5: { TR: "İletişim", KU: "Têkilî" },
  durationLabel: { TR: "Süre", KU: "Dem" },
  downloadLabel: { TR: "İndir", KU: "Daxîne" },
  likeLabel: { TR: "Beğen", KU: "Ecibandin" },
  guestProfile: { TR: "Misafir Profili", KU: "Profîla Mêvan" },
  guestNamePrompt: { TR: "Adınızı ve fotoğrafınızı güncelleyin", KU: "Nav û wêneya xwe nû bikin" },
  save: { TR: "Kaydet", KU: "Tomar Bike" },
  welcomeGuest: { TR: "Hoş Geldin", KU: "Bi Xer Hatî" },
  defaultGuestName: { TR: "Misafir", KU: "Mêvan" },
  likersHeader: { TR: "Beğenenler", KU: "Ecibandine" }
};

export const MOCK_SONGS: Song[] = [
  {
    id: '1',
    title: "Gula Min",
    artist: "Nizamettin Arıç",
    album: "Patnoslu Sanatçılar",
    duration: "4:32",
    coverUrl: "https://images.unsplash.com/photo-1514525253344-991c75ca964b?w=400&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    category: 'Patnoslu Sanatçılar',
    likes: 1240
  },
  {
    id: '2',
    title: "Wey Dil",
    artist: "Şakiro",
    album: "Dengbêjler",
    duration: "12:15",
    coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    category: 'Dengbêjler',
    likes: 8500
  },
  {
    id: '3',
    title: "Patnos'un Yollarında",
    artist: "Yöre Sanatçısı",
    album: "Patnos Türküleri",
    duration: "3:45",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    category: 'Patnos Türküleri',
    likes: 450
  },
  {
    id: '4',
    title: "Gurbet Elde",
    artist: "Amatör Ses",
    album: "Sizden Gelenler",
    duration: "4:20",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    category: 'Sizden Gelenler',
    likes: 230
  },
  {
    id: '5',
    title: "Potbori",
    artist: "Koma Patnos",
    album: "Patnoslu Sanatçılar",
    duration: "6:55",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    category: 'Patnoslu Sanatçılar',
    likes: 980
  },
  {
    id: '6',
    title: "Bıra Hacı",
    artist: "Dengbêj İsmail",
    album: "Dengbêjler",
    duration: "8:30",
    coverUrl: "https://images.unsplash.com/photo-1459749411177-042180ec75c0?w=400&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    category: 'Dengbêjler',
    likes: 3100
  }
];
