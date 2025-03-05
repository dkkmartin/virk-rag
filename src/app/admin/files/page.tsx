'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '@/components/admin/admin-provider';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { JsonEditor } from 'json-edit-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FileDetailsResponse, FileInfo, PaginationParams } from '@/lib/admin-api';
import { Edit, MoreHorizontal, Plus, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

type FileContent = Record<string, unknown>;

const defaultJson: FileContent = {
  name: 'Example Company',
  address: {
    street: '123 Main St',
    city: 'Copenhagen',
    country: 'Denmark',
  },
  registrationDate: new Date().toISOString().split('T')[0],
};

export default function FilesPage() {
  const { api, isLoading } = useAdmin();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10,
    total: 0,
  });
  const [sortBy, setSortBy] = useState<PaginationParams['sort_by']>('last_modified');
  const [order, setOrder] = useState<PaginationParams['order']>('desc');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [fileDetails, setFileDetails] = useState<FileDetailsResponse | null>(null);
  const [newFile, setNewFile] = useState<{ cvrNumber: string; content: FileContent }>({
    cvrNumber: '',
    content: defaultJson,
  });
  const [editingFile, setEditingFile] = useState<{ cvrNumber: string; content: FileContent }>({
    cvrNumber: '',
    content: defaultJson,
  });
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (api && !isLoading) {
      fetchFiles();
    }
  }, [api, isLoading]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await api?.listFiles({
        skip: pagination.skip,
        limit: pagination.limit,
        sort_by: sortBy,
        order: order,
      });

      if (response) {
        setFiles(response.files);
        setPagination({
          skip: response.pagination.skip,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = async (cvrNumber: string) => {
    setSelectedFile(cvrNumber);
    setIsViewDialogOpen(true);

    try {
      const details = await api?.getFileDetails(cvrNumber);
      if (details) {
        setFileDetails(details);
      }
    } catch (error) {
      console.error('Error fetching file details:', error);
    }
  };

  const handleEditClick = async (cvrNumber: string) => {
    setSelectedFile(cvrNumber);
    setIsEditDialogOpen(true);

    try {
      const details = await api?.getFileDetails(cvrNumber);
      if (details) {
        setEditingFile({
          cvrNumber,
          content: details.content as FileContent,
        });
      }
    } catch (error) {
      console.error('Error fetching file details:', error);
    }
  };

  const handleDeleteFile = async () => {
    if (!selectedFile) return;

    try {
      await api?.deleteFile(selectedFile);
      setIsDeleteDialogOpen(false);
      fetchFiles();
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleCreateFile = async () => {
    if (!newFile.cvrNumber || !newFile.content) return;

    setCreating(true);
    try {
      await api?.createFile(newFile.cvrNumber, newFile.content);
      setIsCreateDialogOpen(false);
      setNewFile({ cvrNumber: '', content: defaultJson });
      fetchFiles();
      toast.success('File created successfully');
    } catch (error) {
      console.error('Error creating file:', error);
      toast.error('Failed to create file');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateFile = async () => {
    if (!editingFile.cvrNumber || !editingFile.content) return;

    setEditing(true);
    try {
      await api?.updateFile(editingFile.cvrNumber, editingFile.content);
      setIsEditDialogOpen(false);
      setEditingFile({ cvrNumber: '', content: defaultJson });
      fetchFiles();
      toast.success('File updated successfully');
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
    } finally {
      setEditing(false);
    }
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && pagination.skip + pagination.limit < pagination.total) {
      setPagination((prev) => ({
        ...prev,
        skip: prev.skip + prev.limit,
      }));
    } else if (direction === 'prev' && pagination.skip > 0) {
      setPagination((prev) => ({
        ...prev,
        skip: Math.max(0, prev.skip - prev.limit),
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(2)} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
  };

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
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as PaginationParams['sort_by'])}
                >
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
                <Select
                  value={order}
                  onValueChange={(value) => setOrder(value as PaginationParams['order'])}
                >
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                            <DropdownMenuItem onClick={() => handleEditClick(file.cvr_number)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedFile(file.cvr_number);
                                setIsDeleteDialogOpen(true);
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
              Showing {pagination.skip + 1} to{' '}
              {Math.min(pagination.skip + pagination.limit, pagination.total)} of {pagination.total}{' '}
              files
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('prev')}
                disabled={pagination.skip === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('next')}
                disabled={pagination.skip + pagination.limit >= pagination.total}
              >
                Next
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>

      {/* Create File Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              Enter the CVR number and content for the new file. The content must be valid JSON.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cvr-number">CVR Number</Label>
              <Input
                id="cvr-number"
                value={newFile.cvrNumber}
                onChange={(e) => setNewFile((prev) => ({ ...prev, cvrNumber: e.target.value }))}
                placeholder="Enter CVR number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content (JSON)</Label>
              <div className="min-h-[400px] max-h-[600px] overflow-hidden rounded-md border bg-background ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <JsonEditor
                  data={newFile.content as Record<string, unknown>}
                  setData={(data) =>
                    setNewFile((prev) => ({ ...prev, content: data as FileContent }))
                  }
                  onError={(error) => console.error('JSON Error:', error)}
                  theme={{
                    styles: {
                      container: {
                        backgroundColor: 'transparent',
                        color: theme === 'dark' ? '#ffffff' : '#000000',
                      },
                      string: theme === 'dark' ? '#7ee787' : '#0550ae',
                      number: theme === 'dark' ? '#79c0ff' : '#0550ae',
                      boolean: theme === 'dark' ? '#ff7b72' : '#cf222e',
                      null: theme === 'dark' ? '#ff7b72' : '#cf222e',
                      property: theme === 'dark' ? '#d2a8ff' : '#953800',
                      bracket: { color: theme === 'dark' ? '#ffffff' : '#000000' },
                      iconCollection: theme === 'dark' ? '#ffffff' : '#000000',
                      itemCount: { color: theme === 'dark' ? '#ffffff80' : '#00000080' },
                      input: { backgroundColor: theme === 'dark' ? '#ffffff10' : '#00000010' },
                      error: { color: theme === 'dark' ? '#ff7b72' : '#cf222e' },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFile} disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit File Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit File</DialogTitle>
            <DialogDescription>
              Edit the content of file {selectedFile}. The content must be valid JSON.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="min-h-[400px] max-h-[600px] overflow-hidden rounded-md border bg-background ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <JsonEditor
                data={editingFile.content as Record<string, unknown>}
                setData={(data) =>
                  setEditingFile((prev) => ({ ...prev, content: data as FileContent }))
                }
                onError={(error) => console.error('JSON Error:', error)}
                theme={{
                  styles: {
                    container: {
                      backgroundColor: 'transparent',
                      color: theme === 'dark' ? '#ffffff' : '#000000',
                    },
                    string: theme === 'dark' ? '#7ee787' : '#0550ae',
                    number: theme === 'dark' ? '#79c0ff' : '#0550ae',
                    boolean: theme === 'dark' ? '#ff7b72' : '#cf222e',
                    null: theme === 'dark' ? '#ff7b72' : '#cf222e',
                    property: theme === 'dark' ? '#d2a8ff' : '#953800',
                    bracket: { color: theme === 'dark' ? '#ffffff' : '#000000' },
                    iconCollection: theme === 'dark' ? '#ffffff' : '#000000',
                    itemCount: { color: theme === 'dark' ? '#ffffff80' : '#00000080' },
                    input: { backgroundColor: theme === 'dark' ? '#ffffff10' : '#00000010' },
                    error: { color: theme === 'dark' ? '#ff7b72' : '#cf222e' },
                  },
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFile} disabled={editing}>
              {editing ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View File Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
            <DialogDescription>Viewing details for file {selectedFile}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fileDetails ? (
              <div className="min-h-[400px] max-h-[600px] overflow-auto rounded-md border bg-background">
                <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-all">
                  <code className="text-foreground">
                    {JSON.stringify(fileDetails.content, null, 2)}
                  </code>
                </pre>
              </div>
            ) : (
              <p>Loading file details...</p>
            )}
          </div>
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
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the file with CVR number {selectedFile}? This action
              cannot be undone.
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
    </SidebarProvider>
  );
}
