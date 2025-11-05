'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PackageSearch, CheckCircle, Truck, Home, Loader2 } from 'lucide-react';

const statuses = [
  { icon: CheckCircle, label: 'Order Confirmed' },
  { icon: PackageSearch, label: 'Processing' },
  { icon: Truck, label: 'Shipped' },
  { icon: Home, label: 'Delivered' },
];

function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [currentStatusIndex, setCurrentStatusIndex] = useState(-1);
  const [isTracking, setIsTracking] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState('');

  useEffect(() => {
    if (searchParams.get('orderId')) {
      handleTrackOrder(searchParams.get('orderId')!);
    }
  }, [searchParams]);

  const handleTrackOrder = async (id: string) => {
    if (!id) return;
    setIsTracking(true);
    setTrackedOrderId(id);
    setCurrentStatusIndex(-1);

    // Mock tracking progress
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    let status = 0;
    setCurrentStatusIndex(status);

    const interval = setInterval(() => {
      status++;
      setCurrentStatusIndex(status);
      if (status >= statuses.length - 1) {
        clearInterval(interval);
        setIsTracking(false);
      }
    }, 2000);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleTrackOrder(orderId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-8 text-center">
        Track Your Order
      </h1>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Enter Order ID</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g., ORD-123456789"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
            <Button type="submit" disabled={isTracking || !orderId}>
              {isTracking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Track'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {trackedOrderId && (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>Tracking Details for {trackedOrderId}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pt-2">
              <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-8">
                {statuses.map((status, index) => (
                  <div key={index} className="flex items-center gap-4 relative">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                        index <= currentStatusIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <status.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`font-medium ${
                        index <= currentStatusIndex
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {status.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function OrderTrackingPageWrapper() {
  return (
    <Suspense>
      <OrderTrackingPage />
    </Suspense>
  )
}
