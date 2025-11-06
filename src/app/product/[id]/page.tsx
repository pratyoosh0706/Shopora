
'use client';

import { getProductById, getProducts } from '@/app/actions';
import { ProductGrid } from '@/components/product-grid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, Loader2, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const fetchedProduct = await getProductById(id);
      
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        const allProducts = await getProducts();
        const related = allProducts
          .filter((p) => p.category === fetchedProduct.category && p.id !== fetchedProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      
      setIsLoading(false);
    }
    fetchData();
  }, [id]);


  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(product.price);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square rounded-lg overflow-hidden border">
          <Image
            src={product.image.imageUrl}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
            data-ai-hint={product.image.imageHint}
          />
        </div>
        <div className="flex flex-col">
          <div>
            <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5 text-primary">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-muted stroke-current" />
                </div>
                <span className="text-sm text-muted-foreground">(123 reviews)</span>
            </div>
            <p className="mt-4 text-muted-foreground">{product.description}</p>
          </div>
          <div className="mt-auto pt-8">
            <p className="text-4xl font-bold mb-4">{formattedPrice}</p>
            <div className="flex gap-4">
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Link href={`/checkout?productId=${product.id}`} className="w-full">
                <Button size="lg" variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-12" />
      <div>
        <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">Related Products</h2>
        <ProductGrid products={relatedProducts} />
      </div>
    </div>
  );
}
