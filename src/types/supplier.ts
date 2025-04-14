
// Add ServicePackage interface if it doesn't exist
import { Timestamp } from "firebase/firestore";

export interface ServicePackage {
  id: string;
  supplierId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  features: string[];
  images: string[];
  isActive: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Booking {
  id: string;
  clientId: string;
  supplierId: string;
  clientName: string;
  packageId: string;
  packageName: string;
  date: Date;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface SupplierProfile {
  id: string;
  userId: string;
  businessName: string;
  businessDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  coverImage: string;
  profileImage: string;
  gallery: string[];
  categories: string[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  supplierId: string;
  clientId: string;
  clientName: string;
  bookingId: string;
  packageId: string;
  packageName: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
