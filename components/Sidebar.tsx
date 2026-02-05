import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  adminPass: string;
  setAdminPass: (val: string) => void;
  handleAdminLogin: (e: React.FormEvent) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, setActiveTab, isAdmin, setAdminPass, 
  adminPass, handleAdminLogin, isOpen, setIsOpen 
}) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#121212] border-r border-white/5 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full p-5">
        
        {/* LOGO ALANI */}
        <div className="mb-10 px-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-black text-black text-xl shadow-lg shadow-amber-500/20">P</div>
            <div>
              <h1 className="text-[10px] font-black text-white leading-none uppercase tracking-tighter">İzmir Patnoslular Derneği</h1>
              <p className="text-[8px] font-bold text-amber-500 uppercase mt-1">Müzik Kutusu</p>
            </div>
          </div>
          <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest mb-4 italic">Menü</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button onClick={() => { setActiveTab('home'); setIsOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-400 hover:bg-white/5'}`}>
            <span className="font-bold text-sm">🏠 Ana Sayfa</span>
          </button>
          <button onClick={() => { setActiveTab('contact'); setIsOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'contact' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:bg-white/5'}`}>
            <span className="font-bold text-sm">📞 İletişim</span>
          </button>
        </nav>

        {/* ERİŞİM PANELİ */}
        <div className="mt-auto pt-6 border-t border-white/5">
          {!isAdmin ? (
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div className="bg-neutral-900/50 p-4 rounded-2xl border border-white/5">
                <p className="text-[8px] text-green-500 font-black text-center uppercase mb-3 tracking-widest">Sistem Erişimi</p>
                <input 
                  type="password" 
                  placeholder="Şifre..." 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:outline-none focus:border-amber-500 transition-colors"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
                <button className="w-full bg-amber-500 text-black text-[9px] font-black py-2 rounded-lg mt-3 hover:bg-amber-600 transition-colors uppercase tracking-widest">GİRİŞ YAP</button>
              </div>
            </form>
          ) : (
            <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20 text-center">
               <p className="text-[10px] text-green-500 font-bold uppercase italic">Yönetici Aktif</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
