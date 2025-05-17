
'use server';

import * as z from 'zod';
import type { Medicine } from '@/lib/mockData';
import { mockCategories } from '@/lib/mockData'; // To validate category ID
import { connectToDatabase } from '@/lib/mongodb'; // Import MongoDB connection utility

// Helper function for preprocessing dataAiHint
const preprocessDataAiHint = (val: unknown): unknown => {
  if (val === '' || val === null) {
    return undefined;
  }
  return val;
};

// Helper function for validating category
const isCategoryValid = (val: string): boolean => {
  return mockCategories.some(cat => cat.id === val);
};

export const addProductSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  category: z.string().refine(isCategoryValid, { message: 'Invalid category selected.' }),
  price: z.coerce.number().min(0.01, { message: 'Price must be greater than 0.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock must be a non-negative integer.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }),
  dataAiHint: z.preprocess(
    preprocessDataAiHint,
    z.string().max(50, {message: 'AI hint cannot exceed 50 characters.'}).optional()
  ),
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
  product?: Medicine; // Return the product that was added
};

// The in-memory store is no longer needed as we're using MongoDB
// let simulatedNewProductsStore: Medicine[] = [];

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
    return {
      success: false,
      message: "Invalid category. Please select a valid category.",
      errors: { category: ["Invalid category selected."] }
    };
  }

  console.log('Server Action: Attempting to add new product to MongoDB:');
  console.log(newProductData);

  const newProduct: Medicine = {
    id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, // Generate a unique ID
    name: newProductData.name,
    category: categoryDetails.name, // Store category name for display consistency
    price: newProductData.price,
    description: newProductData.description,
    stock: newProductData.stock,
    imageUrl: newProductData.imageUrl,
    dataAiHint: newProductData.dataAiHint,
  };

  try {
    const db = await connectToDatabase(); // Uses default 'OnlineMedicineDB' or your ENV var
    const medicinesCollection = db.collection<Medicine>('medicines');
    
    const result = await medicinesCollection.insertOne(newProduct);

    if (!result.insertedId) {
      throw new Error('Failed to insert product into database.');
    }

    console.log(`Product "${newProduct.name}" inserted with _id: ${result.insertedId}`);

    return {
      success: true,
      message: `Product "${newProduct.name}" added successfully to the database.`,
      product: newProduct, // Return the product as it was added (including our custom id)
    };

  } catch (error) {
    console.error('Error adding product to MongoDB:', error);
    let errorMessage = "An unexpected error occurred while adding the product.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return {
      success: false,
      message: errorMessage,
      errors: { _form: [errorMessage] }
    };
  }
}
