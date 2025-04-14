import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a URL string to ensure it has the correct protocol prefix.
 * Accepts various formats like:
 * - facebook.com/profile
 * - www.facebook.com/profile
 * - https://facebook.com/profile
 * 
 * @param url The URL string to format
 * @returns Properly formatted URL with https:// prefix
 */
export function formatUrl(url?: string): string | undefined {
  if (!url) return undefined;
  
  // Trim whitespace
  let formattedUrl = url.trim();
  
  // Check if URL already has a protocol
  if (!/^https?:\/\//i.test(formattedUrl)) {
    // If URL starts with www., add https:// prefix
    if (/^www\./i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    } else {
      // Otherwise, add https://www. prefix
      formattedUrl = `https://www.${formattedUrl}`;
    }
  }
  
  return formattedUrl;
}
