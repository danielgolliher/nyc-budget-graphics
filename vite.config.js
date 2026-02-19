import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages: set base to your repo name
// e.g., if your repo is github.com/username/nyc-budget-graphics
// set base to '/nyc-budget-graphics/'
export default defineConfig({
  plugins: [react()],
  base: '/nyc-budget-graphics/',
})
