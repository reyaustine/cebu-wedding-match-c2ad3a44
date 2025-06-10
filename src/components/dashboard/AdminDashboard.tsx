import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Calendar, CheckCircle, XCircle, FileText, AlertTriangle } from "lucide-react";
import { dbService } from "@/services/databaseService";
import { where } from "firebase/firestore";
import { toast } from "sonner";

interface DashboardStat {
  title: string;
  value: number | string;
  description: string;
  icon: JSX.Element;
  changePercent?: number;
  isLoading?: boolean;
}

interface VerificationRequest {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  businessName?: string;
  createdAt: any; // Firestore timestamp
  status: "pending" | "approved" | "rejected";
  category?: string;
  businessInfo?: {
    businessName: string;
    [key: string]: any;
  };
}

interface UserData {
  id: string;
  email: string;
  displayName?: string;
  businessInfo?: {
    businessName: string;
    [key: string]: any;
  };
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching admin dashboard data...");
        
        // Fetch users from correct path
        const users = await dbService.getAll("v1/core/users");
        const totalUsers = users.length;
        console.log("Total users found:", totalUsers);
        
        // Fetch pending verification requests from correct path
        const verifications = await dbService.query<VerificationRequest>("v1/core/userVerifications", 
          where("status", "==", "submitted")
        );
        
        const pendingVerifications = verifications.length;
        console.log("Pending verifications found:", pendingVerifications);
        
        // Enrich verification data with user details
        const enrichedVerifications: VerificationRequest[] = [];
        
        for (const verification of verifications) {
          try {
            const userData = await dbService.getById<UserData>("v1/core/users", verification.userId);
            if (userData) {
              enrichedVerifications.push({
                ...verification,
                userEmail: userData.email,
                userName: userData.displayName || userData.email.split('@')[0],
                businessName: userData.businessInfo?.businessName || 'Unknown Business'
              });
            } else {
              enrichedVerifications.push(verification);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            enrichedVerifications.push(verification);
          }
        }
        
        // Fetch bookings from correct path
        const bookings = await dbService.getAll("v1/core/bookings");
        const totalBookings = bookings.length;
        console.log("Total bookings found:", totalBookings);
        
        // Set dashboard stats
        setStats([
          {
            title: "Total Users",
            value: totalUsers,
            description: "Registered users across all roles",
            icon: <Users className="h-5 w-5 text-blue-500" />,
            isLoading: false
          },
          {
            title: "Pending Verifications",
            value: pendingVerifications,
            description: "Awaiting admin review",
            icon: <FileText className="h-5 w-5 text-amber-500" />,
            isLoading: false
          },
          {
            title: "Total Bookings",
            value: totalBookings,
            description: "Across all suppliers",
            icon: <Calendar className="h-5 w-5 text-green-500" />,
            isLoading: false
          }
        ]);
        
        setVerificationRequests(enrichedVerifications);
        console.log("Admin dashboard data loaded successfully");
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load admin dashboard data");
        
        // Set placeholder stats
        setStats([
          {
            title: "Total Users",
            value: "Error",
            description: "Failed to load data",
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            isLoading: false
          },
          {
            title: "Pending Verifications",
            value: "Error",
            description: "Failed to load data",
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            isLoading: false
          },
          {
            title: "Total Bookings",
            value: "Error",
            description: "Failed to load data",
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            isLoading: false
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);
  
  const handleApproveVerification = async (id: string, userId: string) => {
    try {
      console.log("Approving verification for user:", userId);
      // Update verification status using correct path
      await dbService.update("v1/core/userVerifications", id, { 
        status: "approved",
        approvedAt: new Date(),
        approvedBy: "admin"
      });
      
      // Also update the user's verification status using correct path
      await dbService.update("v1/core/users", userId, { 
        verificationStatus: "verified" 
      });
      
      toast.success("Verification approved successfully");
      
      // Remove from pending list
      setVerificationRequests(prev => prev.filter(req => req.id !== id));
      
      // Update stats
      setStats(prev => prev.map(stat => 
        stat.title === "Pending Verifications" 
          ? { ...stat, value: (stat.value as number) - 1 }
          : stat
      ));
    } catch (error) {
      console.error("Error approving verification:", error);
      toast.error("Failed to approve verification");
    }
  };
  
  const handleRejectVerification = async (id: string, userId: string) => {
    try {
      console.log("Rejecting verification for user:", userId);
      // Update verification status using correct path
      await dbService.update("v1/core/userVerifications", id, { 
        status: "rejected",
        rejectedAt: new Date(),
        rejectedBy: "admin"
      });
      
      // Also update the user's verification status using correct path
      await dbService.update("v1/core/users", userId, { 
        verificationStatus: "unverified" 
      });
      
      toast.success("Verification rejected successfully");
      
      // Remove from pending list
      setVerificationRequests(prev => prev.filter(req => req.id !== id));
      
      // Update stats
      setStats(prev => prev.map(stat => 
        stat.title === "Pending Verifications" 
          ? { ...stat, value: (stat.value as number) - 1 }
          : stat
      ));
    } catch (error) {
      console.error("Error rejecting verification:", error);
      toast.error("Failed to reject verification");
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-wedding-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, verifications, and platform activity</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className="flex items-center gap-1">
                    {stat.isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-wedding-500" />
                    ) : (
                      <h2 className="text-3xl font-bold">
                        {typeof stat.value === 'number' && stat.value >= 1000 
                          ? `${(stat.value / 1000).toFixed(1)}K` 
                          : stat.value}
                      </h2>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                </div>
                <div className="rounded-full bg-gray-100 p-2">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Verification Requests */}
      <Tabs defaultValue="pending" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-medium mb-1">Verification Requests</h2>
            <p className="text-sm text-gray-500">Review and manage verification requests from suppliers and planners</p>
          </div>
          <TabsList>
            <TabsTrigger value="pending">Pending ({verificationRequests.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="pending">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : verificationRequests.length > 0 ? (
            <div className="space-y-4">
              {verificationRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <CardTitle className="text-lg">{request.businessName || "Unknown Business"}</CardTitle>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 self-start sm:self-auto">
                        Pending
                      </Badge>
                    </div>
                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span>{request.userName || "Unknown User"}</span>
                      {request.userEmail && (
                        <span className="text-xs">{request.userEmail}</span>
                      )}
                      {request.category && (
                        <Badge variant="outline" className="self-start sm:self-auto">
                          {request.category}
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <Button 
                        onClick={() => handleApproveVerification(request.id, request.userId)}
                        className="flex items-center gap-2 bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleRejectVerification(request.id, request.userId)}
                        className="flex items-center gap-2 bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex items-center gap-2 ml-auto"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-1">No pending verification requests</h3>
                <p className="text-gray-500">All verification requests have been processed</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="approved">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-1">Approved verifications</h3>
              <p className="text-gray-500">This section will show approved verification requests</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-1">Rejected verifications</h3>
              <p className="text-gray-500">This section will show rejected verification requests</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
