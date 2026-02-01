
import React from 'react';
import { UI_STRINGS } from '../constants';
import { Language } from '../types';

interface SidebarProps {
  lang: Language;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  adminPass: string;
  setAdminPass: (val: string) => void;
  handleAdminLogin: (e: React.FormEvent) => void;
  logo: string | null;
  onGuestLogin: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  lang, 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  setIsAdmin, 
  adminPass, 
  setAdminPass, 
  handleAdminLogin,
  logo,
  onGuestLogin,
  isOpen,
  setIsOpen
}) => {
  const navItems = [
    { id: 'home', icon: 'fa-home', label: UI_STRINGS.home[lang] },
    { id: 'contact', icon: 'fa-headset', label: UI_STRINGS.album5[lang] },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', icon: 'fa-user-shield', label: lang === 'TR' ? 'Yönetici Paneli' : 'Panela Rêveber' });
  }

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed md:relative inset-y-0 left-0 w-64 flex-shrink-0 glass-panel h-full p-6 flex flex-col z-[70] overflow-y-auto border-r border-white/5 transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Section */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logo ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg">P</div>
            )}
            <div>
              <h1 className="text-[10px] font-extrabold leading-tight tracking-tight max-w-[120px]">{UI_STRINGS.appName[lang]}</h1>
              <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">{UI_STRINGS.musicBox[lang]}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-neutral-500"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 space-y-2 mb-8">
          <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-4 px-4">Menü</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Login Section */}
        <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
          {!isAdmin ? (
            <div className="space-y-4">
              <button 
                onClick={onGuestLogin}
                className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-2xl flex items-center justify-center space-x-2 hover:bg-white/10 transition-all font-black text-[9px] uppercase tracking-widest active:scale-95 group"
              >
                <i className="fas fa-user-circle text-amber-500"></i>
                <span>{UI_STRINGS.guestProfile[lang]}</span>
              </button>

              <div className="bg-neutral-900/40 p-4 rounded-3xl border border-white/5">
                <div className="flex items-center space-x-2 mb-4 px-1">
                   <i className="fas fa-lock text-[9px] text-amber-500"></i>
                   <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Yönetici Girişi</label>
                </div>
                
                <form onSubmit={handleAdminLogin} className="space-y-3">
                  <input 
                    type="password" 
                    placeholder="Şifre"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-[11px] text-white outline-none focus:border-amber-500/50"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-500 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest active:scale-95"
                  >
                    Giriş
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-3xl flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-emerald-500 uppercase">Yönetici Aktif</span>
              </div>
              <button 
                onClick={() => { setIsAdmin(false); setActiveTab('home'); }} 
                className="w-full bg-red-500/5 text-neutral-500 hover:text-red-500 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest border border-white/5"
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
