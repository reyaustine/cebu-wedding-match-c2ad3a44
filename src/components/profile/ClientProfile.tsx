
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Camera, CheckCircle, Lock, Mail, Phone, User, Calendar, MapPin, Edit, UploadCloud } from "lucide-react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { User as AuthUser, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/config/firebase";
import { storageService } from "@/services/storageService";

// Form schemas for validation
const personalInfoSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  phoneNumber: z.string().optional(),
  birthday: z.string().optional(),
  address: z.string().optional(),
});

const emailUpdateSchema = z.object({
  newEmail: z.string().email({ message: "Please enter a valid email address." }),
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least 1 uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least 1 number." }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const ClientProfile = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Forms for different types of updates
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      birthday: "",
      address: "",
    },
  });

  const emailForm = useForm<z.infer<typeof emailUpdateSchema>>({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      newEmail: user?.email || "",
      currentPassword: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordUpdateSchema>>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  // Update personal information
  const onPersonalInfoSubmit = async (values: z.infer<typeof personalInfoSchema>) => {
    if (!user?.id) return;
    setIsUpdating(true);

    try {
      await updateDoc(doc(db, "users", user.id), {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        // Can add other fields to store in Firebase
      });
      
      toast.success("Personal information updated successfully!");
    } catch (error: any) {
      console.error("Error updating personal info:", error);
      toast.error(error.message || "Failed to update personal information");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Update email address
  const onEmailSubmit = async (values: z.infer<typeof emailUpdateSchema>) => {
    if (!auth.currentUser || !user?.id) return;
    setIsUpdating(true);
    
    try {
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email || "",
        values.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update email in Firebase Auth
      await updateEmail(auth.currentUser, values.newEmail);
      
      // Update email in Firestore
      await updateDoc(doc(db, "users", user.id), {
        email: values.newEmail
      });
      
      toast.success("Email updated successfully!");
      emailForm.reset({
        newEmail: values.newEmail,
        currentPassword: ""
      });
    } catch (error: any) {
      console.error("Error updating email:", error);
      
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use by another account");
      } else {
        toast.error(error.message || "Failed to update email");
      }
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Update password
  const onPasswordSubmit = async (values: z.infer<typeof passwordUpdateSchema>) => {
    if (!auth.currentUser) return;
    setIsUpdating(true);
    
    try {
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email || "",
        values.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password in Firebase Auth
      await updatePassword(auth.currentUser, values.newPassword);
      
      toast.success("Password updated successfully!");
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect current password");
      } else {
        toast.error(error.message || "Failed to update password");
      }
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;
    
    setIsUploading(true);
    
    try {
      const photoURL = await storageService.uploadProfileImage(user.id, file);
      
      // Update user document with new photo URL
      await updateDoc(doc(db, "users", user.id), {
        photoURL
      });
      
      toast.success("Profile photo updated successfully!");
      
      // Force refresh to show new image
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      toast.error(error.message || "Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-wedding-900">My Profile</h1>
        <p className="text-gray-600">View and manage your personal information</p>
      </div>

      {/* Profile Overview Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-wedding-50 relative pb-16">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={user?.photoURL || ""} alt={user?.firstName || "User"} />
                <AvatarFallback className="bg-wedding-200 text-wedding-800 text-xl">
                  {user?.firstName ? getInitials(`${user.firstName} ${user.lastName}`) : "U"}
                </AvatarFallback>
              </Avatar>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-wedding-500 text-white p-1.5 rounded-full hover:bg-wedding-600"
              >
                <Camera size={16} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-16 pb-6 text-center">
          <h2 className="text-xl font-medium">{user?.firstName} {user?.lastName}</h2>
          {user?.verificationStatus === "verified" && (
            <div className="flex items-center justify-center gap-1 text-green-600 my-1">
              <CheckCircle size={16} />
              <span className="text-sm">Verified Account</span>
            </div>
          )}
          <p className="text-gray-500">{user?.email}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center gap-1">
              <Mail size={14} />
              <span>Client</span>
            </div>
            {user?.phoneNumber && (
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center gap-1">
                <Phone size={14} />
                <span>{user.phoneNumber}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Settings Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details below</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...personalInfoForm}>
                <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={personalInfoForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birthday</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="wedding-btn" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Information"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>Change your email address</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="newEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={emailForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="wedding-btn" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Email"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your current password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter new password" {...field} />
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
                          <Input type="password" placeholder="Confirm new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="wedding-btn" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Change Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
