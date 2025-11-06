
'use client';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
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
import { CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import Link from 'next/link';

function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, total, clearCart, itemCount } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [isUpiVerified, setIsUpiVerified] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    setIsUpiVerified(false);
    if (paymentMethod === 'upi') {
      setIsVerifyingUpi(true);
      const timer = setTimeout(() => {
        setIsVerifyingUpi(false);
        setIsUpiVerified(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentMethod]);


  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (paymentMethod === 'upi' && !isUpiVerified) {
        toast({
            variant: 'destructive',
            title: 'Payment not verified',
            description: 'Please wait for UPI payment verification to complete.',
        });
        return;
    }

    setIsPlacingOrder(true);
    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: "Order Placed!",
      description: `Your order has been placed successfully.`,
    });

    const orderId = `ORD-${Date.now()}`;
    clearCart();
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (itemCount === 0 && !isPlacingOrder) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
        <p className="text-muted-foreground">
          Add some products to your cart to proceed to checkout.
        </p>
        <Link href="/" className='mt-4 inline-block'>
            <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(total);

  const canPlaceOrder = isPlacingOrder || (paymentMethod === 'upi' && !isUpiVerified);

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
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
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
              {paymentMethod === 'card' && (
                <div className="mt-6 space-y-4 border-t pt-6">
                   <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" placeholder="John Doe" required form="checkout-form" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="**** **** **** 1234" required form="checkout-form" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiry</Label>
                      <Input id="expiry-date" placeholder="MM/YY" required form="checkout-form" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" required form="checkout-form" />
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === 'upi' && (
                <div className="mt-6 border-t pt-6 text-center">
                    <p className='text-muted-foreground text-sm mb-4'>Scan the QR code with your UPI app to pay.</p>
                    <div className='flex justify-center'>
                         <Image src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=shopora@mock" alt="UPI QR Code" width={200} height={200} data-ai-hint="qr code" />
                    </div>
                    {isVerifyingUpi && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground font-semibold">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Verifying payment...</span>
                        </div>
                    )}
                    {isUpiVerified && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-semibold">
                            <CheckCircle className="h-5 w-5" />
                            <span>Payment Verified</span>
                        </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 relative rounded-md overflow-hidden">
                        <Image
                          src={item.image.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                         <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">
                        {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                        }).format(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
               <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formattedTotal}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={canPlaceOrder}>
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
