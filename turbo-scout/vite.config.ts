import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true
  },
  define: {
    "process.env.IS_PREACT": JSON.stringify("false"),
  },
  base: "/"
})
