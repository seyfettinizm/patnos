// ... (Başlangıç kısımları aynı)

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-['Outfit']">
      <Sidebar 
        lang={lang} activeTab={activeTab} setActiveTab={setActiveTab} 
        isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminPass={adminPass} 
        setAdminPass={setAdminPass} handleAdminLogin={handleAdminLogin} 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Banner ve İçerik */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-48"> {/* pb-48: Player için geniş boşluk */}
          {activeTab === 'home' && (
            <section className="animate-in fade-in duration-500">
              {/* SABİT SÜPHAN DAĞI BANNER */}
              <div 
                className="mb-10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden min-h-[320px] flex items-end shadow-2xl border border-white/5"
                style={{ 
                  backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1044408-R9P9vW6N7Y5T4Q3S2A1B0C9D8E7F6G.jpg')`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center 40%' 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
                <div className="relative z-10">
                  <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full mb-4 inline-block uppercase tracking-widest">Kültür Mirası</span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">{bannerText}</h2>
                </div>
              </div>

              {/* LİSTE - İKONLARLA BİRLİKTE */}
              <div className="grid gap-3">
                {filteredSongs.map((song, idx) => (
                  <div key={song.id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-bold text-neutral-600">{idx + 1}</span>
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover" alt="" />
                      <div><p className="text-sm font-black">{song.title}</p><p className="text-xs text-neutral-500">{song.artist}</p></div>
                    </div>
                    {/* İNDİR VE BEĞEN İKONLARI BURADA */}
                    <div className="flex items-center space-x-3">
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(song.id.toString()); }} className={`p-2 transition-colors ${likedSongs.includes(song.id.toString()) ? 'text-red-500' : 'text-neutral-500 hover:text-red-400'}`}>
                        <i className={`${likedSongs.includes(song.id.toString()) ? 'fas' : 'far'} fa-heart text-lg`}></i>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDownload(song); }} className="p-2 text-neutral-500 hover:text-amber-500">
                        {downloadingId === song.id.toString() ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-download text-lg"></i>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* YÖNETİCİ PANELİ - YENİ NOT VE BUTON */}
          {activeTab === 'admin' && isAdmin && (
            <div className="max-w-3xl mx-auto space-y-10 py-10">
              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
                <h2 className="text-xl font-black mb-6 text-amber-500 uppercase tracking-widest italic">Müzik Yükleme Paneli</h2>
                <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20 mb-8">
                  <p className="text-white text-lg font-medium leading-relaxed italic mb-6">
                    "Müzik eklemek için lütfen dosyayı Vercel Blob'a yükleyip linkini kopyalayın ve <span className="text-amber-500 font-bold">constants.ts</span> dosyasındaki listeye ekleyin."
                  </p>
                  <a 
                    href="https://vercel.com/dashboard/stores" 
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center space-x-3 bg-amber-500 text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-amber-600 transition-all"
                  >
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>VERCEL BLOB'A GİT</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MÜZİKÇALAR - EN ALTTA SABİT */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 z-[100] bg-neutral-950/80 backdrop-blur-xl border-t border-white/10 p-2">
            <Player song={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onNext={() => {}} onPrev={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
