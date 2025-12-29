import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Main } from '@/components/layout/Main';
import { Search } from '@/components/layout/Search';
import { ThemeSwitch } from '@/components/layout/ThemeSwitch';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  brands,
  generateRegionSalesData,
  formatCurrency,
  zones,
} from '@/data/salesData';
import { TrendingUp, TrendingDown, Minus, Package, ChevronRight } from 'lucide-react';

export default function Brands() {
  const navigate = useNavigate();
  const [regionData] = useState(() => generateRegionSalesData());

  // Calculate brand totals across all regions
  const brandData = useMemo(() => {
    const totals = {};

    brands.forEach((brand) => {
      totals[brand.id] = {
        ...brand,
        currentSales: 0,
        previousSales: 0,
        regionBreakdown: {},
        zoneBreakdown: {},
      };
    });

    Object.entries(regionData).forEach(([regionName, data]) => {
      const zone = data.zone;
      Object.entries(data.brandBreakdown).forEach(([brandId, value]) => {
        if (totals[brandId]) {
          totals[brandId].currentSales += value;
          totals[brandId].previousSales += value * (1 - (data.percentChange / 100));

          // Region breakdown
          if (!totals[brandId].regionBreakdown[regionName]) {
            totals[brandId].regionBreakdown[regionName] = 0;
          }
          totals[brandId].regionBreakdown[regionName] += value;

          // Zone breakdown
          if (!totals[brandId].zoneBreakdown[zone]) {
            totals[brandId].zoneBreakdown[zone] = 0;
          }
          totals[brandId].zoneBreakdown[zone] += value;
        }
      });
    });

    // Calculate percent change and trend
    Object.values(totals).forEach((brand) => {
      if (brand.previousSales > 0) {
        brand.percentChange = parseFloat(
          (((brand.currentSales - brand.previousSales) / brand.previousSales) * 100).toFixed(1)
        );
      } else {
        brand.percentChange = 0;
      }
      brand.trend = brand.percentChange > 0 ? 'up' : brand.percentChange < 0 ? 'down' : 'stable';
    });

    return Object.values(totals).sort((a, b) => b.currentSales - a.currentSales);
  }, [regionData]);

  const totalVolume = useMemo(() => {
    return brandData.reduce((sum, b) => sum + b.currentSales, 0);
  }, [brandData]);

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">NB Brands</h2>
          <p className="text-muted-foreground">
            Nigerian Breweries brand performance overview
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brands.length}</div>
              <p className="text-xs text-muted-foreground">Active product brands</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
              <p className="text-xs text-muted-foreground">Across all brands</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Brand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandData[0]?.name}</div>
              <p className="text-xs text-muted-foreground">{formatCurrency(brandData[0]?.currentSales)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Growth</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const best = [...brandData].sort((a, b) => b.percentChange - a.percentChange)[0];
                return (
                  <>
                    <div className="text-2xl font-bold text-green-500">+{best?.percentChange}%</div>
                    <p className="text-xs text-muted-foreground">{best?.name}</p>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Brand Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brandData.map((brand, index) => {
            const marketShare = ((brand.currentSales / totalVolume) * 100).toFixed(1);

            return (
              <Card
                key={brand.id}
                className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                onClick={() => navigate(`/brands/${brand.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: brand.color }}
                      >
                        #{index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-base">{brand.name}</CardTitle>
                        <CardDescription>{marketShare}% market share</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={brand.trend === 'up' ? 'default' : brand.trend === 'down' ? 'destructive' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {getTrendIcon(brand.trend)}
                      {brand.percentChange > 0 ? '+' : ''}{brand.percentChange}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Volume</span>
                      <span className="font-medium">{formatCurrency(brand.currentSales)}</span>
                    </div>
                    <Progress value={parseFloat(marketShare)} className="h-2" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Zone Distribution</p>
                    <div className="space-y-1.5">
                      {Object.entries(brand.zoneBreakdown)
                        .sort(([, a], [, b]) => b - a)
                        .map(([zoneKey, value]) => {
                          const zone = zones[zoneKey];
                          const zoneShare = ((value / brand.currentSales) * 100).toFixed(0);
                          return (
                            <div key={zoneKey} className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: zone?.color }}
                              />
                              <span className="text-xs flex-1">{zone?.name}</span>
                              <span className="text-xs text-muted-foreground">{zoneShare}%</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t text-sm text-primary">
                    <span>View details</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Main>
    </>
  );
}
