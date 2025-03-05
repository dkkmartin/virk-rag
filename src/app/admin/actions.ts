'use server';

import { cookies } from 'next/headers';

export async function authenticate(apiKey: string) {
  // Get the API key from environment variables
  const validApiKey = process.env.ADMIN_API_KEY;

  // Check if the provided API key matches the valid API key
  if (apiKey === validApiKey) {
    // Set a cookie to indicate that the user is authenticated
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return { success: true };
  }

  return { success: false };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  return { success: true };
}
