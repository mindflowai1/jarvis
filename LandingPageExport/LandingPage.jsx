import React, { Suspense } from 'react';
import LiquidSphere3D from './LiquidSphere3D';

// ─── All styles are self-contained ─────────────────────────────────────────
// This component intentionally uses ZERO Tailwind classes / external CSS.
// Reason: the global index.css (AdminDashboard.css, body overrides, etc.)
// conflicts with any Tailwind utility generated for this route.
// Using inline styles + a scoped <style> tag makes the page immune to that.
// ───────────────────────────────────────────────────────────────────────────

const styles = {
    page: {
        position: 'relative',
        minHeight: '100svh',  // uses dynamic viewport height for mobile browsers
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: "'Inter', 'Space Grotesk', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
    },
    // ── 3D portal (right side) ──
    portalWrapper: {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: '0%',
        transform: 'translateX(17vw)', // O meio termo exato entre as duas tentativas
    },
    // Abstract Liquid Motion 3D Object
    liquidContainer: {
        position: 'relative',
        width: '75vw', // Mais largo horizontalmente para caber o modelo
        height: '60vw', // Altura mantida
        maxWidth: '1000px', // Novo limite máximo de largura
        maxHeight: '750px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    liquidBlobMain: {
        position: 'absolute',
        width: '85%',
        height: '85%',
        background: 'linear-gradient(135deg, #0cf2cd 0%, #033a2d 40%, #01120f 100%)',
        boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.8), inset 10px 10px 30px rgba(12,242,205,0.5)',
        animation: 'rl-blobMorph 12s ease-in-out infinite, rl-liquidSpin 25s linear infinite',
        opacity: 0.9,
    },
    liquidBlobOverlay: {
        position: 'absolute',
        width: '90%',
        height: '90%',
        background: 'linear-gradient(45deg, rgba(12,242,205,0.4) 0%, transparent 60%)',
        boxShadow: 'inset 20px 0 50px rgba(12,242,205,0.3)',
        animation: 'rl-blobMorph2 15s ease-in-out infinite alternate, rl-liquidSpinReverse 30s linear infinite',
        mixBlendMode: 'screen',
    },
    liquidBlobCore: {
        position: 'absolute',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle at 30% 30%, #fff 0%, #0cf2cd 30%, transparent 70%)',
        filter: 'blur(15px)',
        animation: 'rl-float 5s ease-in-out infinite',
        opacity: 0.6,
    },
    liquidGlow: {
        position: 'absolute',
        width: '120%',
        height: '120%',
        background: 'radial-gradient(circle, rgba(12,242,205,0.2) 0%, transparent 65%)',
        filter: 'blur(50px)',
        zIndex: -1,
        animation: 'rl-pulse 6s ease-in-out infinite',
    },
    liquidDrop: {
        position: 'absolute',
        background: 'linear-gradient(135deg, #0cf2cd 0%, #033a2d 40%, #01120f 100%)',
        boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.8), inset 5px 5px 10px rgba(12,242,205,0.5)',
        borderRadius: '50%',
        opacity: 0.6,
        filter: 'blur(1px)',
    },
    drop1: {
        width: '12%',
        height: '12%',
        animation: 'rl-drop1 12s ease-in-out infinite',
    },
    drop2: {
        width: '6%',
        height: '6%',
        animation: 'rl-drop2 9s ease-in-out infinite',
    },
    drop3: {
        width: '15%',
        height: '15%',
        animation: 'rl-drop3 15s ease-in-out infinite',
        animationDelay: '3s',
    },
    // ── Bottom Aurora Boreal Effect ──
    auroraWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
    },
    auroraMist1: {
        position: 'absolute',
        bottom: '-20%',
        left: '-20%',
        width: '140%',
        height: '100%',
        background: 'radial-gradient(ellipse at bottom, rgba(12,242,205,0.3) 0%, transparent 60%)',
        filter: 'blur(60px)',
        animation: 'rl-auroraHover 14s ease-in-out infinite alternate',
    },
    auroraMist2: {
        position: 'absolute',
        bottom: '-30%',
        right: '-20%',
        width: '140%',
        height: '120%',
        background: 'radial-gradient(ellipse at bottom, rgba(3,58,45,0.8) 0%, transparent 60%)',
        filter: 'blur(80px)',
        animation: 'rl-auroraHover2 18s ease-in-out infinite alternate-reverse',
        mixBlendMode: 'screen',
    },
    auroraLine: {
        position: 'absolute',
        bottom: '15%',
        left: '-10%',
        width: '120%',
        height: '4px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(12,242,205,0.5) 50%, transparent 100%)',
        filter: 'blur(4px)',
        animation: 'rl-auroraLineMotion 10s ease-in-out infinite alternate',
    },
    // ── Content shell ──
    shell: {
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '0 80px',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    // ── Navbar ──
    navbar: {
        paddingTop: '36px',
        paddingBottom: '36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        cursor: 'pointer',
    },
    logoMark: {
        width: '36px',
        height: '36px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(255,255,255,0.25)',
    },
    logoMarkInner: {
        width: '14px',
        height: '14px',
        backgroundColor: '#000',
        borderRadius: '4px',
    },
    logoText: {
        fontWeight: 700,
        fontSize: '18px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#fff',
    },
    connectBtn: {
        backgroundColor: '#fff',
        color: '#000',
        fontWeight: 600,
        padding: '10px 24px',
        borderRadius: '10px',
        fontSize: '14px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 0 15px rgba(255,255,255,0.12)',
        transition: 'background 0.2s, box-shadow 0.2s',
    },
    // ── Hero ──
    hero: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '20px',
        paddingBottom: '20px',
    },
    heroInner: {
        maxWidth: '680px',
    },
    eyebrow: {
        color: '#0cf2cd',
        fontWeight: 500,
        fontSize: '17px',
        letterSpacing: '0.04em',
        marginBottom: '20px',
        display: 'block',
    },
    h1: {
        fontSize: 'clamp(52px, 7vw, 84px)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1.04,
        color: '#fff',
        margin: '0 0 28px',
    },
    h1Gradient: {
        display: 'block',
        background: 'linear-gradient(90deg, #fff 30%, #666 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    body: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: '18px',
        lineHeight: 1.7,
        maxWidth: '520px',
        margin: '0 0 40px',
        fontWeight: 300,
    },
    ctaRow: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px',
    },
    ctaPrimary: {
        backgroundColor: '#0cf2cd',
        color: '#000',
        fontWeight: 700,
        fontSize: '15px',
        padding: '16px 32px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 0 24px rgba(12,242,205,0.35)',
        transition: 'box-shadow 0.2s, background 0.2s',
    },
    ctaSecondary: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: '#fff',
        fontWeight: 600,
        fontSize: '15px',
        padding: '16px 32px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.12)',
        cursor: 'pointer',
        transition: 'background 0.2s, border 0.2s',
    },
    // ── Footer strip ──
    footer: {
        paddingTop: '20px',
        paddingBottom: '20px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
    },
    trustedLabel: {
        display: 'block',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: '10px',
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
        opacity: 0.25,
        filter: 'grayscale(100%)',
    },
    logoPlaceholder: {
        fontSize: '18px',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: '#fff',
        whiteSpace: 'nowrap',
    },
};

