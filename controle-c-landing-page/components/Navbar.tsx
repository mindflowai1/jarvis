import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-white text-xl font-display font-bold tracking-tight">Controle-C</h2>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider">v2.0 com IA</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <a className="text-slate-300 hover:text-white text-sm font-medium transition-colors" href="#hero">Como Funciona</a>
          <a className="text-slate-300 hover:text-white text-sm font-medium transition-colors" href="#features">Segurança</a>
          <a className="text-slate-300 hover:text-white text-sm font-medium transition-colors" href="#pricing">Planos</a>
          <a className="text-slate-300 hover:text-white text-sm font-medium transition-colors" href="#">Blog</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:flex text-slate-300 hover:text-white text-sm font-bold transition-colors">
            Login
          </button>
          <button className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-full h-10 px-5 bg-gradient-to-r from-primary to-[#1da851] hover:shadow-[0_0_20px_rgba(37,212,102,0.4)] text-[#020c1b] text-sm font-bold transition-all duration-300">
            <span>Testar no WhatsApp</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;