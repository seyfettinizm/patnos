{/* İLETİŞİM - DUYGUSAL NOTUN EKLENDİĞİ GÜNCEL BÖLÜM */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
              
              {/* ANA PAYLAŞIM KUTUSU (GÖRSELDEKİ TURUNCU ALAN) */}
              <div className="bg-amber-500 rounded-[3.5rem] p-12 md:p-16 text-center text-black shadow-[0_25px_50px_-12px_rgba(245,158,11,0.4)]">
                 <h2 className="text-5xl md:text-6xl font-black mb-6 italic tracking-tighter uppercase leading-none">
                   MÜZİĞİNİ PAYLAŞ
                 </h2>
                 
                 {/* ZENGİNLEŞTİRİLMİŞ VE DAVETKAR DUYGUSAL NOT */}
                 <div className="space-y-4 mb-10 max-w-2xl mx-auto">
                    <p className="text-black font-black text-xl md:text-2xl italic leading-tight tracking-tight">
                      "Patnos'un tozlu raflarında unutulmuş bir plak, eski bir kaset ya da ninenizden duyduğunuz bir ezgi mi var?"
                    </p>
                    <p className="text-black/80 font-bold text-lg md:text-xl italic leading-relaxed">
                      Kültürel mirasımızı birlikte ilmek ilmek işleyelim. Elinizdeki yöresel kayıtları, 
                      dengbêj ezgilerini veya kendi sesinizden can bulan parçaları bize ulaştırın; 
                      bu tınılar İzmir'den tüm dünyaya yankılansın.
                    </p>
                 </div>
                 
                 <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="inline-block bg-black text-white px-16 py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95">
                   WHATSAPP
                 </a>
              </div>

              {/* ALT BİLGİ KARTLARI (ADRES, WHATSAPP, E-POSTA) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* ADRES */}
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] text-center hover:border-amber-500/50 transition-all duration-500">
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">ADRES</h3>
                    <p className="font-black text-[11px] leading-relaxed italic text-neutral-300 uppercase">
                      Yeşilbağlar Mah. 637/33 Sok.<br/>No: 25 Buca / İzmir
                    </p>
                 </div>

                 {/* WHATSAPP */}
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] text-center hover:border-amber-500/50 transition-all duration-500">
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">WHATSAPP</h3>
                    <p className="font-black text-2xl text-neutral-200 tracking-tighter">0505 225 06 55</p>
                 </div>

                 {/* E-POSTA */}
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] text-center hover:border-amber-500/50 transition-all duration-500">
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">E-POSTA</h3>
                    <p className="font-black text-sm italic text-neutral-200">patnosumuz@gmail.com</p>
                 </div>
              </div>
            </div>
          )}
