'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className="w-full h-8 justify-start gap-2 px-2"
      variant="ghost"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="text-muted-foreground size-4 dark:hidden" />
      <Moon className="text-muted-foreground size-4 hidden dark:block" />
      <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </Button>
  );
}
