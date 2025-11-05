
'use client';

import { getProducts } from '@/app/actions';
import { ProductGrid } from '@/components/product-grid';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    getProducts().then(prods => {
      setProducts(prods);
      setIsLoading(false);
    })
  }, []);
  
  const handleExploreClick = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleChatClick = () => {
    // This is a placeholder. You might want to trigger the NovaChat sheet to open.
    // For now, we find the button and click it programmatically.
    const chatTrigger = document.querySelector('button[aria-label="Open AI Chat"]') as HTMLButtonElement;
    chatTrigger?.click();
  }

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
          Your intelligent shopping companion. Discover products tailored just for you with Nova, our AI assistant.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" onClick={handleExploreClick}>Explore Products</Button>
          <Button size="lg" variant="outline" onClick={handleChatClick}>
            Chat with Nova
          </Button>
        </div>
      </section>

      <section id="products">
        <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">All Products</h2>
        {isLoading ? (
           <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
           </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </div>
  );
}
