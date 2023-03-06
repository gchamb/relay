import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function properCase(name: string) {
  const firstChar = name.charAt(0).toUpperCase();
  return firstChar + name.substring(1, name.length).toLowerCase();
};