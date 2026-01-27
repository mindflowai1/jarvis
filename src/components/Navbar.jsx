import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.nav
            className="modern-navbar"
            initial={{ y: -100, opacity: 0, x: "-50%" }}
            animate={{
                y: 0,
                opacity: 1,
                x: "-50%",
                width: isHovered ? "300px" : "120px", // Expand width on hover
                backgroundColor: isHovered ? "rgba(15, 23, 42, 0.8)" : "rgba(15, 23, 42, 0.6)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
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
