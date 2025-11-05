'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getProductById } from '@/app/actions';
import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const productId = searchParams.get('productId');
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (productId) {
      getProductById(productId).then((p) => {
        if (p) {
          setProduct(p);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [productId]);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: "Order Placed!",
      description: `Your order for ${product?.name} has been placed successfully.`,
    });

    const orderId = `ORD-${Date.now()}`;
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p className="text-muted-foreground">
          We couldn't find the product you're looking for.
        </p>
      </div>
    );
  }
  
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(product.price);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">
        Checkout
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" required />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
           <Card className="mt-8">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                This is a mock payment gateway. No real transaction will be made.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="card" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 relative rounded-md overflow-hidden">
                  <Image
                    src={product.image.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{formattedPrice}</p>
                </div>
              </div>
               <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formattedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formattedPrice}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={isPlacingOrder}>
                {isPlacingOrder ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}


export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <CheckoutPage />
    </Suspense>
  )
}
