//function to convert a date string into a human-readable "time ago" format
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  let seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) seconds = 0;
  if (seconds < 5) return "just now";

  const intervals: { seconds: number; label: string }[] = [
    { seconds: 60, label: 'second' },
    { seconds: 60, label: 'minute' },
    { seconds: 24, label: 'hour' },
    { seconds: 7, label: 'day' },
    { seconds: 4.34524, label: 'week' },
    { seconds: 12, label: 'month' },
    { seconds: Number.POSITIVE_INFINITY, label: 'year' },
  ];

  let i = 0;
  while (i < intervals.length - 1 && seconds >= (intervals[i]?.seconds ?? 1)) {
    seconds /= intervals[i]?.seconds ?? 1;
    i++;
  }

  const count = Math.floor(seconds);
  const interval = intervals[i];

  return `${count} ${interval?.label}${count !== 1 ? 's' : ''} ago`;
}