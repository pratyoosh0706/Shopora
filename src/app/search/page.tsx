
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getProducts } from '@/app/actions';
import type { Product } from '@/lib/types';
import { ProductGrid } from '@/components/product-grid';
import { Loader2 } from 'lucide-react';

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      getProducts().then((allProducts) => {
        const filteredProducts = allProducts.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredProducts);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Search Results {query ? `for "${query}"` : ''}
          </h1>
          <p className="text-muted-foreground mb-8">
            {results.length} product{results.length !== 1 ? 's' : ''} found.
          </p>
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold">No products found</h2>
              <p className="text-muted-foreground">
                Try a different search term.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPageWrapper() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <SearchPage />
        </Suspense>
    )
}
