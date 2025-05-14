import Link from 'next/link';
import { Pill } from 'lucide-react';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
      <Pill className="h-8 w-8" />
      <span className="text-2xl font-bold">PillPal</span>
    </Link>
  );
};

export default Logo;
