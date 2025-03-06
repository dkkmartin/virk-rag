'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

interface DataItem {
  period: string;
  value: number;
}

interface BarChartProps {
  data: DataItem[];
  className?: string;
  height?: number;
}

export default function SimpleBarChart({ data, className = '', height = 300 }: BarChartProps) {
  return (
    <ChartContainer
      config={{
        value: {
          label: 'Count',
          color: 'hsl(var(--chart-1))',
        },
      }}
      className={className}
      style={{ minHeight: `${height}px` }}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          left: 32,
          right: 32,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">{payload[0].name}</span>
                      <span className="font-bold text-foreground">{payload[0].payload.period}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Value</span>
                      <span className="font-bold text-foreground">{payload[0].value}</span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="value"
          fill="white"
          radius={4}
          activeBar={{ fill: 'rgba(255, 255, 255, 0.8)' }}
        />
      </BarChart>
    </ChartContainer>
  );
}
