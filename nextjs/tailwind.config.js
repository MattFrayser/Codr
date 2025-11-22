module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
              'toolbar': 'var(--toolbar)',
              'background': 'var(--background)',
              'terminal': 'var(--terminal)',
              'surface': 'var(--surface)',
              'elevated': 'var(--elevated)',
              'interactive-active': 'var(--interactive-active)',
              'text': 'var(--text)',
              'text-muted': 'var(--text-muted)',
              'text-inverse': 'var(--text-inverse)',
              'border': 'var(--border)',
              'accent': 'var(--accent)',
              'success': 'var(--success)',
              'error': 'var(--error)',
            },
        },
    },
    plugins: [],
}