// Hover helpers via CSS-in-JS style tag
const scopedCSS = `
  @keyframes rl-float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }

  @keyframes rl-blobMorph {
    0%, 100% { border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%; }
    34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
    67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
  }

  @keyframes rl-blobMorph2 {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }

  @keyframes rl-liquidSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes rl-liquidSpinReverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }

  @keyframes rl-pulse {
    0% { opacity: 0.6; transform: scale(0.9); }
    50% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 0.6; transform: scale(0.9); }
  }

  @keyframes rl-drop1 {
    0%, 100% { transform: translate(0, 0) scale(0.5); opacity: 0; }
    20% { opacity: 0.7; }
    70% { transform: translate(-10vw, -15vw) scale(1.5); opacity: 0; }
  }

  @keyframes rl-drop2 {
    0%, 100% { transform: translate(0, 0) scale(0.5); opacity: 0; }
    30% { opacity: 0.5; }
    80% { transform: translate(12vw, 10vw) scale(1.2); opacity: 0; }
  }

  @keyframes rl-drop3 {
    0%, 100% { transform: translate(0, 0) scale(0.5); opacity: 0; }
    40% { opacity: 0.8; }
    90% { transform: translate(-8vw, 15vw) scale(0.8); opacity: 0; }
  }

  @keyframes rl-auroraHover {
    0% { transform: scale(1) translate(0, 0) rotate(-2deg); opacity: 0.6; }
    100% { transform: scale(1.1) translate(5vw, -30px) rotate(3deg); opacity: 1; }
  }

  @keyframes rl-auroraHover2 {
    0% { transform: scale(1) translate(0, 0) rotate(2deg); opacity: 0.5; }
    100% { transform: scale(1.2) translate(-5vw, -40px) rotate(-3deg); opacity: 0.9; }
  }

  @keyframes rl-auroraLineMotion {
    0% { transform: translateY(0px) rotate(-1deg); opacity: 0.3; }
    100% { transform: translateY(-20px) rotate(1deg); opacity: 0.7; }
  }

  .rl-connect:hover { background: #e8e8e8 !important; }
  .rl-cta-primary:hover { background: #1fffd9 !important; box-shadow: 0 0 36px rgba(12,242,205,0.55) !important; }
  .rl-cta-secondary:hover { background: rgba(255,255,255,0.09) !important; border-color: rgba(255,255,255,0.22) !important; }

  @media (max-width: 900px), (max-height: 800px) {
    .rl-shell { padding: 0 40px !important; }
    .rl-navbar { padding-top: 20px !important; padding-bottom: 20px !important; }
    .rl-h1 { font-size: clamp(42px, 8vw, 64px) !important; margin-bottom: 16px !important; }
    .rl-body { font-size: 16px !important; margin-bottom: 24px !important; line-height: 1.5 !important; }
    .rl-eyebrow { margin-bottom: 12px !important; font-size: 14px !important; }
    .rl-cta-primary, .rl-cta-secondary { padding: 12px 24px !important; font-size: 14px !important; border-radius: 8px !important; }
    
    /* In mobile, shift it to center, lower opacity and behind the text beautifully */
    .rl-portal { 
      justify-content: center !important;
      padding-right: 0 !important;
      opacity: 0.35 !important;
    }
    /* Diminui The Container bounds scale na tela pequena para não explodir na viewport do mobile */
    .rl-portal > div {
      width: 100vw !important;
      height: 100vw !important;
      transform: translateY(-8vh);
    }
  }
  @media (max-width: 600px) {
    .rl-shell { padding: 0 24px !important; }
    .rl-portal > div { transform: translateY(-3vh); }
    .rl-logo-row { gap: 20px !important; flex-wrap: wrap; }
    .rl-cta-group { gap: 10px !important; }
    .rl-cta-primary, .rl-cta-secondary { width: 100%; text-align: center; }
  }
`;

