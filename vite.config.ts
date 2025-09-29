// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  base: '/portfolio/',           // ★ 关键：项目站点必须设置
  plugins: [
    react(),
    glsl({ include: ['**/*.glsl', '**/*.vert', '**/*.frag', '**/*.wgsl'] })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  build: {
    outDir: 'dist'                 // 可省略，默认就是 dist
  }
})
