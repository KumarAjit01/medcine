
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTitle from '@/components/shared/PageTitle';
import { UserCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSimulatedAuth } from '@/hooks/useSimulatedAuth';
import { updateUserProfileAction, type ProfileUpdateFormState, type SimulatedUser } from '@/app/actions/auth';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }).regex(/^\+?[0-9\s-()]+$/, 'Invalid phone number format.'),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { isLoggedIn, isLoadingAuth, currentUser, updateCurrentUser } = useSimulatedAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!isLoggedIn || !currentUser) {
        router.replace('/login?redirect=/profile');
      } else {
        form.reset({
          name: currentUser.name || '',
          phone: currentUser.phone || '',
          address: currentUser.address || '',
        });
      }
    }
  }, [isLoadingAuth, isLoggedIn, currentUser, router, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!currentUser?.email) {
        toast({ title: "Error", description: "User session not found. Please log in again.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    form.clearErrors();

    const actionData = {
        userId: currentUser.email, // Use email as userId for simulation
        ...data,
    };

    const result: ProfileUpdateFormState = await updateUserProfileAction(actionData);
    setIsSubmitting(false);

    if (result.success && result.user) {
      toast({
        title: "Profile Updated",
        description: result.message || "Your profile has been updated successfully.",
      });
      updateCurrentUser(result.user); // Update local auth state
      form.reset(result.user); // Reset form with updated values
    } else {
      if (result.errors) {
        (Object.keys(result.errors) as Array<keyof NonNullable<ProfileUpdateFormState['errors']>>).forEach((key) => {
          const fieldKey = key as keyof ProfileFormValues | '_form';
           if (result.errors && result.errors[key] && fieldKey !== '_form') {
             if (form.control._fields[fieldKey as keyof ProfileFormValues]) {
                form.setError(fieldKey as keyof ProfileFormValues, { type: 'server', message: result.errors[key]?.join(', ') });
             }
          }
        });
         if (result.errors._form) {
          toast({ title: "Update Failed", description: result.errors._form.join(', '), variant: "destructive" });
        }
      } else if (result.message) {
        toast({ title: "Update Failed", description: result.message, variant: "destructive" });
      } else {
        toast({ title: "An unexpected error occurred", description: "Please try again.", variant: "destructive" });
      }
    }
  }

  if (isLoadingAuth || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <PageTitle title="My Profile" subtitle="View and update your personal information." icon={UserCircle} />

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Keep your information up to date.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" value={currentUser.email || ''} readOnly disabled className="bg-muted/50"/>
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your shipping address" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
