/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    safelist: [
        {
            pattern: /bg-(green|red|blue|yellow|orange|purple)-500/,
        }
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                brand: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                dark: {
                    800: '#18181b', // Zinc 900
                    900: '#09090b', // Zinc 950
                    950: '#050505', // Almost Black
                },
                neon: {
                    cyan: '#2dd4bf',
                    purple: '#d8b4fe',
                }
            },
            animation: {
                'blob': 'blob 10s infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    'from': { boxShadow: '0 0 5px rgba(45, 212, 191, 0.2)' },
                    'to': { boxShadow: '0 0 20px rgba(45, 212, 191, 0.6)' },
                }
            }
        }
    },
    plugins: [],
}
