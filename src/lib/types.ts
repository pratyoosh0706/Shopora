import type { ImagePlaceholder } from './placeholder-images';

export type ProductCategory =
  | 'Tech'
  | 'Fashion'
  | 'Sports'
  | 'Home Goods'
  | 'Books';

export const productCategories: ProductCategory[] = [
  'Tech',
  'Fashion',
  'Sports',
  'Home Goods',
  'Books',
];

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: ImagePlaceholder;
};

export type User = {
  id: string;
  name: string;
  email: string;
  interests: ProductCategory[];
};

export type Order = {
  id: string;
  userId: string;
  productId: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  orderDate: string;
};

export type ChatMessage = {
  id: number;
  role: 'user' | 'assistant' | 'loading';
  content: string;
};
