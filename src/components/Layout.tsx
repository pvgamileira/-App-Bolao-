import { ReactNode } from 'react';
import { Trophy, CalendarDays, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

type LayoutProps = {
  children: ReactNode;
  currentUserId: string | null;
  onLogout: () => void;
};

export function Layout({ children, currentUserId, onLogout }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';
  const isLeaderboard = location.pathname === '/leaderboard';

  return (
    <div className="bg-background min-h-screen font-sans text-white relative overflow-x-hidden md:bg-black/20">
      <div className="max-w-6xl mx-auto md:px-4 w-full h-full min-h-screen flex flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between p-4 bg-surface md:rounded-b-2xl shadow-md border-b md:border border-gray-800 md:mt-2 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Trophy size={24} className="text-primary" />
            <span className="font-bold text-lg hidden md:block">Bolão da Firma</span>
          </div>

          {currentUserId && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isDashboard ? 'bg-[#0f291e] text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <CalendarDays size={20} />
                <span className="font-semibold">Matches</span>
              </Link>
              <Link
                to="/leaderboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isLeaderboard ? 'bg-[#0f291e] text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Trophy size={20} />
                <span className="font-semibold">Ranking</span>
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

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
          <div className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-surface border-t border-gray-800 flex justify-around items-center p-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isDashboard ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <CalendarDays size={24} />
              <span className="text-xs mt-1 font-semibold">Matches</span>
            </Link>

            <Link
              to="/leaderboard"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isLeaderboard ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Trophy size={24} />
              <span className="text-xs mt-1 font-semibold">Ranking</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
