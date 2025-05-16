
'use client';

import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Construction } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <PageTitle title="Shopping Cart" icon={ShoppingCart} />
      <div className="mt-12 flex flex-col items-center gap-6">
        <Construction className="h-24 w-24 text-muted-foreground" />
        <h2 className="text-2xl font-semibold text-foreground">
          Cart Functionality Coming Soon!
        </h2>
        <p className="text-muted-foreground max-w-md">
          We're working hard to bring you a seamless shopping cart experience.
          For now, this feature is under construction.
        </p>
        <div className="flex gap-4 mt-6">
          <Link href="/medicines">
            <Button variant="outline">Browse More Medicines</Button>
          </Link>
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
