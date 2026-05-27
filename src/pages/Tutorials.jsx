import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Sparkles, BookOpen, HelpCircle, ExternalLink } from 'lucide-react';

const TUTORIALS_DATA = [
  {
    id: 1,
    step: "01",
    title: "Seja bem-vindo ao Controle-C",
    description: "Comece por aqui! Damos as boas-vindas à plataforma e apresentamos os primeiros passos essenciais para o seu sucesso.",
    videoUrl: "https://player-vz-19ec53c2-073.tv.pandavideo.com.br/embed/?v=daa072dc-6967-437c-a845-bc958eece88f",
    duration: "1:35",
    badge: "Essencial"
  },
  {
    id: 2,
    step: "02",
    title: "Visão Geral do Dashboard",
    description: "Uma tour completa pelas ferramentas, painel de controle e funcionalidades principais da plataforma.",
    videoUrl: "https://player-vz-19ec53c2-073.tv.pandavideo.com.br/embed/?v=4efbb826-2b49-45f8-9ee4-08c63e8a49e3",
    duration: "3:20",
    badge: "Visão Geral"
  },
  {
    id: 3,
    step: "03",
    title: "Agenda & Sincronização Inteligente",
    description: "Aprenda a conectar e automatizar seu Google Calendar com o assistente virtual de IA.",
    videoUrl: "https://player-vz-19ec53c2-073.tv.pandavideo.com.br/embed/?v=1f8cc6a3-822a-4b5c-ae93-e0680a9927c5",
    duration: "2:45",
    badge: "Agenda"
  },
  {
    id: 4,
    step: "04",
    title: "Controle Financeiro Descomplicado",
    description: "Configure seus limites de gastos, despesas diárias, receitas e gráficos analíticos.",
    videoUrl: "https://player-vz-19ec53c2-073.tv.pandavideo.com.br/embed/?v=82703f1e-7f87-4104-a795-d5738c24c142",
    duration: "4:12",
    badge: "Financeiro"
  },
  {
    id: 5,
    step: "05",
    title: "Gerenciamento Avançado de Tarefas",
    description: "Crie quadros de metas e use a inteligência artificial para otimizar suas listas de afazeres diários.",
    videoUrl: "https://player-vz-19ec53c2-073.tv.pandavideo.com.br/embed/?v=21d9a03a-305e-4925-aaa1-bd74aab719f8",
    duration: "3:58",
    badge: "Tarefas"
  },
  {
    id: 6,
    step: "06",
    title: "Consistência e Monitoramento de Hábitos",
    description: "Descubra como estruturar sua rotina de hábitos saudáveis e monitorar sua evolução semanal.",
    videoUrl: "https://player-vz-19ec53c2-073.tv.pandavideo.com.br/embed/?v=f6f04e39-7a24-41ae-8b05-49bbc17d10aa",
    duration: "3:10",
    badge: "Hábitos"
  }
];

const Tutorials = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] font-['Plus_Jakarta_Sans'] text-slate-100 selection:bg-[#0cf2cd]/30 selection:text-[#0cf2cd] relative overflow-hidden flex flex-col">
      
      {/* Luzes de fundo dinâmicas (Liquid Glow) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-[#0cf2cd]/5 rounded-full blur-[140px] pointer-events-none animate-liquid-fast-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[55%] bg-[#25d366]/5 rounded-full blur-[140px] pointer-events-none animate-liquid-fast-2" />
      <div className="absolute top-[30%] left-[40%] w-[35%] h-[45%] bg-[#8b5cf6]/5 rounded-full blur-[120px] pointer-events-none animate-liquid-fast-3" />

      {/* Grid de linhas tecnológicas sutis de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header Premium */}
      <header className="relative z-10 p-6 border-b border-white/5 bg-[#090e1a]/60 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src="/logo-controle-c.png" alt="Controle-C Logo" className="h-12 sm:h-14 w-auto object-contain" style={{ filter: 'drop-shadow(0 0 15px rgba(12, 242, 205, 0.4))' }} />
            </Link>
            <span className="h-8 w-[1px] bg-white/10 hidden sm:inline-block" />
            <span className="text-xs text-slate-400 font-medium tracking-wider uppercase bg-white/5 px-2.5 py-1 rounded hidden sm:inline-block">
              Central de Aprendizado
            </span>
          </div>

          <button 
            onClick={() => navigate('/?tab=settings')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-200 text-sm font-semibold group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Voltar para Ajustes
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-6 py-12">
        
        {/* Banner de Boas-vindas */}
        <div className="mb-16 text-center sm:text-left relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#0cf2cd]/10 to-[#25d366]/10 border border-[#0cf2cd]/20 text-[#0cf2cd] text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Tutoriais em Vídeo
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4 font-['Space_Grotesk']"
          >
            Como dominar o <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0cf2cd] via-[#13eca4] to-[#25d366]">Controle-C</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed font-light"
          >
            Preparamos um guia completo em vídeo focado no seu sucesso. Aprenda a configurar integrações, gerenciar tarefas automáticas com Inteligência Artificial e organizar suas finanças com poucos cliques.
          </motion.p>
        </div>

        {/* Grade de Tutoriais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TUTORIALS_DATA.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-[#090e1a]/40 backdrop-blur-xl border border-white/5 hover:border-[#0cf2cd]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(12,242,205,0.08)] hover:-translate-y-1.5"
            >
              {/* Container de Vídeo Iframe (16:9) */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden border-b border-white/5">
                <iframe
                  className="absolute inset-0 w-full h-full object-cover"
                  src={tutorial.videoUrl}
                  title={tutorial.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
                
                {/* Overlay sutil em hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-30 transition-opacity" />
              </div>

              {/* Informações do Vídeo */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-black tracking-widest text-[#0cf2cd]/80 font-mono">
                      PASSO {tutorial.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                      {tutorial.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#0cf2cd] transition-colors duration-200 font-['Space_Grotesk'] leading-snug">
                    {tutorial.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                    {tutorial.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {tutorial.duration} min
                  </span>
                  
                  <span className="flex items-center gap-1 text-[#25d366] font-semibold group-hover:underline cursor-pointer">
                    <Play className="w-3 h-3 fill-current" />
                    Assistindo agora
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ / Central de Ajuda Rápida */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 p-8 sm:p-10 rounded-2xl bg-[#090e1a]/25 backdrop-blur-md border border-white/5 max-w-4xl mx-auto text-center"
        >
          <HelpCircle className="w-8 h-8 text-[#0cf2cd] mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-2 font-['Space_Grotesk']">Ainda tem dúvidas sobre o Controle-C?</h3>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            Nossa equipe de suporte está sempre à disposição para ajudar você a configurar o sistema ou tirar dúvidas adicionais.
          </p>
          <a 
            href="https://wa.me/5511999999999" // Link dinâmico ou suporte padrão
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#25d366]/20 to-[#0cf2cd]/20 hover:from-[#25d366]/30 hover:to-[#0cf2cd]/30 border border-[#25d366]/30 hover:border-[#25d366]/50 text-white font-semibold transition-all duration-200 text-sm shadow-[0_0_30px_rgba(37,211,102,0.1)] hover:shadow-[0_0_30px_rgba(37,211,102,0.2)] cursor-pointer"
          >
            Falar com Suporte no WhatsApp
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

      </main>

      {/* Footer Premium */}
      <footer className="py-8 text-center text-slate-500 text-xs border-t border-white/5 bg-[#090e1a]/60 mt-auto relative z-10">
        <p>&copy; {new Date().getFullYear()} Controle-C. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Tutorials;
