import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/layout/Header';
import { Main } from '@/components/layout/Main';
import { Search } from '@/components/layout/Search';
import { ThemeSwitch } from '@/components/layout/ThemeSwitch';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegionDetails from '@/components/RegionDetails';

import {
  generateRegionSalesData,
  generateStateSalesData,
  generateActivityLog,
  calculateZoneTotals,
  brands,
  zones,
  formatCurrency,
} from '@/data/salesData';

import { OverviewCards } from './components/OverviewCards';
import { OverviewChart } from './components/OverviewChart';
import { RecentSales } from './components/RecentSales';
import { NigeriaMapCard } from './components/NigeriaMapCard';
import { ZonePerformance } from './components/ZonePerformance';
import { BrandDistribution } from './components/BrandDistribution';

export default function Dashboard() {
  const { isDark } = useTheme();
  const [selectedBrands, setSelectedBrands] = useState(brands.map((b) => b.id));
  const [selectedZones, setSelectedZones] = useState(Object.keys(zones));
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [showRegionDetails, setShowRegionDetails] = useState(false);

  // Generate demo data
  const [regionData, setRegionData] = useState(() => generateRegionSalesData());
  const [stateData, setStateData] = useState(() => generateStateSalesData());
  const [activityLog, setActivityLog] = useState(() => generateActivityLog());

  const zoneTotals = useMemo(() => calculateZoneTotals(regionData), [regionData]);

  // Calculate filtered data
  const filteredRegionData = useMemo(() => {
    const filtered = {};
    Object.entries(regionData).forEach(([key, data]) => {
      if (selectedZones.includes(data.zone)) {
        filtered[key] = data;
      }
    });
    return filtered;
  }, [regionData, selectedZones]);

  const totalSales = useMemo(() => {
    return Object.values(filteredRegionData).reduce((sum, r) => sum + r.currentSales, 0);
  }, [filteredRegionData]);

  const totalPreviousSales = useMemo(() => {
    return Object.values(filteredRegionData).reduce((sum, r) => sum + r.previousSales, 0);
  }, [filteredRegionData]);

  const overallChange = useMemo(() => {
    if (totalPreviousSales === 0) return 0;
    return ((totalSales - totalPreviousSales) / totalPreviousSales * 100).toFixed(1);
  }, [totalSales, totalPreviousSales]);

  // Combined monthly sales for trend chart
  const combinedMonthlySales = useMemo(() => {
    const monthlyTotals = {};
    Object.values(filteredRegionData).forEach((region) => {
      region.monthlySales.forEach((month) => {
        const key = `${month.month} ${month.year}`;
        if (!monthlyTotals[key]) {
          monthlyTotals[key] = { month: month.month, year: month.year, value: 0 };
        }
        monthlyTotals[key].value += month.value;
      });
    });
    return Object.values(monthlyTotals);
  }, [filteredRegionData]);

  // Combined brand breakdown
  const combinedBrandBreakdown = useMemo(() => {
    const totals = {};
    brands.forEach((b) => {
      totals[b.id] = 0;
    });
    Object.values(filteredRegionData).forEach((region) => {
      Object.entries(region.brandBreakdown).forEach(([brandId, value]) => {
        if (selectedBrands.includes(brandId)) {
          totals[brandId] += value;
        }
      });
    });
    return totals;
  }, [filteredRegionData, selectedBrands]);

  const handleRefresh = () => {
    setRegionData(generateRegionSalesData());
    setStateData(generateStateSalesData());
    setActivityLog(generateActivityLog());
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    if (region) {
      setShowRegionDetails(true);
    }
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
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
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Nigerian Breweries sales overview and regional performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleRefresh}>Refresh Data</Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewCards
              totalSales={totalSales}
              overallChange={parseFloat(overallChange)}
              activeRegions={Object.keys(filteredRegionData).length}
              activeBrands={selectedBrands.length}
            />

            <Card>
              <CardHeader>
                <CardTitle>Sales by Region</CardTitle>
                <CardDescription>Click a region for details</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <NigeriaMapCard
                  regionData={filteredRegionData}
                  onRegionSelect={handleRegionSelect}
                  onStateSelect={handleStateSelect}
                  selectedRegion={selectedRegion}
                  selectedState={selectedState}
                />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Zone Performance</CardTitle>
                  <CardDescription>Sales by geographical zone</CardDescription>
                </CardHeader>
                <CardContent>
                  <ZonePerformance data={zoneTotals} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>12-month performance overview</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <OverviewChart data={combinedMonthlySales} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Brand Distribution</CardTitle>
                  <CardDescription>Sales by brand</CardDescription>
                </CardHeader>
                <CardContent>
                  <BrandDistribution data={combinedBrandBreakdown} />
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalSales / 150)}</div>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders Processed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Distributors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground">+3 new this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5%</div>
                  <p className="text-xs text-muted-foreground">+0.3% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>Latest sales activity across regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales activities={activityLog} />
                </CardContent>
              </Card>
              <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Top Regions</CardTitle>
                  <CardDescription>Best performing regions this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(filteredRegionData)
                      .sort(([, a], [, b]) => b.currentSales - a.currentSales)
                      .slice(0, 5)
                      .map(([name, data]) => (
                        <div key={name} className="flex items-center">
                          <div
                            className="h-2 w-2 rounded-full mr-3"
                            style={{ backgroundColor: data.color }}
                          />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{name}</p>
                            <p className="text-sm text-muted-foreground">
                              {zones[data.zone]?.name || data.zone}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatCurrency(data.currentSales)}</p>
                            <p className={`text-xs ${data.trend === 'up' ? 'text-green-500' : data.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                              {data.percentChange > 0 ? '+' : ''}{data.percentChange}%
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>

      <RegionDetails
        region={selectedRegion}
        regionData={regionData}
        stateData={stateData}
        open={showRegionDetails}
        onOpenChange={setShowRegionDetails}
        onStateSelect={handleStateSelect}
      />
    </>
  );
}
