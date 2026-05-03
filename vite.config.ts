import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접속 허용
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          saju: ['./src/data/sajuDb'],
          coaching: [
            './src/utils/saju/coachingContent',
            './src/utils/integratedReport',
            './src/utils/saju/alignmentMapper',
          ],
          share: ['html2canvas'],
        },
      },
    },
  },
})
