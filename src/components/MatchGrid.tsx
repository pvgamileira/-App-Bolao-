import { useState, useEffect } from 'react';
import { EmptyState } from './EmptyState';
import { supabase } from '../lib/supabaseclient';

export type Match = {
  id: string;
  timeA: string;
  timeAFlag: string;
  timeB: string;
  timeBFlag: string;
  date: Date;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  placarOficialA?: number;
  placarOficialB?: number;
  logoA?: string | null;
  logoB?: string | null;
  tempoDecorrido?: string | null;
  foiParaProrogacao?: boolean;
  foiParaPenaltis?: boolean;
  vencedorPenaltis?: 'A' | 'B' | null;
};

export type Guess = {
  scoreA: number | '';
  scoreB: number | '';
  points?: number | null;
};

type MatchGridProps = {
  matches: Match[];
  guesses: Record<string, Guess>;
  savedGuesses?: Record<string, Guess>;
  onGuessChange: (matchId: string, team: 'A' | 'B', value: number | '') => void;
  onSave: () => void;
  isSubmitting?: boolean;
};

export function MatchGrid({ matches, guesses, savedGuesses = {}, onGuessChange, onSave, isSubmitting = false }: MatchGridProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'all_matches'>('today');
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(todayStr);
  const [usersList, setUsersList] = useState<{id: string, nome_guerra: string}[]>([]);
  const [selectedPeerId, setSelectedPeerId] = useState<string>('');
  const [peerGuesses, setPeerGuesses] = useState<Record<string, {palpite_a: number, palpite_b: number}>>({});
  const [showLiveModalId, setShowLiveModalId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase
        .from('usuarios')
        .select('id, nome_guerra')
        .order('nome_guerra', { ascending: true });
      if (data) {
        setUsersList(data);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchPeerGuesses() {
      if (!selectedPeerId) {
        setPeerGuesses({});
        return;
      }
      const { data } = await supabase
        .from('palpites')
        .select('jogo_id, palpite_a, palpite_b')
        .eq('usuario_id', selectedPeerId);
      
      if (data) {
        const guessesMap: Record<string, {palpite_a: number, palpite_b: number}> = {};
        data.forEach(g => {
          guessesMap[g.jogo_id] = { palpite_a: g.palpite_a, palpite_b: g.palpite_b };
        });
        setPeerGuesses(guessesMap);
      }
    }
    fetchPeerGuesses();
  }, [selectedPeerId]);
  
  let filteredMatches: Match[] = [];
  if (matches.length > 0) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    
    filteredMatches = matches.filter(match => {
      const matchTime = match.date.getTime();
      
      if (activeTab === 'today') {
        return matchTime >= startOfToday && matchTime <= endOfToday;
      } else {
        let include = true;
        if (startDate) {
          const start = new Date(startDate + 'T00:00:00').getTime();
          if (matchTime < start) include = false;
        }
        if (endDate) {
          const end = new Date(endDate + 'T23:59:59.999').getTime();
          if (matchTime > end) include = false;
        }
        return include;
      }
    });
  }

  const hasPendingEdits = filteredMatches.some(m => {
    if (m.status !== 'SCHEDULED') return false;
    const currentGuess = guesses[m.id];
    const savedGuess = savedGuesses[m.id];
    if (!currentGuess) return false;
    
    // If no saved guess, any filled input is a pending edit
    if (!savedGuess) {
      return currentGuess.scoreA !== '' || currentGuess.scoreB !== '';
    }
    
    // If saved guess exists, check if inputs differ from saved
    return currentGuess.scoreA !== savedGuess.scoreA || currentGuess.scoreB !== savedGuess.scoreB;
  });

  const scheduledMatchesCount = filteredMatches.filter(m => m.status === 'SCHEDULED' || m.status === 'LIVE').length;
  const potentialPoints = scheduledMatchesCount * 5;

  return (
    <div className="flex flex-col h-full pb-20 md:pb-4 relative">
      {/* Tabs Header */}
      <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6 border border-slate-700/50">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
            activeTab === 'today' 
              ? 'bg-slate-700 text-teal-400 shadow-md scale-[1.02]' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
          }`}
        >
          Jogos de Hoje
        </button>
        <button
          onClick={() => setActiveTab('all_matches')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
            activeTab === 'all_matches' 
              ? 'bg-slate-700 text-teal-400 shadow-md scale-[1.02]' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
          }`}
        >
          Todos os Jogos
        </button>
      </div>

      {/* Potencial da Rodada Banner */}
      {potentialPoints > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <span className="text-sm font-semibold text-primary/90">
              Potencial Máximo: <strong className="text-primary text-base">{potentialPoints} pontos</strong>
            </span>
          </div>
          <button 
            onClick={() => window.alert(`Você tem ${scheduledMatchesCount} jogo(s) pendente(s) nesta tela.\n\nComo você ganha no máximo 5 pontos por palpite perfeito (acertando o placar exato), há um total de ${potentialPoints} pontos em jogo!\n\nBoa sorte!`)}
            className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary/30 transition-colors"
          >
            ?
          </button>
        </div>
      )}

      {activeTab === 'all_matches' && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1 ml-1 uppercase tracking-wider">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-inner"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1 ml-1 uppercase tracking-wider">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-inner"
            />
          </div>
        </div>
      )}

      {/* Peer Select Dropdown */}
      <div className="mb-6">
        <select
          value={selectedPeerId}
          onChange={(e) => setSelectedPeerId(e.target.value)}
          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-inner appearance-none cursor-pointer"
        >
          <option value="">🔍 Secar palpite de...</option>
          {usersList.map(user => (
            <option key={user.id} value={user.id}>{user.nome_guerra}</option>
          ))}
        </select>
      </div>

      {/* Matches List */}
      <div className="space-y-6 flex-1">
        {filteredMatches.length === 0 ? (
          <EmptyState message={activeTab === 'today' ? "Nenhum jogo marcado para hoje." : "Nenhum jogo futuro encontrado."} />
        ) : (
          filteredMatches.map(match => {
            const guess = guesses[match.id] || { scoreA: '', scoreB: '' };
            const isTbd = (name: string) => {
              if (!name) return true;
              const lower = name.toLowerCase();
              return lower.includes('group') || lower.includes('winner') || lower.includes('place') || lower.includes('round');
            };
            const tbdA = isTbd(match.timeA);
            const tbdB = isTbd(match.timeB);
            const isMatchTbd = tbdA || tbdB;
            
            return (
              <div key={match.id} className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 relative transition-all duration-300 hover:scale-[1.02] hover:border-slate-700 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] group">
                <div className="bg-slate-800/80 backdrop-blur-sm text-center py-2 text-[10px] font-bold text-slate-400 tracking-wider flex items-center justify-center gap-2 flex-wrap border-b border-slate-800 transition-colors group-hover:bg-slate-800">
                  {match.date.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase()} ÀS {match.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  {match.status === 'LIVE' && (
                    <span className="flex items-center gap-1 text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full border border-teal-400/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                      </span>
                      AO VIVO {match.tempoDecorrido ? `- ${match.tempoDecorrido}` : ''}
                    </span>
                  )}
                  {match.status === 'FINISHED' && (
                    <span className="text-slate-500 ml-2">(ENCERRADO)</span>
                  )}
                  {match.foiParaPenaltis && (
                    <span className="bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">PÊNALTIS</span>
                  )}
                  {!match.foiParaPenaltis && match.foiParaProrogacao && (
                    <span className="bg-amber-900/30 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">PRORROGAÇÃO</span>
                  )}
                  {!!savedGuesses[match.id] && match.status === 'SCHEDULED' && (
                    <span className="bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full ml-2 border border-teal-500/20 flex items-center gap-1">
                      <span className="text-[10px]">✓</span> Salvo
                    </span>
                  )}
                </div>
                
                <div className="p-6 flex items-center justify-between">
                  {/* Team A */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-3 overflow-hidden border border-slate-700 shadow-inner group-hover:border-slate-600 transition-colors">
                      {tbdA ? (
                        <span className="text-3xl opacity-30 grayscale">❓</span>
                      ) : match.logoA ? (
                        <img src={match.logoA} alt={match.timeA} className="w-11 h-11 object-contain drop-shadow-md" />
                      ) : (
                        <span className="text-3xl drop-shadow-md">{match.timeAFlag}</span>
                      )}
                    </div>
                    <span className="font-semibold text-sm text-center text-slate-200">
                      {tbdA ? "A Definir" : match.timeA}
                      {match.foiParaPenaltis && match.vencedorPenaltis === 'A' && <span className="ml-1 text-amber-400 text-lg drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" title="Venceu nos Pênaltis">👑</span>}
                    </span>
                  </div>

                  {/* Scores */}
                  <div className="flex items-center gap-3 flex-1 justify-center relative">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={guess.scoreA}
                      disabled={isMatchTbd || match.status !== 'SCHEDULED' || isSubmitting}
                      onChange={(e) => onGuessChange(match.id, 'A', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      className={`w-14 h-16 text-center text-2xl font-bold rounded-xl transition-all duration-300 ${
                        isMatchTbd || match.status !== 'SCHEDULED'
                          ? 'bg-slate-900/50 text-slate-500 border border-slate-800 cursor-not-allowed'
                          : 'bg-slate-800/80 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-slate-800 shadow-inner hover:bg-slate-700 hover:border-slate-600'
                      }`}
                    />
                    
                    <span className="text-slate-600 font-black text-sm uppercase">X</span>
                    
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={guess.scoreB}
                      disabled={isMatchTbd || match.status !== 'SCHEDULED' || isSubmitting}
                      onChange={(e) => onGuessChange(match.id, 'B', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      className={`w-14 h-16 text-center text-2xl font-bold rounded-xl transition-all duration-300 ${
                        isMatchTbd || match.status !== 'SCHEDULED'
                          ? 'bg-slate-900/50 text-slate-500 border border-slate-800 cursor-not-allowed'
                          : 'bg-slate-800/80 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-slate-800 shadow-inner hover:bg-slate-700 hover:border-slate-600'
                      }`}
                    />

                    {(match.status === 'LIVE' || match.status === 'FINISHED') && (
                      <button 
                        onClick={() => setShowLiveModalId(match.id)}
                        className="absolute -bottom-8 text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full whitespace-nowrap hover:bg-primary/40 transition-colors shadow-sm"
                      >
                        👁️ Ver Placar Real
                      </button>
                    )}
                  </div>

                  {/* Team B */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-3 overflow-hidden border border-slate-700 shadow-inner group-hover:border-slate-600 transition-colors">
                      {tbdB ? (
                        <span className="text-3xl opacity-30 grayscale">❓</span>
                      ) : match.logoB ? (
                        <img src={match.logoB} alt={match.timeB} className="w-11 h-11 object-contain drop-shadow-md" />
                      ) : (
                        <span className="text-3xl drop-shadow-md">{match.timeBFlag}</span>
                      )}
                    </div>
                    <span className="font-semibold text-sm text-center text-slate-200">
                      {tbdB ? "A Definir" : match.timeB}
                      {match.foiParaPenaltis && match.vencedorPenaltis === 'B' && <span className="ml-1 text-amber-400 text-lg drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" title="Venceu nos Pênaltis">👑</span>}
                    </span>
                  </div>
                </div>

                {match.status === 'FINISHED' && savedGuesses[match.id] && savedGuesses[match.id].points !== undefined && savedGuesses[match.id].points !== null && (
                  <div className="mx-6 mb-4 mt-2">
                    <div className="bg-slate-800/80 border border-slate-700 text-slate-300 rounded-xl p-3 flex items-center justify-between text-sm font-bold shadow-inner">
                      <span>Resultado Finalizado</span>
                      <div className={`px-3 py-1 rounded shadow-sm ${
                        (savedGuesses[match.id].points ?? 0) > 0 
                          ? 'bg-teal-500 text-slate-900' 
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        +{(savedGuesses[match.id].points ?? 0)} pts
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Match Modal Overlay - Now Fixed Global */}
                {showLiveModalId === match.id && (
                  <div className="fixed bottom-24 left-4 right-4 md:left-auto md:bottom-8 md:right-8 md:w-80 bg-slate-900/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5">
                    <button 
                      onClick={() => setShowLiveModalId(null)}
                      className="absolute top-2 right-4 text-slate-400 hover:text-white font-bold text-2xl transition-colors"
                    >
                      &times;
                    </button>
                    <h3 className="text-teal-400 font-bold text-lg mb-4 flex items-center gap-2 tracking-widest mt-2">
                      {match.status === 'LIVE' ? (
                        <>
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                          </span>
                          AO VIVO
                        </>
                      ) : (
                        'PLACAR FINAL'
                      )}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-2 w-full justify-center">
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 border border-slate-700 shadow-inner">
                          {match.logoA ? <img src={match.logoA} alt="Logo" className="w-8 h-8 object-contain drop-shadow-md" /> : <span className="text-2xl drop-shadow-md">{match.timeAFlag}</span>}
                        </div>
                        <span className="font-semibold text-center text-xs leading-tight text-slate-200">
                          {match.timeA}
                          {match.foiParaPenaltis && match.vencedorPenaltis === 'A' && <span className="ml-1 text-amber-400" title="Venceu nos Pênaltis">👑</span>}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
                        <span className="text-3xl font-bold text-white">{match.placarOficialA ?? '-'}</span>
                        <span className="text-slate-500 text-lg font-black uppercase">X</span>
                        <span className="text-3xl font-bold text-white">{match.placarOficialB ?? '-'}</span>
                      </div>
                      
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 border border-slate-700 shadow-inner">
                          {match.logoB ? <img src={match.logoB} alt="Logo" className="w-8 h-8 object-contain drop-shadow-md" /> : <span className="text-2xl drop-shadow-md">{match.timeBFlag}</span>}
                        </div>
                        <span className="font-semibold text-center text-xs leading-tight text-slate-200">
                          {match.timeB}
                          {match.foiParaPenaltis && match.vencedorPenaltis === 'B' && <span className="ml-1 text-amber-400" title="Venceu nos Pênaltis">👑</span>}
                        </span>
                      </div>
                    </div>
                    {match.status === 'LIVE' && match.tempoDecorrido && (
                      <span className="text-slate-400 font-bold tracking-widest text-sm mt-2">{match.tempoDecorrido}'</span>
                    )}
                  </div>
                )}

                {selectedPeerId && peerGuesses[match.id] && (
                  <div className="mx-6 mb-6 mt-2">
                    <div className="bg-slate-800 border border-slate-700/50 text-slate-300 rounded-lg p-2 text-xs flex items-center justify-center gap-1 font-semibold shadow-inner">
                      👥 Palpite de {usersList.find(u => u.id === selectedPeerId)?.nome_guerra}: {peerGuesses[match.id].palpite_a} x {peerGuesses[match.id].palpite_b}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating/Sticky Action Button */}
      {filteredMatches.length > 0 && hasPendingEdits && (
        <div className="sticky bottom-0 left-0 right-0 py-4 mt-6 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent z-10">
          <button
            onClick={onSave}
            disabled={isSubmitting}
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-xl py-4 rounded-xl shadow-[0_4px_20px_rgba(20,184,166,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none hover:shadow-[0_6px_25px_rgba(20,184,166,0.6)]"
            style={{ minHeight: '48px' }}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Meus Palpites'} 
            {!isSubmitting && <span className="text-2xl">⚽</span>}
          </button>
        </div>
      )}
    </div>
  );
}
