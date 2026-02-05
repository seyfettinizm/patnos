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
      <div className="flex flex-col h-full p-6">
        {/* Dernek Logosu Sabitlendi */}
        <div className="flex flex-col items-center mb-8 border-b border-white/5 pb-6">
          <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 bg-white">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO-removebg-preview-pS8GIsYy9H3L8qE8vFvM7fN8x9V7zI.png" 
              alt="İzmir Patnoslular Derneği Logosu"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="text-center px-2">
            <h1 className="text-xs font-black text-white uppercase leading-tight tracking-tighter">İzmir Patnoslular</h1>
            <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-1">Sosyal Yardımlaşma Derneği</p>
          </div>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:bg-white/5'}`}>
            <i className="fas fa-home w-5"></i>
            <span>{lang === 'TR' ? 'Ana Sayfa' : 'Sereke'}</span>
          </button>

          <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'contact' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:bg-white/5'}`}>
            <i className="fas fa-envelope w-5"></i>
            <span>{lang === 'TR' ? 'İletişim' : 'Têkili'}</span>
          </button>

          {/* Yönetici Girişi - Müzikçaların Üstüne Çıkmayacak Şekilde Menü İçine Alındı */}
          {!isAdmin ? (
            <div className="mt-8 bg-white/5 p-4 rounded-2xl border border-white/5">
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest px-1">Yönetici Girişi</p>
                <input 
                  type="password" 
                  placeholder="Şifre..." 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
                <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2 rounded-lg transition-all hover:bg-amber-600">
                  GİRİŞ
                </button>
              </form>
            </div>
          ) : (
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold mt-4 transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-500/10'}`}
            >
              <i className="fas fa-user-shield w-5"></i>
              <span>Yönetici Paneli</span>
            </button>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
