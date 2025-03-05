'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAdmin } from '@/components/admin/admin-provider';
import type { Statistics } from '@/lib/admin-api';
import { FileIcon } from 'lucide-react';

export default function AdminDashboard() {
  const { api, isLoading } = useAdmin();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (api && !isLoading) {
      const fetchData = async () => {
        try {
          const statsData = await api.getStatistics();
          setStatistics(statsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [api, isLoading]);

  // Prepare data for age distribution chart
  const ageDistributionData = statistics
    ? [
        { name: 'Last Day', value: statistics.age_distribution.last_day },
        { name: 'Last Week', value: statistics.age_distribution.last_week },
        { name: 'Last Month', value: statistics.age_distribution.last_month },
        { name: 'Older', value: statistics.age_distribution.older },
      ]
    : [];

  // Prepare data for size distribution chart
  const sizeDistributionData = statistics
    ? [
        { name: '0-10KB', value: statistics.size_distribution['0-10KB'] },
        { name: '10-50KB', value: statistics.size_distribution['10-50KB'] },
        { name: '50-100KB', value: statistics.size_distribution['50-100KB'] },
        { name: '100KB+', value: statistics.size_distribution['100KB+'] },
      ]
    : [];

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">File Management System Overview</p>
          </div>
        </header>
        <main className="flex-1 space-y-4 p-6">
          {loading ? (
            <div className="flex h-[50vh] items-center justify-center">
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statistics?.total_files.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {statistics?.total_size.megabytes.toFixed(2) || 0} MB total size
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>File Age Distribution</CardTitle>
                    <CardDescription>Distribution of files by age</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ageDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {ageDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>File Size Distribution</CardTitle>
                    <CardDescription>Distribution of files by size</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sizeDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {sizeDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
