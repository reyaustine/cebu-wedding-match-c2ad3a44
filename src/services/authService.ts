
import { toast } from "sonner";

// Define user types
export type UserRole = "client" | "supplier" | "planner" | "admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
}

// Super admin account
const SUPER_ADMIN: User = {
  id: "admin-1",
  email: "reyaustine123@gmail.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  isVerified: true
};

// Mock user store - in a real app, this would be replaced with Firebase or another backend
const users: User[] = [SUPER_ADMIN];
let currentUser: User | null = null;

// Basic auth functions
export const registerUser = (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  role: UserRole
): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Check if user already exists
      const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        toast.error("User already exists with this email");
        reject(new Error("User already exists with this email"));
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${users.length + 1}`,
        email,
        firstName,
        lastName,
        role,
        isVerified: false // New users start unverified
      };
      
      users.push(newUser);
      currentUser = newUser;
      
      toast.success("Registration successful!");
      resolve(newUser);
    }, 800); // Simulate network delay
  });
};

export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // In a real app, we'd check the password hash here
        currentUser = user;
        toast.success(`Welcome back, ${user.firstName}!`);
        resolve(user);
      } else {
        toast.error("Invalid email or password");
        reject(new Error("Invalid email or password"));
      }
    }, 800);
  });
};

export const logoutUser = (): void => {
  currentUser = null;
  toast.info("You've been logged out");
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const isAdmin = (): boolean => {
  return currentUser?.role === "admin";
};

export const isSuperAdmin = (email: string): boolean => {
  return email.toLowerCase() === SUPER_ADMIN.email.toLowerCase();
};
