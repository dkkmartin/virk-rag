'use client';

import type React from 'react';

import { createContext, useContext, useState, useEffect } from 'react';
import { AdminApi } from '@/lib/admin-api';

// Create a context for the admin API
type AdminContextType = {
  api: AdminApi | null;
  isLoading: boolean;
};

const AdminContext = createContext<AdminContextType>({
  api: null,
  isLoading: true,
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [api, setApi] = useState<AdminApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the API with the Next.js API routes
    const adminApi = new AdminApi('/api', ''); // No API key needed here
    setApi(adminApi);
    setIsLoading(false);
  }, []);

  return <AdminContext.Provider value={{ api, isLoading }}>{children}</AdminContext.Provider>;
}
