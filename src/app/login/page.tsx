
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { LogIn, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { loginUserAction, type LoginFormState } from '@/app/actions/auth';
import { useSimulatedAuth } from '@/hooks/useSimulatedAuth'; // Import the hook

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loginAction: simulateLogin } = useSimulatedAuth(); // Get the login function from the hook

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    form.clearErrors();

    const result: LoginFormState = await loginUserAction(data);
    setIsLoading(false);

    if (result.success) {
      simulateLogin(); // Set the simulated login state
      toast({
        title: "Login Successful!",
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
        (Object.keys(result.errors) as Array<keyof NonNullable<LoginFormState['errors']>>).forEach((key) => {
          const fieldKey = key as keyof LoginFormValues | '_form';
          const errorMessages = result.errors![key];
          if (errorMessages && fieldKey !== '_form') {
            if (form.control._fields[fieldKey as keyof LoginFormValues]) {
              form.setError(fieldKey as keyof LoginFormValues, { type: 'server', message: errorMessages.join(', ') });
            }
          }
        });
        if (result.errors._form) {
          toast({
            title: "Login Failed",
            description: result.errors._form.join(', '),
            variant: "destructive",
          });
        } else if (result.message && !Object.values(result.errors).some(e => e && e.length > 0)) {
           toast({
              title: "Login Failed",
              description: result.message,
              variant: "destructive",
          });
        }
      } else if (result.message) {
         toast({
            title: "Login Failed",
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
          <LogIn className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Log in to your Online Medicine Ordering System account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging In...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Link href="#" className="text-sm text-primary hover:underline text-center w-full">
              Forgot Password?
            </Link>
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
