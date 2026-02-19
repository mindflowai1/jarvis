import React from 'react';

const SmartReminders: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center py-20">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#10b19c]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-[#1e3a8a]/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Visualization */}
          <div className="lg:col-span-7 relative order-2 lg:order-1">
            <div className="glass-panel rounded-2xl p-8 lg:p-12 relative min-h-[500px] flex flex-col items-center justify-center border border-white/5 bg-[#111827]/60">
              
              {/* Voice Note Input */}
              <div className="relative w-full max-w-sm mb-16 self-center animate-float">
                <div className="bg-[#1f2937] border border-slate-700 rounded-xl rounded-tr-none p-4 shadow-lg flex items-center gap-3">
                  <div className="size-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-300">person</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-[#2d3b4e] rounded-full flex items-center px-3 gap-1 overflow-hidden">
                       {[...Array(9)].map((_, i) => (
                         <div key={i} className={`w-1 bg-[#10b19c] rounded-full animate-pulse`} style={{ height: Math.random() * 12 + 8 + 'px', animationDuration: Math.random() + 0.5 + 's' }}></div>
                       ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Voice Note • 0:04</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 right-0 bg-[#10b19c] text-[#0B1120] text-xs font-medium px-3 py-1.5 rounded-lg rounded-tl-none shadow-md transform rotate-1">
                  "Lembra de pagar a escola..."
                </div>
                {/* Connecting Lines */}
                <div className="absolute left-1/2 bottom-[-40px] w-px h-[40px] bg-gradient-to-b from-[#10b19c]/50 to-transparent"></div>
              </div>

              {/* Central Processing Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_2px_#10b19c] z-20"></div>

              {/* Output Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg mt-4">
                
                {/* Reminder Widget */}
                <div className="relative group transform transition-all hover:-translate-y-1 duration-300">
                  <div className="absolute top-[-40px] right-[20%] w-px h-[40px] bg-gradient-to-t from-[#f59e0b]/50 to-transparent lg:block hidden"></div>
                  <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border-l-4 border-[#f59e0b] rounded-r-lg p-4 shadow-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded bg-[#f59e0b]/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#f59e0b] text-sm">notifications</span>
                        </div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Lembrete</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Agora</span>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">Pagar Escola</h4>
                    <p className="text-[#f59e0b] text-xs font-medium">Vence Hoje</p>
                  </div>
                </div>

                {/* List Widget */}
                <div className="relative group transform transition-all hover:-translate-y-1 duration-300 delay-100">
                  <div className="absolute top-[-40px] left-[20%] w-px h-[40px] bg-gradient-to-t from-[#10b19c]/50 to-transparent lg:block hidden"></div>
                  <div className="bg-[#1a1a1a]/90 backdrop-blur-sm rounded-lg border border-slate-800 p-4 shadow-xl">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                      <h4 className="text-white font-medium text-sm">Lista de Mercado</h4>
                      <span className="material-symbols-outlined text-slate-500 text-sm">list</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="size-4 rounded border border-[#10b19c] bg-[#10b19c] flex items-center justify-center text-[#0B1120]">
                          <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                        </div>
                        <span className="text-slate-500 text-sm line-through decoration-slate-600">Ração do cachorro</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer opacity-50">
                        <div className="size-4 rounded border border-slate-600 bg-transparent"></div>
                        <span className="text-slate-400 text-sm">Leite</span>
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-5 flex flex-col gap-8 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 w-fit">
                <span className="size-2 rounded-full bg-[#10b19c] animate-pulse"></span>
                <span className="text-xs font-medium text-[#10b19c] uppercase tracking-wider">Second Brain AI</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight font-display">
                Libere espaço na <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">sua mente.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed font-light">
                Não confie na sua memória para coisas pequenas. Deixe a IA transformar seus pensamentos soltos em ações organizadas.
              </p>
            </div>
            <div className="space-y-6 mt-4">
              {[
                {icon: 'notifications_active', title: 'Cobrança Amigável', desc: 'Receba lembretes gentis e inteligentes no momento certo, sem o estresse de notificações constantes.'},
                {icon: 'format_list_bulleted', title: 'Listas Dinâmicas', desc: 'Sua IA identifica itens em áudios e textos, organizando-os automaticamente em listas de tarefas ou compras.'},
                {icon: 'all_inclusive', title: 'Lembretes Recorrentes', desc: 'Configure pagamentos mensais ou hábitos diários com apenas um comando de voz simples.'}
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="shrink-0 size-12 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center group-hover:border-[#10b19c]/50 group-hover:bg-[#10b19c]/10 transition-colors duration-300">
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-[#10b19c] transition-colors">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-1 group-hover:text-[#10b19c] transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SmartReminders;