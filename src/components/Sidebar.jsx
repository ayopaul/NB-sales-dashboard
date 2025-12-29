import {
  LayoutDashboard,
  Map,
  BarChart3,
  Package,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ view, setView, collapsed }) => {
  const { isDark } = useTheme();

  const mainNavItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'map', icon: Map, label: 'Map View' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'brands', icon: Package, label: 'Brands' },
    { id: 'trends', icon: TrendingUp, label: 'Trends' },
  ];

  if (collapsed) {
    return (
      <aside className={`w-16 transition-all duration-200 ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } border-r flex flex-col h-full shrink-0`}>
        <nav className="flex-1 p-2 pt-4 space-y-1">
          {mainNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              title={item.label}
              className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                view === item.id
                  ? isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                  : isDark ? 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>

        {/* Bottom icons */}
        <div className={`p-2 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            title="Settings"
            className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
              isDark ? 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`w-60 transition-all duration-200 ${
      isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    } border-r flex flex-col h-full shrink-0`}>

      {/* Main Navigation */}
      <div className="flex-1 py-4">
        <div className="px-4 mb-2">
          <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Menu
          </p>
        </div>
        <nav className="px-2 space-y-1">
          {mainNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                view === item.id
                  ? isDark
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : isDark
                    ? 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <item.icon className={`w-5 h-5 ${view !== item.id ? 'opacity-70' : ''}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Other Section */}
        <div className="px-4 mt-8 mb-2">
          <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Other
          </p>
        </div>
        <nav className="px-2 space-y-1">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isDark ? 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <Settings className="w-5 h-5 opacity-70" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isDark ? 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <HelpCircle className="w-5 h-5 opacity-70" />
            <span className="text-sm font-medium">Help</span>
          </button>
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className={`p-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <button className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
          isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
        }`}>
          <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            AD
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Admin User
            </p>
            <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              admin@breweries.ng
            </p>
          </div>
          <LogOut className={`w-4 h-4 shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
