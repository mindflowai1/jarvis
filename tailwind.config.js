/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#25d466",
                "primary-dark": "#1da851",
                "primary-teal": "#10b19c",
                "primary-neon": "#13eca4",
                "accent-blue": "#00d2ff",
                "background-ocean": "#020c1b",
                "background-navy": "#0a192f",
                "surface-dark": "#112240",
            },
            fontFamily: {
                display: ["Space Grotesk", "sans-serif"],
                body: ["Inter", "sans-serif"],
                noto: ["Noto Sans", "sans-serif"],
            },
            animation: {
                float: 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out infinite 3s',
                scan: 'scan 3s infinite linear',
                'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                scan: {
                    '0%': { top: '0%', opacity: '0' },
                    '10%': { opacity: '1' },
                    '90%': { opacity: '1' },
                    '100%': { top: '100%', opacity: '0' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.4', transform: 'scale(0.95)' },
                    '50%': { opacity: '0.7', transform: 'scale(1.05)' },
                }
            }
        },
    },
    plugins: [],
}
