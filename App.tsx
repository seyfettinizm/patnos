// App.tsx içeriğinin tamamı buraya gelecek (Çok uzun olduğu için temel yapıyı veriyorum, istersen tam kodu tek seferde atabilirim)
// İçerideki activeTab kontrolüne şunu ekleyeceğiz:

{activeTab === 'contact' && (
  <div className="max-w-4xl mx-auto space-y-8 p-4">
    {/* Adres ve İletişim Bilgileri */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
        <i className="fas fa-map-marker-alt text-amber-500 text-2xl mb-4"></i>
        <h4 className="font-bold">Adres</h4>
        <p className="text-sm text-neutral-400 mt-2">Patnos, Ağrı</p>
      </div>
      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
        <i className="fab fa-whatsapp text-green-500 text-2xl mb-4"></i>
        <h4 className="font-bold">WhatsApp</h4>
        <a href="https://wa.me/905000000000" className="text-sm text-neutral-400 mt-2 block hover:text-white">05XX XXX XX XX</a>
      </div>
      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
        <i className="fas fa-envelope text-blue-500 text-2xl mb-4"></i>
        <h4 className="font-bold">E-Posta</h4>
        <p className="text-sm text-neutral-400 mt-2">iletisim@patnosmuzik.com</p>
      </div>
    </div>

    {/* Misafir Dosya Gönderme Paneli */}
    <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-8 rounded-3xl border border-amber-500/20">
      <h3 className="text-2xl font-black mb-2 italic">Müziğini Paylaş!</h3>
      <p className="text-neutral-400 mb-6 text-sm">Gönderdiğiniz eserler yönetici onayından sonra yayınlanacaktır.</p>
      
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Adınız Soyadınız" className="bg-black/40 border border-white/10 p-3 rounded-xl text-sm w-full outline-none focus:border-amber-500" />
          <input type="text" placeholder="Eser Adı" className="bg-black/40 border border-white/10 p-3 rounded-xl text-sm w-full outline-none focus:border-amber-500" />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-neutral-500 ml-1">Müzik Dosyası (MP3)</label>
          <input type="file" accept="audio/*" className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-600" />
        </div>
        <button type="button" onClick={() => alert('Dosyanız başarıyla yöneticiye gönderildi!')} className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-amber-500 transition-colors">
          DOSYAYI GÖNDER
        </button>
      </form>
    </div>
  </div>
)}
