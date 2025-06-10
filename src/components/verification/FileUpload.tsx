
import { useState, useRef } from "react";
import { Upload, XCircle, CheckCircle2, Loader2, Eye } from "lucide-react";
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
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    setFileName(file.name);
    
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
    setFileName("");
    onFileUploaded("");
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const isImageFile = (url: string) => {
    return url && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('image%2F'));
  };
  
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      
      {!fileUrl ? (
        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
          <div className="mb-4">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            disabled={isUploading}
          />
          
          <Button 
            type="button" 
            variant="outline"
            onClick={triggerFileInput}
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
          
          <p className="text-xs text-muted-foreground mt-2">
            JPEG, PNG or PDF (Max 5MB)
          </p>
          
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          {/* Thumbnail preview section */}
          {isImageFile(fileUrl) && (
            <div className="relative">
              <img 
                src={fileUrl} 
                alt="Uploaded file preview" 
                className="w-full h-32 object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}
          
          {/* Success indicator and actions */}
          <div className="p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-green-700 truncate">
                    File uploaded successfully
                  </p>
                  {fileName && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {fileName}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {isImageFile(fileUrl) && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(fileUrl, '_blank')}
                    className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                    title="View full image"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFile}
                  className="text-destructive hover:text-destructive/90 h-8 w-8 p-0"
                  title="Remove file"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
