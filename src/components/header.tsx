import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User } from 'lucide-react';
import { Logo } from './logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#products', label: 'Products' },
  { href: '/about', label: 'About' },
];

export function Header() {
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
          <Link href="/login">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="hidden md:inline-flex" variant="default">Sign Up</Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Logo className="mb-8" />
              <nav className="grid gap-6 text-lg font-medium">
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
              <div className="absolute bottom-4 left-4 right-4">
                 <Link href="/login" className='w-full'>
                    <Button variant="outline" className="w-full mb-2">
                        Sign In
                    </Button>
                 </Link>
                 <Link href="/signup" className='w-full'>
                    <Button className="w-full">Sign Up</Button>
                 </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
