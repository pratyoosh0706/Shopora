import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { productCategories } from '@/lib/types';
import { Logo } from '@/components/logo';

export default function SignupPage() {
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-4">
        <Logo className="justify-center" />
        <div className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Tell us a bit about yourself to get started
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Robinson" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required/>
          </div>

          <div className="grid gap-3">
            <Label>What are you interested in?</Label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {productCategories.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox id={`interest-${interest}`} value={interest} />
                  <Label
                    htmlFor={`interest-${interest}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create an account
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
