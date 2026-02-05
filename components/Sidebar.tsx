import React from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, adminPass, setAdminPass, handleAdminLogin, lang }) => {
  const menu: any = {
    TR: { home: "Ana Sayfa", contact: "İletişim", admin: "Yönetici Paneli", brand: "İzmir Patnoslular", brandSub: "Müzik Kutusu" },
    KU: { home: "Malper", contact: "Têkilî", admin: "Panela Rêveber", brand: "Patnosiyên Îzmîrê", brandSub: "Sindoqa Muzîkê" }
  };

  return (
    <aside className="w-72 bg-[#050505] border-r border-white/5 flex flex-col h-full p-8 z-50">
      <div className="mb-14 text-center">
        <div className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center font-black text-black text-4xl mx-auto mb-5">P</div>
        <h1 className="text-[12px] font-black uppercase text-white tracking-tighter leading-none mb-1">{menu[lang].brand}</h1>
        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest italic">{menu[lang].brandSub}</p>
      </div>
      
      <nav className="space-y-4 flex-1">
        <button onClick={() => setActiveTab('home')} className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'home' ? 'bg-amber-500 text-black shadow-2xl' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          <span className="text-lg">🏠</span> <span>{menu[lang].home}</span>
        </button>
        <button onClick={() => setActiveTab('contact')} className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'contact' ? 'bg-amber-500 text-black shadow-2xl' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          <span className="text-lg">🎧</span> <span>{menu[lang].contact}</span>
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'admin' ? 'bg-red-500 text-white shadow-2xl' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
            <span className="text-lg">⚙️</span> <span>{menu[lang].admin}</span>
          </button>
        )}
      </nav>

      <div className="mt-auto">
        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="bg-neutral-900/40 p-5 rounded-[2rem] border border-white/5">
            <input type="password" placeholder="***" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white mb-3 outline-none" />
            <button className="w-full bg-amber-500 text-black text-[10px] font-black py-3 rounded-xl uppercase">Giriş</button>
          </form>
        ) : (
          <button onClick={() => setIsAdmin(false)} className="w-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black py-4 rounded-2xl border border-emerald-500/20 uppercase tracking-widest">AKTİF</button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
