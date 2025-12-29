import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency, formatNumber } from '../data/salesData';

const StatsCard = ({
  title,
  value,
  previousValue,
  percentChange,
  trend,
  icon: Icon,
  sparklineData,
  format = 'currency',
  size = 'normal',
  valueColor = ''
}) => {
  const { isDark } = useTheme();

  // Softer colors for deltas
  const getTrendColor = () => {
    if (trend === 'up') return isDark ? 'text-emerald-400/80' : 'text-emerald-600';
    if (trend === 'down') return isDark ? 'text-rose-400/80' : 'text-rose-600';
    return isDark ? 'text-gray-500' : 'text-gray-400';
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const formattedValue = format === 'currency'
    ? formatCurrency(value)
    : format === 'text'
      ? value
      : formatNumber(value);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 hover:shadow-lg ${
        isDark
          ? 'bg-gray-900/50 border-gray-800/50 hover:border-gray-700/50'
          : 'bg-white border-gray-200/50 hover:border-gray-300/50'
      }`}
    >
      <div className="p-6">
        {/* Title + Icon row */}
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
          {Icon && (
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
              <Icon className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
          )}
        </div>

        {/* Value */}
        <p className={`text-3xl font-semibold tracking-tight ${valueColor || (isDark ? 'text-white' : 'text-gray-900')}`}>
          {formattedValue}
        </p>

        {/* Delta - below the number */}
        {percentChange !== undefined && (
          <div className={`flex items-center gap-1.5 mt-3 text-sm ${getTrendColor()}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="font-medium">
              {percentChange > 0 ? '+' : ''}{percentChange}%
            </span>
            <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              from last month
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
