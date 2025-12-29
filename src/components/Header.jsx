import { Sun, Moon, Search, User, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onToggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`h-14 border-b ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} flex items-center px-4 gap-4`}>
      {/* Left section - Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">NB</span>
        </div>
        <div className="hidden sm:block">
          <h1 className={`text-sm font-semibold leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Nigerian Breweries
          </h1>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Sales Dashboard
          </p>
        </div>
      </div>

      {/* Center section - Full width search */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search regions, brands, or states..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm ${
              isDark
                ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:border-gray-600'
                : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200 focus:border-gray-300'
            } border focus:outline-none transition-colors`}
          />
        </div>
      </div>

      {/* Right section - Icons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Settings */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User avatar */}
        <button className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold ml-2">
          AD
        </button>
      </div>
    </header>
  );
};

export default Header;
