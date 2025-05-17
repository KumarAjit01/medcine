
'use server';

import * as z from 'zod';
import type { Medicine } from '@/lib/mockData';
import { mockCategories } from '@/lib/mockData'; // To validate category ID

export const addProductSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  category: z.string().refine(val => mockCategories.some(cat => cat.id === val), { message: 'Invalid category selected.' }),
  price: z.coerce.number().min(0.01, { message: 'Price must be greater than 0.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock must be a non-negative integer.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }),
  dataAiHint: z.string().max(50, {message: 'AI hint cannot exceed 50 characters.'}).optional().transform(val => val === '' ? undefined : val), // Ensure empty string is treated as undefined
});

export type AddProductFormValues = z.infer<typeof addProductSchema>;

export type AddProductFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    category?: string[];
    price?: string[];
    description?: string[];
    stock?: string[];
    imageUrl?: string[];
    dataAiHint?: string[];
    _form?: string[];
  };
  product?: Medicine;
};

// In-memory store for new products (simulated, resets on server restart)
// For a real application, this would interact with a database.
let simulatedNewProductsStore: Medicine[] = [];

export async function addProductAction(
  formData: AddProductFormValues
): Promise<AddProductFormState> {
  const validatedFields = addProductSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the form.",
    };
  }

  const newProductData = validatedFields.data;
  const categoryDetails = mockCategories.find(cat => cat.id === newProductData.category);

  if (!categoryDetails) {
    // This case should ideally be caught by Zod refine, but as a fallback.
    return {
      success: false,
      message: "Invalid category. Please select a valid category.",
      errors: { category: ["Invalid category selected."] }
    };
  }

  console.log('Server Action: Attempting to add new product:');
  console.log(newProductData);

  // Simulate adding to a database/store
  const newProduct: Medicine = {
    id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: newProductData.name,
    category: categoryDetails.name, // Store category name for display consistency
    price: newProductData.price,
    description: newProductData.description,
    stock: newProductData.stock,
    imageUrl: newProductData.imageUrl,
    dataAiHint: newProductData.dataAiHint,
  };

  simulatedNewProductsStore.push(newProduct);
  console.log('Current simulated new products:', simulatedNewProductsStore.map(p => p.name));


  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  return {
    success: true,
    message: `Product "${newProduct.name}" added successfully (simulated).`,
    product: newProduct,
  };
}
