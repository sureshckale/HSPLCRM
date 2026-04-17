/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'New': return 'bg-blue-100 text-blue-700';
    case 'Won': return 'bg-green-100 text-green-700';
    case 'Lost': return 'bg-red-100 text-red-700';
    case 'Negotiation': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
