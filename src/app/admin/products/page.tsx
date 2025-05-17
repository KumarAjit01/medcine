
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import PageTitle from '@/components/shared/PageTitle';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PackagePlus, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { addProductSchema, addProductAction, type AddProductFormValues, type AddProductFormState } from '@/app/actions/products';
import { mockCategories } from '@/lib/mockData';

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      description: '',
      stock: 0,
      imageUrl: '',
      dataAiHint: '',
    },
  });

  async function onSubmit(data: AddProductFormValues) {
    setIsSubmitting(true);
    form.clearErrors();

    const result: AddProductFormState = await addProductAction(data);
    setIsSubmitting(false);

    if (result.success && result.product) {
      toast({
        title: "Product Added!",
        description: result.message,
      });
      form.reset(); // Reset form on success
    } else {
      if (result.errors) {
        (Object.keys(result.errors) as Array<keyof AddProductFormValues | '_form'>).forEach((key) => {
          const fieldKey = key as keyof AddProductFormValues | '_form';
          const errorMessages = result.errors![key as keyof typeof result.errors]; // Type assertion
          if (errorMessages && fieldKey !== '_form') {
             if (form.control._fields[fieldKey as keyof AddProductFormValues]) {
               form.setError(fieldKey as keyof AddProductFormValues, { type: 'server', message: (errorMessages as string[]).join(', ') });
             }
          }
        });
        if (result.errors._form) {
            toast({ title: "Submission Failed", description: result.errors._form.join(', '), variant: "destructive" });
        } else if (result.message && (!result.errors || Object.keys(result.errors).length === 0)) {
             toast({ title: "Submission Failed", description: result.message, variant: "destructive" });
        } else if (!result.message) {
             toast({ title: "Submission Failed", description: "An unexpected error occurred. Please check the form.", variant: "destructive" });
        }
      } else if (result.message) {
        toast({ title: "Submission Failed", description: result.message, variant: "destructive" });
      }
    }
  }

  return (
    <div className="space-y-8">
      <PageTitle title="Manage Products" subtitle="Add new medicines and update existing product details." icon={PackagePlus} />
      
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Add New Medicine</CardTitle>
          <CardDescription>Fill in the details for the new medicine product.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Paracetamol 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCategories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of the medicine..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} step="1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://placehold.co/400x300.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataAiHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data AI Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., tablet painkiller" {...field} />
                    </FormControl>
                    <FormDescription>One or two keywords for AI image search (max 2 words).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Product...
                  </>
                ) : (
                  <>
                    <PackagePlus className="mr-2 h-4 w-4" /> Add Product
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Section for displaying and managing existing medicines will be added in Phase 2 */}
      {/* 
      <Card className="shadow-xl mt-8">
        <CardHeader>
          <CardTitle>Existing Medicines</CardTitle>
          <CardDescription>View and update stock for existing medicines.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Listing and stock update functionality coming soon.</p>
        </CardContent>
      </Card> 
      */}
    </div>
  );
}
