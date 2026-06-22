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
                <div className="flex flex-col items-center flex-1 z-0">
                  <div className="w-12 h-12 rounded-full bg-surface border-2 border-gray-400 flex items-center justify-center mb-[-20px] z-10 shadow-lg">
                    <Medal size={20} className="text-gray-400" />
                  </div>
                  <div className="bg-surface w-full rounded-t-2xl border-t border-gray-400 border-opacity-30 pt-8 pb-4 flex flex-col items-center h-36 justify-end px-2">
                    <div className="w-16 h-16 rounded-full bg-[#1f364d] border-2 border-gray-400 flex items-center justify-center mb-2 overflow-hidden shadow-[0_0_15px_rgba(156,163,175,0.4)]">
                      {second.avatarUrl ? (
                        <img src={second.avatarUrl} alt={second.nomeGuerra} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold">{second.initials}</span>
                      )}
                    </div>
                    <span className="font-semibold text-sm truncate w-full text-center">{second.nomeGuerra}</span>
                    <span className="text-xs text-gray-400">{second.points} pts</span>
                  </div>
                </div>
              )}

              {/* First Place (Gold) */}
              {first && (
                <div className="flex flex-col items-center flex-1 z-10">
                  <div className="w-16 h-16 rounded-full bg-surface border-2 border-gold flex items-center justify-center mb-[-28px] z-20 shadow-[0_0_20px_rgba(255,214,0,0.5)]">
                    <Medal size={28} className="text-gold" />
                  </div>
                  <div className="bg-surface w-full rounded-t-2xl border-t-2 border-gold border-opacity-50 pt-10 pb-4 flex flex-col items-center h-48 justify-end px-2 shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,214,0,0.1)] to-transparent rounded-t-2xl pointer-events-none"></div>
                    <div className="w-20 h-20 rounded-full bg-[#1f364d] border-2 border-gold flex items-center justify-center mb-2 overflow-hidden shadow-[0_0_20px_rgba(255,214,0,0.6)] z-10">
                      {first.avatarUrl ? (
                        <img src={first.avatarUrl} alt={first.nomeGuerra} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold">{first.initials}</span>
                      )}
                    </div>
                    <span className="font-bold text-base truncate w-full text-center z-10">{first.nomeGuerra}</span>
                    <span className="text-gold font-bold text-sm z-10">{first.points} pts</span>
                  </div>
                </div>
              )}

              {/* Third Place (Bronze) */}
              {third && (
                <div className="flex flex-col items-center flex-1 z-0">
                  <div className="w-10 h-10 rounded-full bg-surface border-2 border-[#CD7F32] flex items-center justify-center mb-[-16px] z-10 shadow-lg">
                    <Medal size={16} className="text-[#CD7F32]" />
                  </div>
                  <div className="bg-surface w-full rounded-t-2xl border-t border-[#CD7F32] border-opacity-30 pt-6 pb-4 flex flex-col items-center h-32 justify-end px-2">
                    <div className="w-14 h-14 rounded-full bg-[#1f364d] border-2 border-[#CD7F32] flex items-center justify-center mb-2 overflow-hidden shadow-[0_0_10px_rgba(205,127,50,0.4)]">
                      {third.avatarUrl ? (
                        <img src={third.avatarUrl} alt={third.nomeGuerra} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold">{third.initials}</span>
                      )}
                    </div>
                    <span className="font-semibold text-xs truncate w-full text-center">{third.nomeGuerra}</span>
                    <span className="text-xs text-gray-400">{third.points} pts</span>
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
                    className={`flex items-center p-4 rounded-xl border ${
                      isCurrentUser 
                        ? 'bg-[#0f291e] border-primary shadow-[0_0_15px_rgba(0,230,118,0.15)]' 
                        : 'bg-surface border-gray-800'
                    }`}
                  >
                    <div className={`w-8 font-bold text-lg ${isCurrentUser ? 'text-primary' : 'text-gray-400'}`}>
                      {rank}
                    </div>
                    
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      isCurrentUser ? 'bg-primary text-background' : 'bg-[#1f364d] text-white'
                    }`}>
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.nomeGuerra} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="font-bold text-sm">{user.initials}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 font-semibold truncate">
                      {user.nomeGuerra}
                    </div>
                    
                    <div className={`font-bold ${isCurrentUser ? 'text-primary' : 'text-gray-300'}`}>
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
