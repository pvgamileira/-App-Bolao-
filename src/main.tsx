import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { isSupabaseConfigured } from './lib/supabaseclient'
import { AlertTriangle } from 'lucide-react'

function ConfigurationError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full bg-red-900/20 border border-red-500/50 rounded-xl p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-400 mb-4">Erro de Configuração</h1>
        <p className="mb-4 text-gray-200">
          O aplicativo não pode se conectar ao banco de dados porque as variáveis de ambiente <strong>VITE_SUPABASE_URL</strong> e/ou <strong>VITE_SUPABASE_ANON_KEY</strong> não foram encontradas.
        </p>
        <div className="text-sm text-gray-400 bg-black/30 p-4 rounded-lg text-left">
          <p className="mb-2"><strong>Como corrigir:</strong></p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Localmente:</strong> crie um arquivo <code>.env.local</code> na raiz do projeto com as chaves do Supabase.</li>
            <li><strong>No GitHub Pages:</strong> vá em Settings &gt; Secrets and variables &gt; Actions e adicione essas variáveis como <strong>Repository secrets</strong>, depois rode o deploy novamente.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

let root = (window as any).__reactRoot;
if (!root) {
  root = createRoot(document.getElementById('root')!);
  (window as any).__reactRoot = root;
}

root.render(
  <StrictMode>
    <ThemeProvider>
      {isSupabaseConfigured ? <App /> : <ConfigurationError />}
    </ThemeProvider>
  </StrictMode>,
)
