'use client';

import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function SignInButton() {
  return (
    <Button variant="outline" onClick={() => signIn('github', { redirectTo: '/admin' })}>
      <Github className="h-5 w-5" />
      Sign in with GitHub
    </Button>
  );
}
