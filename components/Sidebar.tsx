import React from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, adminPass, setAdminPass, handleAdminLogin, lang }) => {
  const menu: any = {
    TR: { home: "Ana Sayfa", contact: "İletişim & Paylaşım", admin: "Yönetim Paneli", logout: "ÇIKIŞ", login: "GİRİŞ", brandTop: "İzmir Patnoslular", brandBottom: "Derneği Müzik Kutusu" },
    KU: { home: "Malper", contact: "Têkilî & Parvekirin", admin: "Panela Rêveberiyê", logout: "DERKETIN", login: "TÊKEVE", brandTop: "Komeleya Patnosiyên", brandBottom: "Îzmîrê Sindoqa Muzîkê" }
  };

  const currentMenu = menu[lang] || menu.TR;

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full p-6 relative z-50">
      <div className="mb-12 flex flex-col items-center border-b border-white/5 pb-8 text-center">
        <div className="w-20 h-20 bg-amber-500 rounded-[2.2rem] flex items-center justify-center font-black text-black text-4xl mb-5 border-4 border-white/5 shadow-2xl">P</div>
        <div className="px-2">
          <h1 className="text-[12px] font-black text-white uppercase leading-tight tracking-tighter">{currentMenu.brandTop}</h1>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest italic mt-1.5">{currentMenu.brandBottom}</p>
        </div>
      </div>
      
      <nav className="space-y-3 mb-auto">
        <button onClick={() => setActiveTab('home')} className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center space-x-3 ${activeTab === 'home' ? 'bg-amber-500 text-black font-black' : 'text-neutral-500 hover:text-white'}`}>
          <span>🏠</span><span className="text-sm font-bold">{currentMenu.home}</span>
        </button>
        <button onClick={() => setActiveTab('contact')} className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center space-x-3 ${activeTab === 'contact' ? 'bg-amber-500 text-black font-black' : 'text-neutral-500 hover:text-white'}`}>
          <span>📞</span><span className="text-sm font-bold">{currentMenu.contact}</span>
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center space-x-3 ${activeTab === 'admin' ? 'bg-red-500 text-white font-black' : 'text-neutral-500 hover:text-white'}`}>
            <span>⚙️</span><span className="text-sm font-bold">{currentMenu.admin}</span>
          </button>
        )}
      </nav>

      <div className="mt-8">
        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="bg-neutral-900/40 p-5 rounded-[2rem] border border-white/5 shadow-inner">
            <input type="password" placeholder="Şifre" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-center text-xs text-white outline-none focus:border-amber-500 mb-3" />
            <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2.5 rounded-xl uppercase shadow-lg hover:bg-amber-400 transition-colors">{currentMenu.login}</button>
          </form>
        ) : (
          <button onClick={() => { setIsAdmin(false); setActiveTab('home'); }} className="w-full bg-red-500/10 text-red-500 text-[9px] font-black py-4 rounded-2xl border border-red-500/20 uppercase hover:bg-red-500 hover:text-white transition-all shadow-lg">{currentMenu.logout} 🚪</button>
        )}
      </div>
      <div className="h-28"></div>
    </aside>
  );
};

export default Sidebar;
