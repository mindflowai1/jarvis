import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-950 font-['Rajdhani'] selection:bg-[#0cf2cd]/30 selection:text-[#0cf2cd] relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-[#13eca4]/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/5 bg-gray-950/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0cf2cd] to-[#25D366] tracking-tight">
            JARVIS
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
          <span className="text-[#13eca4] text-xs font-bold tracking-widest uppercase bg-[#13eca4]/10 px-3 py-1 rounded-full mb-6 inline-block">Legal</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">Termos de Serviço</h1>
          <p className="text-slate-400 text-sm mb-10">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#13eca4]" />
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar e utilizar os serviços do Jarvis, você atesta que leu, compreendeu e concordou em se vincular a estes Termos de Serviço. Se você não concorda com qualquer parte destes termos, você não deve usar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0cf2cd]" />
                2. Descrição dos Serviços
              </h2>
              <p>
                O Jarvis é um assistente pessoal inteligente integrado a inteligência artificial, projetado para auxiliar na produtividade, gerenciamento de dados e interações. O serviço está sujeito a alterações, atualizações e melhorias contínuas sem aviso prévio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#13eca4]" />
                3. Uso Aceitável
              </h2>
              <p>
                Você se compromete a utilizar os serviços do Jarvis para finalidades legais e íntegras. É expressamente proibido:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-400">
                <li>Violar qualquer lei ou regulamento local, estadual, nacional ou internacional.</li>
                <li>Transmitir ou carregar material malicioso, vírus ou qualquer código destrutivo.</li>
                <li>Tentar obter acesso não autorizado aos nossos sistemas internos.</li>
                <li>Usar o serviço de maneira que sobrecarregue ou prejudique nossa infraestrutura.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0cf2cd]" />
                4. Propriedade Intelectual
              </h2>
              <p>
                Todos os direitos, títulos e interesses do Jarvis e de todos os componentes associados são de propriedade exclusiva dos seus criadores. Você não tem permissão para copiar, modificar, distribuir, vender ou alugar qualquer parte dos nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#13eca4]" />
                5. Limitação de Responsabilidade
              </h2>
              <p>
                O Jarvis é fornecido "no estado em que se encontra" e "conforme disponível". Não garantimos que o serviço será contínuo, seguro ou livre de erros. Em nenhuma circunstância o Jarvis ou seus desenvolvedores serão responsáveis por quaisquer danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso ou da incapacidade de usar o serviço.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0cf2cd]" />
                6. Modificações dos Termos
              </h2>
              <p>
                Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. É sua responsabilidade revisar periodicamente esta página para verificar as alterações. O uso continuado do serviço após qualquer alteração constitui a aceitação dos novos Termos.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer minimalista */}
      <footer className="py-6 text-center text-slate-500 text-xs border-t border-white/5 bg-gray-950/50 mt-auto relative z-10">
        <p>&copy; {new Date().getFullYear()} Jarvis. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default TermsOfService;
