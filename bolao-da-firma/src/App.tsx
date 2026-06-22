import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { MatchGrid, type Match, type Guess } from './components/MatchGrid';
import { LeaderboardPodium, type UserRank } from './components/LeaderboardPodium';
import { Layout } from './components/Layout';
import { supabase } from './lib/supabaseclient';

function AppContent() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Data States
  const [matches, setMatches] = useState<Match[]>([]);
  const [guesses, setGuesses] = useState<Record<string, Guess>>({});
  const [leaderboard, setLeaderboard] = useState<UserRank[]>([]);
  
  // UI states
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const fetchMatches = async () => {
    setIsLoadingMatches(true);
    
    // Dynamic Date Handling for today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await supabase
      .from('jogos')
      .select('*')
      .gte('data_hora', startOfDay)
      .lte('data_hora', endOfDay)
      .order('data_hora', { ascending: true });
      
    if (!error && data) {
      const formattedMatches: Match[] = data.map(j => ({
        id: j.id,
        timeA: j.time_a,
        timeAFlag: '🏁', 
        timeB: j.time_b,
        timeBFlag: '🏁',
        date: new Date(j.data_hora),
        status: j.status || 'SCHEDULED'
      }));
      setMatches(formattedMatches);
    }
    setIsLoadingMatches(false);
  };

  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome_guerra, pontos_legado, palpites(pontos_ganhos)');
      
    if (!error && data) {
      const ranks: UserRank[] = data.map((u: any) => {
        const palpitesPoints = u.palpites ? u.palpites.reduce((acc: number, p: any) => acc + (p.pontos_ganhos || 0), 0) : 0;
        return {
          id: u.id,
          nomeGuerra: u.nome_guerra,
          points: (u.pontos_legado || 0) + palpitesPoints,
          initials: u.nome_guerra.substring(0, 2).toUpperCase()
        };
      });
      setLeaderboard(ranks);
    }
    setIsLoadingLeaderboard(false);
  };

  const fetchUserGuesses = async (userId: string) => {
    const { data, error } = await supabase
      .from('palpites')
      .select('jogo_id, palpite_a, palpite_b')
      .eq('usuario_id', userId);
      
    if (!error && data) {
      const newGuesses: Record<string, Guess> = {};
      data.forEach(p => {
        newGuesses[p.jogo_id] = { scoreA: p.palpite_a, scoreB: p.palpite_b };
      });
      setGuesses(newGuesses);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchLeaderboard();

    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jogos' },
        (payload) => {
          fetchMatches();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'palpites' },
        (payload) => {
          fetchLeaderboard();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'usuarios' },
        (payload) => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch guesses when user logs in or reloads (if we stored auth)
  useEffect(() => {
    if (currentUserId) {
      fetchUserGuesses(currentUserId);
    }
  }, [currentUserId]);

  const handleLogin = (userId: string, nomeGuerra: string) => {
    setCurrentUserId(userId);
    navigate('/dashboard');
  };
  
  const handleLogout = () => {
    setCurrentUserId(null);
    setGuesses({});
    navigate('/');
  };

  const handleGuessChange = (matchId: string, team: 'A' | 'B', value: number | '') => {
    setGuesses(prev => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { scoreA: '', scoreB: '' }),
        [`score${team}`]: value
      }
    }));
  };

  const handleSaveGuesses = async () => {
    if (!currentUserId) return;
    
    setIsSubmitting(true);
    
    // Prepare upserts
    const payload = Object.entries(guesses).map(([matchId, guess]) => {
      if (guess.scoreA === '' || guess.scoreB === '') return null;
      return {
        usuario_id: currentUserId,
        jogo_id: matchId,
        palpite_a: guess.scoreA as number,
        palpite_b: guess.scoreB as number
      };
    }).filter(Boolean) as any[]; 
    
    if (payload.length > 0) {
      const { error } = await supabase
        .from('palpites')
        .upsert(payload, { onConflict: 'usuario_id,jogo_id' });
        
      if (!error) {
        alert('Palpites salvos com sucesso!');
        if (window.innerWidth < 768) {
          navigate('/leaderboard');
        }
      } else {
        alert('Erro ao salvar palpites: ' + error.message);
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <Layout currentUserId={currentUserId} onLogout={handleLogout}>
      <Routes>
        <Route 
          path="/" 
          element={
            currentUserId ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthForm onLogin={handleLogin} />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            currentUserId ? (
              <div className="md:grid md:grid-cols-[1fr_350px] md:gap-8 h-full">
                <div className="py-4 md:py-8 h-full">
                  {isLoadingMatches && matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      <p className="text-gray-400">Carregando jogos...</p>
                    </div>
                  ) : (
                    <MatchGrid 
                      matches={matches} 
                      guesses={guesses} 
                      onGuessChange={handleGuessChange}
                      onSave={handleSaveGuesses}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </div>
                {/* Desktop sidebar */}
                <div className="hidden md:block bg-surface/30 border-l border-gray-800 shadow-2xl h-[calc(100vh-80px)] overflow-y-auto">
                   <LeaderboardPodium 
                      users={leaderboard} 
                      currentUserId={currentUserId} 
                      isLoading={isLoadingLeaderboard}
                   />
                </div>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/leaderboard" 
          element={
            currentUserId ? (
               <div className="md:grid md:grid-cols-[1fr_350px] md:gap-8 h-full">
                <div className="hidden md:block py-4 md:py-8 h-full">
                  {/* Keep match grid on left for desktop even if /leaderboard is visited */}
                  <MatchGrid 
                    matches={matches} 
                    guesses={guesses} 
                    onGuessChange={handleGuessChange}
                    onSave={handleSaveGuesses}
                    isSubmitting={isSubmitting}
                  />
                </div>
                {/* Mobile view or desktop sidebar */}
                <div className="bg-surface/30 md:border-l md:border-gray-800 md:shadow-2xl h-[calc(100vh-80px)] overflow-y-auto">
                   <LeaderboardPodium 
                      users={leaderboard} 
                      currentUserId={currentUserId} 
                      isLoading={isLoadingLeaderboard}
                   />
                </div>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
