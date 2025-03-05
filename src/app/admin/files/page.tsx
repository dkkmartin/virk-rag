"use client"

import { useEffect, useState } from "react"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FileInfo, PaginationParams } from "@/lib/admin-api"
import { Edit, MoreHorizontal, Plus, Trash2, FileText, Eye } from "lucide-react"
import { format } from "date-fns"

export default function FilesPage() {
  const { api, isLoading } = useAdmin()
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10,
    total: 0,
  })
  const [sortBy, setSortBy] = useState<PaginationParams["sort_by"]>("last_modified")
  const [order, setOrder] = useState<PaginationParams["order"]>("desc")
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [fileDetails, setFileDetails] = useState<any>(null)

  useEffect(() => {
    if (api && !isLoading) {
      fetchFiles()
    }
  }, [api, isLoading])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const response = await api?.listFiles({
        skip: pagination.skip,
        limit: pagination.limit,
        sort_by: sortBy,
        order: order,
      })

      if (response) {
        setFiles(response.files)
        setPagination({
          skip: response.pagination.skip,
          limit: response.pagination.limit,
          total: response.pagination.total,
        })
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewFile = async (cvrNumber: string) => {
    setSelectedFile(cvrNumber)
    setIsViewDialogOpen(true)

    try {
      const details = await api?.getFileDetails(cvrNumber)
      if (details) {
        setFileDetails(details)
      }
    } catch (error) {
      console.error("Error fetching file details:", error)
    }
  }

  const handleDeleteFile = async () => {
    if (!selectedFile) return

    try {
      await api?.deleteFile(selectedFile)
      setIsDeleteDialogOpen(false)
      fetchFiles()
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next" && pagination.skip + pagination.limit < pagination.total) {
      setPagination((prev) => ({
        ...prev,
        skip: prev.skip + prev.limit,
      }))
    } else if (direction === "prev" && pagination.skip > 0) {
      setPagination((prev) => ({
        ...prev,
        skip: Math.max(0, prev.skip - prev.limit),
      }))
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm")
  }

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(2)} KB`
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`
    }
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-lg font-semibold">Files Management</h1>
            <p className="text-sm text-muted-foreground">View and manage all files in the system</p>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="sort-by">Sort By</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as PaginationParams["sort_by"])}>
                  <SelectTrigger id="sort-by" className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_modified">Last Modified</SelectItem>
                    <SelectItem value="cvr_number">CVR Number</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Select value={order} onValueChange={(value) => setOrder(value as PaginationParams["order"])}>
                  <SelectTrigger id="order" className="w-[180px]">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New File
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CVR Number</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Age (Days)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading files...
                    </TableCell>
                  </TableRow>
                ) : files.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No files found
                    </TableCell>
                  </TableRow>
                ) : (
                  files.map((file) => (
                    <TableRow key={file.cvr_number}>
                      <TableCell className="font-medium">{file.cvr_number}</TableCell>
                      <TableCell>{formatFileSize(file.size_kb)}</TableCell>
                      <TableCell>{formatDate(file.last_modified)}</TableCell>
                      <TableCell>{file.age_days}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewFile(file.cvr_number)}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedFile(file.cvr_number)
                                setIsDeleteDialogOpen(true)
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {pagination.skip + 1} to {Math.min(pagination.skip + pagination.limit, pagination.total)} of{" "}
              {pagination.total} files
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange("prev")}
                disabled={pagination.skip === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange("next")}
                disabled={pagination.skip + pagination.limit >= pagination.total}
              >
                Next
              </Button>
            </div>
          </div>

          {/* View File Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  File Details: {selectedFile}
                </DialogTitle>
                <DialogDescription>Detailed information about the selected file</DialogDescription>
              </DialogHeader>
              {fileDetails ? (
                <div className="max-h-[60vh] overflow-auto">
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">File Information</h3>
                      <div className="mt-2 space-y-2 rounded-md border p-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Size:</span>
                          <span className="text-sm">{formatFileSize(fileDetails.file_info.size_kb)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Last Modified:</span>
                          <span className="text-sm">{formatDate(fileDetails.file_info.last_modified)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Age (Days):</span>
                          <span className="text-sm">{fileDetails.file_info.age_days}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Path:</span>
                          <span className="text-sm truncate max-w-[200px]">{fileDetails.file_info.path}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Content Preview</h3>
                      <div className="mt-2 rounded-md border p-3">
                        <pre className="text-xs overflow-auto max-h-[200px]">
                          {JSON.stringify(fileDetails.content, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">Loading file details...</div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the file with CVR number {selectedFile}? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteFile}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

