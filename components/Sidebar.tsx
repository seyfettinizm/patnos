import React from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, adminPass, setAdminPass, handleAdminLogin, lang, logo }) => {
  const menu: any = {
    TR: { 
      home: "Ana Sayfa", 
      contact: "İletişim", 
      admin: "Yönetici Paneli", 
      brand: "İZMİR PATNOSLULAR", 
      brandSub: "Müzik Kutusu",
      loginTitle: "Yönetici Girişi",
      loginBtn: "GİRİŞ"
    },
    KU: { 
      home: "Malper", 
      contact: "Têkilî", 
      admin: "Panela Rêveber", 
      brand: "PATNOSIYÊN ÎZMÎRÊ", 
      brandSub: "Sindoqa Muzîkê",
      loginTitle: "Kêşana Rêveber",
      loginBtn: "KETIN"
    }
  };

  return (
    <aside className="w-72 bg-[#050505] border-r border-white/5 flex flex-col h-full p-8 z-50">
      {/* LOGO BÖLÜMÜ */}
      <div className="mb-8 text-center">
        {logo ? (
          <img src={logo} className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover border-2 border-amber-500" alt="Logo" />
        ) : (
          <div className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center font-black text-black text-4xl mx-auto mb-4 shadow-xl shadow-amber-500/10">P</div>
        )}
        <h1 className="text-[12px] font-black uppercase text-white tracking-tighter leading-none mb-1">{menu[lang].brand}</h1>
        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest italic">{menu[lang].brandSub}</p>
      </div>

      {/* YÖNETİCİ GİRİŞİ - BURAYA TAŞINDI (PLAYERIN ÜSTÜNDE KALMAZ) */}
      <div className="mb-10">
        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="bg-neutral-900/60 p-4 rounded-[1.5rem] border border-white/5 shadow-inner">
            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-3 ml-1 text-center">{menu[lang].loginTitle}</p>
            <div className="flex flex-col space-y-2">
              <input 
                type="password" 
                placeholder="***" 
                value={adminPass} 
                onChange={(e) => setAdminPass(e.target.value)} 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-amber-500 transition-all text-center" 
              />
              <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest hover:bg-white transition-colors">
                {menu[lang].loginBtn}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-[1.5rem] text-center">
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">OTURUM AÇIK</p>
            <button 
              onClick={() => { setIsAdmin(false); setActiveTab('home'); }} 
              className="text-[9px] font-bold text-white bg-red-500/50 px-4 py-1 rounded-lg uppercase hover:bg-red-600 transition-all"
            >
              Çıkış Yap
            </button>
          </div>
        )}
      </div>
      
      {/* MENÜ BUTONLARI */}
      <div className="text-neutral-600 text-[9px] font-black mb-4 uppercase tracking-[0.2em] px-2">MENÜ</div>
      <nav className="space-y-3">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'home' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
        >
          <span className="text-lg">🏠</span> <span>{menu[lang].home}</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('contact')} 
          className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'contact' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
        >
          <span className="text-lg">🎧</span> <span>{menu[lang].contact}</span>
        </button>

        {isAdmin && (
          <button 
            onClick={() => setActiveTab('admin')} 
            className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'admin' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
          >
            <span className="text-lg">⚙️</span> <span>{menu[lang].admin}</span>
          </button>
        )}
      </nav>

      {/* ALT BİLGİ */}
      <div className="mt-auto pt-6 border-t border-white/5 text-center">
        <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest">© 2024 Patnos Arşivi</p>
      </div>
    </aside>
  );
};

export default Sidebar;
