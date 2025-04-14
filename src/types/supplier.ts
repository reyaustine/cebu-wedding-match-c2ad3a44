
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
  supplierId: string;
  clientId: string;
  clientName: string;
  packageName: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: Date;
  amount: number;
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
