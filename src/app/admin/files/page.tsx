'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { JsonEditor } from 'json-edit-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { FileIcon, ClockIcon, HardDriveIcon } from 'lucide-react';

type FileContent = Record<string, unknown>;

type FileInfo = {
  size_bytes: number;
  size_kb: number;
  last_modified: string;
  age_days: number;
  path: string;
};

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
  const [cvrNumber, setCvrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useTheme();
  const [editingFile, setEditingFile] = useState<{
    cvrNumber: string;
    content: FileContent;
    info?: FileInfo;
  }>({
    cvrNumber: '',
    content: defaultJson,
  });

  const handleFetch = async () => {
    if (!cvrNumber.trim()) {
      toast.error('Please enter a CVR number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/files/${cvrNumber}`);
      if (!response.ok) {
        if (response.status === 404) {
          setEditingFile({ cvrNumber: '', content: defaultJson });
          setIsEditing(false);
          toast.error('File not found');
        } else {
          throw new Error('Failed to fetch file');
        }
        return;
      }
      const data = await response.json();
      setEditingFile({
        cvrNumber,
        content: data.content as FileContent,
        info: data.file_info as FileInfo,
      });
      setIsEditing(true);
      toast.success('File loaded successfully');
    } catch (error) {
      console.error('Error fetching file:', error);
      toast.error('Failed to fetch file');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!cvrNumber.trim()) {
      toast.error('Please enter a CVR number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/files/${cvrNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: defaultJson }),
      });

      if (response.status === 409) {
        toast.error('File already exists');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to create file');
      }

      const data = await response.json();
      setEditingFile({
        cvrNumber,
        content: defaultJson,
        info: data.file_info as FileInfo,
      });
      setIsEditing(true);
      toast.success('File created successfully');
    } catch (error) {
      console.error('Error creating file:', error);
      toast.error('Failed to create file');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!cvrNumber.trim() || !editingFile.content) {
      toast.error('Missing CVR number or file content');
      return;
    }

    console.log('Updating file with content:', editingFile.content);

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/files/${cvrNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editingFile.content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update file');
      }

      const data = await response.json();
      // Update file info after successful update
      if (data.file_info) {
        setEditingFile((prev) => ({ ...prev, info: data.file_info as FileInfo }));
      }
      console.log('Update response:', data);
      toast.success('File updated successfully');
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!cvrNumber.trim()) {
      toast.error('Please enter a CVR number');
      return;
    }

    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/files/${cvrNumber}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setEditingFile({ cvrNumber: '', content: defaultJson });
      setIsEditing(false);
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-lg font-semibold">File Management</h1>
            <p className="text-sm text-muted-foreground">Manage individual CVR files</p>
          </div>
        </header>

        <main className="flex-1 space-y-4 p-6">
          <Card>
            <CardHeader>
              <CardTitle>CVR File Operations</CardTitle>
              <CardDescription>
                Enter a CVR number to create, read, update, or delete its associated file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="cvr-number">CVR Number</Label>
                  <Input
                    id="cvr-number"
                    value={cvrNumber}
                    onChange={(e) => setCvrNumber(e.target.value)}
                    placeholder="Enter CVR number"
                    disabled={loading}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleFetch} disabled={loading}>
                    Load
                  </Button>
                  <Button onClick={handleCreate} disabled={loading} variant="outline">
                    Create New
                  </Button>
                </div>
              </div>

              {isEditing && editingFile.info && (
                <div className="grid gap-4 rounded-lg border bg-muted/50 p-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <HardDriveIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Size</p>
                      <p className="text-sm text-muted-foreground">
                        {editingFile.info.size_kb.toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last Modified</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(editingFile.info.last_modified)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Path</p>
                      <p className="text-sm text-muted-foreground break-all">
                        {editingFile.info.path}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="space-y-2">
                  <Label>File Content</Label>
                  <div className="min-h-[400px] max-h-[600px] overflow-auto rounded-md border bg-background ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <div className="min-w-max">
                      <JsonEditor
                        data={editingFile.content}
                        setData={(data) =>
                          setEditingFile((prev) => ({ ...prev, content: data as FileContent }))
                        }
                        onError={(error) => console.error('JSON Error:', error)}
                        theme={{
                          styles: {
                            container: {
                              backgroundColor: 'transparent',
                              color: theme === 'dark' ? '#ffffff' : '#000000',
                              height: '100%',
                              overflow: 'auto',
                              whiteSpace: 'nowrap',
                              padding: '1rem',
                            },
                            string: theme === 'dark' ? '#7ee787' : '#0550ae',
                            number: theme === 'dark' ? '#79c0ff' : '#0550ae',
                            boolean: theme === 'dark' ? '#ff7b72' : '#cf222e',
                            null: theme === 'dark' ? '#ff7b72' : '#cf222e',
                            property: theme === 'dark' ? '#d2a8ff' : '#953800',
                            bracket: { color: theme === 'dark' ? '#ffffff' : '#000000' },
                            iconCollection: theme === 'dark' ? '#ffffff' : '#000000',
                            itemCount: { color: theme === 'dark' ? '#ffffff80' : '#00000080' },
                            input: {
                              backgroundColor: theme === 'dark' ? '#ffffff10' : '#00000010',
                              color: theme === 'dark' ? '#ffffff' : '#000000',
                            },
                            error: { color: theme === 'dark' ? '#ff7b72' : '#cf222e' },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end gap-2">
                <Button onClick={handleDelete} variant="destructive" disabled={loading}>
                  Delete
                </Button>
                <Button onClick={handleUpdate} disabled={loading}>
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
