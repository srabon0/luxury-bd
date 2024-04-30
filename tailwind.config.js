/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
        "primary": "#6366f1",
                
        "secondary": "#0067d7",
                
        "accent": "#7dd3fc",
                
        "neutral": "#131f24",
                
        "base-100": "#ffffff",

        "base-200": "#818cf8",

        "base-300": "#eef2ff",
                
        "info": "#f3f4f6",
                
        "success": "#059669",
                
        "warning": "#ffa900",
                
        "error": "#ff8b8b",
                },
              },
            ],
          },
        };