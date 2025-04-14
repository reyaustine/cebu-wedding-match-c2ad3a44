
import { FC, useState, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Plus, X, ImageIcon, Loader2 } from "lucide-react";
import { storageService } from "@/services/storageService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface MultiImageUploaderProps {
  onUpload: (urls: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
}

export const MultiImageUploader: FC<MultiImageUploaderProps> = ({
  onUpload,
  initialImages = [],
  maxImages = 5,
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (initialImages) {
      setImageUrls(initialImages);
    }
  }, [initialImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error("You must be logged in to upload images");
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (imageUrls.length + files.length > maxImages) {
      toast.error(`You can upload maximum ${maxImages} images`);
      return;
    }

    setIsUploading(true);

    try {
      const newUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await storageService.uploadImage(file, `services/${user.id}`);
        newUrls.push(url);
      }
      
      const updatedUrls = [...imageUrls, ...newUrls];
      setImageUrls(updatedUrls);
      onUpload(updatedUrls);
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedUrls = [...imageUrls];
    updatedUrls.splice(index, 1);
    setImageUrls(updatedUrls);
    onUpload(updatedUrls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
            <img
              src={url}
              alt={`Uploaded image ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={() => handleRemoveImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {imageUrls.length < maxImages && (
          <div className="border border-dashed rounded-md flex items-center justify-center aspect-square relative overflow-hidden">
            <Label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Add Image</span>
                </>
              )}
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
              multiple={true}
            />
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Upload up to {maxImages} images. Recommended size: 800x600px.
      </p>
    </div>
  );
};
