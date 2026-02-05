import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void; // Çıkış için eklendi
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
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#121212] border-r border-white/5 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full p-6">
        
        {/* LOGO */}
        <div className="mb-10 flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-black text-black shadow-lg shadow-amber-500/20 text-xl">P</div>
          <div>
            <h1 className="text-[10px] font-black text-white uppercase leading-tight tracking-tighter">İzmir Patnoslular Derneği</h1>
            <p className="text-[8px] font-bold text-amber-500 uppercase tracking-widest italic">Müzik Kutusu</p>
          </div>
        </div>
        
        <nav className="space-y-2 flex-1">
          <p className="text-[9px] text-neutral-600 font-black uppercase tracking-[0.2em] mb-4 ml-2 italic">Menü</p>
          <button onClick={() => { setActiveTab('home'); setIsOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-400 hover:bg-white/5'}`}>
            <span className="font-bold text-sm">🏠 Ana Sayfa</span>
          </button>
          <button onClick={() => { setActiveTab('contact'); setIsOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'contact' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-400 hover:bg-white/5'}`}>
            <span className="font-bold text-sm">📞 İletişim</span>
          </button>
          
          {isAdmin && (
            <button onClick={() => { setActiveTab('admin'); setIsOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white shadow-lg' : 'text-neutral-400 hover:bg-white/5'}`}>
              <span className="font-bold text-sm">⚙️ Yönetim Paneli</span>
            </button>
          )}
        </nav>

        {/* ERİŞİM & ÇIKIŞ PANELİ */}
        <div className="mt-auto pb-4">
          {!isAdmin ? (
            <div className="bg-neutral-900/50 p-4 rounded-2xl border border-white/5">
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <input 
                  type="password" 
                  placeholder="Şifre..." 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-amber-500 outline-none transition-all"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
                <button className="w-full bg-amber-500 text-black text-[9px] font-black py-2 rounded-lg uppercase tracking-tighter hover:bg-amber-400">Giriş Yap</button>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20 text-center">
                 <p className="text-[10px] text-green-500 font-black uppercase italic tracking-widest">Yönetici Aktif</p>
              </div>
              <button 
                onClick={() => { setIsAdmin(false); setActiveTab('home'); }}
                className="w-full bg-neutral-800 hover:bg-red-500/20 hover:text-red-500 text-neutral-500 text-[9px] font-black py-2 rounded-lg transition-all uppercase"
              >
                Güvenli Çıkış 🚪
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
