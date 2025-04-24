import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SupplierProfile as SupplierProfileType } from "@/types/supplier";
import { dbService } from "@/services/databaseService";
import { storageService } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit, ImagePlus, X, Save, Mail, Phone, MapPin, Facebook, Instagram, Globe, Camera, Star } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { where } from "firebase/firestore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const SupplierProfile = () => {
  const { user, updatePassword } = useAuth();
  const [profile, setProfile] = useState<SupplierProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<SupplierProfileType>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<{ file: File; preview: string }[]>([]);
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const supplierProfiles = await dbService.query<SupplierProfileType>(
          'supplierProfiles',
          where('userId', '==', user.id)
        );
        
        if (supplierProfiles.length > 0) {
          setProfile(supplierProfiles[0]);
          setEditedProfile(supplierProfiles[0]);
        } else {
          const newProfile: Omit<SupplierProfileType, 'id'> = {
            userId: user.id,
            businessName: user?.firstName ? `${user.firstName}'s Services` : "My Business",
            businessDescription: "",
            contactEmail: user.email || "",
            contactPhone: user.phoneNumber || "",
            address: "",
            city: "",
            coverImage: "",
            profileImage: user.photoURL || "",
            gallery: [],
            categories: [],
            socialLinks: {},
            verificationStatus: 'verified',
            averageRating: 0,
            reviewCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          const profileId = await dbService.create('supplierProfiles', newProfile);
          setProfile({ id: profileId, ...newProfile });
          setEditedProfile({ id: profileId, ...newProfile });
        }
      } catch (error) {
        console.error("Error fetching supplier profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSocialLinkChange = (platform: 'facebook' | 'instagram' | 'website', value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };
  
  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newImages = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setSelectedGalleryImages((prev) => [...prev, ...newImages]);
  };
  
  const removeGalleryImage = (index: number, isExisting: boolean = false) => {
    if (isExisting && profile) {
      const updatedGallery = [...profile.gallery];
      updatedGallery.splice(index, 1);
      
      setEditedProfile((prev) => ({
        ...prev,
        gallery: updatedGallery
      }));
      
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          gallery: updatedGallery
        };
      });
    } else {
      setSelectedGalleryImages((prev) => {
        const newImages = [...prev];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        return newImages;
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!profile || !user) return;
    
    try {
      setIsSaving(true);
      
      let updatedProfile = { ...editedProfile, updatedAt: new Date() };
      
      if (coverImageFile) {
        const coverImagePath = `supplier_profiles/${user.id}/cover_${Date.now()}`;
        const coverImageUrl = await storageService.uploadFile(coverImagePath, coverImageFile);
        updatedProfile.coverImage = coverImageUrl;
      }
      
      if (profileImageFile) {
        const profileImagePath = `supplier_profiles/${user.id}/profile_${Date.now()}`;
        const profileImageUrl = await storageService.uploadFile(profileImagePath, profileImageFile);
        updatedProfile.profileImage = profileImageUrl;
        
        toast.success("Profile picture updated");
      }
      
      if (selectedGalleryImages.length > 0) {
        const uploadPromises = selectedGalleryImages.map((image) => {
          const imagePath = `supplier_profiles/${user.id}/gallery/${Date.now()}-${image.file.name}`;
          return storageService.uploadFile(imagePath, image.file);
        });
        
        const uploadedUrls = await Promise.all(uploadPromises);
        
        const currentGallery = profile.gallery || [];
        updatedProfile.gallery = [...currentGallery, ...uploadedUrls];
      }
      
      await dbService.update('supplierProfiles', profile.id, updatedProfile);
      
      setProfile((prev) => {
        if (!prev) return prev;
        return { ...prev, ...updatedProfile };
      });
      
      setCoverImageFile(null);
      setCoverImagePreview(null);
      setProfileImageFile(null);
      setProfileImagePreview(null);
      setSelectedGalleryImages([]);
      
      setIsEditing(false);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePasswordSubmit = async (data: PasswordFormValues) => {
    if (!user) return;
    
    setPasswordError(null);
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("Failed to update password. Make sure your current password is correct.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-wedding-900">Business Profile</h1>
          <p className="text-gray-600">Manage your supplier profile and settings</p>
        </div>
        {!isEditing ? (
          <Button className="wedding-btn" onClick={() => setIsEditing(true)}>
            <Edit size={16} className="mr-2" /> Edit Profile
          </Button>
        ) : (
          <Button className="wedding-btn" onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            Save Profile
          </Button>
        )}
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Business Profile</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <div className="relative h-48 md:h-64 bg-gray-200 rounded-lg overflow-hidden">
            {(coverImagePreview || profile?.coverImage) && (
              <img 
                src={coverImagePreview || profile?.coverImage} 
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            
            {isEditing && (
              <div className="absolute bottom-4 right-4">
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm py-2 px-3 rounded-full shadow-sm hover:bg-white transition-colors">
                    <ImagePlus size={16} />
                    <span className="text-sm font-medium">Change Cover</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-md">
                  {(profileImagePreview || profile?.profileImage) ? (
                    <img 
                      src={profileImagePreview || profile?.profileImage} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                      {user?.firstName?.[0]}
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 cursor-pointer">
                    <div className="bg-wedding-500 text-white p-2 rounded-full shadow-sm hover:bg-wedding-600 transition-colors">
                      <Camera size={16} />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="flex-grow">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Business Name</label>
                      <Input
                        value={editedProfile.businessName || ''}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        placeholder="Your Business Name"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Textarea
                        value={editedProfile.businessDescription || ''}
                        onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                        placeholder="Tell clients about your business..."
                        className="min-h-32"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold">{profile?.businessName}</h2>
                    <div className="flex items-center gap-1 mt-1">
                      {profile?.averageRating > 0 && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{profile.averageRating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({profile.reviewCount} reviews)</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-4 text-gray-700">
                      {profile?.businessDescription || 'No description provided.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input
                        value={editedProfile.contactEmail || ''}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="contact@yourcompany.com"
                        type="email"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <Input
                        value={editedProfile.contactPhone || ''}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="e.g. +63 912 345 6789"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <Input
                        value={editedProfile.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Business Address"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">City</label>
                      <Input
                        value={editedProfile.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-gray-600">{profile?.contactEmail || user?.email || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-gray-600">{profile?.contactPhone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-gray-600">
                          {profile?.address ? `${profile.address}, ${profile.city}` : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Social Media & Links</h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Facebook</label>
                      <Input
                        value={editedProfile.socialLinks?.facebook || ''}
                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/yourbusiness"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Instagram</label>
                      <Input
                        value={editedProfile.socialLinks?.instagram || ''}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/yourbusiness"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Website</label>
                      <Input
                        value={editedProfile.socialLinks?.website || ''}
                        onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                        placeholder="https://yourbusiness.com"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profile?.socialLinks?.facebook && (
                      <div className="flex items-center gap-3">
                        <Facebook className="w-5 h-5 text-gray-500" />
                        <a 
                          href={profile.socialLinks.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Facebook
                        </a>
                      </div>
                    )}
                    
                    {profile?.socialLinks?.instagram && (
                      <div className="flex items-center gap-3">
                        <Instagram className="w-5 h-5 text-gray-500" />
                        <a 
                          href={profile.socialLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Instagram
                        </a>
                      </div>
                    )}
                    
                    {profile?.socialLinks?.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <a 
                          href={profile.socialLinks.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    
                    {!profile?.socialLinks?.facebook && !profile?.socialLinks?.instagram && !profile?.socialLinks?.website && (
                      <p className="text-gray-500">No social links provided</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Account Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p>{user?.firstName} {user?.lastName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p>{user?.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Account Type</p>
                <Badge className="mt-1">Supplier</Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Account Status</p>
                <Badge className="bg-green-100 text-green-800 mt-1">Active</Badge>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {passwordError && (
                  <div className="text-red-500 text-sm">{passwordError}</div>
                )}
                
                <div className="flex justify-end">
                  <Button type="submit" className="wedding-btn">
                    Update Password
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>
        
        <TabsContent value="gallery" className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Photo Gallery</h3>
              
              {isEditing && (
                <label className="cursor-pointer">
                  <Button variant="outline" className="gap-2">
                    <ImagePlus size={16} />
                    Add Photos
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryImageChange}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </div>
            
            {(profile?.gallery?.length || selectedGalleryImages.length) ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile?.gallery?.map((image, index) => (
                  <div key={`gallery-${index}`} className="relative aspect-square">
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index, true)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                
                {selectedGalleryImages.map((image, index) => (
                  <div key={`new-gallery-${index}`} className="relative aspect-square">
                    <img 
                      src={image.preview} 
                      alt={`New Gallery ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <Camera className="w-12 h-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">No Photos Added</h3>
                <p className="mt-2 text-gray-500">
                  {isEditing ? 'Click "Add Photos" to upload images to your gallery.' : 'No photos have been added to your gallery yet.'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
