import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <ShoppingBag className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold font-headline tracking-tight">
        Shopora
      </span>
    </Link>
  );
}
