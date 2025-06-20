import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a name to a URL-safe format by replacing spaces with hyphens
 * and encoding special characters
 */
export function nameToUrl(name: string): string {
  return encodeURIComponent(name.trim().replace(/\s+/g, '-'));
}

/**
 * Convert a URL-safe name back to the original format by replacing hyphens with spaces
 * and decoding special characters
 */
export function urlToName(urlName: string): string {
  return decodeURIComponent(urlName).replace(/-/g, ' ');
}
