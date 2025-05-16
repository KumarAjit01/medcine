
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserPlus, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { signupUserAction, type SignupFormState } from '@/app/actions/auth';
import { useSimulatedAuth } from '@/hooks/useSimulatedAuth';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }).regex(/^\+?[0-9\s-()]+$/, 'Invalid phone number format.'),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { loginAction: storeUserAuthData } = useSimulatedAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    form.clearErrors();

    const { confirmPassword, ...actionData } = data;

    const result: SignupFormState = await signupUserAction(actionData);
    setIsLoading(false);

    if (result.success && result.user) {
      storeUserAuthData(result.user); // Store new user details for "auto-login"
      toast({
        title: "Signup Successful!",
        description: result.message,
      });
      form.reset();
      if (result.redirectTo) {
        router.push(result.redirectTo);
      } else {
        router.push('/'); // Fallback redirect
      }
    } else {
      if (result.errors) {
        (Object.keys(result.errors) as Array<keyof NonNullable<SignupFormState['errors']>>).forEach((key) => {
          const fieldKey = key as keyof SignupFormValues | '_form';
          const errorMessages = result.errors![key];
          if (errorMessages && fieldKey !== '_form') {
            if (form.control._fields[fieldKey as keyof SignupFormValues]) {
                form.setError(fieldKey as keyof SignupFormValues, { type: 'server', message: errorMessages.join(', ') });
            } else {
                 console.warn(`Attempted to set error on non-existent form field: ${String(fieldKey)}`);
            }
          }
        });
        if (result.errors._form) {
             toast({
                title: "Signup Failed",
                description: result.errors._form.join(', '),
                variant: "destructive",
            });
        } else if (result.message && !Object.values(result.errors).some(e => e && e.length > 0)) {
            toast({
                title: "Signup Failed",
                description: result.message,
                variant: "destructive",
            });
        }
      } else if (result.message) {
         toast({
            title: "Signup Failed",
            description: result.message,
            variant: "destructive",
          });
      } else {
        toast({
            title: "An unexpected error occurred",
            description: "Please try again later.",
            variant: "destructive",
          });
      }
    }
  }

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join the Online Medicine Ordering System today for a healthier tomorrow.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 123 456 7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing Up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
