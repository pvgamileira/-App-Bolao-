import { useState, type FormEvent } from 'react';
import { User, KeyRound, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabaseclient';

export function AuthForm({ onLogin }: { onLogin: (userId: string, nomeGuerra: string) => void }) {
  const [activeTab, setActiveTab] = useState<'ENTRAR' | 'CRIAR'>('ENTRAR');
  const [nomeGuerra, setNomeGuerra] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nomeGuerra.trim()) return;
    setError('');
    setIsLoading(true);

    const normalizedName = nomeGuerra.trim().toUpperCase();

    try {
      if (activeTab === 'CRIAR') {
        if (!pin.trim()) {
          setError('Você deve fornecer um PIN de 4 dígitos.');
          setIsLoading(false);
          return;
        }

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('usuarios')
          .select('id, pin')
          .eq('nome_guerra', normalizedName)
          .single();

        if (existingUser) {
          if (existingUser.pin === null) {
            // Claim legacy account
            const { error: updateError } = await supabase
              .from('usuarios')
              .update({ pin: pin.trim() })
              .eq('id', existingUser.id);
            
            if (updateError) {
              setError('Erro ao configurar PIN: ' + updateError.message);
            } else {
              onLogin(existingUser.id, normalizedName);
            }
          } else {
            // Account exists and has a pin
            setError('Nome de Guerra já está em uso.');
          }
        } else if (checkError && checkError.code === 'PGRST116') {
          // User does not exist, safe to insert
          const { data, error: insertError } = await supabase
            .from('usuarios')
            .insert([{ nome_guerra: normalizedName, pin: pin.trim() }])
            .select('id')
            .single();

          if (insertError) {
            setError('Erro ao criar conta: ' + insertError.message);
          } else if (data) {
            onLogin(data.id, normalizedName);
          }
        } else {
           setError('Erro ao verificar usuário: ' + (checkError?.message || 'Erro desconhecido.'));
        }

      } else {
        // ENTRAR
        const { data, error: fetchError } = await supabase
          .from('usuarios')
          .select('id, pin')
          .eq('nome_guerra', normalizedName)
          .single();

        if (fetchError || !data) {
          setError('Nome de guerra não encontrado ou PIN incorreto.');
        } else if (data.pin === null) {
          setError('Sua conta ainda não possui senha. Por favor, vá em "Criar Conta" para definir seu PIN de acesso inicial.');
        } else if (data.pin !== pin.trim()) {
          setError('Nome de guerra não encontrado ou PIN incorreto.');
        } else {
          onLogin(data.id, normalizedName);
        }
      }
    } catch (err: any) {
      setError('Ocorreu um erro: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] w-full p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-surface p-4 rounded-full mb-4 shadow-[0_0_15px_rgba(0,230,118,0.3)]">
          <Trophy size={48} className="text-primary" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-bold text-center text-white">Bolão da Firma</h1>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {import.meta.env.VITE_APP_VERSION || 'v1.0.0'}
          </span>
        </div>
      </div>

      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
        <div className="flex border-b border-gray-800">
          <button
            type="button"
            className={`flex-1 py-4 text-center font-bold transition-colors ${activeTab === 'ENTRAR' ? 'bg-[#1f364d] text-primary' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setActiveTab('ENTRAR'); setError(''); }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`flex-1 py-4 text-center font-bold transition-colors ${activeTab === 'CRIAR' ? 'bg-[#1f364d] text-primary' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setActiveTab('CRIAR'); setError(''); }}
          >
            Criar Conta
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                required
                placeholder="Nome de Guerra"
                value={nomeGuerra}
                onChange={(e) => setNomeGuerra(e.target.value)}
                className="w-full bg-background border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                maxLength={4}
                placeholder="PIN (4 dígitos)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-background border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all tracking-widest"
              />
            </div>
            {activeTab === 'CRIAR' && (
               <p className="text-xs text-gray-500 mt-1 mb-2">Um PIN de 4 dígitos é obrigatório para manter sua conta segura</p>
            )}

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg border border-red-900/50">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-[#00c868] text-background font-bold text-lg py-4 rounded-xl transition-colors mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Aguarde...' : (activeTab === 'ENTRAR' ? 'Entrar no Bolão' : 'Registrar Conta')}
              {!isLoading && <span className="text-xl">⚽</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
