"use client"

import { useEffect, useState } from "react"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Statistics } from "@/lib/admin-api"
import { RefreshCw } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function StatisticsPage() {
  const { api, isLoading } = useAdmin()
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (api && !isLoading) {
      fetchStatistics()
    }
  }, [api, isLoading])

  const fetchStatistics = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const stats = await api?.getStatistics(forceRefresh)
      if (stats) {
        setStatistics(stats)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Prepare data for age distribution chart
  const ageDistributionData = [
    { name: "Last Day", value: statistics?.age_distribution.last_day || 0 },
    { name: "Last Week", value: statistics?.age_distribution.last_week || 0 },
    { name: "Last Month", value: statistics?.age_distribution.last_month || 0 },
    { name: "Older", value: statistics?.age_distribution.older || 0 },
  ]

  // Prepare data for size distribution chart
  const sizeDistributionData = [
    { name: "0-10KB", value: statistics?.size_distribution["0-10KB"] || 0 },
    { name: "10-50KB", value: statistics?.size_distribution["10-50KB"] || 0 },
    { name: "50-100KB", value: statistics?.size_distribution["50-100KB"] || 0 },
    { name: "100KB+", value: statistics?.size_distribution["100KB+"] || 0 },
  ]

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Statistics</h1>
            <p className="text-sm text-muted-foreground">Detailed statistics about the file system</p>
          </div>
          <Button onClick={() => fetchStatistics(true)} disabled={refreshing} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Statistics"}
          </Button>
        </header>
        <main className="flex-1 space-y-6 p-6">
          {loading ? (
            <div className="flex h-[50vh] items-center justify-center">
              <p>Loading statistics...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics?.total_files.toLocaleString() || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics?.total_size.megabytes.toFixed(2) || 0} MB</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statistics?.system_info.disk_usage_percent.toFixed(1) || 0}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statistics?.system_info.memory_usage_percent.toFixed(1) || 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>File Age Distribution</CardTitle>
                  <CardDescription>Number of files by age category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Number of Files",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageDistributionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="value" fill="var(--color-value)" name="Number of Files" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File Size Distribution</CardTitle>
                  <CardDescription>Number of files by size category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Number of Files",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sizeDistributionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="value" fill="var(--color-value)" name="Number of Files" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Storage Path</h3>
                        <p className="mt-1 text-sm">{statistics?.storage_path || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Last Calculated</h3>
                        <p className="mt-1 text-sm">{formatDate(statistics?.last_calculated)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

