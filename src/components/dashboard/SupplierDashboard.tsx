
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Package, MessageSquare, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { dbService } from "@/services/databaseService";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { where, collection, doc, getDoc } from "firebase/firestore";
import { Booking, ServicePackage } from "@/types/supplier";

interface Conversation {
  id?: string;
  participants: string[];
}

interface Message {
  senderId: string;
  read: boolean;
}

interface DashboardStats {
  pendingBookings: number;
  activePackages: number;
  unreadMessages: number;
  monthlyRevenue: number;
}

export const SupplierDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    pendingBookings: 0,
    activePackages: 0,
    unreadMessages: 0,
    monthlyRevenue: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch pending bookings count
        const bookings = await dbService.query<Booking>('bookings', 
          where('supplierId', '==', user.id),
          where('status', '==', 'pending')
        );
        
        // Fetch active packages count
        const packages = await dbService.query<ServicePackage>('servicePackages', 
          where('supplierId', '==', user.id),
          where('isActive', '==', true)
        );

        // Get unread messages
        const conversations = await dbService.query<Conversation>('conversations', 
          where('participants', 'array-contains', user.id)
        );
        
        let unreadCount = 0;
        
        // Count unread messages
        for (const convo of conversations) {
          if (!convo.id) continue;
          
          const convoId = convo.id as string;
          
          try {
            const messages = await dbService.query<Message>(
              `conversations/${convoId}/messages`,
              where('senderId', '!=', user.id),
              where('read', '==', false)
            );
            unreadCount += messages.length;
          } catch (messageError) {
            console.error("Error fetching messages:", messageError);
            // Continue with other conversations
          }
        }
        
        // Calculate monthly revenue (simplified for demo)
        const completedBookings = await dbService.query<Booking>('bookings',
          where('supplierId', '==', user.id),
          where('status', '==', 'completed'),
          where('completedAt', '>=', new Date(new Date().setDate(1))) // From 1st day of current month
        );
        
        const monthlyRevenue = completedBookings.reduce((total, booking) => {
          const bookingAmount = booking.amount || 0;
          return total + bookingAmount;
        }, 0);
        
        setStats({
          pendingBookings: bookings.length,
          activePackages: packages.length,
          unreadMessages: unreadCount,
          monthlyRevenue: monthlyRevenue
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleCreatePackage = () => {
    navigate('/services/new');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-wedding-900">Supplier Dashboard</h1>
          <p className="text-gray-600">Manage your wedding services business</p>
        </div>
        <Button className="wedding-btn" onClick={handleCreatePackage}>
          Create New Package
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
                <h3 className="text-3xl font-bold mt-1">{stats.pendingBookings}</h3>
              </div>
              <Calendar className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Packages</p>
                <h3 className="text-3xl font-bold mt-1">{stats.activePackages}</h3>
              </div>
              <Package className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Unread Messages</p>
                <h3 className="text-3xl font-bold mt-1">{stats.unreadMessages}</h3>
              </div>
              <MessageSquare className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue (This Month)</p>
                <h3 className="text-3xl font-bold mt-1">₱{stats.monthlyRevenue.toLocaleString()}</h3>
              </div>
              <DollarSign className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Your scheduled events and appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.pendingBookings > 0 ? (
            <div>
              {/* We'll render actual booking data when available */}
              <p>Loading upcoming bookings...</p>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg font-medium">No upcoming bookings</p>
              <p className="text-sm mt-2">Create packages to start receiving bookings</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
