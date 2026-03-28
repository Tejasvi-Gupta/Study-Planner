import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change base to '/study-planner/' if deploying to GitHub Pages
// Leave as '/' for Vercel or Netlify
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,   // set true if you want source maps in production
  },
})
