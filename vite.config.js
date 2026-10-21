import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitePages from './scripts/site-pages.js'

// Custom domain (data.maximumnewyork.com) serves from /
export default defineConfig({
  plugins: [react(), sitePages()],
  base: '/',
})
