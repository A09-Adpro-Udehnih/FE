import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatName(name: string): string {
  const parts = name.split(' ');

  if (parts.length > 2) {
    return `${parts[0]} ${parts
      .slice(1)
      .map((word) => word[0].toUpperCase() + '.')
      .join(' ')}`;
  }

  return name;
}