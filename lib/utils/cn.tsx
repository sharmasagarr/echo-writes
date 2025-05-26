import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// function to merge classes without dublication
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}