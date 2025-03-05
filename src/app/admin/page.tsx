"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useAdmin } from "@/components/admin/admin-provider"
import type { Statistics, SystemInfo } from "@/lib/admin-api"
import { FileIcon, HardDriveIcon, MemoryStickIcon, CpuIcon } from "lucide-react"

export default function AdminDashboard() {
  const { api, isLoading } = useAdmin()
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (api && !isLoading) {
      const fetchData = async () => {
        try {
          const [statsData, sysInfoData] = await Promise.all([api.getStatistics(), api.getSystemInfo()])
          setStatistics(statsData)
          setSystemInfo(sysInfoData)
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [api, isLoading])

  // Prepare data for age distribution chart
  const ageDistributionData = statistics
    ? [
        { name: "Last Day", value: statistics.age_distribution.last_day },
        { name: "Last Week", value: statistics.age_distribution.last_week },
        { name: "Last Month", value: statistics.age_distribution.last_month },
        { name: "Older", value: statistics.age_distribution.older },
      ]
    : []

  // Prepare data for size distribution chart
  const sizeDistributionData = statistics
    ? [
        { name: "0-10KB", value: statistics.size_distribution["0-10KB"] },
        { name: "10-50KB", value: statistics.size_distribution["10-50KB"] },
        { name: "50-100KB", value: statistics.size_distribution["50-100KB"] },
        { name: "100KB+", value: statistics.size_distribution["100KB+"] },
      ]
    : []

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

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
                    <div className="text-2xl font-bold">{statistics?.total_files.toLocaleString() || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {statistics?.total_size.megabytes.toFixed(2) || 0} MB total size
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                    <HardDriveIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemInfo?.disk.used_percent.toFixed(1) || 0}%</div>
                    <Progress value={systemInfo?.disk.used_percent || 0} className="mt-2" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {systemInfo ? (systemInfo.disk.total_gb - systemInfo.disk.free_gb).toFixed(1) : 0} GB of{" "}
                      {systemInfo?.disk.total_gb.toFixed(1) || 0} GB used
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                    <MemoryStickIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemInfo?.memory.used_percent.toFixed(1) || 0}%</div>
                    <Progress value={systemInfo?.memory.used_percent || 0} className="mt-2" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {systemInfo ? (systemInfo.memory.total_gb - systemInfo.memory.available_gb).toFixed(1) : 0} GB of{" "}
                      {systemInfo?.memory.total_gb.toFixed(1) || 0} GB used
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CPU Cores</CardTitle>
                    <CpuIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemInfo?.cpu_cores || 0}</div>
                    <p className="text-xs text-muted-foreground">Available processing cores</p>
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

              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Detailed system resource information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="disk">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="disk">Disk</TabsTrigger>
                      <TabsTrigger value="memory">Memory</TabsTrigger>
                    </TabsList>
                    <TabsContent value="disk" className="space-y-4">
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Space</span>
                          <span className="text-sm">{systemInfo?.disk.total_gb.toFixed(2) || 0} GB</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Free Space</span>
                          <span className="text-sm">{systemInfo?.disk.free_gb.toFixed(2) || 0} GB</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Used Space</span>
                          <span className="text-sm">
                            {systemInfo ? (systemInfo.disk.total_gb - systemInfo.disk.free_gb).toFixed(2) : 0} GB
                          </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Usage Percentage</span>
                          <span className="text-sm">{systemInfo?.disk.used_percent.toFixed(2) || 0}%</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="memory" className="space-y-4">
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Memory</span>
                          <span className="text-sm">{systemInfo?.memory.total_gb.toFixed(2) || 0} GB</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Available Memory</span>
                          <span className="text-sm">{systemInfo?.memory.available_gb.toFixed(2) || 0} GB</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Used Memory</span>
                          <span className="text-sm">
                            {systemInfo ? (systemInfo.memory.total_gb - systemInfo.memory.available_gb).toFixed(2) : 0}{" "}
                            GB
                          </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Usage Percentage</span>
                          <span className="text-sm">{systemInfo?.memory.used_percent.toFixed(2) || 0}%</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

