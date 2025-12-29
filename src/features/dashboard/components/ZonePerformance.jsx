import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/data/salesData';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function ZonePerformance({ data }) {
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
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          barSize={24}
        >
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
            className="text-xs fill-muted-foreground"
          />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            className="text-xs fill-muted-foreground"
            width={50}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, _, props) => [
                  formatCurrency(value),
                  `(${props.payload.change > 0 ? '+' : ''}${props.payload.change}%)`,
                ]}
              />
            }
          />
          <Bar dataKey="sales" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      <div className="space-y-2">
        {chartData.map((zone) => (
          <div
            key={zone.name}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: zone.color }}
              />
              <span className="text-sm text-muted-foreground">{zone.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {formatCurrency(zone.sales)}
              </span>
              <span
                className={`text-xs font-medium ${
                  zone.change > 0
                    ? 'text-green-500'
                    : zone.change < 0
                    ? 'text-red-500'
                    : 'text-muted-foreground'
                }`}
              >
                {zone.change > 0 ? '+' : ''}
                {zone.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
