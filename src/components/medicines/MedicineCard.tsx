import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Medicine } from '@/lib/mockData';
import { Tag, ShoppingCart } from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard = ({ medicine }: MedicineCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary">
      <CardHeader className="p-0">
        <Link href={`/medicines/${medicine.id}`} className="block aspect-[4/3] relative w-full overflow-hidden">
          <Image
            src={medicine.imageUrl}
            alt={medicine.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={medicine.dataAiHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">
          <Link href={`/medicines/${medicine.id}`}>{medicine.name}</Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-2">{medicine.description}</CardDescription>
        <div className="flex items-center text-sm text-foreground/80 mb-2">
          <Tag className="h-4 w-4 mr-1 text-primary" />
          <span>{medicine.category}</span>
        </div>
        <p className="text-xl font-semibold text-primary">${medicine.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MedicineCard;
