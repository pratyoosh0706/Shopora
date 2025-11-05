'use server';

import { conversationalProductSearch } from '@/ai/flows/conversational-product-search';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';

export async function getProducts(): Promise<Product[]> {
  // In a real app, you'd fetch this from a database
  return Promise.resolve(products);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  // In a real app, you'd fetch this from a database
  return Promise.resolve(products.find((p) => p.id === id));
}

export async function askNova(
  query: string
): Promise<{ response: string; error: string | null }> {
  try {
    const response = await conversationalProductSearch(query);
    return { response, error: null };
  } catch (error) {
    console.error('Error with conversational search:', error);
    return {
      response: '',
      error: 'Sorry, I am having trouble connecting to my brain. Please try again later.',
    };
  }
}
