import { useState } from 'react';
import { EmptyState } from './EmptyState';

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
};

export type Guess = {
  scoreA: number | '';
  scoreB: number | '';
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
  const [activeTab, setActiveTab] = useState<'today' | 'future'>('today');
  
  const localTodayStr = new Date().toISOString().split('T')[0];

  const filteredMatches = matches.filter(match => {
    const iso = match.date.toISOString();
    return activeTab === 'today' ? iso.startsWith(localTodayStr) : iso > `${localTodayStr}T23:59:59Z`;
  });

  const hasPendingMatches = filteredMatches.some(m => m.status === 'SCHEDULED' && !savedGuesses[m.id]);

  return (
    <div className="flex flex-col h-full pb-20 md:pb-4 relative">
      {/* Tabs Header */}
      <div className="flex bg-[#0f1c29] p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'today' 
              ? 'bg-primary text-background shadow-md' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Jogos de Hoje
        </button>
        <button
          onClick={() => setActiveTab('future')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'future' 
              ? 'bg-primary text-background shadow-md' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Jogos Futuros
        </button>
      </div>

      {/* Matches List */}
      <div className="space-y-6 flex-1">
        {filteredMatches.length === 0 ? (
          <EmptyState message={activeTab === 'today' ? "Nenhum jogo marcado para hoje." : "Nenhum jogo futuro encontrado."} />
        ) : (
          filteredMatches.map(match => {
            const guess = guesses[match.id] || { scoreA: '', scoreB: '' };
            
            return (
              <div key={match.id} className="bg-surface rounded-2xl overflow-hidden shadow-lg border border-gray-800">
                <div className="bg-[#1f364d] text-center py-2 text-xs font-bold text-gray-300 tracking-wider flex items-center justify-center gap-2 flex-wrap">
                  {match.date.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase()} ÀS {match.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  {match.status === 'LIVE' && (
                    <span className="flex items-center gap-1 text-primary">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      AO VIVO
                    </span>
                  )}
                  {match.status === 'FINISHED' && (
                    <span className="text-gray-400 ml-2">(ENCERRADO)</span>
                  )}
                  {!!savedGuesses[match.id] && match.status === 'SCHEDULED' && (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full ml-2">✓ Palpite Registrado</span>
                  )}
                </div>
                
                <div className="p-6 flex items-center justify-between">
                  {/* Team A */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-2 overflow-hidden border-2 border-gray-700">
                      {match.logoA ? (
                        <img src={match.logoA} alt={match.timeA} className="w-12 h-12 object-contain" />
                      ) : (
                        <span className="text-3xl">{match.timeAFlag}</span>
                      )}
                    </div>
                    <span className="font-semibold text-sm">{match.timeA}</span>
                  </div>

                  {/* Scores */}
                  <div className="flex items-center gap-4 flex-1 justify-center">
                    {match.status === 'FINISHED' && match.placarOficialA !== undefined ? (
                      <div className="w-14 h-16 bg-[#0f1c29] text-gray-300 text-center text-2xl font-bold rounded-xl flex items-center justify-center opacity-75 border border-gray-700">
                        {match.placarOficialA}
                      </div>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={guess.scoreA}
                        disabled={match.status !== 'SCHEDULED' || !!savedGuesses[match.id] || isSubmitting}
                        onChange={(e) => onGuessChange(match.id, 'A', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        className={`w-14 h-16 text-center text-2xl font-bold rounded-xl transition-all ${
                          match.status !== 'SCHEDULED' || !!savedGuesses[match.id]
                            ? 'bg-[#0f1c29] text-gray-300 opacity-75 border border-gray-700 cursor-not-allowed'
                            : 'bg-[#1f364d] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background'
                        }`}
                      />
                    )}
                    
                    <span className="text-gold font-bold text-xl">X</span>
                    
                    {match.status === 'FINISHED' && match.placarOficialB !== undefined ? (
                      <div className="w-14 h-16 bg-[#0f1c29] text-gray-300 text-center text-2xl font-bold rounded-xl flex items-center justify-center opacity-75 border border-gray-700">
                        {match.placarOficialB}
                      </div>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={guess.scoreB}
                        disabled={match.status !== 'SCHEDULED' || !!savedGuesses[match.id] || isSubmitting}
                        onChange={(e) => onGuessChange(match.id, 'B', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        className={`w-14 h-16 text-center text-2xl font-bold rounded-xl transition-all ${
                          match.status !== 'SCHEDULED' || !!savedGuesses[match.id]
                            ? 'bg-[#0f1c29] text-gray-300 opacity-75 border border-gray-700 cursor-not-allowed'
                            : 'bg-[#1f364d] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background'
                        }`}
                      />
                    )}
                  </div>

                  {/* Team B */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-2 overflow-hidden border-2 border-gray-700">
                      {match.logoB ? (
                        <img src={match.logoB} alt={match.timeB} className="w-12 h-12 object-contain" />
                      ) : (
                        <span className="text-3xl">{match.timeBFlag}</span>
                      )}
                    </div>
                    <span className="font-semibold text-sm">{match.timeB}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating/Sticky Action Button */}
      {filteredMatches.length > 0 && hasPendingMatches && (
        <div className="sticky bottom-0 left-0 right-0 py-4 mt-6 bg-gradient-to-t from-background via-background to-transparent z-10">
          <button
            onClick={onSave}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-[#00c868] text-background font-bold text-xl py-4 rounded-xl shadow-[0_4px_20px_rgba(0,230,118,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
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
