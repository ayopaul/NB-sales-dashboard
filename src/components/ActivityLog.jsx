import { ShoppingCart, Target, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const iconMap = {
  'shopping-cart': ShoppingCart,
  'target': Target,
  'alert-triangle': AlertTriangle,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown
};

const typeColors = {
  sale: 'text-blue-400',
  target: 'text-green-400',
  alert: 'text-amber-400',
  growth: 'text-green-400',
  decline: 'text-red-400'
};

const ActivityLog = ({ activities, maxItems = 5 }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-2">
      {activities.slice(0, maxItems).map((activity) => {
        const Icon = iconMap[activity.icon] || ShoppingCart;
        const colorClass = typeColors[activity.type] || 'text-gray-400';

        return (
          <div
            key={activity.id}
            className={`flex items-start gap-2.5 p-2 rounded-md ${
              isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
            } transition-colors`}
          >
            <div className={`p-1.5 rounded-md shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {activity.message}
              </p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                {activity.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityLog;
