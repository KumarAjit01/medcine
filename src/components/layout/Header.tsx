
'use client';

import Link from 'next/link';
import { Menu, ShoppingCart, X, Home, ListTree, UploadCloud, Bot, LogIn, UserPlus, Shield, LogOut, UserCircle, Loader2 } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSimulatedAuth } from '@/hooks/useSimulatedAuth';
import { Badge } from '@/components/ui/badge'; // Import Badge

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/medicines', label: 'Medicines', icon: ListTree },
  { href: '/ai-recommendations', label: 'AI Recommender', icon: Bot },
  { href: '/prescriptions/upload', label: 'Upload Prescription', icon: UploadCloud },
  { href: '/admin', label: 'Admin', icon: Shield },
];

const Header = () => {
  const isMobile = useIsMobile();
  const { isLoggedIn, logoutAction, isLoadingAuth, currentUser, cartItems } = useSimulatedAuth();

  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const NavItems = ({ isSheet = false }: { isSheet?: boolean }) => (
    <>
      {navLinks.map((link) => (
        isSheet ? (
          <SheetClose asChild key={link.href}>
            <Link href={link.href} className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-lg">
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          </SheetClose>
        ) : (
          <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md">
            {link.label}
          </Link>
        )
      ))}
    </>
  );

  const CartButtonContent = ({ isSheet = false }: {isSheet?: boolean}) => (
    <>
      <ShoppingCart className={`h-5 w-5 ${isSheet ? 'mr-2' : ''}`} />
      {isSheet && 'Cart'}
      {totalCartQuantity > 0 && (
        <Badge 
            variant="destructive" 
            className={`absolute ${isSheet ? 'right-2 top-2' : '-right-2 -top-2'} text-xs px-1.5 py-0.5 h-auto leading-tight`} // Adjusted badge styling
        >
            {totalCartQuantity}
        </Badge>
      )}
    </>
  );


  const AuthButtonsMobile = () => (
    <>
      <hr className="my-2 border-border" />
      {isLoadingAuth ? (
        <div className="flex items-center justify-center py-2 px-3 text-lg">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : isLoggedIn ? (
        <>
          <SheetClose asChild>
            <Link href="/profile" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-lg">
                <UserCircle className="h-5 w-5" /> Profile
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Button onClick={logoutAction} variant="ghost" className="w-full justify-start text-lg py-2 px-3">
              <LogOut className="h-5 w-5 mr-2" /> Logout
            </Button>
          </SheetClose>
        </>
      ) : (
        <>
          <SheetClose asChild>
            <Link href="/login" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-lg">
              <LogIn className="h-5 w-5" /> Login
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/signup" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-lg">
              <UserPlus className="h-5 w-5" /> Sign Up
            </Link>
          </SheetClose>
        </>
      )}
      <SheetClose asChild>
        <Button variant="ghost" asChild className="w-full justify-start mt-4 text-lg relative">
           <Link href="/cart" className="flex items-center gap-2">
            <CartButtonContent isSheet={true}/>
          </Link>
        </Button>
      </SheetClose>
    </>
  );

  const AuthButtonsDesktop = () => (
    <>
      <Button variant="ghost" size="icon" asChild className="relative">
        <Link href="/cart" aria-label="Shopping Cart">
          <CartButtonContent />
        </Link>
      </Button>
      {isLoadingAuth ? (
         <Button variant="outline" size="sm" disabled>
            <Loader2 className="animate-spin h-4 w-4" />
          </Button>
      ) : isLoggedIn ? (
        <>
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              <UserCircle className="mr-1 h-4 w-4" /> {currentUser?.name ? currentUser.name.split(' ')[0] : 'Profile'}
            </Button>
          </Link>
          <Button onClick={logoutAction} variant="outline" size="sm">
            <LogOut className="mr-1 h-4 w-4" /> Logout
          </Button>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="default" size="sm">Sign Up</Button>
          </Link>
        </>
      )}
    </>
  );

   if (isLoadingAuth && isMobile === undefined) {
    return (
      <header className="bg-card shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo />
          <div className="h-8 w-8 bg-muted rounded animate-pulse md:hidden"></div> {/* Skeleton for mobile menu button */}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6">
              <div className="flex flex-col gap-4">
                <NavItems isSheet={true} />
                <AuthButtonsMobile />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-2">
            <NavItems />
            <AuthButtonsDesktop />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
