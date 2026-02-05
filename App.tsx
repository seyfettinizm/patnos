{/* İLETİŞİM - O GÜZEL NOT GERİ GELDİ */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in slide-in-from-bottom-6 duration-500">
              <div className="bg-amber-500 rounded-[3.5rem] p-16 text-center text-black shadow-[0_20px_60px_rgba(245,158,11,0.3)]">
                 <div className="w-20 h-20 bg-black/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-5xl">📥</div>
                 <h2 className="text-5xl font-black mb-6 italic tracking-tighter uppercase">Kendi Müziğini Gönder</h2>
                 
                 {/* İSTEDİĞİN O ÖZEL NOT BURADA */}
                 <p className="text-black/80 font-bold mb-10 max-w-xl mx-auto italic text-lg leading-relaxed">
                   "Elinizde bulunan Patnos yöresine ait, tozlu raflarda kalmış eski kayıtları, 
                   yöresel ezgileri veya kendi sesinizden parçaları bizimle paylaşın. 
                   Kültürel mirasımızı birlikte koruyalım ve gelecek nesillere ulaştıralım."
                 </p>
                 
                 <a href="https://wa.me/905052250655" target="_blank" rel="noreferrer" className="inline-block bg-black text-white px-12 py-6 rounded-3xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">
                   WhatsApp ile Gönder
                 </a>
              </div>

              {/* ALT BİLGİ KUTULARI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] text-center hover:border-amber-500/50 transition-all">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">WhatsApp Hat</h3>
                    <p className="font-black text-xl">0505 225 06 55</p>
                 </div>
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] text-center hover:border-amber-500/50 transition-all">
                    <div className="text-4xl mb-4">📧</div>
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">E-Posta Adresi</h3>
                    <p className="font-black text-sm italic">patnosumuz@gmail.com</p>
                 </div>
                 <div className="bg-neutral-900 border border-white/5 p-10 rounded-[3rem] text-center hover:border-amber-500/50 transition-all">
                    <div className="text-4xl mb-4">📍</div>
                    <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-4">Dernek Adres</h3>
                    <p className="font-black text-[11px] leading-relaxed italic">{t[lang].address}</p>
                 </div>
              </div>
            </div>
          )}
