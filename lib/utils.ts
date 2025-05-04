import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { client } from "@/app/sanity/lib/client";

// function to merge classes without dublication
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  let seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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
  const interval = intervals[i] ?? { label: 'time', seconds: 1 }; // fallback to safe object

  return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}


// function to generate unique username
export async function generateUniqueUsername(fullName: string): Promise<string> {
  const names = fullName.trim().toLowerCase().split(" ");
  const firstName = names[0];
  const lastInitial = names[1]?.slice(0,2) ?? "";

  // Try up to 10 random variations
  for (let i = 0; i < 10; i++) {
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const username = `${firstName}${lastInitial}${randomDigits}`;

    const isTaken = await isUsernameTaken(username);
    if (!isTaken) return username;
  }

  throw new Error("Could not generate unique username");
}

async function isUsernameTaken(username: string): Promise<boolean> {
  const result = await client.fetch(
    `count(*[_type == "user" && username == $username]) > 0`,
    { username }
  );
  return result;
}
