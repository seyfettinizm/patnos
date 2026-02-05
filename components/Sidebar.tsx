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
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/10 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full p-6 pb-44">
        
        {/* LOGO BÖLÜMÜ */}
        <div className="flex flex-col items-center mb-10 border-b border-white/5 pb-6">
          <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-2 border-amber-500 bg-white flex items-center justify-center shadow-2xl">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO-removebg-preview-pS8GIsYy9H3L8qE8vFvM7fN8x9V7zI.png" 
              alt="Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="text-center">
            <h1 className="text-[11px] font-black text-white uppercase">İzmir Patnoslular</h1>
            <p className="text-[9px] font-bold text-amber-500 uppercase mt-1 italic">Sosyal Yardımlaşma Derneği</p>
          </div>
        </div>
        
        <nav className="space-y-2 flex-1 font-bold">
          <button onClick={() => { setActiveTab('home'); setIsOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${activeTab === 'home' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:bg-white/5'}`}>
            <span>Ana Sayfa</span>
          </button>
          <button onClick={() => { setActiveTab('contact'); setIsOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${activeTab === 'contact' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:bg-white/5'}`}>
            <span>İletişim</span>
          </button>
        </nav>

        {!isAdmin && (
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mt-auto">
            <form onSubmit={handleAdminLogin} className="space-y-3 text-center">
              <p className="text-[10px] text-neutral-500 font-bold uppercase mb-2">ERİŞİM</p>
              <input 
                type="password" 
                placeholder="Şifre..." 
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
              />
              <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2 rounded-lg">GİRİŞ</button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
