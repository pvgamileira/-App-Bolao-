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
    const dummyEmail = `${normalizedName.replace(/\s+/g, '').toLowerCase()}@v2.bolaodafirma.app`;
    const dummyPassword = `${pin.trim() || '0000'}00`;

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
            // Claim legacy account (Progressive Migration)
            
            // 1. Sign up to create the shadow identity
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: dummyEmail,
              password: dummyPassword,
            });

            if (signUpError) {
              setError('Erro ao migrar sua conta para o novo sistema seguro: ' + signUpError.message);
              setIsLoading(false);
              return;
            }

            // 2. Link auth_id and set the new PIN in the legacy record
            const { error: updateError } = await supabase
              .from('usuarios')
              .update({ pin: pin.trim(), auth_id: signUpData?.user?.id })
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
          
          // 1. Shadow Auth Signup
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: dummyEmail,
            password: dummyPassword,
          });

          if (authError) {
            setError('Erro de autenticação interna: ' + authError.message);
            setIsLoading(false);
            return;
          }

          const newUserId = authData?.user?.id;
          const insertPayload: any = { nome_guerra: normalizedName, pin: pin.trim() };
          if (newUserId) {
            insertPayload.id = newUserId;
            insertPayload.auth_id = newUserId;
          }

          const { data, error: insertError } = await supabase
            .from('usuarios')
            .insert([insertPayload])
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
        
        // 1. Legacy validation (Verifica se o usuário existe e se o PIN bate)
        const { data, error: fetchError } = await supabase
          .from('usuarios')
          .select('id, pin, auth_id')
          .eq('nome_guerra', normalizedName)
          .single();

        if (fetchError || !data) {
          setError('Nome de guerra não encontrado ou PIN incorreto.');
          setIsLoading(false);
          return;
        } else if (data.pin === null) {
          setError('Sua conta ainda não possui senha. Por favor, vá em "Criar Conta" para definir seu PIN de acesso inicial.');
          setIsLoading(false);
          return;
        } else if (data.pin !== pin.trim()) {
          setError('Nome de guerra não encontrado ou PIN incorreto.');
          setIsLoading(false);
          return;
        }

        // 2. Progressive Migration: Se o usuário ainda não tem auth_id, criamos a conta no Supabase Auth agora!
        if (!data.auth_id) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: dummyEmail,
            password: dummyPassword,
          });

          if (signUpError) {
            setError('Erro ao migrar sua conta para o novo sistema: ' + signUpError.message);
            setIsLoading(false);
            return;
          }

          if (signUpData.user) {
            // Salva o novo auth_id na tabela usuarios
            await supabase
              .from('usuarios')
              .update({ auth_id: signUpData.user.id })
              .eq('id', data.id);
          }
        } else {
          // 3. Se já tem auth_id, apenas fazemos o login normal
          const { error: authError } = await supabase.auth.signInWithPassword({
            email: dummyEmail,
            password: dummyPassword,
          });

          if (authError) {
            setError('ERRO DE LOGIN SEGURO: ' + authError.message);
            setIsLoading(false);
            return;
          }
        }

        // Sucesso total
        onLogin(data.id, normalizedName);
      }
    } catch (err: any) {
      setError('Ocorreu um erro: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] w-full p-4">
      <div className="mb-10 flex flex-col items-center">
        <div className="bg-slate-800/80 p-5 rounded-3xl mb-4 shadow-[0_0_25px_rgba(20,184,166,0.2)] border border-teal-500/20 backdrop-blur-sm transition-transform hover:scale-105">
          <Trophy size={48} className="text-teal-400 drop-shadow-lg" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-black text-center text-white tracking-tight drop-shadow-md">Bolão da Firma</h1>
          <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 shadow-inner">
            {import.meta.env.VITE_APP_VERSION || 'v1.1.0'}
          </span>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none"></div>
        <div className="flex border-b border-slate-800 relative z-10">
          <button
            type="button"
            className={`flex-1 py-5 text-center font-bold transition-all duration-300 ${activeTab === 'ENTRAR' ? 'bg-slate-800/80 text-teal-400 shadow-inner' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'}`}
            onClick={() => { setActiveTab('ENTRAR'); setError(''); }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`flex-1 py-5 text-center font-bold transition-all duration-300 ${activeTab === 'CRIAR' ? 'bg-slate-800/80 text-teal-400 shadow-inner' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'}`}
            onClick={() => { setActiveTab('CRIAR'); setError(''); }}
          >
            Criar Conta
          </button>
        </div>

        <div className="p-8 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={20} className="text-slate-500 group-focus-within:text-teal-400 transition-colors" />
              </div>
              <input
                type="text"
                required
                placeholder="Nome de Guerra"
                value={nomeGuerra}
                onChange={(e) => setNomeGuerra(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-inner hover:bg-slate-800/80"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound size={20} className="text-slate-500 group-focus-within:text-teal-400 transition-colors" />
              </div>
              <input
                type="password"
                maxLength={4}
                placeholder="PIN (4 dígitos)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all tracking-widest text-lg shadow-inner hover:bg-slate-800/80"
              />
            </div>
            {activeTab === 'CRIAR' && (
               <p className="text-xs text-slate-400 mt-1 mb-2">Um PIN de 4 dígitos é obrigatório para manter sua conta segura</p>
            )}

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-xl border border-red-900/50 shadow-inner">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-lg py-4 rounded-xl transition-all duration-300 mt-8 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-[0_4px_20px_rgba(20,184,166,0.3)] hover:shadow-[0_6px_25px_rgba(20,184,166,0.5)]"
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
