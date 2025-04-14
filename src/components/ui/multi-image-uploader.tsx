
import { useState, useCallback, useEffect } from "react";
import { Button } from "./button";
import { toast } from "sonner";
import { storageService } from "@/services/storageService";
import { useAuth } from "@/contexts/AuthContext";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface MultiImageUploaderProps {
  onUpload: (imageUrls: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
}

export const MultiImageUploader = ({
  onUpload,
  initialImages = [],
  maxImages = 5,
}: MultiImageUploaderProps) => {
  const [images, setImages] = useState<string[]>(initialImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  
  // Update local state when initialImages changes
  useEffect(() => {
    if (initialImages) {
      setImages(initialImages);
    }
  }, [initialImages]);

  // Handle file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;
    
    setIsUploading(true);
    
    try {
      // Check if adding more images would exceed the limit
      if (images.length + files.length > maxImages) {
        toast.error(`You can only upload up to ${maxImages} images`);
        return;
      }
      
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExtension = file.name.split('.').pop();
        // Generate a unique file path
        const filePath = `packages/${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
        // Upload using the uploadFile method from storageService
        return storageService.uploadFile(filePath, file);
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      
      setImages(newImages);
      onUpload(newImages);
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  }, [images, maxImages, onUpload, user]);

  // Handle image deletion
  const handleRemoveImage = useCallback(async (indexToRemove: number) => {
    try {
      // Optionally delete from storage
      // await storageService.deleteFile(images[indexToRemove]);
      
      const newImages = images.filter((_, index) => index !== indexToRemove);
      setImages(newImages);
      onUpload(newImages);
      toast.success("Image removed");
    } catch (error) {
      toast.error("Failed to remove image");
    }
  }, [images, onUpload]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
            <img 
              src={imageUrl} 
              alt={`Uploaded ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(index)}
            >
              <X size={14} />
            </Button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <label className="cursor-pointer border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
            <input 
              type="file" 
              accept="image/*" 
              multiple={true}
              onChange={handleFileUpload}
              className="sr-only"
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-500"></div>
                <p className="text-xs text-gray-500 mt-2">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload size={24} className="text-gray-400" />
                <p className="text-xs text-gray-500 mt-2">Upload Image</p>
              </div>
            )}
          </label>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        Upload up to {maxImages} images. Recommended size: 1200x800px.
      </p>
    </div>
  );
};
