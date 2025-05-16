
'use client'; // Required for hooks like useRouter and useSimulatedAuth

import { mockMedicines } from '@/lib/mockData';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation'; // Import useRouter
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, ShoppingCart, Tag, PackageCheck, LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSimulatedAuth } from '@/hooks/useSimulatedAuth'; // Import the hook
import { useEffect, useState } from 'react';
import type { Medicine } from '@/lib/mockData';

// generateStaticParams needs to be outside the component if it's used for SSG
// For client components with dynamic data fetching, this might not be necessary or might work differently.
// However, since we are using mockData, we can keep it for now if some routes are pre-rendered.
// export async function generateStaticParams() {
//   return mockMedicines.map((medicine) => ({
//     id: medicine.id,
//   }));
// }
// For a fully client-rendered approach or dynamic fetching, generateStaticParams might not be used.
// Let's assume for now it might still be used for initial builds.

export default function MedicineDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isLoggedIn, isLoadingAuth } = useSimulatedAuth();
  const [medicine, setMedicine] = useState<Medicine | undefined>(undefined);

  useEffect(() => {
    const foundMedicine = mockMedicines.find((m) => m.id === params.id);
    if (foundMedicine) {
      setMedicine(foundMedicine);
    } else {
      notFound();
    }
  }, [params.id]);

  const handleAddToCartClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/medicines/${params.id}`);
    } else {
      // TODO: Implement actual add to cart logic
      if (medicine) {
        console.log(`Adding ${medicine.name} to cart`);
        // Example: toast({ title: `${medicine.name} added to cart` });
      }
    }
  };

  if (!medicine) {
    // Still loading medicine or not found (notFound() would have been called by useEffect)
    // You could show a more specific loading state for the medicine data itself here
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title={medicine.name} icon={Pill} />
      
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          <div className="relative aspect-square md:aspect-auto min-h-[300px] md:min-h-full">
            <Image
              src={medicine.imageUrl}
              alt={medicine.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              data-ai-hint={medicine.dataAiHint}
              priority
            />
          </div>
          
          <div className="flex flex-col">
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2">{medicine.category}</Badge>
              <CardTitle className="text-3xl">{medicine.name}</CardTitle>
              <p className="text-3xl font-bold text-primary mt-2">${medicine.price.toFixed(2)}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-base leading-relaxed">{medicine.description}</CardDescription>
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-sm">
                  <PackageCheck className="h-5 w-5 mr-2 text-green-600" />
                  <span>Stock: <span className="font-semibold">{medicine.stock > 0 ? `${medicine.stock} units available` : 'Out of Stock'}</span></span>
                </div>
                <div className="flex items-center text-sm">
                  <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Category: {medicine.category}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 border-t">
              {isLoadingAuth ? (
                <Button size="lg" className="w-full" disabled>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
                </Button>
              ) : isLoggedIn ? (
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={handleAddToCartClick}
                  disabled={medicine.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> 
                  {medicine.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleAddToCartClick}
                >
                  <LogIn className="mr-2 h-5 w-5" /> Login to Add to Cart
                </Button>
              )}
            </CardFooter>
          </div>
        </div>
      </Card>

      <div className="text-center mt-8">
        <Link href="/medicines">
          <Button variant="outline">Back to Catalog</Button>
        </Link>
      </div>
    </div>
  );
}
