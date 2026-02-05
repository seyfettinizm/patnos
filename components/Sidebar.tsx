import React from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, adminPass, setAdminPass, handleAdminLogin, lang, logo }) => {
  return (
    <aside className="w-72 bg-[#050505] border-r border-white/5 flex flex-col h-full p-8 z-50">
      <div className="mb-14 text-center">
        {logo ? (
          <img src={logo} className="w-24 h-24 rounded-3xl mx-auto mb-5 object-cover border-2 border-amber-500" alt="Logo" />
        ) : (
          <div className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center font-black text-black text-4xl mx-auto mb-5 shadow-2xl shadow-amber-500/20">P</div>
        )}
        <h1 className="text-[12px] font-black uppercase text-white tracking-tighter leading-none mb-1">İzmir Patnoslular Derneği</h1>
        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest italic">Müzik Kutusu</p>
      </div>
      
      <div className="text-neutral-600 text-[10px] font-black mb-6 uppercase tracking-[0.2em] px-4">Menü</div>
      <nav className="space-y-4 flex-1">
        <button onClick={() => setActiveTab('home')} className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'home' ? 'bg-amber-500 text-black shadow-2xl' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          <span className="text-lg">🏠</span> <span>Ana Sayfa</span>
        </button>
        <button onClick={() => setActiveTab('contact')} className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'contact' ? 'bg-amber-500 text-black shadow-2xl' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          <span className="text-lg">🎧</span> <span>İletişim</span>
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'admin' ? 'bg-red-500 text-white shadow-2xl' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
            <span className="text-lg">👥</span> <span>Yönetici Paneli</span>
          </button>
        )}
      </nav>

      <div className="mt-auto">
        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="bg-neutral-900/40 p-5 rounded-[2rem] border border-white/5">
            <input type="password" placeholder="Şifre..." value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white mb-3 outline-none focus:border-amber-500" />
            <button className="w-full bg-amber-500 text-black text-[10px] font-black py-3 rounded-xl uppercase tracking-widest">Giriş Yap</button>
          </form>
        ) : (
          <button onClick={() => setIsAdmin(false)} className="w-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black py-4 rounded-2xl border border-emerald-500/20 uppercase tracking-widest">Yönetici Aktif</button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
