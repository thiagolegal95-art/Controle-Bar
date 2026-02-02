
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Aumenta o limite de aviso para 2000kb para acomodar bibliotecas de gráficos e ícones
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Organiza dependências em chunks separados para melhor cache no navegador e performance no Vercel
        manualChunks: {
          'vendor-ui': ['lucide-react'],
          'vendor-charts': ['recharts'],
          'vendor-core': ['react', 'react-dom'],
        },
      },
    },
  },
});
