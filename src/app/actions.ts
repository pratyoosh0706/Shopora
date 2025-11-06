
'use server';

import { conversationalProductSearch } from '@/ai/flows/conversational-product-search';
import { products as localProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { initializeFirebase } from '@/firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

export async function getProducts(): Promise<Product[]> {
  const { firestore } = initializeFirebase();
  const productsCollection = collection(firestore, 'products');
  const snapshot = await getDocs(productsCollection);
  if (snapshot.empty) {
    console.log('No products found in Firestore. Seeding database...');
    await seedDatabase();
    const seededSnapshot = await getDocs(productsCollection);
    return seededSnapshot.docs.map((doc) => doc.data() as Product);
  }
  return snapshot.docs.map((doc) => doc.data() as Product);
}

export async function getProductById(
  id: string
): Promise<Product | undefined> {
  const { firestore } = initializeFirebase();
  const productDoc = doc(firestore, 'products', id);
  const snapshot = await getDoc(productDoc);
  if (snapshot.exists()) {
    return snapshot.data() as Product;
  }
  return undefined;
}

async function seedDatabase() {
  console.log('Starting database seed...');
  const { firestore } = initializeFirebase();
  const productsCollection = collection(firestore, 'products');

  const promises = localProducts.map(async (product) => {
    const productRef = doc(productsCollection, product.id);
    try {
      await setDoc(productRef, product);
      console.log(`Seeded product: ${product.name}`);
    } catch (error) {
      console.error(`Failed to seed product ${product.id}:`, error);
    }
  });

  await Promise.all(promises);
  console.log('Database seeding complete.');
}

export async function askNova(
  query: string
): Promise<{ response: string; error: string | null }> {
  try {
    const products = await getProducts();
    const response = await conversationalProductSearch({
      query,
      products: JSON.stringify(products),
    });
    return { response, error: null };
  } catch (error) {
    console.error('Error with conversational search:', error);
    return {
      response: '',
      error:
        'Sorry, I am having trouble connecting to my brain. Please try again later.',
    };
  }
}
