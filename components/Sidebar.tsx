import React from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, adminPass, setAdminPass, handleAdminLogin, lang, logoUrl }) => {
  const menu: any = {
    TR: { brand: "İZMİR PATNOSLULAR DERNEĞİ", brandSub: "MÜZİK KUTUSU", loginTitle: "YÖNETİCİ GİRİŞİ", loginBtn: "GİRİŞ", home: "Ana Sayfa", contact: "İletişim", admin: "Panel" },
    KU: { brand: "KOMELA PATNOSIYÊN ÎZMÎRÊ", brandSub: "SINDOQA MUZÎKÊ", loginTitle: "KÊŞANA RÊVEBER", loginBtn: "KETIN", home: "Malper", contact: "Têkilî", admin: "Panel" }
  };

  return (
    <aside className="w-full md:w-72 bg-[#050505] border-b md:border-r border-white/5 flex flex-col p-6 md:p-8 z-50 shrink-0 overflow-y-auto max-h-[40vh] md:max-h-screen">
      <div className="mb-6 md:mb-10 text-center relative">
        {logoUrl ? (
          <img src={logoUrl} className="w-16 h-16 rounded-[1.5rem] mx-auto mb-4 object-cover border-2 border-amber-500 shadow-xl shadow-amber-500/10" alt="Logo" />
        ) : (
          <div className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center font-black text-black text-4xl mx-auto mb-4 border-2 border-white/10">P</div>
        )}
        <h1 className="text-[11px] font-black uppercase text-white tracking-tighter leading-tight mb-3">{menu[lang].brand}</h1>
        <div className="flex items-center justify-center space-x-2 w-full px-2">
          <div className="h-[1px] flex-1 bg-amber-500/30"></div>
          <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic">{menu[lang].brandSub}</p>
          <div className="h-[1px] flex-1 bg-amber-500/30"></div>
        </div>
      </div>

      <div className="mb-6">
        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="bg-neutral-900/60 p-4 rounded-[1.5rem] border border-white/5">
            <input type="password" placeholder="***" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white text-center mb-2" />
            <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2 rounded-xl uppercase">{menu[lang].loginBtn}</button>
          </form>
        ) : (
          <button onClick={() => setIsAdmin(false)} className="w-full bg-red-500/20 text-red-500 text-[9px] font-black py-2 rounded-xl border border-red-500/20 uppercase">Oturumu Kapat</button>
        )}
      </div>
      
      <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        <button onClick={() => setActiveTab('home')} className={`flex-1 md:w-full text-center md:text-left px-4 py-3 rounded-xl text-[10px] md:text-xs font-black transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black' : 'text-neutral-500 hover:bg-white/5'}`}>🏠 {menu[lang].home}</button>
        <button onClick={() => setActiveTab('contact')} className={`flex-1 md:w-full text-center md:text-left px-4 py-3 rounded-xl text-[10px] md:text-xs font-black transition-all ${activeTab === 'contact' ? 'bg-amber-500 text-black' : 'text-neutral-500 hover:bg-white/5'}`}>🎧 {menu[lang].contact}</button>
        {isAdmin && <button onClick={() => setActiveTab('admin')} className={`flex-1 md:w-full text-center md:text-left px-4 py-3 rounded-xl text-[10px] md:text-xs font-black transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white' : 'text-neutral-500'}`}>⚙️ {menu[lang].admin}</button>}
      </nav>
    </aside>
  );
};

export default Sidebar;
