import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-950 font-['Rajdhani'] selection:bg-[#0cf2cd]/30 selection:text-[#0cf2cd] relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-[#0cf2cd]/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/5 bg-gray-950/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0cf2cd] to-[#25D366] tracking-tight">
            CONTROLE-C
          </Link>
          <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            Voltar para o início
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full p-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <span className="text-[#0cf2cd] text-xs font-bold tracking-widest uppercase bg-[#0cf2cd]/10 px-3 py-1 rounded-full mb-6 inline-block">Legal</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">Política de Privacidade</h1>
          <p className="text-slate-400 text-sm mb-10">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0cf2cd]" />
                1. Informações que Coletamos
              </h2>
              <p>
                Coletamos informações que você nos fornece diretamente ao usar nossos serviços, como nome, e-mail e dados de uso necessários para o funcionamento do Controle-C. Informações de calendário e integrações de terceiros são acessadas estritamente com o seu consentimento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#13eca4]" />
                2. Como Usamos as Informações
              </h2>
              <p>
                Utilizamos as informações coletadas para:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-400">
                <li>Fornecer, operar e manter os serviços do Controle-C.</li>
                <li>Melhorar, personalizar e expandir nossos serviços.</li>
                <li>Entender e analisar como você usa o Controle-C.</li>
                <li>Desenvolver novos produtos, serviços e funcionalidades.</li>
                <li>Comunicar-nos com você, seja diretamente ou por meio de parceiros, para atendimento ao cliente, atualizações e marketing (se consentido).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0cf2cd]" />
                3. Compartilhamento de Informações
              </h2>
              <p>
                Não comercializamos suas informações pessoais. Podemos compartilhar informações com fornecedores de serviços terceirizados que nos auxiliam na operação do aplicativo, desde que concordem em manter tais informações confidenciais de acordo com a LGPD e regulamentações pertinentes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#13eca4]" />
                4. Segurança dos Dados
              </h2>
              <p>
                Empregamos medidas de segurança técnicas e organizacionais adequadas para proteger suas informações pessoais contra perda, roubo, acesso não autorizado, divulgação, cópia, uso ou modificação. No acesso aos serviços de IA e integrações com o Google, os tokens são geridos com protocolos robustos e não são expostos indevidamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0cf2cd]" />
                5. Seus Direitos
              </h2>
              <p>
                Você tem o direito de solicitar acesso, correção ou exclusão de suas informações pessoais. Caso deseje exercer esses direitos ou tenha dúvidas sobre nossas práticas de privacidade, entre em contato através das nossas plataformas oficiais.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer minimalista */}
      <footer className="py-6 text-center text-slate-500 text-xs border-t border-white/5 bg-gray-950/50 mt-auto relative z-10">
        <p>&copy; {new Date().getFullYear()} Controle-C. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
