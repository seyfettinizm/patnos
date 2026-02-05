import React from 'react';

// SidebarProps Interface aynı kalacak...

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, setActiveTab, isAdmin, setIsAdmin, setAdminPass, 
  adminPass, handleAdminLogin 
}) => {
  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full p-6 relative z-50">
      
      {/* LOGO - GÖRSELLE DEĞİŞTİRİLDİ */}
      <div className="mb-12 flex flex-col items-center border-b border-white/5 pb-8 text-center">
        <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center font-black text-black shadow-2xl text-4xl mb-4 border-4 border-white/5">P</div>
        <div>
          <h1 className="text-[11px] font-black text-white uppercase leading-tight tracking-tighter">İzmir Patnoslular</h1>
          <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest italic">Sosyal Yardımlaşma</p>
        </div>
      </div>
      
      <nav className="space-y-3 mb-auto">
        <button onClick={() => setActiveTab('home')} className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black shadow-xl scale-105 font-black' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          <span>🏠 Ana Sayfa</span>
        </button>
        <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all ${activeTab === 'contact' ? 'bg-amber-500 text-black shadow-xl scale-105 font-black' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          <span>📞 İletişim</span>
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('admin')} className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white shadow-xl scale-105 font-black' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
            <span>⚙️ Yönetim Paneli</span>
          </button>
        )}
      </nav>

      {/* ŞİFRE GİRİŞİ */}
      {!isAdmin && (
        <div className="mt-8 bg-neutral-900/60 p-4 rounded-3xl border border-white/5">
          <form onSubmit={handleAdminLogin} className="space-y-2">
            <input 
              type="password" 
              placeholder="Admin Şifresi" 
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white focus:border-amber-500 outline-none"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
            />
            <button className="w-full bg-amber-500 text-black text-[9px] font-black py-2 rounded-xl uppercase">Giriş</button>
          </form>
        </div>
      )}

      {/* ÇIKIŞ BUTONU */}
      {isAdmin && (
        <button onClick={() => { setIsAdmin(false); setActiveTab('home'); }} className="mt-8 w-full bg-neutral-800 text-neutral-500 hover:text-red-500 text-[9px] font-black py-3 rounded-xl border border-white/5 transition-all uppercase tracking-widest">
          GÜVENLİ ÇIKIŞ 🚪
        </button>
      )}
      
      {/* Player için boşluk */}
      <div className="h-28"></div>
    </aside>
  );
};

export default Sidebar;
