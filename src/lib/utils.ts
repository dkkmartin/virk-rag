import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';

  // Force UTC interpretation by appending "Z" (if missing)
  const date = new Date(dateString + 'Z');

  // Format time in "Europe/Copenhagen" (CET/CEST aware)
  const time = date
    .toLocaleTimeString('da-DK', {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Europe/Copenhagen',
    })
    .replace('.', ':');

  // Get today's and yesterday's dates in "Europe/Copenhagen"
  const now = new Date();
  const today = new Intl.DateTimeFormat('da-DK', {
    timeZone: 'Europe/Copenhagen',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(now);

  const yesterday = new Intl.DateTimeFormat('da-DK', {
    timeZone: 'Europe/Copenhagen',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(now.setDate(now.getDate() - 1)));

  // Format the given date for comparison
  const formattedDate = new Intl.DateTimeFormat('da-DK', {
    timeZone: 'Europe/Copenhagen',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  if (formattedDate === today) {
    return `Today at ${time}`;
  } else if (formattedDate === yesterday) {
    return `Yesterday at ${time}`;
  } else {
    return date.toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' });
  }
};
