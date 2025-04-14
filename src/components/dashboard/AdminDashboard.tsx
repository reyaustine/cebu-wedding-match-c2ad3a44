
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
  Upload
} from "lucide-react";
import { dbService } from "@/services/databaseService";
import { useAuth } from "@/contexts/AuthContext";
import { isSuperAdmin } from "@/services/authService";
import { toast } from "sonner";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    reportedContent: 0,
    activeBookings: 0
  });
  const { user } = useAuth();
  const isSuperAdminUser = user ? isSuperAdmin(user.email) : false;
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, these would be actual queries to Firestore
        // For now we'll just simulate the data
        setStats({
          totalUsers: 1, // Including the super admin
          pendingVerifications: 0,
          reportedContent: 0,
          activeBookings: 0
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard statistics");
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-wedding-900">Admin Dashboard</h1>
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
                <h3 className="text-3xl font-bold mt-1">{stats.totalUsers}</h3>
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
                <h3 className="text-3xl font-bold mt-1">{stats.pendingVerifications}</h3>
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
                <h3 className="text-3xl font-bold mt-1">{stats.reportedContent}</h3>
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
                <h3 className="text-3xl font-bold mt-1">{stats.activeBookings}</h3>
              </div>
              <LineChart className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isSuperAdminUser && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
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
              <CardHeader>
                <CardTitle>Verification Requests</CardTitle>
                <CardDescription>Review and approve supplier verification requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  <p>No pending verification requests</p>
                  <p className="text-sm mt-2">New supplier verification requests will appear here</p>
                </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              <div className="text-center py-10 text-gray-500">
                <p>No pending verification requests</p>
                <p className="text-sm mt-2">New supplier verification requests will appear here</p>
              </div>
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
