import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }: any) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/10 transform transition-transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-white flex items-center justify-center border-2 border-amber-500">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO-removebg-preview-pS8GIsYy9H3L8qE8vFvM7fN8x9V7zI.png" 
              alt="Logo" 
              className="w-full h-full object-contain p-1"
            />
          </div>
          <h1 className="text-[10px] font-bold text-white uppercase text-center">İzmir Patnoslular Derneği</h1>
        </div>
        <nav className="space-y-2">
          <button onClick={() => { setActiveTab('home'); setIsOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg ${activeTab === 'home' ? 'bg-amber-500 text-black' : 'text-white'}`}>Ana Sayfa</button>
          <button onClick={() => { setActiveTab('contact'); setIsOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg ${activeTab === 'contact' ? 'bg-amber-500 text-black' : 'text-white'}`}>İletişim</button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
