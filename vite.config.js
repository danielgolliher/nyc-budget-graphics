import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain (data.maximumnewyork.com) serves from /
export default defineConfig({
  plugins: [react()],
  base: '/',
})
