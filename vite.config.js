import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import plugin from 'tailwindcss/plugin'

// https://vite.dev/config/
export default defineConfig({
  theme:{
    extend: {
      textShadow:{
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [
    plugin(function({ matchUtilities, theme}){
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
    react(),
    tailwindcss()
  ],
  build:{
    outDir: 'dist'
  },
  server:{
    host: true,
    historyApiFallback: true
  },
  preview:{
    host: true
  }
})