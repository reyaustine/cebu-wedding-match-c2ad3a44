
import { useState } from "react";
import { Upload, XCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storageService } from "@/services/storageService";
import { toast } from "sonner";

interface FileUploadProps {
  label: string;
  userId: string;
  fileType: string;
  onFileUploaded: (url: string) => void;
  existingUrl?: string;
}

export const FileUpload = ({ 
  label, 
  userId, 
  fileType, 
  onFileUploaded,
  existingUrl 
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | undefined>(existingUrl);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG) or PDF file");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }
    
    setError(null);
    setIsUploading(true);
    
    try {
      // Upload to Firebase Storage
      const path = `verification/${userId}/${fileType}_${Date.now()}`;
      
      console.log("Uploading file to path:", path);
      console.log("File type:", file.type);
      console.log("File size:", file.size);
      
      const downloadUrl = await storageService.uploadFile(path, file);
      console.log("Download URL received:", downloadUrl);
      
      if (downloadUrl) {
        setFileUrl(downloadUrl);
        onFileUploaded(downloadUrl);
        toast.success("File uploaded successfully");
      } else {
        throw new Error("Failed to get download URL");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload file. Please try again.");
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearFile = () => {
    setFileUrl(undefined);
    onFileUploaded("");
  };
  
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      
      {!fileUrl ? (
        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
          <div className="mb-4">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          
          <label className="cursor-pointer">
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              disabled={isUploading}
            />
            <Button 
              type="button" 
              variant="outline"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Choose File"
              )}
            </Button>
          </label>
          
          <p className="text-xs text-muted-foreground mt-2">
            JPEG, PNG or PDF (Max 5MB)
          </p>
          
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </div>
      ) : (
        <div className="border rounded-md p-3 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm truncate">File uploaded successfully</span>
          </div>
          
          <Button 
            type="button"
            variant="ghost" 
            size="sm" 
            onClick={clearFile}
            className="text-destructive hover:text-destructive/90"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
