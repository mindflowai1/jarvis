import React from 'react';

const Pricing: React.FC = () => {
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

export default Pricing;