const LandingPage = () => {
    return (
        <>
            <style>{scopedCSS}</style>
            <div style={styles.page}>

                {/* ── Bottom Aurora Boreal Effect ── */}
                <div style={styles.auroraWrapper}>
                    <div style={styles.auroraMist1} />
                    <div style={styles.auroraMist2} />
                    <div style={styles.auroraLine} />
                </div>

                {/* ── Abstract Liquid Motion Element ── */}
                <div style={styles.portalWrapper} className="rl-portal">
                    <div style={styles.liquidContainer}>
                        <Suspense fallback={<div style={styles.liquidGlow} />}>
                            <LiquidSphere3D />
                        </Suspense>
                    </div>
                </div>

                {/* ── Content shell ── */}
                <div style={styles.shell} className="rl-shell">

                    {/* Navbar */}
                    <header style={styles.navbar} className="rl-navbar">
                        <div style={styles.logoGroup}>
                            <div style={styles.logoMark}>
                                <div style={styles.logoMarkInner} />
                            </div>
                            <span style={styles.logoText}>Robo Labs</span>
                        </div>
                        <button style={styles.connectBtn} className="rl-connect">
                            Connect
                        </button>
                    </header>

                    {/* Hero */}
                    <main style={styles.hero} className="rl-hero">
                        <div style={styles.heroInner}>
                            <span style={styles.eyebrow} className="rl-eyebrow">Enterprise AI Integration</span>
                            <h1 style={styles.h1} className="rl-h1">
                                Accelerate Growth
                                <span style={styles.h1Gradient}>With Autonomous AI</span>
                            </h1>
                            <p style={styles.body} className="rl-body">
                                Intelligent solutions for modern enterprises. We build custom AI
                                agents, automate complex workflows, and extract actionable
                                insights to elevate your operations.
                            </p>
                            <div style={styles.ctaRow} className="rl-cta-group">
                                <button style={styles.ctaPrimary} className="rl-cta-primary">
                                    Explore Services
                                </button>
                                <button style={styles.ctaSecondary} className="rl-cta-secondary">
                                    Book a Consultation
                                </button>
                            </div>
                        </div>
                    </main>

                    {/* Footer strip */}
                    <footer style={styles.footer} className="rl-footer">
                        <span style={styles.trustedLabel}>Trusted by forward-thinking teams</span>
                        {/* Replace the placeholders below with real <img> logos */}
                        <div style={styles.logoRow} className="rl-logo-row">
                            <span style={styles.logoPlaceholder}>ACME CORP</span>
                            <span style={styles.logoPlaceholder}>GLOBEX</span>
                            <span style={styles.logoPlaceholder}>INNOVA</span>
                            <span style={styles.logoPlaceholder}>NEXUS</span>
                        </div>
                    </footer>

                </div>
            </div>
        </>
    );
};

export default LandingPage;
