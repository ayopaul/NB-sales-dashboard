import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Header } from '@/components/layout/Header';
import { Main } from '@/components/layout/Main';
import { Search } from '@/components/layout/Search';
import { ThemeSwitch } from '@/components/layout/ThemeSwitch';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  brands,
  generateRegionSalesData,
  formatCurrency,
  zones,
} from '@/data/salesData';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, Clock } from 'lucide-react';

// Generate weekly data (Fridays)
const generateWeeklyData = (baseValue) => {
  const weeks = [];
  const today = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));
    // Adjust to Friday
    const day = date.getDay();
    const diff = day <= 5 ? 5 - day : 5 + 7 - day;
    date.setDate(date.getDate() + diff - 7);

    const variation = 0.7 + Math.random() * 0.6;
    weeks.push({
      week: `Week ${12 - i}`,
      date: date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
      value: Math.round(baseValue * variation / 12),
    });
  }
  return weeks;
};

export default function BrandDetail() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [regionData] = useState(() => generateRegionSalesData());

  const brand = brands.find((b) => b.id === brandId);

  // Calculate brand data
  const brandStats = useMemo(() => {
    if (!brand) return null;

    let currentSales = 0;
    let previousSales = 0;
    const regionBreakdown = {};
    const zoneBreakdown = {};

    Object.entries(regionData).forEach(([regionName, data]) => {
      const zone = data.zone;
      const value = data.brandBreakdown[brandId] || 0;

      currentSales += value;
      previousSales += value * (1 - data.percentChange / 100);

      if (!regionBreakdown[regionName]) {
        regionBreakdown[regionName] = { value: 0, zone };
      }
      regionBreakdown[regionName].value += value;

      if (!zoneBreakdown[zone]) {
        zoneBreakdown[zone] = 0;
      }
      zoneBreakdown[zone] += value;
    });

    const percentChange = previousSales > 0
      ? parseFloat((((currentSales - previousSales) / previousSales) * 100).toFixed(1))
      : 0;

    return {
      currentSales,
      previousSales,
      percentChange,
      trend: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable',
      regionBreakdown,
      zoneBreakdown,
      weeklyData: generateWeeklyData(currentSales),
    };
  }, [brand, brandId, regionData]);

  if (!brand || !brandStats) {
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
          <div className="text-center py-12">
            <p className="text-muted-foreground">Brand not found</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/brands')}>
              Back to Brands
            </Button>
          </div>
        </Main>
      </>
    );
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-muted-foreground" />;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-muted-foreground text-xs">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Top regions for this brand
  const topRegions = Object.entries(brandStats.regionBreakdown)
    .sort(([, a], [, b]) => b.value - a.value)
    .slice(0, 5);

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
        {/* Back Button & Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate('/brands')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Brands
          </Button>

          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: brand.color }}
            >
              {brand.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight">{brand.name}</h2>
              <p className="text-muted-foreground">
                Detailed performance and regional breakdown
              </p>
            </div>
            <Badge
              variant={brandStats.trend === 'up' ? 'default' : brandStats.trend === 'down' ? 'destructive' : 'secondary'}
              className={`flex items-center gap-1 text-base px-3 py-1 ${
                brandStats.trend === 'up' ? 'bg-green-500' : ''
              }`}
            >
              {getTrendIcon(brandStats.trend)}
              {brandStats.percentChange > 0 ? '+' : ''}{brandStats.percentChange}%
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(brandStats.currentSales)}</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Previous Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(Math.round(brandStats.previousSales))}</div>
              <p className="text-xs text-muted-foreground">Last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Regions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(brandStats.regionBreakdown).length}</div>
              <p className="text-xs text-muted-foreground">Selling this brand</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Frequency</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Weekly</div>
              <p className="text-xs text-muted-foreground">Updated every Friday</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Weekly Performance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Performance</CardTitle>
                  <CardDescription>Volume submitted every Friday (last 12 weeks)</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Last updated: Friday</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={brandStats.weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`gradient-${brand.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={brand.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={brand.color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      className="fill-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      className="fill-muted-foreground"
                      width={45}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={brand.color}
                      strokeWidth={2}
                      fill={`url(#gradient-${brand.id})`}
                      dot={{ fill: brand.color, strokeWidth: 0, r: 3 }}
                      activeDot={{ r: 5, fill: brand.color }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Zone Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Zone Breakdown</CardTitle>
              <CardDescription>Volume by geographical zone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(brandStats.zoneBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([zoneKey, value]) => {
                  const zone = zones[zoneKey];
                  const percentage = ((value / brandStats.currentSales) * 100).toFixed(0);
                  return (
                    <div key={zoneKey}>
                      <div className="flex justify-between text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: zone?.color }}
                          />
                          <span>{zone?.name} Zone</span>
                        </div>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                      <Progress value={parseFloat(percentage)} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(value)}
                      </p>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </div>

        {/* Regional Performance */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Top performing regions for {brand.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {topRegions.map(([regionName, data], index) => {
                const zone = zones[data.zone];
                const percentage = ((data.value / brandStats.currentSales) * 100).toFixed(1);
                return (
                  <div
                    key={regionName}
                    className="p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: brand.color }}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm truncate">{regionName}</span>
                    </div>
                    <p className="text-lg font-bold">{formatCurrency(data.value)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: zone?.color }}
                      />
                      <span className="text-xs text-muted-foreground">{zone?.name} Zone</span>
                      <span className="text-xs text-muted-foreground">• {percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Data Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Weekly Submissions</CardTitle>
            <CardDescription>Historical data submitted every Friday</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Week</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date (Friday)</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Volume</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {brandStats.weeklyData.map((week, index) => {
                    const prevWeek = brandStats.weeklyData[index - 1];
                    const change = prevWeek
                      ? (((week.value - prevWeek.value) / prevWeek.value) * 100).toFixed(1)
                      : 0;
                    return (
                      <tr key={week.week} className="border-b last:border-0">
                        <td className="py-3 px-4">{week.week}</td>
                        <td className="py-3 px-4 text-muted-foreground">{week.date}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(week.value)}</td>
                        <td className={`py-3 px-4 text-right ${
                          parseFloat(change) > 0 ? 'text-green-500' : parseFloat(change) < 0 ? 'text-red-500' : 'text-muted-foreground'
                        }`}>
                          {index > 0 ? `${parseFloat(change) > 0 ? '+' : ''}${change}%` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  );
}
