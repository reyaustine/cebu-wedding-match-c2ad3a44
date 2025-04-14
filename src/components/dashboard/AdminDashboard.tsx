
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Users,
  AlertTriangle,
  CheckCircle,
  LineChart,
  Settings,
  BarChart3,
  Building,
  FileText,
  Bell,
  Calendar,
  Upload,
  Search,
  Check,
  X
} from "lucide-react";
import { dbService } from "@/services/databaseService";
import { useAuth } from "@/contexts/AuthContext";
import { isSuperAdmin } from "@/services/authService";
import { toast } from "sonner";
import { where } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StatsData {
  totalUsers: number;
  pendingVerifications: number;
  reportedContent: number;
  activeBookings: number;
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
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    pendingVerifications: 0,
    reportedContent: 0,
    activeBookings: 0
  });
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const isSuperAdminUser = user ? isSuperAdmin(user.email) : false;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users count
        const users = await dbService.getAll("users");
        const totalUsers = users.length;
        
        // Fetch pending verification requests
        const verifications = await dbService.query("userVerifications", 
          where("status", "==", "pending")
        );
        
        const pendingVerifications = verifications.length;
        
        // Enrich verification data with user information
        const enrichedVerifications: VerificationRequest[] = [];
        
        for (const verification of verifications) {
          try {
            const userData = await dbService.getById("users", verification.userId);
            if (userData) {
              enrichedVerifications.push({
                ...verification,
                userEmail: userData.email,
                userName: userData.displayName || userData.email,
                businessName: verification.businessInfo?.businessName || "Unknown Business"
              });
            } else {
              enrichedVerifications.push(verification);
            }
          } catch (error) {
            console.error(`Error fetching user data for ${verification.userId}:`, error);
            enrichedVerifications.push(verification);
          }
        }
        
        setVerificationRequests(enrichedVerifications);
        
        // For now, hardcoded stats for reported content and active bookings
        const reportedContent = 0;
        const activeBookings = 0;
        
        setStats({
          totalUsers,
          pendingVerifications,
          reportedContent,
          activeBookings
        });
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleApproveVerification = async (id: string) => {
    try {
      await dbService.update("userVerifications", id, {
        status: "approved"
      });
      
      toast.success("Verification approved successfully");
      
      // Refetch verification requests
      const updatedVerifications = verificationRequests.map(req => 
        req.id === id ? { ...req, status: "approved" } : req
      );
      
      setVerificationRequests(updatedVerifications);
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1
      }));
    } catch (error) {
      console.error("Error approving verification:", error);
      toast.error("Failed to approve verification");
    }
  };

  const handleRejectVerification = async (id: string) => {
    try {
      await dbService.update("userVerifications", id, {
        status: "rejected"
      });
      
      toast.success("Verification rejected");
      
      // Refetch verification requests
      const updatedVerifications = verificationRequests.map(req => 
        req.id === id ? { ...req, status: "rejected" } : req
      );
      
      setVerificationRequests(updatedVerifications);
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1
      }));
    } catch (error) {
      console.error("Error rejecting verification:", error);
      toast.error("Failed to reject verification");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-wedding-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            {isSuperAdminUser 
              ? "Super Admin CRM Dashboard" 
              : "Platform management and verification center"}
          </p>
        </div>
        
        {isSuperAdminUser && (
          <Button variant="outline" className="flex items-center gap-2">
            <Settings size={16} />
            System Settings
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-1" />
                ) : (
                  <h3 className="text-3xl font-bold mt-1">{stats.totalUsers}</h3>
                )}
              </div>
              <Users className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-1" />
                ) : (
                  <h3 className="text-3xl font-bold mt-1">{stats.pendingVerifications}</h3>
                )}
              </div>
              <CheckCircle className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Reported Content</p>
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-1" />
                ) : (
                  <h3 className="text-3xl font-bold mt-1">{stats.reportedContent}</h3>
                )}
              </div>
              <AlertTriangle className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Bookings</p>
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-1" />
                ) : (
                  <h3 className="text-3xl font-bold mt-1">{stats.activeBookings}</h3>
                )}
              </div>
              <LineChart className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isSuperAdminUser && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6 overflow-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 size={18} />
                      Platform Analytics
                    </CardTitle>
                    <CardDescription>User registration and activity</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">Analytics will be displayed here</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bell size={18} />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest platform events</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 text-gray-500">
                    <p>No recent activity</p>
                    <p className="text-sm mt-2">New activities will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  <p>No users to display</p>
                  <p className="text-sm mt-2">User list will appear here as they register</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Verification Requests</CardTitle>
                  <CardDescription>Review and approve supplier verification requests</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Search size={14} />
                    <span>Search</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-gray-100 rounded-md animate-pulse" />
                    ))}
                  </div>
                ) : verificationRequests.length > 0 ? (
                  <div className="space-y-4">
                    {verificationRequests.map((request) => (
                      <div key={request.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3 mb-3 md:mb-0">
                          <Avatar>
                            <AvatarFallback>{request.userName?.substring(0, 2) || "??"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{request.businessName || "Business"}</h3>
                            <p className="text-sm text-gray-500">{request.userEmail}</p>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                                {request.category || "General"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Button 
                            onClick={() => handleApproveVerification(request.id)} 
                            className="flex-1 md:flex-none bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1"
                          >
                            <Check size={16} />
                            <span>Approve</span>
                          </Button>
                          <Button 
                            onClick={() => handleRejectVerification(request.id)} 
                            className="flex-1 md:flex-none bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>No pending verification requests</p>
                    <p className="text-sm mt-2">New supplier verification requests will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage website content and reported items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  <p>No content to manage</p>
                  <p className="text-sm mt-2">Content management tools will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                    <Building size={24} />
                    <span>Business Settings</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                    <FileText size={24} />
                    <span>Content Policy</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                    <Calendar size={24} />
                    <span>Event Settings</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                    <Users size={24} />
                    <span>User Roles</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                    <Upload size={24} />
                    <span>Import/Export</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                    <Settings size={24} />
                    <span>Advanced</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {!isSuperAdminUser && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Verification Requests</CardTitle>
                <CardDescription>Suppliers awaiting verification</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded-md animate-pulse" />
                  ))}
                </div>
              ) : verificationRequests.length > 0 ? (
                <div className="space-y-4">
                  {verificationRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-3 mb-3 md:mb-0">
                        <Avatar>
                          <AvatarFallback>{request.userName?.substring(0, 2) || "??"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{request.businessName || "Business"}</h3>
                          <p className="text-sm text-gray-500">{request.userEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button 
                          onClick={() => handleApproveVerification(request.id)} 
                          className="flex-1 md:flex-none bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1"
                        >
                          <Check size={16} />
                          <span>Approve</span>
                        </Button>
                        <Button 
                          onClick={() => handleRejectVerification(request.id)} 
                          className="flex-1 md:flex-none bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No pending verification requests</p>
                  <p className="text-sm mt-2">New supplier verification requests will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>User-reported content and issues</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-gray-500">
                <p>No reports</p>
                <p className="text-sm mt-2">Reports from users will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
