import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({ children, variant = 'fadeInUp', delay = 0, className = '' }) => {
    const variants = {
        fadeIn: {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut", delay } }
        },
        fadeInUp: {
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay } }
        },
        fadeInLeft: {
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay } }
        },
        fadeInRight: {
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay } }
        },
        scaleIn: {
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", delay } }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={variants[variant]}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
