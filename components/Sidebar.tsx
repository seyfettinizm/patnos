import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../constants';

interface SidebarProps {
  lang: Language;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  adminPass: string;
  setAdminPass: (val: string) => void;
  handleAdminLogin: (e: React.FormEvent) => void;
  onGuestLogin: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  logo?: any;
}

const Sidebar: React.FC<SidebarProps> = ({ lang, activeTab, setActiveTab, isAdmin, setAdminPass, adminPass, handleAdminLogin, isOpen, setIsOpen }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/10 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-black tracking-tighter text-amber-500">PATNOS MÜZİK</h1>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-white"><i className="fas fa-times"></i></button>
        </div>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'home' ? 'bg-amber-500 text-black' : 'hover:bg-white/5'}`}>
            <i className="fas fa-home w-5"></i>
            <span>{lang === 'TR' ? 'Ana Sayfa' : 'Sereke'}</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
