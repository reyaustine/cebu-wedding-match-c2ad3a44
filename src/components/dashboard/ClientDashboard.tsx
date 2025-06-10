
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MessageSquare, ArrowLeft, MapPin, Clock, ArrowRight, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dbService } from "@/services/databaseService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { where } from "firebase/firestore";

interface Booking {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierCategory: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  reviewSubmitted?: boolean;
}

export const ClientDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // In a real app, we would fetch actual bookings from Firestore
        // For now, let's try to fetch from database if available, otherwise use mock data
        let fetchedBookings: Booking[] = [];
        
        try {
          // Try to fetch from database if it exists
          fetchedBookings = await dbService.query<Booking>(
            "bookings",
            where("userId", "==", user.id)
          );
        } catch (error) {
          console.log("Using mock data instead:", error);
          // If database fetch fails, use mock data
          fetchedBookings = [
            {
              id: "booking1",
              supplierId: "supplier1",
              supplierName: "Moments Photography",
              supplierCategory: "Photography",
              date: "2025-05-15",
              time: "13:00",
              location: "Cebu City",
              status: "confirmed"
            },
            {
              id: "booking2",
              supplierId: "supplier2",
              supplierName: "Divine Blooms",
              supplierCategory: "Flowers & Decor",
              date: "2025-06-20",
              time: "10:00",
              location: "Mandaue City",
              status: "pending"
            },
            {
              id: "booking3",
              supplierId: "supplier3",
              supplierName: "Cebu Catering",
              supplierCategory: "Catering",
              date: "2025-04-30",
              time: "18:00",
              location: "Lapu-Lapu City",
              status: "completed",
              reviewSubmitted: false
            }
          ];
        }
        
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load your bookings");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      // In a real app, we would update the booking status in Firestore
      // For now, let's just update the state
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 500)), 
        {
          loading: 'Cancelling booking...',
          success: 'Booking cancelled successfully',
          error: 'Failed to cancel booking'
        }
      );
      
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? {...booking, status: "cancelled" as const} : booking
      ));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const handleLeaveReview = (bookingId: string) => {
    // In a real app, we would navigate to a review form
    toast.info("Review feature coming soon!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter bookings based on status for each tab
  const upcomingBookings = bookings.filter(b => b.status === "pending" || b.status === "confirmed");
  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h3 className="text-lg font-medium text-wedding-800">{booking.supplierName}</h3>
              <Badge className={getStatusColor(booking.status)} variant="outline">
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mb-2">{booking.supplierCategory}</p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{booking.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
            <Button className="flex-1 md:w-full wedding-btn-outline flex items-center justify-center gap-1">
              <MessageSquare size={14} />
              <span>Message</span>
            </Button>
            
            {booking.status === "pending" || booking.status === "confirmed" ? (
              <Button 
                className="flex-1 md:w-full bg-red-100 text-red-800 hover:bg-red-200 flex items-center justify-center gap-1"
                onClick={() => handleCancelBooking(booking.id)}
              >
                Cancel
              </Button>
            ) : booking.status === "completed" && !booking.reviewSubmitted ? (
              <Button 
                className="flex-1 md:w-full bg-amber-100 text-amber-800 hover:bg-amber-200 flex items-center justify-center gap-1"
                onClick={() => handleLeaveReview(booking.id)}
              >
                <Star size={14} />
                Review
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = (message: string) => (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-gray-700 mb-1">{message}</h3>
      <p className="text-gray-500 mb-4">You don't have any bookings in this category</p>
      <Link to="/suppliers">
        <Button className="wedding-btn">Browse Suppliers</Button>
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-wedding-900">My Bookings</h1>
          <p className="text-gray-600">View and manage your wedding service bookings</p>
        </div>
        <div className="flex flex-row gap-2">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
          <Link to="/suppliers">
            <Button className="wedding-btn flex items-center gap-2">
              Find Suppliers
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {upcomingBookings.map(renderBookingCard)}
            </div>
          ) : renderEmptyState("No upcoming bookings")}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {isLoading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : pastBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pastBookings.map(renderBookingCard)}
            </div>
          ) : renderEmptyState("No past bookings")}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : bookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map(renderBookingCard)}
            </div>
          ) : renderEmptyState("No bookings found")}
        </TabsContent>
      </Tabs>
    </div>
  );
};
