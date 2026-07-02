import React from 'react';
import { LogOut, User, Moon, Sun, Home } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';
import Clock from './Clock';

const Navbar = ({ onLogout, username, onGoHome }) => {
  const [theme, setTheme] = useDarkMode();

  return (
    <nav className="fixed w-full z-50 transition-colors duration-300 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <img src="/pantry-pal-icon.png" alt="Pantry Pal" className="w-12 h-12" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">
                Pantry Pal
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">

            {/* Home Button */}
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="p-2 text-teal-200 hover:text-white rounded-full transition-all"
                title="Home"
              >
                <Home size={20} />
              </button>
            )}

            {/* The Digital Clock */}
            <Clock />

            <div className="h-8 w-px bg-white/20 hidden md:block"></div>

            {/* User Profile */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <User size={16} className="text-teal-300" />
              <span className="text-sm font-semibold text-white">{username}</span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-teal-200 hover:text-red-300 hover:bg-red-500/20 rounded-full transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;