'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ArrowUp, FileIcon, Minus, RefreshCw } from 'lucide-react';
import type { Statistics } from '@/types/api';
import type { FilesStatistics } from '@/types/api';
import { formatDate } from '@/lib/utils';
import SimpleBarChart from '@/components/bar-chart';
import { Button } from '@/components/ui/button';
export default function AdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [filesStatistics, setFilesStatistics] = useState<FilesStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/admin/statistics?force_refresh=true');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchFilesStats = async () => {
    try {
      const response = await fetch('/api/admin/statistics/files');
      const data = await response.json();
      setFilesStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/statistics/files');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setFilesStatistics(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { period: 'Today', value: filesStatistics?.today || 0 },
    { period: 'This Week', value: filesStatistics?.this_week || 0 },
    { period: 'This Month', value: filesStatistics?.this_month || 0 },
    { period: 'This Year', value: filesStatistics?.this_year || 0 },
    { period: 'Total', value: filesStatistics?.total || 0 },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">File Management System Overview</p>
          </div>
          <Button onClick={fetchStats} disabled={refreshing} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Total Files Statistics'}
          </Button>
          <Button onClick={fetchFilesStats} disabled={refreshing} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Files Statistics'}
          </Button>
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
                    <FileIcon size={20} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {statistics?.total_files.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {statistics?.total_size.megabytes.toFixed(2) || 0} MB total size
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New files today</CardTitle>
                    {filesStatistics?.today && filesStatistics.today > 0 ? (
                      <ArrowUp size={20} color="#00ff00" />
                    ) : (
                      <Minus size={20} color="orange" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {filesStatistics?.today.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      As of {formatDate(filesStatistics?.timestamp || '')}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New files this week</CardTitle>
                    {filesStatistics?.this_week && filesStatistics.this_week > 0 ? (
                      <ArrowUp size={20} color="#00ff00" />
                    ) : (
                      <Minus size={20} color="orange" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {filesStatistics?.this_week.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      As of {formatDate(filesStatistics?.timestamp || '')}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New files total</CardTitle>
                    {filesStatistics?.total && filesStatistics.total > 0 ? (
                      <ArrowUp size={20} color="#00ff00" />
                    ) : (
                      <Minus size={20} color="orange" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {filesStatistics?.total.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      As of {formatDate(filesStatistics?.timestamp || '')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>New files</CardTitle>
                  </CardHeader>
                  {filesStatistics && filesStatistics && <SimpleBarChart data={chartData} />}
                </Card>
              </div>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
