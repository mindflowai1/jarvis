import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 overflow-hidden bg-[#0f172a]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[#10b19c]/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight font-display">
          O panorama completo <br/><span className="text-[#10b19c]">da sua vida.</span>
        </h2>
        <p className="text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
          Enquanto o WhatsApp é para a agilidade do dia a dia, o Dashboard é para sua visão estratégica de longo prazo.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4 md:px-8">
        {/* Floating Badges */}
        <div className="absolute -top-12 left-0 md:left-10 lg:-left-4 z-20 animate-float hidden md:flex items-center gap-3 px-4 py-2 rounded-full glass-panel shadow-lg">
          <span className="material-symbols-outlined text-[#10b19c]">sync</span>
          <span className="text-white text-sm font-medium">Sync em Tempo Real</span>
        </div>
        <div className="absolute -top-8 right-0 md:right-10 lg:-right-8 z-20 animate-float-delayed hidden md:flex items-center gap-3 px-4 py-2 rounded-full glass-panel shadow-lg">
          <span className="material-symbols-outlined text-[#10b19c]">download</span>
          <span className="text-white text-sm font-medium">Exportação PDF/Excel</span>
        </div>

        {/* Laptop Frame */}
        <div className="relative mx-auto bg-[#0f172a] rounded-t-[1.5rem] p-1 pt-3 shadow-2xl ring-1 ring-white/10 w-full max-w-[1024px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-32 bg-black rounded-b-lg z-30"></div>
          
          <div className="bg-[#1e293b] aspect-[16/10] w-full rounded-lg overflow-hidden relative border border-white/5">
            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f172a]/50 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center gap-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
                  <span className="text-white cursor-pointer">Visão Geral</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Transações</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Orçamento</span>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                 <div className="h-8 w-8 rounded-full bg-[#10b19c]/20 flex items-center justify-center text-[#10b19c]">
                   <span className="material-symbols-outlined text-sm">notifications</span>
                 </div>
                 <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-white/10">
                   <img alt="Avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY-TFYW0E0U92bK7AmR3HrMp2JAOpIVHTXelauazfr-pJ8cQXGjqMwxTwIosQpPUadYM_Pz6u_wm2sBUFvgN9QrKNpNN2lqLlx0WDsjxdTIKpNzUZKEjMeoSfKdGSE0eYxz_5EGWgjQcA7QCoCYrxtvE0kkhvEqp7_Tbb_wCZGESTzwN9IHbceFSpldmtSC8Ne98GC40P4PiMKR8ub4cudttS4ZcW4RlBhU4MUuf2WhMbrviLb6ZSc6YICl9Y8T78q3OXLTuJVsjU" />
                 </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 h-[calc(100%-3.5rem)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                
                {/* Main Chart */}
                <div className="md:col-span-8 bg-[#151e2d] rounded-xl border border-white/5 p-6 flex flex-col justify-between shadow-sm">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-slate-400 text-sm font-medium">Fluxo de Caixa</p>
                       <h3 className="text-white text-3xl font-bold mt-1">R$ 12.450,00</h3>
                       <div className="flex items-center gap-2 mt-2">
                         <span className="text-[#10b19c] text-sm font-medium flex items-center bg-[#10b19c]/10 px-2 py-0.5 rounded">
                           <span className="material-symbols-outlined text-sm mr-1">trending_up</span>+15%
                         </span>
                         <span className="text-slate-500 text-xs">vs. mês anterior</span>
                       </div>
                     </div>
                   </div>
                   <div className="relative h-48 w-full mt-auto">
                     <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                       <defs>
                         <linearGradient id="gradientIncome" x1="0" x2="0" y1="0" y2="1">
                           <stop offset="0%" stopColor="#10b19c" stopOpacity="0.3"></stop>
                           <stop offset="100%" stopColor="#10b19c" stopOpacity="0"></stop>
                         </linearGradient>
                       </defs>
                       <path d="M0,35 Q10,32 20,25 T40,15 T60,18 T80,10 T100,5 V40 H0 Z" fill="url(#gradientIncome)"></path>
                       <path d="M0,35 Q10,32 20,25 T40,15 T60,18 T80,10 T100,5" fill="none" stroke="#10b19c" strokeLinecap="round" strokeWidth="0.8"></path>
                       <path d="M0,38 Q15,36 30,30 T50,32 T70,28 T90,34 T100,30" fill="none" stroke="#ef4444" strokeDasharray="1,1" strokeLinecap="round" strokeWidth="0.8"></path>
                     </svg>
                   </div>
                </div>

                {/* Right Panel */}
                <div className="md:col-span-4 bg-[#151e2d] rounded-xl border border-white/5 p-6 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#10b19c] text-xl">calendar_month</span> Agenda
                    </h4>
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">Hoje</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="relative pl-4 border-l-2 border-[#10b19c]/50 py-1">
                      <p className="text-white text-sm font-medium">Reunião de Orçamento</p>
                      <p className="text-slate-500 text-xs mt-0.5">14:00 - 15:00 • Google Meet</p>
                      <button className="mt-2 w-full py-1.5 bg-[#10b19c]/10 text-[#10b19c] text-xs font-semibold rounded hover:bg-[#10b19c] hover:text-white transition-all">Join Meet</button>
                    </div>
                    <div className="relative pl-4 border-l-2 border-slate-700 py-1 opacity-70">
                      <p className="text-white text-sm font-medium">Call com Contador</p>
                      <p className="text-slate-500 text-xs mt-0.5">16:30 - 17:00 • Zoom</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="md:col-span-4 bg-[#151e2d] rounded-xl border border-white/5 p-6 flex items-center gap-4">
                  <div className="relative size-20 shrink-0">
                    <svg className="size-full" viewBox="0 0 36 36">
                      <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                      <path className="text-[#10b19c]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="65, 100" strokeWidth="3"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-white text-sm font-bold">65%</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Meta Principal</p>
                    <h4 className="text-white text-sm font-bold mt-1">Economia para Viagem</h4>
                    <p className="text-slate-500 text-xs mt-1">R$ 6.500 / R$ 10k</p>
                  </div>
                </div>

                 <div className="md:col-span-8 bg-[#151e2d] rounded-xl border border-white/5 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-white font-medium text-sm">Últimas Transações</h4>
                      <a className="text-[#10b19c] text-xs hover:underline" href="#">Ver todas</a>
                    </div>
                    <div className="flex flex-col gap-3">
                       <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                         <div className="flex items-center gap-3">
                           <div className="bg-slate-800 p-2 rounded-lg text-white"><span className="material-symbols-outlined text-[20px]">directions_car</span></div>
                           <div className="flex flex-col"><span className="text-white text-sm font-medium">Uber</span><span className="text-slate-500 text-xs">Transporte • Hoje, 08:30</span></div>
                         </div>
                         <span className="text-white text-sm font-medium">- R$ 24,90</span>
                       </div>
                       <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                         <div className="flex items-center gap-3">
                           <div className="bg-slate-800 p-2 rounded-lg text-white"><span className="material-symbols-outlined text-[20px]">restaurant</span></div>
                           <div className="flex flex-col"><span className="text-white text-sm font-medium">iFood</span><span className="text-slate-500 text-xs">Alimentação • Ontem, 20:15</span></div>
                         </div>
                         <span className="text-white text-sm font-medium">- R$ 48,50</span>
                       </div>
                    </div>
                 </div>

              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-3 md:h-4 bg-[#1e293b] rounded-b-[1.5rem] shadow-inner"></div>
        </div>
        <div className="relative mx-auto w-[110%] md:w-[120%] h-3 md:h-4 bg-[#cbd5e1] rounded-b-xl md:rounded-b-2xl shadow-xl z-20 mt-[-2px] flex justify-center items-start overflow-hidden">
          <div className="w-20 md:w-32 h-2 bg-[#94a3b8] rounded-b-lg"></div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;