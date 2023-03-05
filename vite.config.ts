import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/gsap-draggable-zoomable-svg/',
  plugins: [vue()],
})
