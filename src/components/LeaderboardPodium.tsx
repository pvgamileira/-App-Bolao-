import { Medal } from 'lucide-react';
import { EmptyState } from './EmptyState';

export type UserRank = {
  id: string;
  nomeGuerra: string;
  points: number;
  initials: string;
  avatarUrl?: string; // For future when we have avatars
};

type LeaderboardPodiumProps = {
  users: UserRank[];
  currentUserId: string;
  isLoading?: boolean;
};

export function LeaderboardPodium({ users, currentUserId, isLoading = false }: LeaderboardPodiumProps) {
  // Sort users by points descending
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  
  const top3 = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3);

  // Ensure we have exactly 3 for the podium display, pad with empty if needed
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <div className="flex flex-col h-full pb-20 md:pb-4">
      <div className="p-4 flex-1">
        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center mt-12 space-y-8">
             <div className="w-full flex justify-center items-end gap-4 h-64 mb-8">
               <div className="w-24 h-36 bg-surface rounded-t-2xl"></div>
               <div className="w-24 h-48 bg-surface rounded-t-2xl"></div>
               <div className="w-24 h-32 bg-surface rounded-t-2xl"></div>
             </div>
             <div className="w-full h-16 bg-surface rounded-xl"></div>
             <div className="w-full h-16 bg-surface rounded-xl"></div>
             <div className="w-full h-16 bg-surface rounded-xl"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="mt-12">
            <EmptyState message="Nenhum palpite computado ainda. Salve seus palpites para entrar no ranking!" />
          </div>
        ) : (
          <>
            {/* Podium */}
            <div className="flex justify-center items-end gap-2 sm:gap-4 mb-10 mt-8 h-64">
              {/* Second Place (Silver) */}
              {second && (
                <div className="flex flex-col items-center flex-1 z-0 group">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-400 flex items-center justify-center mb-[-20px] z-10 shadow-lg transition-transform group-hover:scale-110">
                    <Medal size={20} className="text-slate-400 drop-shadow-md" />
                  </div>
                  <div className="bg-slate-800/80 w-full rounded-t-2xl border-t border-slate-400/30 pt-8 pb-4 flex flex-col items-center h-36 justify-end px-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-slate-700/80 group-hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-400 flex items-center justify-center mb-2 overflow-hidden shadow-[0_0_15px_rgba(148,163,184,0.4)]">
                      {second.avatarUrl ? (
                        <img src={second.avatarUrl} alt={second.nomeGuerra} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-slate-200">{second.initials}</span>
                      )}
                    </div>
                    <span className="font-semibold text-sm truncate w-full text-center text-slate-100">{second.nomeGuerra}</span>
                    <span className="text-xs text-slate-400 font-bold">{second.points} pts</span>
                  </div>
                </div>
              )}

              {/* First Place (Gold) */}
              {first && (
                <div className="flex flex-col items-center flex-1 z-10 group">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center mb-[-28px] z-20 shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-transform group-hover:scale-110">
                    <Medal size={28} className="text-amber-400 drop-shadow-md" />
                  </div>
                  <div className="bg-gradient-to-t from-slate-800/90 to-slate-800/70 w-full rounded-t-2xl border-t-2 border-amber-400/60 pt-10 pb-4 flex flex-col items-center h-48 justify-end px-2 shadow-2xl relative backdrop-blur-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_10px_40px_rgba(251,191,36,0.15)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(251,191,36,0.1)] to-transparent rounded-t-2xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-70"></div>
                    <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center mb-2 overflow-hidden shadow-[0_0_20px_rgba(251,191,36,0.6)] z-10 group-hover:shadow-[0_0_25px_rgba(251,191,36,0.8)] transition-shadow">
                      {first.avatarUrl ? (
                        <img src={first.avatarUrl} alt={first.nomeGuerra} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-slate-100">{first.initials}</span>
                      )}
                    </div>
                    <span className="font-bold text-base truncate w-full text-center z-10 text-white">{first.nomeGuerra}</span>
                    <span className="text-amber-400 font-bold text-sm z-10 drop-shadow-sm">{first.points} pts</span>
                  </div>
                </div>
              )}

              {/* Third Place (Bronze) */}
              {third && (
                <div className="flex flex-col items-center flex-1 z-0 group">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-[#CD7F32] flex items-center justify-center mb-[-16px] z-10 shadow-lg transition-transform group-hover:scale-110">
                    <Medal size={16} className="text-[#CD7F32] drop-shadow-md" />
                  </div>
                  <div className="bg-slate-800/80 w-full rounded-t-2xl border-t border-[#CD7F32]/40 pt-6 pb-4 flex flex-col items-center h-32 justify-end px-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-slate-700/80 group-hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-[#CD7F32] flex items-center justify-center mb-2 overflow-hidden shadow-[0_0_10px_rgba(205,127,50,0.4)]">
                      {third.avatarUrl ? (
                        <img src={third.avatarUrl} alt={third.nomeGuerra} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-slate-200">{third.initials}</span>
                      )}
                    </div>
                    <span className="font-semibold text-xs truncate w-full text-center text-slate-100">{third.nomeGuerra}</span>
                    <span className="text-xs text-slate-400 font-bold">{third.points} pts</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ranking List */}
            <div className="space-y-3">
              {rest.map((user, index) => {
                const isCurrentUser = user.id === currentUserId;
                const rank = index + 4; // Start from 4 since top 3 are above

                return (
                  <div 
                    key={user.id} 
                    className={`flex items-center p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                      isCurrentUser 
                        ? 'bg-teal-900/20 border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.1)]' 
                        : `bg-slate-800/40 border-slate-700/30 hover:bg-slate-700/60 hover:border-slate-600/50 ${index % 2 === 0 ? 'bg-slate-800/20' : ''}`
                    }`}
                  >
                    <div className={`w-8 font-bold text-lg ${isCurrentUser ? 'text-teal-400' : 'text-slate-500'}`}>
                      {rank}
                    </div>
                    
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 border shadow-inner ${
                      isCurrentUser ? 'bg-teal-500/20 text-teal-400 border-teal-500/50' : 'bg-slate-700 text-slate-300 border-slate-600'
                    }`}>
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.nomeGuerra} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="font-bold text-sm">{user.initials}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 font-semibold truncate text-slate-200">
                      {user.nomeGuerra}
                    </div>
                    
                    <div className={`font-bold ${isCurrentUser ? 'text-teal-400' : 'text-slate-400'}`}>
                      {user.points} pts
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
