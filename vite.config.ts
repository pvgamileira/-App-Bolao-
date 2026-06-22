import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/-App-Bolao-/', // Garante que o Vite entenda o caminho do GitHub Pages
})