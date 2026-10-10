import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { novaApi } from './nova-api.js'

const root = dirname(fileURLToPath(import.meta.url))

// One project: shop at "/", owner dashboard at "/admin", API at "/api".
export default defineConfig({
  plugins: [react(), novaApi()],
  server: { watch: { ignored: ['**/data/**'] } },
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        admin: resolve(root, 'admin.html'),
      },
    },
  },
})
