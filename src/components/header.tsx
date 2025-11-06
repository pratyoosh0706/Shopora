
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, PackageSearch, User, LogOut, ShoppingBag } from 'lucide-react';
import { Logo } from './logo';
import { useFirebase } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';
import { CartSheet } from './cart-sheet';
import { SearchBar } from './search-bar';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#products', label: 'Products' },
  { href: '/orders', label: 'My Orders'},
  { href: '/track-order', label: 'Track Order' },
];

function UserNav() {
  const { user, auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed Out',
        description: "You have successfully signed out.",
      });
      router.push('/');
    } catch (error) {
      console.error("Sign out error", error);
      toast({
        variant: "destructive",
        title: 'Error signing out',
        description: 'There was a problem signing you out. Please try again.',
      });
    }
  };

  if (!user) {
    return (
      <>
        <Link href="/login">
          <Button variant="ghost" className="hidden md:inline-flex">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="hidden md:inline-flex" variant="default">
            Sign Up
          </Button>
        </Link>
      </>
    );
  }

  const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className='w-4 h-4' />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/orders')}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>My Orders</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/track-order')}>
          <PackageSearch className="mr-2 h-4 w-4" />
          <span>Track Orders</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { isUserLoading, user } = useFirebase();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
           {isMounted && (
            <div className="hidden md:block w-full max-w-xs">
              <SearchBar />
            </div>
           )}
          {isMounted && !isUserLoading && <UserNav />}
          {isMounted && <CartSheet />}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Logo className="mb-8" />
              <div className="mb-4">
                <SearchBar />
              </div>
              <nav className="grid gap-6 text-lg font-medium">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-primary flex items-center gap-2"
                    >
                      {link.label === 'Track Order' && (
                        <PackageSearch className="h-4 w-4" />
                      )}
                       {link.label === 'My Orders' && (
                        <ShoppingBag className="h-4 w-4" />
                      )}
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="absolute bottom-4 left-4 right-4">
                {isMounted && !isUserLoading && !user ? (
                   <div className='w-full'>
                     <SheetClose asChild>
                        <Link href="/login" className='w-full'>
                           <Button variant="outline" className="w-full mb-2">
                               Sign In
                           </Button>
                        </Link>
                     </SheetClose>
                      <SheetClose asChild>
                        <Link href="/signup" className='w-full'>
                           <Button className="w-full">Sign Up</Button>
                        </Link>
                     </SheetClose>
                   </div>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
