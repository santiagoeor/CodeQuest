/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'cq-bg': '#0d1117',
        'cq-surface': '#161b22',
        'cq-surface-hover': '#1c2128',
        'cq-border': '#30363d',
        'cq-text': '#f0f6fc',
        'cq-muted': '#8b949e',
        'cq-primary': '#5865f2',
        'cq-primary-hover': '#4752c4',
        'cq-accent': '#00d26a',
        'cq-accent-hover': '#00b85c',
        'cq-warning': '#f1e05a',
        'cq-danger': '#f85149',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
};
