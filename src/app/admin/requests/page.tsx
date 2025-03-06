'use client';

import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RequestStats {
  most_requested: Array<{
    cvr_number: string;
    requests: number;
  }>;
  total_tracked: number;
  all_requests: Record<string, number>;
}

export default function RequestsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<RequestStats | null>(null);

  const fetchStats = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch('/api/admin/requests');
      if (!response.ok) {
        throw new Error('Failed to fetch request statistics');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching request statistics:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/requests');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Request Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Track and analyze CVR number request patterns
            </p>
          </div>
          <Button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Statistics'}
          </Button>
        </header>

        <main className="flex-1 space-y-4 p-6">
          {loading ? (
            <div className="flex h-[50vh] items-center justify-center">
              <p>Loading request statistics...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tracked Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.total_tracked.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Unique CVR numbers tracked: {Object.keys(stats?.all_requests || {}).length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CVR Number</TableHead>
                      <TableHead className="text-right">Request Count</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.most_requested.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          No request data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      stats?.most_requested.map((item) => (
                        <TableRow key={item.cvr_number}>
                          <TableCell className="font-medium">{item.cvr_number}</TableCell>
                          <TableCell className="text-right">
                            {item.requests.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {((item.requests / (stats?.total_tracked || 1)) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
