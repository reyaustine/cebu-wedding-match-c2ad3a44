
import { Timestamp } from "firebase/firestore";

export type DateOrTimestamp = Date | Timestamp;

export interface SupplierProfile {
  id?: string;
  userId: string;
  businessName: string;
  businessDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  categories?: string[];
  logo?: string;
  coverImage: string;
  profileImage: string;
  gallery: string[];
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  services?: string[];
  averageRating?: number;
  reviewCount?: number;
  createdAt?: DateOrTimestamp;
  updatedAt: Date;
}

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
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  packageId: string;
  clientId: string;
  supplierId: string;
  clientName: string;
  packageName: string;
  date: DateOrTimestamp;
  startTime: DateOrTimestamp;
  endTime: DateOrTimestamp;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  totalAmount: number; // Renamed from the originally used amount field
  amount: number; // Adding amount to maintain compatibility with existing code
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentMethod?: string;
  createdAt: DateOrTimestamp;
  updatedAt: DateOrTimestamp;
  completedAt?: DateOrTimestamp; // Added completedAt field needed in SupplierBookings.tsx
}
