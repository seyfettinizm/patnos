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
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/10 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-black tracking-tighter text-amber-500">PATNOS MÜZİK</h1>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-white"><i className="fas fa-times"></i></button>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:bg-white/5'}`}
          >
            <i className="fas fa-home w-5"></i>
            <span>{lang === 'TR' ? 'Ana Sayfa' : 'Sereke'}</span>
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-500/10'}`}
            >
              <i className="fas fa-user-shield w-5"></i>
              <span>Yönetici Paneli</span>
            </button>
          )}
        </nav>

        {/* Yönetici Girişi Bölümü */}
        {!isAdmin && (
          <div className="mt-auto pt-6 border-t border-white/10">
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest px-2">Yönetici Girişi</p>
              <input 
                type="password" 
                placeholder="Şifre..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
              />
              <button className="w-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-black py-2 rounded-lg transition-all uppercase">
                Giriş Yap
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
