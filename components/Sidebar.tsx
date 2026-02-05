import React from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, adminPass, setAdminPass, handleAdminLogin, lang }) => {
  const menu: any = {
    TR: { home: "Ana Sayfa", contact: "İletişim & Paylaşım", admin: "Yönetim", brandTop: "İzmir Patnoslular", brandBottom: "Derneği Müzik Kutusu" },
    KU: { home: "Malper", contact: "Têkilî & Parvekirin", admin: "Rêveberî", brandTop: "Komeleya Patnosiyên", brandBottom: "Îzmîrê Sindoqa Muzîkê" }
  };

  const currentMenu = menu[lang] || menu.TR;

  return (
    <aside className="w-60 bg-black border-r border-white/5 flex flex-col h-full p-6 z-50">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-black text-3xl mx-auto mb-4">P</div>
        <p className="text-[10px] font-black uppercase text-white tracking-tighter">{currentMenu.brandTop}</p>
        <p className="text-[8px] font-bold text-amber-500 uppercase tracking-widest">{currentMenu.brandBottom}</p>
      </div>
      
      <nav className="space-y-2 flex-1">
        <button onClick={() => setActiveTab('home')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white'}`}>🏠 {currentMenu.home}</button>
        <button onClick={() => setActiveTab('contact')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'contact' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white'}`}>📞 {currentMenu.contact}</button>
        {isAdmin && <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white' : 'text-neutral-400 hover:text-white'}`}>⚙️ {currentMenu.admin}</button>}
      </nav>

      {!isAdmin ? (
        <form onSubmit={handleAdminLogin} className="mt-4">
          <input type="password" placeholder="Şifre" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white mb-2 outline-none" />
          <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2 rounded-lg uppercase">GİRİŞ</button>
        </form>
      ) : (
        <button onClick={() => { setIsAdmin(false); setActiveTab('home'); }} className="mt-4 w-full bg-red-500/20 text-red-500 text-[10px] font-bold py-2 rounded-lg border border-red-500/20">ÇIKIŞ 🚪</button>
      )}
    </aside>
  );
};

export default Sidebar;
