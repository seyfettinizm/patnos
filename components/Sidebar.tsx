import React from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, adminPass, setAdminPass, handleAdminLogin, lang, logo }) => {
  const menu: any = {
    TR: { home: "Ana Sayfa", contact: "İletişim", admin: "Yönetici", brand: "İZMİR PATNOSLULAR" },
    KU: { home: "Malper", contact: "Têkilî", admin: "Rêveber", brand: "PATNOSIYÊN ÎZMÎRÊ" }
  };
  const currentMenu = menu[lang] || menu.TR;

  return (
    <aside className="w-64 bg-black border-r border-white/5 flex flex-col h-full p-8 z-50">
      <div className="mb-12 text-center">
        {logo ? (
          <img src={logo} className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover border-2 border-amber-500" alt="Logo" />
        ) : (
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-black text-3xl mx-auto mb-4">P</div>
        )}
        <p className="text-[11px] font-black uppercase text-white tracking-tighter leading-none">{currentMenu.brand}</p>
        <p className="text-[8px] font-bold text-amber-500 uppercase tracking-widest mt-1">DERNEĞİ</p>
      </div>
      
      <nav className="space-y-3 flex-1">
        <button onClick={() => setActiveTab('home')} className={`w-full text-left px-5 py-4 rounded-2xl text-[11px] font-black transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white'}`}>🏠 {currentMenu.home}</button>
        <button onClick={() => setActiveTab('contact')} className={`w-full text-left px-5 py-4 rounded-2xl text-[11px] font-black transition-all ${activeTab === 'contact' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white'}`}>📞 {currentMenu.contact}</button>
        {isAdmin && <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-5 py-4 rounded-2xl text-[11px] font-black transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white' : 'text-neutral-500 hover:text-white'}`}>⚙️ {currentMenu.admin}</button>}
      </nav>

      <div className="mt-auto">
        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="bg-neutral-900/50 p-4 rounded-2xl border border-white/5">
            <input type="password" placeholder="Yönetici Şifre" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white mb-2 outline-none" />
            <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2 rounded-xl uppercase tracking-widest">GİRİŞ</button>
          </form>
        ) : (
          <button onClick={() => { setIsAdmin(false); setActiveTab('home'); }} className="w-full bg-red-500/20 text-red-500 text-[10px] font-black py-3 rounded-xl border border-red-500/20 uppercase">ÇIKIŞ 🚪</button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
