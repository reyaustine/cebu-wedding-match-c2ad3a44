
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
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  services?: string[];
  averageRating?: number;
  reviews?: number;
  createdAt?: DateOrTimestamp;
  updatedAt: Date;
}
