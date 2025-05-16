
'use server';

import * as z from 'zod';

// --- In-memory store for simulated users (Resets on server restart) ---
const serverSignupDataSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }).regex(/^\+?[0-9\s-()]+$/, 'Invalid phone number format.'),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  address: z.string().optional(), // Added address
});
export type SimulatedUser = z.infer<typeof serverSignupDataSchema>;
let simulatedUsersStore: SimulatedUser[] = [];

// --- Signup Schemas and Action ---
const serverSignupSchema = serverSignupDataSchema.omit({ address: true }); // Address is not collected at signup initially

export type SignupFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    _form?: string[];
  };
  user?: SimulatedUser; // Return user object on success
  redirectTo?: string;
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

  console.log('Server Action: Attempting to sign up user:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Phone:', phone);

  await new Promise(resolve => setTimeout(resolve, 500));

  if (email.toLowerCase() === "exists@example.com" || simulatedUsersStore.find(user => user.email.toLowerCase() === email.toLowerCase())) {
    return {
      success: false,
      message: "This email address is already registered.",
      errors: { email: ["This email address is already registered."] }
    };
  }

  const newUser: SimulatedUser = { name, email, phone, password, address: '' }; // Initialize address as empty string
  simulatedUsersStore.push(newUser);
  console.log('Current simulated users:', simulatedUsersStore.map(u => u.email));

  return {
    success: true,
    message: `Welcome, ${name}! Your account has been created. Redirecting...`,
    user: newUser, // Return the new user object
    redirectTo: "/"
  };
}


// --- Login Schemas and Action ---
const serverLoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

export type LoginFormState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  user?: SimulatedUser; // Return user object on success
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

  console.log('Server Action: Attempting to log in user:');
  console.log('Email:', email);

  await new Promise(resolve => setTimeout(resolve, 500));

  const foundUserInStore = simulatedUsersStore.find(
    user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );

  if (foundUserInStore) {
    return {
      success: true,
      message: `Login successful! Welcome back, ${foundUserInStore.name}. Redirecting...`,
      user: foundUserInStore, // Return the found user object
      redirectTo: "/"
    };
  }

  const hardcodedTestUser: SimulatedUser = { email: "test@example.com", password: "password123", name: "Test User", phone: "1234567890", address: "123 Test St" };
  if (email.toLowerCase() === hardcodedTestUser.email && password === hardcodedTestUser.password) {
    // Ensure test user is in store if not already (e.g. after server restart)
    if(!simulatedUsersStore.find(u => u.email.toLowerCase() === hardcodedTestUser.email)) {
      simulatedUsersStore.push(hardcodedTestUser);
    }
    return {
      success: true,
      message: "Login successful! Redirecting...",
      user: hardcodedTestUser, // Return the hardcoded user object
      redirectTo: "/"
    };
  }

  return {
    success: false,
    message: "Invalid email or password.",
    errors: { _form: ["Invalid email or password. Please try again."] }
  };
}

// --- Profile Update Schemas and Action ---
const serverProfileUpdateSchema = z.object({
  userId: z.string().email(), // Using email as userId for simulation
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }).regex(/^\+?[0-9\s-()]+$/, 'Invalid phone number format.'),
  address: z.string().optional(),
});

export type ProfileUpdateFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    phone?: string[];
    address?: string[];
    _form?: string[];
  };
  user?: SimulatedUser;
};

export async function updateUserProfileAction(
  formData: z.infer<typeof serverProfileUpdateSchema>
): Promise<ProfileUpdateFormState> {
  const validatedFields = serverProfileUpdateSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the form.",
    };
  }

  const { userId, name, phone, address } = validatedFields.data;

  console.log('Server Action: Attempting to update profile for user:', userId);

  await new Promise(resolve => setTimeout(resolve, 500));

  const userIndex = simulatedUsersStore.findIndex(user => user.email.toLowerCase() === userId.toLowerCase());

  if (userIndex === -1) {
    return {
      success: false,
      message: "User not found.",
      errors: { _form: ["User not found."] }
    };
  }

  // Update user details (keep existing password)
  simulatedUsersStore[userIndex] = {
    ...simulatedUsersStore[userIndex],
    name,
    phone,
    address: address || '', // Ensure address is a string
  };

  console.log('Updated user:', simulatedUsersStore[userIndex]);

  return {
    success: true,
    message: "Profile updated successfully!",
    user: simulatedUsersStore[userIndex],
  };
}
