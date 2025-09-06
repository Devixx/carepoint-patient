/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                'brand-blue': '#2563eb',
                'brand-green': '#10b981',
                'brand-red': '#ef4444',
                'brand-amber': '#f59e0b',
            },
        },
    },
    plugins: [],
}
