{/* ADMİN PANELİ - GÜNCELLENMİŞ KONSOL */}
          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in zoom-in duration-500">
               <div className="bg-neutral-900/50 p-12 rounded-[3.5rem] border border-white/10 backdrop-blur-md">
                  <h2 className="text-2xl font-black text-amber-500 mb-8 uppercase italic tracking-tighter">
                    {t[lang].uploadTitle}
                  </h2>
                  
                  <form onSubmit={(e) => { 
                    e.preventDefault(); 
                    if(!newSong.title || !newSong.url) return alert("Lütfen müzik adı ve linkini doldurun!");
                    setSongs([{...newSong, id: Date.now(), likes: 0}, ...songs]); 
                    alert("Müzik başarıyla listeye eklendi!"); 
                  }} className="grid grid-cols-2 gap-6">
                    
                    {/* 1. Müzik Adı */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase ml-2">1. Müzik Adı</label>
                      <input type="text" placeholder="Örn: Patnos'un Gülleri" className="bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
                    </div>

                    {/* 2. Sanatçı Adı */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase ml-2">2. Sanatçı Adı</label>
                      <input type="text" placeholder="Örn: Sanatçı İsmi" className="bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
                    </div>

                    {/* 3. Şarkı Kapağı (URL) */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase ml-2">3. Şarkı Kapağı (Resim URL)</label>
                      <input type="text" placeholder="Vercel/GitHub Resim Linki" className="bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all" value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} />
                    </div>

                    {/* 4. Müzik Linki (MP3 URL) */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase ml-2">4. Müzik Linki (MP3 URL)</label>
                      <input type="text" placeholder="Vercel/GitHub MP3 Linki" className="bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} />
                    </div>

                    {/* Kategori Seçimi */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase ml-2">Kategori Seçin</label>
                      <select className="bg-black border border-white/10 p-5 rounded-2xl text-sm text-neutral-400 outline-none focus:border-amber-500 appearance-none transition-all" value={newSong.category} onChange={e => setNewSong({...newSong, category: e.target.value})}>
                        {t[lang].categories.slice(1).map((c: string) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Kaydet Butonu */}
                    <div className="flex items-end">
                      <button type="submit" className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-white transition-all transform active:scale-95 shadow-lg shadow-amber-500/10">
                        {t[lang].saveBtn}
                      </button>
                    </div>

                  </form>
               </div>
            </div>
          )}
