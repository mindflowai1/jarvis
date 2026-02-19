import React from 'react';

const Showcase: React.FC = () => {
  return (
    <div className="bg-[#020c1b] text-white font-display overflow-x-hidden antialiased flex items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-5xl glass-panel rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#2bd4bd]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2bd4bd]/10 border border-[#2bd4bd]/20 text-[#2bd4bd] text-[10px] font-bold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2bd4bd] shrink-0"></span>
            WhatsApp Assistant
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">
            Sua agenda no WhatsApp. <br className="hidden sm:block"/>
            <span className="text-[#2bd4bd]">Simples assim.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto font-light">
            Esqueça a navegação complexa. Gerencie seus compromissos apenas conversando.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          {/* Card 1 */}
          <div className="bg-[#0a192f]/50 border border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[220px] hover:border-[#2bd4bd]/20 hover:bg-[#0d2341]/60 hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-end mb-4">
              <div className="bg-[#005c4b] px-4 py-2.5 rounded-l-2xl rounded-br-2xl shadow-lg flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-[14px]">mic</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(6)].map((_, i) => <div key={i} className="waveform-bar"></div>)}
                </div>
                <span className="text-[9px] text-white/60">0:12</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-lg bg-[#25D366]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#25D366] text-[18px]">graphic_eq</span>
                </div>
                <h3 className="text-lg font-bold">Agendar por Áudio ou Texto</h3>
              </div>
              <p className="text-xs text-gray-400">Envie um áudio e nós criamos o evento na sua agenda instantaneamente.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0a192f]/50 border border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[220px] hover:border-[#2bd4bd]/20 hover:bg-[#0d2341]/60 hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-start mb-4">
              <div className="bg-[#2bd4bd]/10 border border-[#2bd4bd]/15 rounded-tr-none rounded-2xl p-3 w-full max-w-[240px]">
                <div className="bg-[#112240]/40 rounded-lg p-2 border border-white/5 flex items-center gap-3">
                  <div className="size-8 bg-white rounded flex items-center justify-center shrink-0">
                    <img alt="Google Meet" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkdqDGrvCaTvuMwy0VrP6Q4xJUSOD-oZ1w6dY0v7nh6SnvPXqd6dr2EVROnFllez-mIdHhYwSi0r9F23w_8qiPDezyDP_oGxLDUZpwTA9vQkSYHkLtt0hZxjoFekjLCv4MGQmJleBo1kWt3IMgUdgBCvLQduPkklTVRMeqt5FuUwPUcbIvN57zKJNv6ve1yQcHqWYR3BsfJMQ4_3n4eSu-_txnHnectRPS87fUh4ho3ebpFSRqwWmohbdw3WS04K7zDS8O2sQnxPc" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-semibold text-white truncate">Reunião de Alinhamento</p>
                    <p className="text-[9px] text-[#1da4f7] truncate">meet.google.com/abc-defg</p>
                  </div>
                </div>
                <div className="mt-1.5 text-[9px] text-gray-400">Link gerado e enviado. ✅</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-lg bg-[#1da4f7]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#1da4f7] text-[18px]">videocam</span>
                </div>
                <h3 className="text-lg font-bold">Links do Meet Automáticos</h3>
              </div>
              <p className="text-xs text-gray-400">Detectamos intenção de reunião e anexamos o link automaticamente.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0a192f]/50 border border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[220px] hover:border-[#2bd4bd]/20 hover:bg-[#0d2341]/60 hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-3 mb-4">
              <div className="flex justify-end">
                <div className="bg-white/10 rounded-l-xl rounded-tr-xl px-3 py-1.5 text-[11px] text-gray-200">
                  O que tenho pra hoje?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-[#2bd4bd]/10 border border-[#2bd4bd]/15 rounded-r-xl rounded-tl-xl p-2.5 w-full max-w-[200px]">
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-[10px] text-gray-300 border-l border-[#2bd4bd] pl-2">
                      <span className="font-mono text-[#2bd4bd]">14:00</span>
                      <span>Revisão Trimestral</span>
                    </li>
                    <li className="flex items-start gap-2 text-[10px] text-gray-300 border-l border-gray-600 pl-2">
                      <span className="font-mono text-gray-400">16:30</span>
                      <span>Call Investidores</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-lg bg-[#2bd4bd]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#2bd4bd] text-[18px]">calendar_month</span>
                </div>
                <h3 className="text-lg font-bold">Consulte sua Agenda</h3>
              </div>
              <p className="text-xs text-gray-400">Pergunte ao bot sobre seus horários livres ou compromissos do dia.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#0a192f]/50 border border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[220px] hover:border-[#2bd4bd]/20 hover:bg-[#0d2341]/60 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center h-full mb-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl w-full max-w-[220px]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="size-4 rounded-sm bg-black flex items-center justify-center">
                      <span className="material-symbols-outlined text-[10px] text-white">calendar_today</span>
                    </div>
                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-tighter">Calendar</span>
                  </div>
                  <span className="text-[8px] text-white/40">Agora</span>
                </div>
                <h4 className="text-[11px] font-bold text-white">Reunião em 10 min</h4>
                <p className="text-[9px] text-white/60">Prepare-se para o Daily Standup.</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-lg bg-[#f97316]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#f97316] text-[18px]">notifications_active</span>
                </div>
                <h3 className="text-lg font-bold">Avisos Antecipados</h3>
              </div>
              <p className="text-xs text-gray-400">Receba notificações inteligentes no WhatsApp antes de reuniões.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase;