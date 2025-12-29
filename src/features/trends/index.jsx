import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Header } from '@/components/layout/Header';
import { Main } from '@/components/layout/Main';
import { Search } from '@/components/layout/Search';
import { ThemeSwitch } from '@/components/layout/ThemeSwitch';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  brands,
  generateRegionSalesData,
  formatCurrency,
} from '@/data/salesData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Trends() {
  const navigate = useNavigate();
  const [regionData] = useState(() => generateRegionSalesData());

  // Generate monthly trend data for each brand
  const brandTrendData = useMemo(() => {
    const brandMonthly = {};

    brands.forEach((brand) => {
      brandMonthly[brand.id] = {
        ...brand,
        monthlyData: months.map((month, idx) => ({
          month,
          value: 0,
        })),
        totalCurrent: 0,
        totalPrevious: 0,
      };
    });

    // Aggregate monthly data from regions
    Object.values(regionData).forEach((region) => {
      region.monthlySales.forEach((monthData, idx) => {
        // Distribute monthly sales across brands based on brand breakdown ratio
        const totalBrandValue = Object.values(region.brandBreakdown).reduce((a, b) => a + b, 0);

        Object.entries(region.brandBreakdown).forEach(([brandId, brandValue]) => {
          if (brandMonthly[brandId] && totalBrandValue > 0) {
            const ratio = brandValue / totalBrandValue;
            brandMonthly[brandId].monthlyData[idx].value += monthData.value * ratio;
          }
        });
      });

      // Calculate totals
      Object.entries(region.brandBreakdown).forEach(([brandId, value]) => {
        if (brandMonthly[brandId]) {
          brandMonthly[brandId].totalCurrent += value;
          brandMonthly[brandId].totalPrevious += value * (1 - (region.percentChange / 100));
        }
      });
    });

    // Calculate percent change for each brand
    Object.values(brandMonthly).forEach((brand) => {
      if (brand.totalPrevious > 0) {
        brand.percentChange = parseFloat(
          (((brand.totalCurrent - brand.totalPrevious) / brand.totalPrevious) * 100).toFixed(1)
        );
      } else {
        brand.percentChange = 0;
      }
      brand.trend = brand.percentChange > 0 ? 'up' : brand.percentChange < 0 ? 'down' : 'stable';
    });

    return Object.values(brandMonthly).sort((a, b) => b.totalCurrent - a.totalCurrent);
  }, [regionData]);

  // Combined chart data for all brands
  const combinedChartData = useMemo(() => {
    return months.map((month, idx) => {
      const dataPoint = { month };
      brandTrendData.slice(0, 6).forEach((brand) => {
        dataPoint[brand.name] = Math.round(brand.monthlyData[idx].value);
      });
      return dataPoint;
    });
  }, [brandTrendData]);

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
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
          <h2 className="text-2xl font-bold tracking-tight">Sales Trends</h2>
          <p className="text-muted-foreground">
            Brand performance trends over the past 12 months
          </p>
        </div>

        {/* Combined Trend Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Brand Performance Comparison</CardTitle>
            <CardDescription>Monthly volume trends for top 6 brands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    className="fill-muted-foreground"
                    width={50}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {brandTrendData.slice(0, 6).map((brand) => (
                    <Line
                      key={brand.id}
                      type="monotone"
                      dataKey={brand.name}
                      stroke={brand.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Individual Brand Trends */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brandTrendData.map((brand) => (
            <Card
              key={brand.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
              onClick={() => navigate(`/brands/${brand.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: brand.color }}
                    />
                    <CardTitle className="text-sm font-medium">{brand.name}</CardTitle>
                  </div>
                  <Badge
                    variant={brand.trend === 'up' ? 'default' : brand.trend === 'down' ? 'destructive' : 'secondary'}
                    className={`flex items-center gap-1 ${
                      brand.trend === 'up' ? 'bg-green-500' : ''
                    }`}
                  >
                    {getTrendIcon(brand.trend)}
                    {brand.percentChange > 0 ? '+' : ''}{brand.percentChange}%
                  </Badge>
                </div>
                <CardDescription>{formatCurrency(brand.totalCurrent)} total volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[120px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={brand.monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`gradient-${brand.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={brand.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={brand.color} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 9 }}
                        tickLine={false}
                        axisLine={false}
                        interval={2}
                        className="fill-muted-foreground"
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={brand.color}
                        strokeWidth={2}
                        fill={`url(#gradient-${brand.id})`}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  );
}
