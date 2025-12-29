import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { formatCurrency } from '@/data/salesData';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  value: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
};

export function OverviewChart({ data }) {
  const { isDark } = useTheme();

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs fill-muted-foreground"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
          className="text-xs fill-muted-foreground"
          width={60}
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
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          fill="url(#salesGradient)"
          dot={false}
          activeDot={{ r: 5, strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
