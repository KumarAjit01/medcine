import { mockMedicines } from '@/lib/mockData';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, ShoppingCart, Tag, PackageCheck } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return mockMedicines.map((medicine) => ({
    id: medicine.id,
  }));
}

export default function MedicineDetailPage({ params }: { params: { id: string } }) {
  const medicine = mockMedicines.find((m) => m.id === params.id);

  if (!medicine) {
    notFound();
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
              <Button size="lg" className="w-full" disabled={medicine.stock === 0}>
                <ShoppingCart className="mr-2 h-5 w-5" /> 
                {medicine.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
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
