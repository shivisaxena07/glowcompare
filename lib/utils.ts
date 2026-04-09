import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Platform, PlatformPrice } from '@/src/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function getBestPrice(prices: PlatformPrice[]): PlatformPrice | null {
  const available = prices.filter((p) => p.availability)
  if (available.length === 0) return null
  return available.reduce((best, p) => (p.price < best.price ? p : best))
}
