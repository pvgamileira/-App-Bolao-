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
  const [savedGuesses, setSavedGuesses] = useState<Record<string, Guess>>({});
  const [leaderboard, setLeaderboard] = useState<UserRank[]>([]);

  // UI states
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchMatches = async () => {
    setIsLoadingMatches(true);

    const { data, error } = await supabase
      .from('jogos')
      .select('*')
      .order('data_hora', { ascending: true });

    if (!error && data) {
      const formattedMatches: Match[] = data.map(j => {
        const matchDate = new Date(j.data_hora);
        let computedStatus = j.status || 'SCHEDULED';
        
        // Se a data já passou e o banco ainda diz SCHEDULED, força para LIVE na interface
        if (computedStatus === 'SCHEDULED' && new Date() >= matchDate) {
          computedStatus = 'LIVE';
        }

        return {
          id: j.id,
          timeA: j.time_a,
          timeAFlag: '🏁',
          timeB: j.time_b,
          timeBFlag: '🏁',
          date: matchDate,
          status: computedStatus,
          placarOficialA: j.placar_oficial_a,
          placarOficialB: j.placar_oficial_b,
          logoA: j.logo_a,
          logoB: j.logo_b,
          tempoDecorrido: j.tempo_decorrido
        };
      });
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
      .select('jogo_id, palpite_a, palpite_b, pontos_ganhos')
      .eq('usuario_id', userId);

    if (!error && data) {
      const newGuesses: Record<string, Guess> = {};
      data.forEach(p => {
        newGuesses[p.jogo_id] = { scoreA: p.palpite_a, scoreB: p.palpite_b, points: p.pontos_ganhos };
      });
      setGuesses(newGuesses);
      setSavedGuesses(newGuesses);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchLeaderboard();

    const channelId = `schema-db-changes-${Date.now()}-${Math.random()}`;
    const channel = supabase.channel(channelId)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'jogos' },
        (payload) => {
          const updatedRow = payload.new as any;
          if (!updatedRow || !updatedRow.id) return;
          
          setMatches(prevMatches => {
            return prevMatches.map(m => {
              if (m.id === updatedRow.id) {
                const matchDate = new Date(updatedRow.data_hora);
                let computedStatus = updatedRow.status || 'SCHEDULED';
                if (computedStatus === 'SCHEDULED' && new Date() >= matchDate) {
                  computedStatus = 'LIVE';
                }
                return {
                  ...m,
                  status: computedStatus,
                  placarOficialA: updatedRow.placar_oficial_a,
                  placarOficialB: updatedRow.placar_oficial_b,
                  tempoDecorrido: updatedRow.tempo_decorrido
                };
              }
              return m;
            });
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'palpites' },
        () => {
          fetchLeaderboard();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'usuarios' },
        () => {
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

  const handleLogin = (userId: string, _nomeGuerra: string) => {
    setCurrentUserId(userId);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    setGuesses({});
    setSavedGuesses({});
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

    if (!window.confirm("Tem certeza que deseja registrar esses palpites? Após a confirmação, eles não poderão ser alterados.")) {
      return;
    }

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
        await fetchUserGuesses(currentUserId);
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
            <Layout currentUserId={currentUserId} onLogout={handleLogout}>
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
                    savedGuesses={savedGuesses}
                    onGuessChange={handleGuessChange}
                    onSave={handleSaveGuesses}
                    isSubmitting={isSubmitting}
                  />
                )}
              </div>
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/leaderboard"
        element={
          currentUserId ? (
            <Layout currentUserId={currentUserId} onLogout={handleLogout}>
              <div className="py-4 md:py-8 h-full">
                <LeaderboardPodium
                  users={leaderboard}
                  currentUserId={currentUserId}
                  isLoading={isLoadingLeaderboard}
                />
              </div>
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
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
