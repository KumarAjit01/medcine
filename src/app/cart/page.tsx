
'use client';

import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useSimulatedAuth, type CartItem } from '@/hooks/useSimulatedAuth';
import { mockMedicines, type Medicine } from '@/lib/mockData';
import { ShoppingCart, Trash2, Minus, Plus, CreditCard, Truck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation'; // Added import
import { useToast } from "@/hooks/use-toast"; // Added import

interface CartDisplayItem extends Medicine {
  quantity: number;
  itemTotal: number;
}

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartItemQuantity, isLoadingAuth, isLoggedIn, currentUser, clearCart } = useSimulatedAuth();
  const [isProcessingOrder, setIsProcessingOrder] = useState(false); // For simulated order placement
  const router = useRouter(); // Added router
  const { toast } = useToast(); // Added toast

  const detailedCartItems: CartDisplayItem[] = useMemo(() => {
    return cartItems
      .map(cartItem => {
        const medicineDetails = mockMedicines.find(m => m.id === cartItem.medicineId);
        if (medicineDetails) {
          return {
            ...medicineDetails,
            quantity: cartItem.quantity,
            itemTotal: medicineDetails.price * cartItem.quantity,
          };
        }
        return null; 
      })
      .filter((item): item is CartDisplayItem => item !== null);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return detailedCartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [detailedCartItems]);

  const shippingCost = cartSubtotal > 0 ? 5.00 : 0; // Example shipping cost
  const cartTotal = cartSubtotal + shippingCost;

  const handleQuantityChange = (medicineId: string, newQuantity: number) => {
    if (newQuantity >= 0) { 
      updateCartItemQuantity(medicineId, newQuantity);
    }
  };
  
  const handleProceedToCheckout = () => {
    if (!currentUser || !currentUser.address || currentUser.address.trim() === '') {
      toast({
        title: "Address Required",
        description: "Please add a delivery address to your profile before proceeding to checkout.",
        variant: "destructive",
      });
      router.push('/profile?redirect=/cart'); // Redirect to profile, optionally pass redirect back to cart
      return;
    }

    console.log("Proceeding to checkout with items:", detailedCartItems);
    setIsProcessingOrder(true);
    // Simulate order placement
    setTimeout(() => {
        clearCart(); 
        toast({
          title: "Order Placed (Simulated!)",
          description: "Your order has been successfully placed. You would normally be redirected to payment.",
        });
        setIsProcessingOrder(false);
        router.push('/'); // Redirect to homepage after simulated order
    }, 1500);
  };


  if (isLoadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isLoggedIn && !isLoadingAuth) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <PageTitle title="Shopping Cart" icon={ShoppingCart} />
        <div className="mt-12 flex flex-col items-center gap-6">
          <ShoppingCart className="h-24 w-24 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-foreground">
            Your Cart is Empty
          </h2>
          <p className="text-muted-foreground max-w-md">
            Looks like you haven't added anything to your cart yet.
            Please log in to view or add items to your cart.
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="/login?redirect=/cart">
              <Button>Login to View Cart</Button>
            </Link>
            <Link href="/medicines">
              <Button variant="outline">Browse Medicines</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }


  if (detailedCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <PageTitle title="Shopping Cart" icon={ShoppingCart} />
        <div className="mt-12 flex flex-col items-center gap-6">
          <ShoppingCart className="h-24 w-24 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-foreground">
            Your Cart is Empty
          </h2>
          <p className="text-muted-foreground max-w-md">
            Looks like you haven't added anything to your cart yet.
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="/medicines">
              <Button variant="outline">Browse Medicines</Button>
            </Link>
            <Link href="/">
              <Button>Go to Homepage</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Your Shopping Cart" icon={ShoppingCart} subtitle={`You have ${detailedCartItems.length} item(s) in your cart.`} />
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] md:h-auto md:max-h-[600px]">
                <div className="divide-y divide-border">
                  {detailedCartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        width={80} 
                        height={80} 
                        className="rounded-md object-cover aspect-square"
                        data-ai-hint={item.dataAiHint || 'medicine product'}
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-center"
                          min="0"
                        />
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-semibold w-20 text-right">${item.itemTotal.toFixed(2)}</p>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="shadow-lg sticky top-24"> {/* Sticky for summary */}
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p>${cartSubtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Shipping</p>
                <p>${shippingCost.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-xl">
                <p>Total</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleProceedToCheckout}
                disabled={isProcessingOrder}
              >
                {isProcessingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CreditCard className="mr-2 h-5 w-5" />}
                {isProcessingOrder ? "Processing..." : "Proceed to Checkout"}
              </Button>
              <Link href="/medicines" className="w-full">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
