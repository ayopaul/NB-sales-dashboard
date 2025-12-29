import { X, TrendingUp, TrendingDown, Minus, MapPin, Target, BarChart3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency, brands, zones, regionStates } from '../data/salesData';
import { SalesTrendChart, BrandDistributionChart } from './SalesCharts';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const RegionDetails = ({ region, regionData, open, onOpenChange }) => {
  const { isDark } = useTheme();

  if (!region || !regionData) return null;

  const data = regionData[region];
  if (!data) return null;

  const zone = zones[data.zone];
  const states = regionStates[region] || [];
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const trendColor = data.trend === 'up' ? 'text-green-500' : data.trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  // Get performance color based on percent change
  const getPerformanceBadge = (percentChange) => {
    if (percentChange >= 10) return { variant: 'default', label: 'Excellent', className: 'bg-green-500' };
    if (percentChange >= 5) return { variant: 'default', label: 'Good', className: 'bg-green-400' };
    if (percentChange >= 0) return { variant: 'default', label: 'Moderate', className: 'bg-lime-500' };
    if (percentChange >= -5) return { variant: 'default', label: 'Slight Decline', className: 'bg-yellow-500' };
    if (percentChange >= -10) return { variant: 'default', label: 'Declining', className: 'bg-orange-500' };
    return { variant: 'destructive', label: 'Poor', className: 'bg-red-500' };
  };

  const performanceBadge = getPerformanceBadge(data.percentChange);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 overflow-hidden">
        <ScrollArea className="h-full">
          {/* Header */}
          <SheetHeader className="sticky top-0 z-10 bg-background border-b p-4">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: data.color || 'hsl(var(--primary))' }}
              >
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl">{zone?.name} Zone</SheetTitle>
                <SheetDescription className="flex items-center gap-2 mt-1">
                  <span>{region}</span>
                  <span>•</span>
                  <span>{states.length} States</span>
                </SheetDescription>
              </div>
              <Badge className={performanceBadge.className}>
                {performanceBadge.label}
              </Badge>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">Current Sales</p>
                <p className="text-2xl font-bold">{formatCurrency(data.currentSales)}</p>
                <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
                  <TrendIcon className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">
                    {data.percentChange > 0 ? '+' : ''}{data.percentChange}%
                  </span>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">Previous Sales</p>
                <p className="text-2xl font-bold">{formatCurrency(data.previousSales)}</p>
                <p className="text-xs text-muted-foreground mt-1">Last month</p>
              </div>
            </div>

            {/* Target Progress */}
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Target Progress</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Monthly', current: data.currentSales, target: data.targets?.monthly || data.currentSales * 1.2 },
                  { label: 'Quarterly', current: data.currentSales * 2.5, target: data.targets?.quarterly || data.currentSales * 4 },
                  { label: 'Yearly', current: data.currentSales * 10, target: data.targets?.yearly || data.currentSales * 15 }
                ].map(item => {
                  const progress = Math.min(100, Math.round((item.current / item.target) * 100));
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sales Trend */}
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Sales History</span>
              </div>
              <SalesTrendChart data={data.monthlySales} height={180} />
            </div>

            {/* Brand Distribution */}
            <div className="rounded-xl border bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">Brand Distribution</h3>
              <BrandDistributionChart data={data.brandBreakdown} height={200} />
            </div>

            {/* States in Region */}
            <div className="rounded-xl border bg-card p-4">
              <h3 className="text-sm font-semibold mb-3">States in {region}</h3>
              <div className="flex flex-wrap gap-2">
                {states.map(state => (
                  <Badge key={state} variant="secondary">
                    {state}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Top Brands */}
            <div className="rounded-xl border bg-card p-4">
              <h3 className="text-sm font-semibold mb-3">Top Brands</h3>
              <div className="space-y-3">
                {brands
                  .map(brand => ({
                    ...brand,
                    sales: data.brandBreakdown[brand.id] || 0
                  }))
                  .sort((a, b) => b.sales - a.sales)
                  .slice(0, 5)
                  .map((brand, index) => (
                    <div key={brand.id} className="flex items-center gap-3">
                      <span className="text-xs w-5 text-muted-foreground font-medium">
                        #{index + 1}
                      </span>
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: brand.color }}
                      />
                      <span className="flex-1 text-sm truncate">
                        {brand.name}
                      </span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(brand.sales)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Zone Info */}
            <div className="rounded-xl border bg-card p-4">
              <h3 className="text-sm font-semibold mb-3">Zone Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Zone</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: zone?.color || '#888' }}
                    />
                    <span className="font-medium">{zone?.name}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Regions in Zone</span>
                  <span className="font-medium">{zone?.regions?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default RegionDetails;
