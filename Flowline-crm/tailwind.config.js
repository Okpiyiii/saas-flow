/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: '#e4e4e7',
                background: '#ffffff',
                foreground: '#09090b',
                muted: '#f4f4f5',
                'muted-foreground': '#71717a',
            },
            fontFamily: {
                fustat: ['Fustat', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                'lg': '0.5rem',
                'md': '0.375rem',
                'sm': '0.25rem',
            },
            boxShadow: {
                'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'glass-inner': 'inset 0px 4px 4px 0px rgba(255,255,255,0.25)',
                'glass-inner-cta': 'inset 0px 4px 4px 0px rgba(255,255,255,0.35)',
            },
        },
    },
    plugins: [],
}
