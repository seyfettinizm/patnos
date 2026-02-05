{/* İLETİŞİM - DUYGUSAL NOT VE MODERN TASARIM */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
              
              {/* ANA PAYLAŞIM KUTUSU */}
              <div className="bg-amber-500 rounded-[3.5rem] p-16 text-center text-black shadow-[0_25px_50px_-12px_rgba(245,158,11,0.4)] transition-transform hover:scale-[1.01]">
                 <div className="w-20 h-20 bg-black/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-5xl">📥</div>
                 <h2 className="text-6xl font-black mb-6 italic tracking-tighter uppercase leading-none">Müziğini Paylaş</h2>
                 
                 {/* OPTİMİZE EDİLMİŞ DUYGUSAL NOT */}
                 <p className="text-black/80 font-bold mb-10 max-w-2xl mx-auto italic text-xl leading-relaxed tracking-tight">
                   "Elinizde bulunan Patnos yöresine ait, tozlu raflarda kalmış eski kayıtları, 
                   unutulmaya yüz tutmuş yöresel ezgileri veya kendi sesinizden can bulan parçaları bizimle paylaşın. 
                   Gelin, bu eşsiz kültürel mirasımızı birlikte koruyalım ve tınılarımızı gelecek nesillere hep beraber ulaştıralım."
                 </p>
                 
                 <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="inline-block bg-black text-white px-14 py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:bg-neutral-800 transition-all active:scale-95">
                   WHATSAPP İLE GÖNDER
                 </a>
              </div>

              {/* İLETİŞİM KARTLARI (ALT SIRALAMA) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* ADRES */}
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] text-center group hover:border-amber-500/50 transition-all duration-500">
                    <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">📍</div>
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">DERNEK ADRESİ</h3>
                    <p className="font-black text-[12px] leading-relaxed italic text-neutral-300">
                      Yeşilbağlar Mah. 637/33 Sok.<br/>No: 25 Buca / İzmir
                    </p>
                 </div>

                 {/* WHATSAPP */}
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] text-center group hover:border-amber-500/50 transition-all duration-500">
                    <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">📱</div>
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">WHATSAPP HATTI</h3>
                    <p className="font-black text-2xl text-neutral-200">0505 225 06 55</p>
                 </div>

                 {/* E-POSTA */}
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] text-center group hover:border-amber-500/50 transition-all duration-500">
                    <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">📧</div>
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">E-POSTA ADRESİ</h3>
                    <p className="font-black text-sm italic text-neutral-200 underline decoration-amber-500/30">patnosumuz@gmail.com</p>
                 </div>
              </div>

            </div>
          )}
