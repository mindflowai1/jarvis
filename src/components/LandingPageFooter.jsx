import React from 'react';
import ScrollReveal from './ScrollReveal';

const LandingPageFooter = () => {
    return (
        <footer className="w-full border-t border-white/5 bg-[#050e1b] pt-16 pb-8 px-6 text-[#8892b0] font-body">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <ScrollReveal variant="fadeInUp" className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-white font-display font-bold text-2xl tracking-tight">
                            <span className="material-symbols-outlined text-primary text-3xl">mic</span>
                            Controle-C
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Organizando o Brasil, um áudio por vez. A revolução financeira que cabe no seu bolso e entende sua voz.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInUp" delay={0.1} className="flex flex-col gap-4">
                        <h4 className="text-white font-bold font-display uppercase tracking-wider text-sm">Produto</h4>
                        <a href="#features" className="hover:text-white transition-colors text-sm">Funcionalidades</a>
                        <a href="#dashboard" className="hover:text-white transition-colors text-sm">Dashboard</a>
                        <a href="#pricing" className="hover:text-white transition-colors text-sm">Preços</a>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInUp" delay={0.2} className="flex flex-col gap-4">
                        <h4 className="text-white font-bold font-display uppercase tracking-wider text-sm">Legal</h4>
                        <a href="#" className="hover:text-white transition-colors text-sm">Termos de Uso</a>
                        <a href="#" className="hover:text-white transition-colors text-sm">Política de Privacidade</a>
                        <a href="#" className="hover:text-white transition-colors text-sm">Segurança</a>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInUp" delay={0.3} className="flex flex-col gap-4">
                        <h4 className="text-white font-bold font-display uppercase tracking-wider text-sm">Suporte</h4>
                        <a href="#" className="hover:text-white transition-colors text-sm">Central de Ajuda</a>
                        <a href="#" className="hover:text-white transition-colors text-sm">Comunidade</a>
                        <a href="#" className="hover:text-white transition-colors text-sm">Status</a>
                    </ScrollReveal>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs">© 2024 Controle-C Tecnologia Ltda. Todos os direitos reservados.</p>
                    <p className="text-xs flex items-center gap-1">Feito com <span className="text-primary">💚</span> e 🤖 no Brasil.</p>
                </div>
            </div>
        </footer>
    );
};

export default LandingPageFooter;
