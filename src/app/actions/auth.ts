
'use server';

import * as z from 'zod';

// --- In-memory store for simulated users (Resets on server restart) ---
const serverSignupDataSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }).regex(/^\+?[0-9\s-()]+$/, 'Invalid phone number format.'),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});
type SimulatedUser = z.infer<typeof serverSignupDataSchema>;
let simulatedUsersStore: SimulatedUser[] = [];

// --- Signup Schemas and Action ---
const serverSignupSchema = serverSignupDataSchema.extend({
  // No need to extend if serverSignupDataSchema already has all fields for storage
});


export type SignupFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    _form?: string[]; // For general form errors not specific to a field
  };
  redirectTo?: string; // Added for auto-login redirect
};

export async function signupUserAction(
  formData: z.infer<typeof serverSignupSchema>
): Promise<SignupFormState> {
  const validatedFields = serverSignupSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the form.",
    };
  }

  const { name, email, phone, password } = validatedFields.data;

  // --- Simulate User Creation ---
  console.log('Server Action: Attempting to sign up user:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Phone:', phone);
  // console.log('Password:', password); // In a real app, never log the raw password.

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay

  // Check if email already exists in store or is the hardcoded existing email
  if (email.toLowerCase() === "exists@example.com" || simulatedUsersStore.find(user => user.email.toLowerCase() === email.toLowerCase())) {
    return {
      success: false,
      message: "This email address is already registered.",
      errors: { email: ["This email address is already registered."] }
    };
  }

  // Add user to our in-memory store
  simulatedUsersStore.push({ name, email, phone, password });
  console.log('Current simulated users:', simulatedUsersStore.map(u => u.email));
  // --- End Simulation ---

  return { 
    success: true, 
    message: `Welcome, ${name}! Your account has been created. Redirecting...`,
    redirectTo: "/" // Redirect to homepage after successful signup
  };
}


// --- Login Schemas and Action ---
const serverLoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }), // Min 1 for presence, actual length check by auth system
});

export type LoginFormState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[]; // For general form errors
  };
  redirectTo?: string;
};

export async function loginUserAction(
  formData: z.infer<typeof serverLoginSchema>
): Promise<LoginFormState> {
  const validatedFields = serverLoginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your input.",
    };
  }

  const { email, password } = validatedFields.data;

  // --- Simulate User Authentication ---
  console.log('Server Action: Attempting to log in user:');
  console.log('Email:', email);
  // console.log('Password:', password); // In a real app, never log the raw password.

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay

  // Check against in-memory store first
  const foundUserInStore = simulatedUsersStore.find(
    user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );

  if (foundUserInStore) {
    return {
      success: true,
      message: `Login successful! Welcome back, ${foundUserInStore.name}. Redirecting...`,
      redirectTo: "/" // Or a dashboard page
    };
  }

  // Simulated successful login for hardcoded test user
  if (email.toLowerCase() === "test@example.com" && password === "password123") {
    return {
      success: true,
      message: "Login successful! Redirecting...",
      redirectTo: "/" // Or a dashboard page
    };
  }

  // Simulated failed login
  return {
    success: false,
    message: "Invalid email or password.",
    errors: { _form: ["Invalid email or password. Please try again."] }
  };
  // --- End Simulation ---
}
