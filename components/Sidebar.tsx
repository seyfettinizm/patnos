import React from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, adminPass, setAdminPass, handleAdminLogin, lang, logo }) => {
  const menu: any = {
    TR: { 
      home: "Ana Sayfa", 
      contact: "İletişim", 
      admin: "Yönetici Paneli", 
      brand: "İZMİR PATNOSLULAR DERNEĞİ", 
      brandSub: "MÜZİK KUTUSU",
      loginTitle: "Yönetici Girişi",
      loginBtn: "GİRİŞ"
    },
    KU: { 
      home: "Malper", 
      contact: "Têkilî", 
      admin: "Panela Rêveber", 
      brand: "KOMELA PATNOSIYÊN ÎZMÎRÊ", 
      brandSub: "SINDOQA MUZÎKÊ",
      loginTitle: "Kêşana Rêveber",
      loginBtn: "KETIN"
    }
  };

  return (
    <aside className="w-72 bg-[#050505] border-r border-white/5 flex flex-col h-full p-8 z-50">
      
      {/* --- LOGO VE YENİ TASARIMLI BAŞLIK --- */}
      <div className="mb-10 text-center relative">
        {/* Logo */}
        <div className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center font-black text-black text-4xl mx-auto mb-5 shadow-2xl shadow-amber-500/20 border-2 border-white/10">
          P
        </div>

        {/* Dernek Adı */}
        <h1 className="text-[12px] font-black uppercase text-white tracking-tighter leading-tight mb-3">
          {menu[lang].brand}
        </h1>

        {/* Çizgili Müzik Kutusu Bölümü */}
        <div className="flex items-center justify-center space-x-3 w-full px-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/50"></div>
          <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] whitespace-nowrap italic">
            {menu[lang].brandSub}
          </p>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/50"></div>
        </div>
      </div>

      {/* YÖNETİCİ GİRİŞİ */}
      <div className="mb-10">
        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="bg-neutral-900/60 p-4 rounded-[1.8rem] border border-white/5 shadow-inner">
            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-3 text-center">{menu[lang].loginTitle}</p>
            <div className="flex flex-col space-y-2">
              <input 
                type="password" 
                placeholder="***" 
                value={adminPass} 
                onChange={(e) => setAdminPass(e.target.value)} 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-amber-500 transition-all text-center" 
              />
              <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-amber-500/10">
                {menu[lang].loginBtn}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-[1.8rem] text-center">
            <p className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">OTURUM AÇIK</p>
            <button onClick={() => { setIsAdmin(false); setActiveTab('home'); }} className="text-[8px] font-bold text-white bg-red-500/40 px-3 py-1 rounded-lg uppercase hover:bg-red-600 transition-all">Çıkış Yap</button>
          </div>
        )}
      </div>
      
      {/* MENÜ BUTONLARI */}
      <div className="text-neutral-600 text-[9px] font-black mb-4 uppercase tracking-[0.2em] px-2">MENÜ</div>
      <nav className="space-y-3">
        <button onClick={() => setActiveTab('home')} className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'home' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          <span className="text-lg">🏠</span> <span>{menu[lang].home}</span>
        </button>
        <button onClick={() => setActiveTab('contact')} className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'contact' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          <span className="text-lg">🎧</span> <span>{menu[lang].contact}</span>
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'admin' ? 'bg-red-500 text-white shadow-lg' : 'text-neutral-500 hover:bg-white/5'}`}>
            <span className="text-lg">⚙️</span> <span>{menu[lang].admin}</span>
          </button>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 text-center">
        <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest italic">© 2024 Patnos Arşivi</p>
      </div>
    </aside>
  );
};

export default Sidebar;
