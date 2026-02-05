import React from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, adminPass, setAdminPass, handleAdminLogin, lang }) => {
  const menu = {
    TR: { home: "Ana Sayfa", contact: "İletişim", admin: "Yönetim Paneli", logout: "GÜVENLİ ÇIKIŞ", login: "Giriş" },
    KU: { home: "Malper", contact: "Têkilî", admin: "Panela Rêveberiyê", logout: "DERKETINA EWLE", login: "Têkeve" }
  };

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full p-6 relative z-50">
      <div className="mb-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center font-black text-black shadow-2xl text-4xl mb-4 border-4 border-white/5">P</div>
        <h1 className="text-[11px] font-black text-white uppercase tracking-tighter">İzmir Patnoslular</h1>
      </div>
      
      <nav className="space-y-3 mb-auto">
        <button onClick={() => setActiveTab('home')} className={`w-full text-left px-5 py-4 rounded-2xl transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black font-black' : 'text-neutral-500 hover:text-white'}`}>
          🏠 {menu[lang as keyof typeof menu].home}
        </button>
        <button onClick={() => setActiveTab('contact')} className={`w-full text-left px-5 py-4 rounded-2xl transition-all ${activeTab === 'contact' ? 'bg-amber-500 text-black font-black' : 'text-neutral-500 hover:text-white'}`}>
          📞 {menu[lang as keyof typeof menu].contact}
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-5 py-4 rounded-2xl transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white font-black' : 'text-neutral-500 hover:text-white'}`}>
            ⚙️ {menu[lang as keyof typeof menu].admin}
          </button>
        )}
      </nav>

      {!isAdmin ? (
        <form onSubmit={handleAdminLogin} className="mt-8 bg-neutral-900/60 p-4 rounded-3xl border border-white/5">
          <input 
            type="password" placeholder="Şifre" value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white outline-none focus:border-amber-500 mb-2"
          />
          <button className="w-full bg-amber-500 text-black text-[9px] font-black py-2 rounded-xl uppercase">{menu[lang as keyof typeof menu].login}</button>
        </form>
      ) : (
        <button onClick={() => { setIsAdmin(false); setActiveTab('home'); }} className="mt-8 w-full bg-red-500/10 text-red-500 text-[9px] font-black py-3 rounded-xl border border-red-500/20 uppercase tracking-widest">
          {menu[lang as keyof typeof menu].logout} 🚪
        </button>
      )}
      <div className="h-28"></div>
    </aside>
  );
};

export default Sidebar;
