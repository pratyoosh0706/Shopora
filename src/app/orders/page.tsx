
'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useFirebase, useFirestore } from '@/firebase';
import { Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import type { Order, Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

type OrderWithProduct = Order & { product: Product };

export default function OrdersPage() {
  const { user, isUserLoading } = useFirebase();
  const firestore = useFirestore();
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user || !firestore) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const ordersRef = collection(firestore, 'users', user.uid, 'orders');
        const q = query(ordersRef);
        const querySnapshot = await getDocs(q);
        
        const fetchedOrders: OrderWithProduct[] = await Promise.all(querySnapshot.docs.map(async (orderDoc) => {
            const orderData = orderDoc.data() as Order;
            
            const productRef = doc(firestore, 'products', orderData.productId);
            const productSnap = await getDoc(productRef);
            const productData = productSnap.exists() ? productSnap.data() as Product : null;
            
            return { ...orderData, id: orderDoc.id, product: productData! };
        }));

        // Filter out any orders where product data could not be fetched
        setOrders(fetchedOrders.filter(o => o.product));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isUserLoading) {
      fetchOrders();
    }
  }, [user, firestore, isUserLoading]);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Please sign in</h2>
        <p className="text-muted-foreground mt-2">
          You need to be logged in to view your orders.
        </p>
        <Link href="/login" className="mt-4 inline-block">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">No orders yet</h2>
        <p className="text-muted-foreground mt-2">
          You haven't placed any orders. Let's change that!
        </p>
        <Link href="/" className="mt-4 inline-block">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">
        My Orders
      </h1>
      <Card>
        <CardHeader>
            <CardTitle>Your Order History</CardTitle>
            <CardDescription>A list of all the orders you have placed on Shopora.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
            {orders.map((order, index) => (
                <div key={order.id}>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-full sm:w-32 h-32 relative rounded-md overflow-hidden flex-shrink-0">
                        <Image
                            src={order.product.image.imageUrl}
                            alt={order.product.name}
                            fill
                            className="object-cover"
                            data-ai-hint={order.product.image.imageHint}
                        />
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <h3 className="font-semibold">{order.product.name}</h3>
                            <p className="text-sm text-muted-foreground">{order.product.category}</p>
                            <p className="text-lg font-bold mt-1">
                                {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                }).format(order.product.price)}
                            </p>
                        </div>
                        <div>
                             <p className="font-semibold text-sm text-muted-foreground">Order Date</p>
                             <p>{new Date(order.orderDate).toLocaleDateString()}</p>
                             <p className="font-semibold text-sm text-muted-foreground mt-2">Order ID</p>
                             <p className='text-xs font-mono'>{order.id}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-sm text-muted-foreground">Status</p>
                            <p>{order.status}</p>
                             <Link href={`/track-order?orderId=${order.id}`} className='mt-2 inline-block'>
                                <Button variant="outline" size="sm">Track Order</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                {index < orders.length - 1 && <Separator className="mt-6" />}
                </div>
            ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
