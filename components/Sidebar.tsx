import React from 'react';
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
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ lang, activeTab, setActiveTab, isAdmin, setAdminPass, adminPass, handleAdminLogin, isOpen, setIsOpen }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/10 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full p-6 overflow-y-auto">
        {/* Dernek Logosu ve İsim Alanı */}
        <div className="flex flex-col items-center mb-10 space-y-3 border-b border-white/5 pb-6">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 overflow-hidden border-2 border-amber-500/50">
             {/* Buraya dernek logosu URL'si gelecek, şimdilik ikon koyuyorum */}
            <i className="fas fa-university text-3xl text-black"></i>
          </div>
          <div className="text-center">
            <h1 className="text-sm font-black tracking-tight text-white uppercase leading-tight">İzmir Patnoslular</h1>
            <h2 className="text-[10px] font-bold text-amber-500 tracking-[0.2em] uppercase">Sosyal Yardımlaşma Derneği</h2>
          </div>
        </div>
        
        <nav className="space-y-2 mb-8">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:bg-white/5'}`}>
            <i className="fas fa-home w-5"></i>
            <span>{lang === 'TR' ? 'Ana Sayfa' : 'Sereke'}</span>
          </button>

          <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'contact' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:bg-white/5'}`}>
            <i className="fas fa-envelope w-5"></i>
            <span>{lang === 'TR' ? 'İletişim' : 'Têkili'}</span>
          </button>
          
          {isAdmin && (
            <button onClick={() => setActiveTab('admin')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-500/10'}`}>
              <i className="fas fa-user-shield w-5"></i>
              <span>Yönetici Paneli</span>
            </button>
          )}
        </nav>

        {!isAdmin && (
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mt-auto">
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest px-1">Yönetici Erişimi</p>
              <input type="password" placeholder="Şifre..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
              <button className="w-full bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black text-[10px] font-black py-2 rounded-lg transition-all uppercase border border-amber-500/20">Giriş Yap</button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
