
import { Timestamp } from "firebase/firestore";

// Define the type for date fields that can be either Date or Firestore Timestamp
export type DateOrTimestamp = Date | Timestamp;

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
  createdAt: DateOrTimestamp;
  updatedAt: DateOrTimestamp;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  supplierId: string;
  serviceId: string;
  serviceName: string;
  packageName: string;
  date: DateOrTimestamp;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  notes?: string;
  createdAt: DateOrTimestamp;
  updatedAt: DateOrTimestamp;
  completedAt?: DateOrTimestamp;
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
  categories: string[];
  logo?: string;
  coverImage?: string;
  profileImage?: string;
  gallery: string[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  averageRating: number;
  reviewCount: number;
  createdAt: DateOrTimestamp;
  updatedAt: DateOrTimestamp;
}
