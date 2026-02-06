import React, { useState } from 'react';

const Sidebar: React.FC<any> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, lang, logoUrl }) => {
  const [adminPass, setAdminPass] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const menu: any = {
    TR: { brand: "İZMİR PATNOSLULAR DERNEĞİ", brandSub: "MÜZİK KUTUSU", loginTitle: "ŞİFREYİ GİRİN", loginBtn: "ONAYLA", home: "Ana Sayfa", contact: "İletişim", admin: "Yönetici", logout: "Çıkış Yap" },
    KU: { brand: "KOMELA PATNOSIYÊN ÎZMÎRÊ", brandSub: "SINDOQA MUZÎKÊ", loginTitle: "NASNAVÊ BIDE", loginBtn: "ERÊ BIKE", home: "Malper", contact: "Têkilî", admin: "Rêveber", logout: "Dergirin" }
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    if(adminPass === 'Mihriban04') {
      setIsAdmin(true);
      setShowLogin(false);
      setActiveTab('admin');
    } else {
      alert("Hatalı Şifre!");
    }
  };

  return (
    <aside className="w-full md:w-72 bg-[#050505] border-b md:border-r border-white/5 flex flex-col p-6 md:p-8 z-50 shrink-0 h-full overflow-y-auto">
      {/* LOGO BÖLÜMÜ - ARTIK ŞEFFAF */}
      <div className="mb-10 text-center">
        {logoUrl ? (
          <img src={logoUrl} className="w-24 h-24 mx-auto mb-4 object-contain" alt="Logo" />
        ) : (
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-black text-4xl mx-auto mb-4">P</div>
        )}
        <h1 className="text-[11px] font-black uppercase text-white tracking-tighter leading-tight mb-3">{menu[lang].brand}</h1>
        <div className="flex items-center justify-center space-x-2 w-full px-2">
          <div className="h-[1px] flex-1 bg-amber-500/30"></div>
          <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic">{menu[lang].brandSub}</p>
          <div className="h-[1px] flex-1 bg-amber-500/30"></div>
        </div>
      </div>

      <nav className="flex flex-col space-y-3">
        <button onClick={() => setActiveTab('home')} className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'home' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:bg-white/5'}`}>
          <span className="text-lg">🏠</span> <span>{menu[lang].home}</span>
        </button>
        <button onClick={() => setActiveTab('contact')} className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'contact' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:bg-white/5'}`}>
          <span className="text-lg">🎧</span> <span>{menu[lang].contact}</span>
        </button>

        {/* YÖNETİCİ BUTONU VE GİRİŞ EKRANI */}
        {!isAdmin ? (
          <div className="relative">
            <button onClick={() => setShowLogin(!showLogin)} className="w-full text-left px-5 py-4 rounded-2xl text-xs font-black text-neutral-500 hover:bg-white/5 flex items-center space-x-4 transition-all">
              <span className="text-lg">⚙️</span> <span>{menu[lang].admin}</span>
            </button>
            {showLogin && (
              <form onSubmit={handleLogin} className="mt-2 bg-neutral-900 p-4 rounded-2xl border border-amber-500/20 animate-in slide-in-from-top-2">
                <input type="password" placeholder="***" value={adminPass} onChange={(e)=>setAdminPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white text-center mb-2" />
                <button className="w-full bg-amber-500 text-black text-[10px] font-black py-2 rounded-xl uppercase">{menu[lang].loginBtn}</button>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center space-x-4 ${activeTab === 'admin' ? 'bg-red-500 text-white shadow-lg' : 'text-red-500 bg-red-500/5 hover:bg-red-500/10'}`}>
              <span className="text-lg">🛠️</span> <span>Panel</span>
            </button>
            <button onClick={() => setIsAdmin(false)} className="w-full text-center py-2 text-[9px] font-black text-neutral-600 uppercase hover:text-red-500 transition-all italic">
               [{menu[lang].logout}]
            </button>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-6 text-center border-t border-white/5">
        <p className="text-[8px] text-neutral-700 font-bold uppercase tracking-widest italic">© 2024 PATNOS ARŞİVİ</p>
      </div>
    </aside>
  );
};

export default Sidebar;
