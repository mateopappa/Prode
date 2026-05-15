import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function blurText(text: string): string {
  // Mostrar solo el largo con puntos
  return '•'.repeat(Math.min(text.length, 20));
}
