
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

// Client-side schema, now only for the address field as it's the only one being actively edited in this form
const profileSchema = z.object({
  address: z.string().optional(), // Or .min(5, { message: 'Address must be at least 5 characters.' })
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
      address: '',
    },
  });

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!isLoggedIn || !currentUser) {
        router.replace('/login?redirect=/profile');
      } else {
        // Set default values for the form, only address is directly controlled by the form
        form.reset({
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

    // Only send address for update along with userId. Name and phone are not updated from this form.
    const actionData = {
        userId: currentUser.email,
        address: data.address,
    };

    const result: ProfileUpdateFormState = await updateUserProfileAction(actionData);
    setIsSubmitting(false);

    if (result.success && result.user) {
      toast({
        title: "Profile Updated",
        description: result.message || "Your address has been updated successfully.",
      });
      updateCurrentUser(result.user); // Update local auth state
      form.reset({ address: result.user.address || '' }); // Reset form with updated address
    } else {
      if (result.errors) {
        // Only handle address errors or _form errors from this specific form's perspective
        if (result.errors.address) {
            form.setError('address', { type: 'server', message: result.errors.address.join(', ') });
        }
        if (result.errors._form) {
          toast({ title: "Update Failed", description: result.errors._form.join(', '), variant: "destructive" });
        } else if (result.message && !result.errors.address) {
           toast({ title: "Update Failed", description: result.message, variant: "destructive" });
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
      <PageTitle title="My Profile" subtitle="View your personal information and update your address." icon={UserCircle} />

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Keep your delivery address up to date.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input value={currentUser.name || ''} readOnly disabled className="bg-muted/50"/>
                </FormControl>
              </FormItem>
              
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" value={currentUser.email || ''} readOnly disabled className="bg-muted/50"/>
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" value={currentUser.phone || ''} readOnly disabled className="bg-muted/50"/>
                </FormControl>
              </FormItem>
              
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Address...
                  </>
                ) : (
                  'Save Address'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
