import type React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { AdminProvider } from '@/components/admin/admin-provider';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'File Management System Admin Dashboard',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('admin_auth');

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    redirect('/auth/login');
  }

  return <AdminProvider>{children}</AdminProvider>;
}
