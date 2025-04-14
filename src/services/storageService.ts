
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/config/firebase";
import { toast } from "sonner";

export const storageService = {
  // Upload file to storage with progress tracking
  uploadFile: async (
    filePath: string,
    file: File
  ): Promise<string> => {
    try {
      console.log("Starting file upload to path:", filePath);
      
      // Create a storage reference
      const storageRef = ref(storage, filePath);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log("File uploaded successfully");
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Download URL obtained:", downloadURL);
      
      return downloadURL;
    } catch (error: any) {
      console.error("Error in uploadFile:", error);
      toast.error(`Upload failed: ${error.message}`);
      throw error;
    }
  },

  // Upload user profile image
  uploadProfileImage: async (
    userId: string,
    file: File
  ): Promise<string> => {
    const fileExtension = file.name.split('.').pop();
    const filePath = `users/${userId}/profile_${Date.now()}.${fileExtension}`;
    return await storageService.uploadFile(filePath, file);
  },

  // Upload supplier portfolio image
  uploadPortfolioImage: async (
    supplierId: string,
    file: File
  ): Promise<string> => {
    const fileExtension = file.name.split('.').pop();
    const filePath = `suppliers/${supplierId}/portfolio_${Date.now()}.${fileExtension}`;
    return await storageService.uploadFile(filePath, file);
  },
  
  // Upload package image
  uploadPackageImage: async (
    supplierId: string,
    packageId: string,
    file: File
  ): Promise<string> => {
    const fileExtension = file.name.split('.').pop();
    const filePath = `suppliers/${supplierId}/packages/${packageId}/${Date.now()}.${fileExtension}`;
    return await storageService.uploadFile(filePath, file);
  },

  // Delete file from storage
  deleteFile: async (fileUrl: string): Promise<void> => {
    try {
      // Get storage reference from URL
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message}`);
      throw error;
    }
  }
};
