import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis do .env para usar no vite.config.ts
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'api-backend',
        configureServer(server) {
          server.middlewares.use('/api/ia', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body);
                
                // Chamando a API autenticada a partir do backend seguro
                const response = await fetch("https://text.pollinations.ai/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${env.POLLINATIONS_API_KEY}`
                  },
                  body: JSON.stringify({
                    messages: parsed.messages,
                    model: "openai"
                  })
                });
                
                const text = await response.text();
                
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ text }));
              } catch (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Erro no backend' }));
              }
            });
          }
        });
      }
    }
  ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
