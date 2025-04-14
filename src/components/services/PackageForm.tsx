
import { useState, useEffect } from "react";
import { dbService } from "@/services/databaseService";
import { storageService } from "@/services/storageService";
import { useAuth } from "@/contexts/AuthContext";
import { ServicePackage } from "@/types/supplier";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ImagePlus, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { where } from "firebase/firestore";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PackageFormProps {
  packageId?: string;
  isEditMode: boolean;
}

const serviceCategories = [
  "Photography",
  "Videography",
  "Catering",
  "Venue",
  "Flowers",
  "Music",
  "Cake",
  "Decor",
  "Transportation",
  "Attire",
  "Invitations",
  "Makeup",
  "Jewelry",
  "Favors",
  "Other"
];

// Define the form schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Package name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  features: z.string().transform((val) => val.split('\n').filter(line => line.trim() !== '')),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export const PackageForm = ({ packageId, isEditMode }: PackageFormProps) => {
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      features: "",
      isActive: true,
    },
  });

  // Fetch package data if in edit mode
  useEffect(() => {
    const fetchPackage = async () => {
      if (!isEditMode || !packageId || !user) return;
      
      try {
        setIsLoading(true);
        const packageData = await dbService.getById<ServicePackage>('servicePackages', packageId);
        
        if (!packageData) {
          toast.error("Package not found");
          navigate('/services');
          return;
        }
        
        // Check if the package belongs to the current user
        if (packageData.supplierId !== user.id) {
          toast.error("You don't have permission to edit this package");
          navigate('/services');
          return;
        }
        
        // Set form values
        form.setValue("name", packageData.name);
        form.setValue("description", packageData.description);
        form.setValue("price", packageData.price);
        form.setValue("category", packageData.category);
        form.setValue("features", packageData.features.join('\n'));
        form.setValue("isActive", packageData.isActive);
        
        // Set existing images
        if (packageData.images && packageData.images.length) {
          setExistingImages(packageData.images);
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        toast.error("Failed to load package details");
        navigate('/services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [user, packageId, isEditMode, navigate, form]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const newImages = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setSelectedImages((prev) => [...prev, ...newImages]);
  };
  
  // Remove selected image
  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };
  
  // Remove existing image
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };
  
  // Upload images to storage
  const uploadImages = async (): Promise<string[]> => {
    if (!user || selectedImages.length === 0) return existingImages;
    
    const uploadPromises = selectedImages.map((image) => {
      const fileName = `service_packages/${user.id}/${Date.now()}-${image.file.name}`;
      return storageService.uploadFile(fileName, image.file);
    });
    
    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      return [...existingImages, ...uploadedUrls];
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a package");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload images first
      const imageUrls = await uploadImages();
      
      const packageData = {
        ...data,
        images: imageUrls,
        supplierId: user.id,
        updatedAt: new Date()
      };
      
      if (isEditMode && packageId) {
        // Update existing package
        await dbService.update('servicePackages', packageId, packageData);
        toast.success("Package updated successfully");
      } else {
        // Create new package
        const newPackageData = {
          ...packageData,
          createdAt: new Date()
        };
        await dbService.create('servicePackages', newPackageData);
        toast.success("Package created successfully");
      }
      
      // Navigate back to services page
      navigate('/services');
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} package`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
        <p className="mt-4 text-gray-600">Loading package details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => navigate('/services')}
        >
          <ArrowLeft size={16} />
          Back to Services
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-wedding-900 mb-6">
          {isEditMode ? "Edit Package" : "Create New Package"}
        </h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Premium Wedding Photography" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a descriptive name for your service package.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₱)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Set the price for this package in Philippine Pesos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceCategories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the category that best describes your service.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your service package in detail..." 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of what clients will receive with this package.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add one feature per line, e.g.&#10;8 hours of photography coverage&#10;All edited high-resolution images&#10;Online gallery" 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    List the features of your package, one per line.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <div>
                <FormLabel>Package Images</FormLabel>
                <div className="mt-2 flex flex-wrap gap-4">
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative w-24 h-24">
                      <img 
                        src={image} 
                        alt={`Package image ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {selectedImages.map((image, index) => (
                    <div key={`new-${index}`} className="relative w-24 h-24">
                      <img 
                        src={image.preview} 
                        alt={`New package image ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    <ImagePlus size={24} className="text-gray-400" />
                    <span className="mt-1 text-xs text-gray-500">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      multiple
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Upload up to 5 images showcasing your package. First image will be the cover image.
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Packages that are active will be visible to clients in the directory.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-wedding-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/services')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="wedding-btn"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Create Package'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
