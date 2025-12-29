import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingCart, Target, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const iconMap = {
  'shopping-cart': ShoppingCart,
  'target': Target,
  'alert-triangle': AlertTriangle,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
};

const typeColors = {
  'sale': 'bg-green-500/10 text-green-500',
  'target': 'bg-blue-500/10 text-blue-500',
  'alert': 'bg-yellow-500/10 text-yellow-500',
  'growth': 'bg-emerald-500/10 text-emerald-500',
  'decline': 'bg-red-500/10 text-red-500',
};

export function RecentSales({ activities }) {
  if (!activities || activities.length === 0) {
    return <div className="text-sm text-muted-foreground">No recent activity</div>;
  }

  return (
    <div className="space-y-6">
      {activities.slice(0, 5).map((activity) => {
        const Icon = iconMap[activity.icon] || ShoppingCart;
        const colorClass = typeColors[activity.type] || 'bg-gray-500/10 text-gray-500';

        return (
          <div key={activity.id} className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
