/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'chat-bg' : "url('/images/chat.jpg')"
      },
      keyframes: {
        loadingFade : {
          '0%, 100%' :{opacity : 0},
          '50%' : {opacity : 0.8}
        }
      }
    },
  },
  plugins: [],
}

