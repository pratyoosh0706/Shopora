'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold mt-4">
            Order Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order is being processed.
          </p>
          {orderId && (
            <div className="text-sm">
              <p>Your Order ID is:</p>
              <p className="font-mono bg-muted p-2 rounded-md mt-1">
                {orderId}
              </p>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <Link href={`/track-order?orderId=${orderId}`} className="w-full">
              <Button className="w-full">Track Order</Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderConfirmationPageWrapper() {
  return (
    <Suspense>
      <OrderConfirmationPage />
    </Suspense>
  )
}
