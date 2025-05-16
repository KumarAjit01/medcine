
'use server';

import * as z from 'zod';

// --- Signup Schemas and Action ---
const serverSignupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }).regex(/^\+?[0-9\s-()]+$/, 'Invalid phone number format.'),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
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

  // In a real application, you would:
  // 1. Hash the password securely (e.g., using bcrypt).
  // 2. Create the user in your authentication system (e.g., Firebase Authentication).
  //    const hashedPassword = await bcrypt.hash(password, 10);
  //    await firebaseAdmin.auth().createUser({ email, password: hashedPassword, displayName: name });
  // 3. Save additional user information (like phone number) to a database (e.g., Firestore) linked to the user's ID.

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate a potential error (e.g., email already exists)
  if (email.toLowerCase() === "exists@example.com") {
    return {
      success: false,
      message: "This email address is already registered.",
      errors: { email: ["This email address is already registered."] }
    };
  }
  // --- End Simulation ---

  return { success: true, message: `Welcome, ${name}! Your account has been created successfully. You can now log in.` };
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
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real application, you would:
  // 1. Fetch user data from your database by email.
  // 2. Compare the provided password with the stored hashed password (e.g., using bcrypt.compare).
  // 3. If credentials match, create a session/token.

  // Simulated successful login
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
