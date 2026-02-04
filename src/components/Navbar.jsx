import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar se é dispositivo mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handler para toggle em mobile
    const handleNavClick = () => {
        if (isMobile) {
            setIsHovered(!isHovered);
        }
    };

    // Handler para fechar quando clicar fora (mobile)
    useEffect(() => {
        if (!isMobile || !isHovered) return;

        const handleClickOutside = (e) => {
            if (!e.target.closest('.modern-navbar')) {
                setIsHovered(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobile, isHovered]);

    return (
        <motion.nav
            className="modern-navbar"
            initial={{ y: -100, opacity: 0, x: "-50%" }}
            animate={{
                y: 0,
                opacity: 1,
                x: "-50%",
                width: isHovered ? "300px" : "120px",
                backgroundColor: isHovered ? "rgba(15, 23, 42, 0.8)" : "rgba(15, 23, 42, 0.6)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onHoverStart={() => !isMobile && setIsHovered(true)}
            onHoverEnd={() => !isMobile && setIsHovered(false)}
            onClick={handleNavClick}
        >
            <div className="nav-logo">
                <span className="logo-text">JARVIS</span>
            </div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        className="nav-actions"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link to="/login" className="nav-login-btn">
                            <span className="btn-text">Entrar</span>
                            <div className="btn-glow"></div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
