// ... (Importlar aynı kalacak)

const App: React.FC = () => {
  // ... (State'ler aynı)
  const [bannerText, setBannerText] = useState('İzmir Patnoslular Derneği Müzik Arşivi');

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-['Outfit']">
      <Sidebar 
        // ... (Sidebar propsları)
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* ... (Header içeriği) */}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-40">
          {activeTab === 'home' && (
            <section className="animate-in fade-in duration-500">
              {/* Sabit Banner Görseli */}
              <div 
                className="mb-10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden min-h-[300px] flex items-end shadow-2xl border border-white/5"
                style={{ 
                  backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg')`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center 40%' 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="relative z-10 max-w-2xl">
                  <span className="bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full mb-4 inline-block">Kültür Mirası</span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight drop-shadow-lg">{bannerText}</h2>
                </div>
              </div>

              {/* ... (Şarkı listesi aynı kalacak) */}
            </section>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="max-w-3xl mx-auto space-y-10 py-10">
              {/* Banner Ayarı */}
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10">
                <h2 className="text-xl font-black mb-6 text-amber-500 flex items-center"><i className="fas fa-edit mr-3"></i> BANNER AYARLARI</h2>
                <input 
                  type="text" 
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-amber-500 outline-none" 
                  value={bannerText} 
                  onChange={(e) => setBannerText(e.target.value)} 
                />
              </div>
              
              {/* İstediğin Müzik Yükleme Notu */}
              <div className="p-8 bg-amber-500/10 rounded-[2rem] border border-amber-500/20 shadow-xl">
                <h2 className="text-xl font-black mb-4 text-amber-500 flex items-center uppercase italic">
                  <i className="fas fa-cloud-upload-alt mr-3"></i> Müzik Yükleme Paneli
                </h2>
                <p className="text-white text-lg font-medium leading-relaxed">
                  "Müzik eklemek için lütfen dosyayı Vercel Blob'a yükleyip linkini kopyalayın ve <code className="bg-black/40 px-2 py-1 rounded text-amber-400">constants.ts</code> dosyasındaki listeye ekleyin."
                </p>
                <div className="mt-6 flex space-x-4">
                  <a href="https://vercel.com/dashboard/stores" target="_blank" className="bg-amber-500 text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-amber-600 transition-all">
                    VERCEL BLOB'A GİT
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Müzikçalar - En Altta Sabit */}
        {/* ... (Player kodu) */}
      </main>
    </div>
  );
};
