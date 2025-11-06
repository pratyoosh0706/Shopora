
'use client';

import { getProducts } from '@/app/actions';
import { ProductGrid } from '@/components/product-grid';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useFirebase();

  useEffect(() => {
    setIsMounted(true);
    getProducts().then((prods) => {
      setProducts(prods);
      setIsLoading(false);
    });
  }, []);

  const sortedProducts = useMemo(() => {
    if (!user || !user.interests || user.interests.length === 0) {
      return products;
    }
    const userInterests = new Set(user.interests);
    return [...products].sort((a, b) => {
      const aIsPreferred = userInterests.has(a.category);
      const bIsPreferred = userInterests.has(b.category);
      if (aIsPreferred && !bIsPreferred) return -1;
      if (!aIsPreferred && bIsPreferred) return 1;
      return 0;
    });
  }, [products, user]);

  const handleExploreClick = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChatClick = () => {
    const chatTrigger = document.querySelector(
      'button[aria-label="Open AI Chat"]'
    ) as HTMLButtonElement;
    chatTrigger?.click();
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Welcome to Shopora
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your intelligent shopping companion. Discover products tailored just
          for you with Nova, our AI assistant.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" onClick={handleExploreClick}>
            Explore Products
          </Button>
          <Button size="lg" variant="outline" onClick={handleChatClick}>
            Chat with Nova
          </Button>
        </div>
      </section>

      <section id="products">
        <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">
          {user ? 'Personalized For You' : 'All Products'}
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ProductGrid products={sortedProducts} />
        )}
      </section>
    </div>
  );
}
