import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { brands, formatCurrency } from '../data/salesData';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

// Chart configuration for shadcn
const salesChartConfig = {
  value: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  current: {
    label: 'Current Month',
    color: 'hsl(var(--chart-1))',
  },
  previous: {
    label: 'Previous Month',
    color: 'hsl(var(--chart-2))',
  },
};

// Sales Trend Area Chart using shadcn
export const SalesTrendChart = ({ data, height = 300 }) => {
  const { isDark } = useTheme();

  const chartConfig = {
    value: {
      label: 'Sales',
      color: isDark ? '#34d399' : '#10b981',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isDark ? '#34d399' : '#10b981'} stopOpacity={0.3} />
            <stop offset="95%" stopColor={isDark ? '#34d399' : '#10b981'} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? '#1f2937' : '#f3f4f6'}
          strokeOpacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickMargin={12}
        />
        <YAxis
          tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
          tickMargin={8}
          width={50}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `Month: ${label}`}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={isDark ? '#34d399' : '#10b981'}
          strokeWidth={2}
          fill="url(#salesGradient)"
          dot={false}
          activeDot={{ r: 5, fill: isDark ? '#34d399' : '#10b981', stroke: isDark ? '#111827' : '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  );
};

// Brand Distribution Pie Chart
export const BrandDistributionChart = ({ data, height = 300 }) => {
  const { isDark } = useTheme();

  const chartData = brands
    .filter(brand => data[brand.id] > 0)
    .map(brand => ({
      name: brand.name,
      value: data[brand.id],
      color: brand.color,
      fill: brand.color,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.color };
    return acc;
  }, {});

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatCurrency(value)}
            />
          }
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          layout="vertical"
          align="right"
          verticalAlign="middle"
        />
      </PieChart>
    </ChartContainer>
  );
};

// Regional Comparison Bar Chart
export const RegionalComparisonChart = ({ data, height = 300 }) => {
  const { isDark } = useTheme();

  const chartData = Object.entries(data)
    .map(([name, regionData]) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      fullName: name,
      current: regionData.currentSales,
      previous: regionData.previousSales,
      color: regionData.color,
    }))
    .sort((a, b) => b.current - a.current)
    .slice(0, 8);

  const chartConfig = {
    current: {
      label: 'Current Month',
      color: isDark ? '#34d399' : '#10b981',
    },
    previous: {
      label: 'Previous Month',
      color: isDark ? '#374151' : '#d1d5db',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        barGap={2}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? '#1f2937' : '#f3f4f6'}
          strokeOpacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          angle={-45}
          textAnchor="end"
          height={60}
          tickMargin={8}
        />
        <YAxis
          tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
          tickMargin={8}
          width={50}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => [
                formatCurrency(value),
                name === 'current' ? 'Current' : 'Previous',
              ]}
              labelFormatter={(_, payload) => payload[0]?.payload?.fullName}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="previous"
          fill={isDark ? '#374151' : '#d1d5db'}
          radius={[6, 6, 0, 0]}
        />
        <Bar dataKey="current" fill={isDark ? '#34d399' : '#10b981'} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};

// Zone Performance Chart
export const ZonePerformanceChart = ({ data, height = 200 }) => {
  const { isDark } = useTheme();

  const chartData = Object.entries(data).map(([key, zone]) => ({
    name: zone.name,
    sales: zone.totalSales,
    change: zone.percentChange,
    color: zone.color,
    fill: zone.color,
  }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.color };
    return acc;
  }, {});

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 10, left: 50, bottom: 0 }}
        barSize={20}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? '#1f2937' : '#f3f4f6'}
          strokeOpacity={0.5}
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
          tickMargin={8}
        />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          width={45}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, _, props) => [
                formatCurrency(value),
                `Sales (${props.payload.change > 0 ? '+' : ''}${props.payload.change}%)`,
              ]}
            />
          }
        />
        <Bar dataKey="sales" radius={[0, 8, 8, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

// Mini Sparkline Chart
export const SparklineChart = ({ data, trend, height = 40 }) => {
  const color = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';

  const chartConfig = {
    value: {
      label: 'Value',
      color,
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <LineChart data={data.slice(-6)}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};
