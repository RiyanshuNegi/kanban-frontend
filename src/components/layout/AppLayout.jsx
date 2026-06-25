import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function AppLayout({ children }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-mono text-gray-900">
      {/* Responsive Navigation Bar */}
      <nav className="border-b-4 border-gray-900 bg-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm z-10 relative">
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-center">
          Kanban_System
        </h1>
        <div className="flex gap-4 w-full sm:w-auto justify-center sm:justify-end">
          {user ? (
            <button 
              onClick={logout}
              className="border-2 border-gray-900 px-4 py-1 font-bold text-sm bg-red-500 text-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:translate-y-[2px] hover:shadow-none transition-all w-full sm:w-auto"
            >
              LOGOUT
            </button>
          ) : (
            <span className="border-2 border-gray-900 px-3 py-1 font-bold text-sm bg-gray-200">
              Status: Logged-Out
            </span>
          )}
        </div>
      </nav>

      <main className="flex-grow p-4 sm:p-6 flex flex-col">
        {children}
      </main>
    </div>
  );
}