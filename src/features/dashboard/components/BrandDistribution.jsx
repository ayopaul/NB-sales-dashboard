import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { brands, formatCurrency } from '@/data/salesData';

export function BrandDistribution({ data }) {
  const chartData = brands
    .filter((brand) => data[brand.id] > 0)
    .map((brand) => ({
      name: brand.name,
      value: data[brand.id],
      color: brand.color,
      fill: brand.color,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-popover text-popover-foreground border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium text-sm">{item.name}</p>
          <p className="text-muted-foreground text-xs">{formatCurrency(item.value)}</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
