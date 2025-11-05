import { getProducts } from '@/app/actions';
import { ProductGrid } from '@/components/product-grid';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const products = await getProducts();

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
          <Button size="lg">Explore Products</Button>
          <Button size="lg" variant="outline">
            Chat with Nova
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">All Products</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
