'use client';

import { useEffect, useState } from 'react';

import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Statistics } from '@/types/api';
import { Calendar, FileText, HardDrive, RefreshCw } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatDate } from '@/lib/utils';

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  function fetchStatistics() {
    const fetchData = async () => {
      setRefreshing(true);
      try {
        const response = await fetch('/api/admin/statistics?force_refresh=true');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setRefreshing(false);
      }
    };

    fetchData();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ageDistributionData = [
    { name: 'Last Day', value: statistics?.age_distribution.last_day || 0 },
    { name: 'Last Week', value: statistics?.age_distribution.last_week || 0 },
    { name: 'Last Month', value: statistics?.age_distribution.last_month || 0 },
    { name: 'Older', value: statistics?.age_distribution.older || 0 },
  ];

  const sizeDistributionData = [
    { name: '0-10KB', value: statistics?.size_distribution['0-10KB'] || 0 },
    { name: '10-50KB', value: statistics?.size_distribution['10-50KB'] || 0 },
    { name: '50-100KB', value: statistics?.size_distribution['50-100KB'] || 0 },
    { name: '100KB+', value: statistics?.size_distribution['100KB+'] || 0 },
  ];

  const formatYAxis = (value: string | number): string => {
    const numValue = Number(value);
    if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(1)}M`;
    }
    if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(0)}K`;
    }
    return String(value);
  };

  const formatTooltipValue = (value: string | number): string => {
    return Number(value).toLocaleString();
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Statistics</h1>
            <p className="text-sm text-muted-foreground">Detailed statistics about the files</p>
          </div>
          <Button
            onClick={() => fetchStatistics()}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Statistics'}
          </Button>
        </header>
        <main className="flex-1 space-y-6 p-6">
          {loading ? (
            <div className="flex h-[50vh] items-center justify-center">
              <p>Loading statistics...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                    <FileText size={20} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {statistics?.total_files.toLocaleString() || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                    <HardDrive size={20} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {statistics?.total_size.megabytes.toFixed(2) || 0} MB
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Last Calculated</CardTitle>
                    <Calendar size={20} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{formatDate(statistics?.last_calculated)}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>File Age Distribution</CardTitle>
                  <CardDescription>Number of files by age category</CardDescription>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  <ChartContainer
                    config={{
                      value: {
                        label: 'Number of Files',
                        color: 'hsl(var(--chart-1))',
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ageDistributionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" height={40} />
                        <YAxis
                          width={70}
                          allowDecimals={false}
                          domain={[0, 'dataMax']}
                          scale="linear"
                          tickFormatter={formatYAxis}
                          ticks={[0, 500000, 1000000, 1500000, 2000000]}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                          formatter={formatTooltipValue}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                        <Bar
                          dataKey="value"
                          fill="white"
                          name="Number of Files"
                          maxBarSize={40}
                          minPointSize={5}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File Size Distribution</CardTitle>
                  <CardDescription>Number of files by size category</CardDescription>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  <ChartContainer
                    config={{
                      value: {
                        label: 'Number of Files',
                        color: 'hsl(var(--chart-2))',
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sizeDistributionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" height={40} />
                        <YAxis
                          width={70}
                          allowDecimals={false}
                          domain={[0, 'dataMax']}
                          scale="linear"
                          tickFormatter={formatYAxis}
                          ticks={[0, 500000, 1000000, 1500000, 2000000]}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                          formatter={formatTooltipValue}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                        <Bar
                          dataKey="value"
                          fill="white"
                          name="Number of Files"
                          maxBarSize={40}
                          minPointSize={5}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
