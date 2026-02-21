import React from 'react';

// Navbar Component
const Navbar = () => {
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

// Hero Component
const Hero = () => {
  return (
    <div id="hero" className="relative min-h-screen flex items-center pt-32 pb-24 lg:pb-32 overflow-hidden bg-background-ocean">
      <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,212,102,0.15)_0%,_rgba(2,12,27,0)_70%)] blur-3xl opacity-50 pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="flex flex-col gap-8 items-start relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Novo: Integração com Google Calendar lançada 🚀
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-white text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight">
              Sua vida financeira organizada em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25d466] to-[#00d2ff]">um áudio.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              O assistente de IA que vive no seu WhatsApp. Envie uma mensagem de voz para registrar gastos, agendar pagamentos e visualizar gráficos. Sem apps complexos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="group flex items-center justify-center gap-3 h-14 px-8 rounded-full bg-primary hover:bg-primary-dark text-[#020c1b] text-base font-bold transition-all duration-300 shadow-[0_0_25px_rgba(37,212,102,0.25)] hover:shadow-[0_0_40px_rgba(37,212,102,0.4)]">
              <span className="material-symbols-outlined text-xl">chat</span>
              <span>Começar Agora — É Grátis</span>
            </button>
            <button className="flex items-center justify-center gap-2 h-14 px-8 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-white text-base font-bold transition-all duration-300">
              <span className="material-symbols-outlined text-xl">play_circle</span>
              <span>Ver Demo em Vídeo</span>
            </button>
          </div>
          <div className="flex flex-col gap-4 pt-4">
            <p className="text-slate-500 text-sm font-medium">Aprovado por +10.000 usuários de empresas como</p>
            <div className="flex flex-wrap items-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <div className="h-6 w-auto flex items-center text-white font-display font-bold text-lg">Google</div>
              <div className="w-px h-4 bg-slate-700"></div>
              <div className="h-6 w-auto flex items-center text-white font-display font-bold text-lg">Nubank</div>
              <div className="w-px h-4 bg-slate-700"></div>
              <div className="h-6 w-auto flex items-center text-white font-display font-bold text-lg">XP</div>
              <div className="w-px h-4 bg-slate-700"></div>
              <div className="h-6 w-auto flex items-center text-white font-display font-bold text-lg">Stone</div>
            </div>
          </div>
        </div>

        {/* Right Side - Phone Mockup */}
        <div className="relative flex justify-center lg:justify-end min-h-[680px] lg:h-[800px] items-center mt-12 lg:mt-0">
          
          {/* Main Scale Wrapper for Responsiveness */}
          <div className="relative scale-90 sm:scale-100 transition-transform duration-300">
            
            {/* Floating Widgets */}
            <div className="absolute top-10 left-0 lg:-left-8 z-20 animate-float glass-panel p-4 rounded-2xl flex items-center gap-4 max-w-[220px] shadow-2xl">
              <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Google Calendar</span>
                <span className="text-sm text-white font-bold">Fatura Sincronizada</span>
              </div>
            </div>

            <div className="absolute bottom-20 right-0 lg:-right-4 z-20 animate-float-delayed glass-panel p-4 rounded-2xl flex flex-col gap-2 shadow-2xl border border-primary/20">
              <div className="flex justify-between items-center gap-8">
                <span className="text-xs text-slate-400">Economia Mensal</span>
                <span className="text-xs text-primary font-bold flex items-center">
                  <span className="material-symbols-outlined text-sm">trending_up</span> +15%
                </span>
              </div>
              <div className="h-10 flex items-end gap-1">
                <div className="w-2 bg-primary/20 rounded-t-sm h-[40%]"></div>
                <div className="w-2 bg-primary/20 rounded-t-sm h-[60%]"></div>
                <div className="w-2 bg-primary/20 rounded-t-sm h-[50%]"></div>
                <div className="w-2 bg-primary/20 rounded-t-sm h-[70%]"></div>
                <div className="w-2 bg-primary rounded-t-sm h-[85%] shadow-[0_0_10px_rgba(37,212,102,0.5)]"></div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="absolute -inset-6 bg-gradient-to-tr from-[#25D366] to-[#00d2ff] rounded-[3.5rem] blur-2xl opacity-50 animate-pulse-glow"></div>
              <div className="absolute -inset-2 bg-[#25D366] rounded-[3.5rem] blur-xl opacity-60 animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
              <div className="relative w-[300px] sm:w-[340px] h-[640px] bg-[#121212] rounded-[3rem] border-[8px] border-[#2d2d2d] shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-8 bg-[#121212] z-30 flex justify-center">
                  <div className="w-24 h-6 bg-black rounded-b-xl"></div>
                </div>
                <div className="bg-[#202c33] px-4 pt-12 pb-3 flex items-center gap-3 border-b border-[#2a3942]">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    <span className="material-symbols-outlined text-xl">smart_toy</span>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-white text-sm font-semibold">Controle-C 🤖</span>
                    <span className="text-[#8696a0] text-xs">online</span>
                  </div>
                  <div className="flex gap-4 text-primary">
                    <span className="material-symbols-outlined">videocam</span>
                    <span className="material-symbols-outlined">call</span>
                  </div>
                </div>
                
                <div className="bg-[#0b141a] h-full p-4 flex flex-col gap-4 overflow-hidden relative">
                  {/* WhatsApp BG Image */}
                  <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8U34eklfWkRgSoCuFKrV5nKCbsHvzzt2iXyH7n6y5R18TMmDnMbZaUP3w9wEJNnwxLNCT_WzfKEVJof2rOE1_GbDMp1U1tVnbhy5wFHCsIBaq1JLE8VL5ZBsJNlXTBDwV4yBiR2AGq02J5GxCarVcD1lJA1SDFAe5cwnOugBL73S5e6ojsNomsho-WIA1ETPqCOKDXfpJYl17jUI2MTb3S_WdUBA6dih5Z3MGEYkhCfzn8gy5z4RcJGXBbRRkrhwZLEu1Ym7Y48g')" }}></div>
                  <div className="absolute inset-0 bg-[#0b141a]/95 z-0"></div> 

                  <div className="relative z-10 flex justify-center mb-2">
                    <span className="bg-[#182229] text-[#8696a0] text-[10px] px-3 py-1 rounded-lg shadow-sm">Hoje</span>
                  </div>

                  {/* User Message */}
                  <div className="relative z-10 self-end max-w-[85%] bg-[#005c4b] rounded-lg rounded-tr-none p-2 shadow-sm">
                    <div className="flex items-center gap-3 pr-2">
                      <div className="text-[#aebac1]">
                        <span className="material-symbols-outlined text-3xl">account_circle</span>
                      </div>
                      <div className="flex flex-col w-full min-w-[140px]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-slate-300 text-lg">play_arrow</span>
                          <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden flex items-center gap-0.5 px-0.5">
                            <div className="w-[2px] h-[60%] bg-white/80 rounded-full"></div>
                            <div className="w-[2px] h-[100%] bg-white/80 rounded-full"></div>
                            <div className="w-[2px] h-[40%] bg-white/80 rounded-full"></div>
                            <div className="w-[2px] h-[70%] bg-white/80 rounded-full"></div>
                            <div className="w-[2px] h-[50%] bg-white/80 rounded-full"></div>
                            <div className="w-[2px] h-[30%] bg-white/80 rounded-full"></div>
                            <div className="w-[2px] h-[80%] bg-white/80 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-[#aebac1] text-[10px]">0:12</span>
                          <div className="flex items-end gap-1">
                            <span className="text-[#aebac1] text-[10px]">10:42</span>
                            <span className="material-symbols-outlined text-[#53bdeb] text-[14px]">done_all</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bot Message */}
                  <div className="relative z-10 self-start max-w-[85%] bg-[#202c33] rounded-lg rounded-tl-none p-3 shadow-sm">
                    <div className="flex flex-col gap-2">
                      <p className="text-white text-sm">Entendido! Registrei o gasto:</p>
                      <div className="bg-[#182229] rounded p-2 border-l-4 border-primary">
                        <p className="text-white font-bold text-sm">Almoço de Negócios</p>
                        <p className="text-primary font-bold">R$ 120,00</p>
                        <p className="text-[#8696a0] text-xs">Categoria: Alimentação</p>
                      </div>
                      <p className="text-white text-sm">Também adicionei ao seu Google Calendar para o reembolso. ✅</p>
                      <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[#8696a0] text-[10px]">10:42</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Message */}
                  <div className="relative z-10 self-start max-w-[85%] bg-[#202c33] rounded-lg rounded-tl-none p-1 shadow-sm mt-1">
                    <div className="bg-[#111b21] rounded p-3">
                      <p className="text-[#8696a0] text-xs mb-2 uppercase tracking-wide font-bold">Gastos da Semana</p>
                      <div className="flex items-end justify-between h-16 gap-1 px-1">
                        <div className="w-full bg-[#2a3942] rounded-t-sm h-[30%]"></div>
                        <div className="w-full bg-[#2a3942] rounded-t-sm h-[50%]"></div>
                        <div className="w-full bg-[#2a3942] rounded-t-sm h-[40%]"></div>
                        <div className="w-full bg-[#2a3942] rounded-t-sm h-[80%]"></div>
                        <div className="w-full bg-[#2a3942] rounded-t-sm h-[45%]"></div>
                        <div className="w-full bg-[#2a3942] rounded-t-sm h-[60%]"></div>
                        <div className="w-full bg-primary rounded-t-sm h-[90%]"></div>
                      </div>
                      <div className="flex justify-between text-[#8696a0] text-[9px] mt-1 px-1 font-mono">
                        <span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span><span>D</span>
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-1 p-2 pb-1">
                      <span className="text-[#8696a0] text-[10px]">10:43</span>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="absolute bottom-16 left-0 w-full p-2 flex gap-2 items-center z-20">
                    <div className="bg-[#202c33] flex-1 h-10 rounded-full flex items-center px-4 gap-3">
                      <span className="material-symbols-outlined text-[#8696a0] text-xl">sentiment_satisfied</span>
                      <span className="text-[#8696a0] text-sm">Mensagem</span>
                      <div className="flex-1"></div>
                      <span className="material-symbols-outlined text-[#8696a0] text-xl">attach_file</span>
                      <span className="material-symbols-outlined text-[#8696a0] text-xl">camera_alt</span>
                    </div>
                    <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                      <span className="material-symbols-outlined text-xl">mic</span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 w-full flex justify-center z-20">
                    <div className="w-32 h-1 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features Component
const Features = () => {
  return (
    <div id="features" className="relative w-full min-h-screen flex items-center justify-center py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#0f172a] to-[#022c22] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#19e664]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#19e664]/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10 items-center">
        {/* Left Column: Copy */}
        <div className="lg:col-span-5 flex flex-col gap-8 order-2 lg:order-1">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.1] tracking-tight font-display">
              Você <span className="relative inline-block text-white">
                manda
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#19e664]" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4"></path>
                </svg>
              </span> no seu dinheiro. <br className="hidden md:block"/>Não o contrário.
            </h2>
            <div className="space-y-4 text-lg text-slate-400 font-light leading-relaxed font-display">
              <p>
                A gestão manual é o caos silencioso que drena sua riqueza mês após mês. Você perde horas tentando entender para onde o dinheiro foi, enquanto as oportunidades de investimento passam.
              </p>
              <p>
                O Controle-C elimina a adivinhação. Nossa IA transforma recibos físicos em inteligência financeira instantânea, permitindo que você assuma o comando de cada centavo sem levantar um dedo.
              </p>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-6 pt-4">
            {[
              { icon: 'document_scanner', title: 'Leitura de Notas Fiscais', desc: 'Digitalize instantaneamente qualquer comprovante via câmera com precisão de 99%.' },
              { icon: 'pie_chart', title: 'Categorização Inteligente', desc: 'A IA identifica o estabelecimento e classifica seus gastos automaticamente em segundos.' },
              { icon: 'notifications_active', title: 'Alertas de Orçamento', desc: 'Receba notificações proativas no WhatsApp antes de estourar seus limites mensais.' }
            ].map((feature, idx) => (
              <div key={idx} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#19e664]/10 flex items-center justify-center text-[#19e664] group-hover:bg-[#19e664] group-hover:text-[#022c22] transition-colors">
                  <span className="material-symbols-outlined text-[24px]">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-1 font-display">{feature.title}</h3>
                  <p className="text-sm text-slate-400 font-display">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button className="group inline-flex items-center gap-3 text-[#19e664] font-bold text-lg hover:text-white transition-colors">
              Ver automação em ação
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              <div className="h-[2px] w-0 bg-[#19e664] absolute bottom-0 left-0 transition-all duration-300 group-hover:w-full"></div>
            </button>
          </div>
        </div>

        {/* Right Column: Visual */}
        <div className="lg:col-span-7 h-full min-h-[500px] relative order-1 lg:order-2 flex items-center">
          <div className="relative w-full h-[500px] glass-panel rounded-2xl overflow-hidden p-8 flex items-center justify-center bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)]">
            <div className="grid grid-cols-2 w-full h-full gap-8 relative z-10">
              
              {/* Receipt Visual */}
              <div className="relative h-full flex items-center justify-center">
                <div className="relative w-48 h-72 bg-white rotate-[-6deg] shadow-2xl overflow-hidden rounded-sm mx-auto">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/crumpled-paper.png')] opacity-20 z-10 mix-blend-multiply pointer-events-none"></div>
                  <div className="p-4 flex flex-col items-center text-gray-800 text-[10px] font-mono leading-tight h-full">
                    <div className="font-bold text-sm mb-2">STARBUCKS COFFEE</div>
                    <div className="mb-4 text-center">Rua Fictícia, 123<br/>São Paulo, SP</div>
                    <div className="w-full border-b border-dashed border-gray-400 mb-2"></div>
                    <div className="w-full flex justify-between"><span>1 Cappuccino</span><span>R$ 14,00</span></div>
                    <div className="w-full flex justify-between mb-2"><span>1 Cookie</span><span>R$ 4,50</span></div>
                    <div className="w-full border-b border-dashed border-gray-400 mb-2"></div>
                    <div className="w-full flex justify-between font-bold text-xs"><span>TOTAL</span><span>R$ 18,50</span></div>
                    <div className="mt-auto text-center opacity-60">Obrigado pela preferência!</div>
                    <div className="mt-2 h-8 w-full bg-gray-800" style={{ background: 'repeating-linear-gradient(90deg, #000 0, #000 2px, #fff 2px, #fff 4px)' }}></div>
                  </div>
                  <div className="absolute w-full h-1 bg-[#19e664] blur-[2px] z-20 animate-scan left-0"></div>
                </div>
              </div>

              {/* Connection Lines */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                  <path d="M180 200 C 250 200, 250 200, 320 200" fill="none" stroke="#19e664" strokeOpacity="0.3" strokeWidth="2"></path>
                  <path className="animate-[dash_1s_linear_infinite]" strokeDasharray="10" d="M180 200 C 250 200, 250 200, 320 200" stroke="#19e664" strokeDashoffset="20" strokeWidth="2"></path>
                </svg>
              </div>

              {/* UI Card Result */}
              <div className="relative h-full flex items-center justify-center">
                <div className="animate-float relative w-64 bg-[#1a3223] border border-[#346546] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center border border-green-800 overflow-hidden">
                      <img alt="Starbucks" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpAGFQJvpXw4H-EGpH83WRiwHvokBEpuKSh771Nlxf5BMbFmzunziWTzIa3yy9l0jaXqvPcrfJPyda_dFMd8dEtRwxhmpWTcXvENAaHWPiNUKRIDvA6NGbg0qs2vQL3-MjYvvTFhkhSn9Qbd73WXHsozFbgwf6yIS-OQvd1ZBjLtCH6HlWWBiySPUeh9bU4nVONkvp4RThY5x3BOoisKHdrmHLZnXM0ogYkTI5m7LcDlQh4vwd87LwtBKlyf3PHPPdA5tuSB-69g0" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-bold">Starbucks Coffee</h4>
                      <p className="text-xs text-slate-400">Há 2 minutos</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-xs text-[#93c8a6] uppercase tracking-wider font-semibold">Valor Total</span>
                    <div className="text-2xl text-white font-bold">R$ 18,50</div>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-[#19e664]/20 text-[#19e664] rounded-full text-xs font-bold border border-[#19e664]/30 flex items-center gap-1">
                      ☕ Alimentação
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Orçamento Diário</span>
                      <span className="text-white font-bold">45%</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#19e664] h-full rounded-full w-[45%] shadow-[0_0_10px_rgba(25,230,100,0.5)]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Grid BG */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Showcase Component
const Showcase = () => {
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

// SmartReminders Component
const SmartReminders = () => {
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

// Dashboard Component
const Dashboard = () => {
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

// Pricing Component
const Pricing = () => {
  return (
    <div id="pricing" className="bg-[#0a192f] text-[#ccd6f6] font-body relative flex flex-col items-center">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#13eca4]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <section className="w-full max-w-7xl px-4 py-20 md:py-32 flex flex-col items-center relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Investimento <span className="text-[#13eca4]">Transparente</span></h2>
          <p className="text-[#8892b0] text-lg max-w-2xl mx-auto">Escolha o plano ideal para organizar suas finanças pessoais sem complicações.</p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center mb-12 relative">
          <div className="bg-[#112240]/40 backdrop-blur border border-white/5 p-1 rounded-full flex relative z-10">
            <button className="px-6 py-2 rounded-full text-sm font-medium transition-all text-[#8892b0]">Mensal</button>
            <button className="px-6 py-2 rounded-full text-sm font-medium transition-all bg-[#13eca4] text-[#0a192f] shadow-lg relative">
              Anual
              <span className="absolute -top-3 -right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-[10px] font-bold text-black px-2 py-0.5 rounded-full shadow-lg transform rotate-12 animate-pulse border border-yellow-200">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          {/* Starter */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-transparent p-8 hover:border-white/20 transition-colors duration-300">
            <div className="mb-6">
              <h3 className="font-display text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-[#8892b0] text-sm mb-6">Para quem está começando a organizar.</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-white">R$ 0</span>
                <span className="text-[#8892b0]">/mês</span>
              </div>
            </div>
            <div className="flex-grow flex flex-col gap-4 mb-8">
              {['5 transcrições de áudio/mês', 'Exportação básica (CSV)', 'Suporte por e-mail'].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[#ccd6f6]">
                  <span className="material-symbols-outlined text-[#13eca4] text-[20px]">check_circle</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-lg border border-white/20 text-white font-display font-bold hover:bg-white/5 transition-colors">
              Começar Grátis
            </button>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border border-[#13eca4]/50 bg-[#112240] p-8 shadow-[0_0_20px_rgba(19,236,164,0.15)] transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#13eca4] text-[#0a192f] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Recomendado
            </div>
            <div className="mb-6">
              <h3 className="font-display text-xl font-bold text-white mb-2 flex items-center gap-2">
                Pro <span className="material-symbols-outlined text-[#13eca4] text-xl">verified</span>
              </h3>
              <p className="text-[#8892b0] text-sm mb-6">Controle total e inteligência avançada.</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold text-white">R$ 29,90</span>
                <span className="text-[#8892b0]">/mês</span>
              </div>
              <p className="text-xs text-[#13eca4] mt-2 font-medium">Cobrado R$ 358,80 anualmente</p>
            </div>
            <div className="flex-grow flex flex-col gap-4 mb-8">
               {['Mensagens e Áudios Ilimitados', 'Dashboard Web Completo', 'Categorização automática com IA', 'Prioridade no suporte'].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm font-medium text-white">
                  <span className="material-symbols-outlined text-[#13eca4] text-[20px]">check_circle</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-lg bg-[#13eca4] hover:bg-[#0fb880] text-[#0a192f] font-display font-bold shadow-lg shadow-[#13eca4]/20 transition-all transform hover:scale-[1.02]">
              Assinar Pro
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-3xl px-6 pb-24 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Perguntas Frequentes</h2>
        </div>
        <div className="flex flex-col gap-4">
          {[
            {q: 'Meus dados e áudios estão seguros?', a: 'Sim, utilizamos criptografia de ponta a ponta. Seus áudios são processados apenas para extração de dados e não são armazenados permanentemente.'},
            {q: 'Qual o limite de tamanho dos áudios?', a: 'No plano Pro, suportamos áudios de até 15 minutos de duração contínua.'},
            {q: 'A IA entende gírias e sotaques?', a: 'Nossa IA é treinada especificamente com dados em português brasileiro, reconhecendo a maioria dos sotaques regionais e gírias comuns.'},
            {q: 'Como funciona o cancelamento?', a: 'O cancelamento é simples e pode ser feito a qualquer momento diretamente no seu painel de controle.'}
          ].map((faq, i) => (
            <details key={i} className="group bg-[#112240]/70 backdrop-blur border border-white/5 rounded-xl overflow-hidden transition-all duration-300 open:bg-[#112240]">
              <summary className="flex cursor-pointer items-center justify-between p-6 text-white hover:text-[#13eca4] transition-colors">
                <h3 className="text-base font-semibold pr-4">{faq.q}</h3>
                <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180 text-[#13eca4]">expand_more</span>
              </summary>
              <div className="px-6 pb-6 text-[#8892b0] text-sm leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full px-4 pb-20 relative z-10">
        <div className="w-full max-w-6xl mx-auto rounded-3xl overflow-hidden relative border border-[#13eca4]/20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-[#0f2e2a] to-[#0a192f] z-0"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-16 md:px-16 gap-8 text-center md:text-left">
            <div className="flex flex-col gap-4 max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">Pare de perder tempo com planilhas hoje.</h2>
              <p className="text-[#8892b0] text-lg">Junte-se a milhares de brasileiros que organizam suas finanças apenas falando.</p>
            </div>
            <div className="flex-shrink-0">
              <button className="px-8 py-4 bg-[#13eca4] hover:bg-[#0fb880] text-[#0a192f] font-display font-bold rounded-xl shadow-[0_0_20px_rgba(19,236,164,0.4)] transition-all transform hover:-translate-y-1 text-lg flex items-center gap-2">
                Começar Teste Grátis
                <span className="material-symbols-outlined font-bold">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#050e1b] pt-16 pb-8 px-6 text-[#8892b0] font-body">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white font-display font-bold text-2xl tracking-tight">
              <span className="material-symbols-outlined text-primary text-3xl">mic</span>
              Controle-C
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Organizando o Brasil, um áudio por vez. A revolução financeira que cabe no seu bolso e entende sua voz.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold font-display uppercase tracking-wider text-sm">Produto</h4>
            <a href="#" className="hover:text-white transition-colors text-sm">Funcionalidades</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Integrações</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Preços</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold font-display uppercase tracking-wider text-sm">Legal</h4>
            <a href="#" className="hover:text-white transition-colors text-sm">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Segurança</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold font-display uppercase tracking-wider text-sm">Suporte</h4>
            <a href="#" className="hover:text-white transition-colors text-sm">Central de Ajuda</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Comunidade</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Status</a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">© 2024 Controle-C Tecnologia Ltda. Todos os direitos reservados.</p>
          <p className="text-xs flex items-center gap-1">Feito com <span className="text-primary">💚</span> e 🤖 no Brasil.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Tests Page Component
const Tests = () => {
  return (
    <div className="min-h-screen bg-background-ocean text-white font-body selection:bg-primary selection:text-background-ocean overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <SmartReminders />
        <Dashboard />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Tests;
