import type { ReactNode } from 'react';
import { Trophy, CalendarDays, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

type LayoutProps = {
  children: ReactNode;
  currentUserId: string | null;
  onLogout: () => void;
};

export function Layout({ children, currentUserId, onLogout }: LayoutProps) {

  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';
  const isLeaderboard = location.pathname === '/leaderboard';

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center">
      <div className="max-w-6xl w-full h-full min-h-screen flex flex-col md:px-4">
        {/* Top Navigation */}
        <header className="flex items-center justify-between p-4 bg-slate-900/60 backdrop-blur-md md:rounded-b-2xl shadow-lg border-b md:border border-slate-700/50 md:mt-2 sticky top-0 z-50 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-xl">
              <Trophy size={24} className="text-teal-400" />
            </div>
            <span className="font-bold text-lg hidden md:block tracking-wide">Bolão da Firma</span>
          </div>

          {currentUserId && (
            <nav className="hidden md:flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDashboard ? 'bg-slate-700 text-teal-400 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <CalendarDays size={20} />
                <span className="font-semibold text-sm">Matches</span>
              </Link>
              <Link
                to="/leaderboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isLeaderboard ? 'bg-slate-700 text-teal-400 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <Trophy size={20} />
                <span className="font-semibold text-sm">Ranking</span>
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-4">
            {currentUserId && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
                <span className="hidden md:inline text-sm font-semibold">Sair</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full relative">
          {children}
        </main>

        {/* Bottom Navigation (Mobile Only) */}
        {currentUserId && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 flex justify-around items-center p-2 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isDashboard ? 'text-teal-400 scale-110' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <CalendarDays size={22} className={isDashboard ? 'drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]' : ''} />
              <span className="text-[10px] mt-1 font-semibold uppercase tracking-wider">Matches</span>
            </Link>

            <Link
              to="/leaderboard"
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isLeaderboard ? 'text-teal-400 scale-110' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Trophy size={22} className={isLeaderboard ? 'drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]' : ''} />
              <span className="text-[10px] mt-1 font-semibold uppercase tracking-wider">Ranking</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
