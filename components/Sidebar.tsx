import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  adminPass: string;
  setAdminPass: (val: string) => void;
  handleAdminLogin: (e: React.FormEvent) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, setActiveTab, isAdmin, setIsAdmin, setAdminPass, 
  adminPass, handleAdminLogin, isOpen, setIsOpen 
}) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full p-6">
        
        {/* LOGO */}
        <div className="mb-10 flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-black text-black shadow-lg text-xl">P</div>
          <div>
            <h1 className="text-[11px] font-black text-white uppercase leading-tight tracking-tighter">İzmir Patnoslular</h1>
            <p className="text-[8px] font-bold text-amber-500 uppercase tracking-widest italic">Müzik Kutusu</p>
          </div>
        </div>
        
        {/* NAVİGASYON */}
        <nav className="space-y-2 mb-10">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-400 hover:bg-white/5'}`}>
            <span className="font-bold text-sm">🏠 Ana Sayfa</span>
          </button>
          <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'contact' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:bg-white/5'}`}>
            <span className="font-bold text-sm">📞 İletişim</span>
          </button>
          {isAdmin && (
            <button onClick={() => setActiveTab('admin')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white shadow-lg' : 'text-neutral-400 hover:bg-white/5'}`}>
              <span className="font-bold text-sm">⚙️ Yönetim Paneli</span>
            </button>
          )}
        </nav>

        {/* ERİŞİM KONTROL (PLAYER'DAN UZAKTA, ORTA BÖLÜMDE) */}
        <div className="bg-neutral-900/40 p-5 rounded-[2rem] border border-white/5 shadow-inner mb-auto">
          {!isAdmin ? (
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <p className="text-[9px] text-neutral-500 font-black text-center uppercase tracking-widest">Sistem Girişi</p>
              <input 
                type="password" 
                placeholder="Şifre..." 
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-[11px] text-white focus:border-amber-500 outline-none"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
              />
              <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2.5 rounded-xl hover:bg-amber-400 transition-all">GİRİŞ YAP</button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-500">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                <p className="text-[10px] font-black uppercase tracking-widest">Yönetici Aktif</p>
              </div>
              <button onClick={() => { setIsAdmin(false); setActiveTab('home'); }} className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[9px] font-black py-2 rounded-xl border border-red-500/20 transition-all">GÜVENLİ ÇIKIŞ</button>
            </div>
          )}
        </div>

        {/* PLAYER İÇİN ALT REZERV ALANI (Boş bırakıldı) */}
        <div className="h-24"></div>
      </div>
    </aside>
  );
};

export default Sidebar;
