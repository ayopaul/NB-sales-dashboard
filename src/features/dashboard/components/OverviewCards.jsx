import { MapPin, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/data/salesData';

const NairaIcon = ({ className }) => (
  <span className={className} style={{ fontWeight: 600 }}>₦</span>
);

export function OverviewCards({ totalSales, overallChange, activeRegions, activeBrands }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <NairaIcon className="h-4 w-4 text-muted-foreground text-base" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
          <p className={`text-xs ${overallChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {overallChange >= 0 ? '+' : ''}{overallChange}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Regions</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeRegions}</div>
          <p className="text-xs text-muted-foreground">Sales regions active</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Brands Active</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeBrands}</div>
          <p className="text-xs text-muted-foreground">Product brands tracked</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          {overallChange >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${overallChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {overallChange >= 0 ? '+' : ''}{overallChange}%
          </div>
          <p className="text-xs text-muted-foreground">Month over month</p>
        </CardContent>
      </Card>
    </div>
  );
}
