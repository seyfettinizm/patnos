import React from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, adminPass, setAdminPass, handleAdminLogin, lang }) => {
  // --- SIDEBAR DİL SÖZLÜĞÜ ---
  const menu: any = {
    TR: { 
      home: "Ana Sayfa", 
      contact: "İletişim", 
      admin: "Yönetim Paneli", 
      logout: "GÜVENLİ ÇIKIŞ", 
      login: "GİRİŞ",
      brandTop: "İzmir Patnoslular",
      brandBottom: "Derneği Müzik Kutusu"
    },
    KU: { 
      home: "Malper", 
      contact: "Têkilî", 
      admin: "Panela Rêveberiyê", 
      logout: "DERKETINA EWLE", 
      login: "TÊKEVE",
      brandTop: "Komeleya Patnosiyên",
      brandBottom: "Îzmîrê Sindoqa Muzîkê"
    }
  };

  const currentMenu = menu[lang] || menu.TR;

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full p-6 relative z-50">
      
      {/* LOGO ALANI */}
      <div className="mb-12 flex flex-col items-center border-b border-white/5 pb-8 text-center">
        <div className="w-20 h-20 bg-amber-500 rounded-[2.2rem] flex items-center justify-center font-black text-black shadow-[0_0_40px_rgba(245,158,11,0.2)] text-4xl mb-5 border-4 border-white/5 transition-transform hover:rotate-6">
          P
        </div>
        <div>
          <h1 className="text-[12px] font-black text-white uppercase leading-tight tracking-tighter">
            {currentMenu.brandTop}
          </h1>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest italic mt-1.5 opacity-90">
            {currentMenu.brandBottom}
          </p>
        </div>
      </div>
      
      {/* MENÜ BUTONLARI */}
      <nav className="space-y-3 mb-auto">
        <button onClick={() => setActiveTab('home')} className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center space-x-3 group ${activeTab === 'home' ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          <span className={`text-lg transition-transform group-hover:scale-125`}>🏠</span>
          <span className="text-sm">{currentMenu.home}</span>
        </button>
        <button onClick={() => setActiveTab('contact')} className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center space-x-3 group ${activeTab === 'contact' ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          <span className={`text-lg transition-transform group-hover:scale-125`}>📞</span>
          <span className="text-sm">{currentMenu.contact}</span>
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center space-x-3 group ${activeTab === 'admin' ? 'bg-red-500 text-white font-black shadow-lg shadow-red-500/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
            <span className={`text-lg transition-transform group-hover:scale-125`}>⚙️</span>
            <span className="text-sm">{currentMenu.admin}</span>
          </button>
        )}
      </nav>

      {/* ALT PANEL: GİRİŞ VE ÇIKIŞ */}
      <div className="mt-8">
        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="bg-neutral-900/60 p-5 rounded-[2rem] border border-white/5 shadow-inner">
            <p className="text-[8px] text-neutral-500 font-black text-center uppercase tracking-widest mb-3 italic">Yönetici Erişimi</p>
            <input 
              type="password" 
              placeholder="••••••" 
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-center text-xs text-white outline-none focus:border-amber-500 mb-3 transition-all"
            />
            <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2.5 rounded-xl uppercase hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/10">
              {currentMenu.login}
            </button>
          </form>
        ) : (
          <button onClick={() => { setIsAdmin(false); setActiveTab('home'); }} className="w-full bg-red-500/10 text-red-500 text-[9px] font-black py-4 rounded-2xl border border-red-500/20 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg">
            {currentMenu.logout} 🚪
          </button>
        )}
      </div>
      
      {/* Müzik Çalar için alt boşluk */}
      <div className="h-28"></div>
    </aside>
  );
};

export default Sidebar;
