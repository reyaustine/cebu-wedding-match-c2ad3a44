import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { dbService } from "@/services/databaseService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ServicePackage } from "@/types/supplier";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { InputWithCopyButton } from "@/components/ui/input-with-copy-button";
import { MultiImageUploader } from "@/components/ui/multi-image-uploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the schema for form validation
const schema = yup.object({
  name: yup.string().required("Package name is required"),
  description: yup.string().required("Description is required"),
  price: yup.number().required("Price is required").positive("Price must be positive"),
  category: yup.string().required("Category is required"),
  features: yup.array().of(yup.string()).required("At least one feature is required").min(1, "At least one feature is required"),
  images: yup.array().of(yup.string()).optional(),
}).required();

interface PackageFormProps {
  packageId?: string;
  isEditMode?: boolean;
}

export const PackageForm = ({ packageId, isEditMode }: PackageFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<ServicePackage>({
    id: '',
    supplierId: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    features: [],
    images: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: formValues
  });

  useEffect(() => {
    if (isEditMode && packageId) {
      const fetchPackage = async () => {
        setIsLoading(true);
        try {
          const packageData = await dbService.get<ServicePackage>('servicePackages', packageId);
          if (packageData) {
            setFormValues(packageData);
            // Set default values for the form
            setValue('name', packageData.name);
            setValue('description', packageData.description);
            setValue('price', packageData.price);
            setValue('category', packageData.category);
            setValue('features', packageData.features);
            setValue('images', packageData.images);
          } else {
            toast.error("Package not found");
            navigate('/services');
          }
        } catch (error) {
          console.error("Error fetching package:", error);
          toast.error("Failed to load package data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPackage();
    }
  }, [isEditMode, packageId, setValue, navigate]);

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    if (!user) {
      toast.error("You must be logged in to create a package");
      return;
    }

    setIsLoading(true);

    try {
      const packageData: Omit<ServicePackage, 'id'> = {
        supplierId: user.id,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        features: data.features,
        images: data.images || [],
        isActive: true,
        createdAt: isEditMode ? formValues.createdAt : new Date(),
        updatedAt: new Date(),
      };

      if (isEditMode && packageId) {
        await dbService.update('servicePackages', packageId, packageData);
        toast.success("Package updated successfully");
      } else {
        await dbService.add('servicePackages', packageData);
        toast.success("Package created successfully");
      }

      navigate('/services');
    } catch (error) {
      console.error("Error creating/updating package:", error);
      toast.error("Failed to save package");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFeature = () => {
    setFormValues({ ...formValues, features: [...formValues.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...formValues.features];
    newFeatures.splice(index, 1);
    setFormValues({ ...formValues, features: newFeatures });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formValues.features];
    newFeatures[index] = value;
    setFormValues({ ...formValues, features: newFeatures });
  };

  const handleImageUpload = (images: string[]) => {
    setFormValues({ ...formValues, images: images });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Service Package" : "Create New Service Package"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update your service package details here." : "Create a new service package to showcase your services."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Package Name</Label>
              <Input id="name" type="text"  {...register("name")} defaultValue={formValues.name} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} defaultValue={formValues.description} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" {...register("price")} defaultValue={formValues.price} />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" type="text" {...register("category")} defaultValue={formValues.category} />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <Label>Features</Label>
              {formValues.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="button" variant="outline" size="icon" className="text-red-500" onClick={() => handleRemoveFeature(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6"/><path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddFeature}>
                Add Feature
              </Button>
              {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features.message}</p>}
            </div>

            <div>
              <Label>Images</Label>
              <MultiImageUploader onUpload={handleImageUpload} initialImages={formValues.images} />
            </div>

            <Button type="submit" className="wedding-btn" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (isEditMode ? "Update Package" : "Create Package")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
