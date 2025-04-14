
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Heart, ArrowLeft, MapPin, Clock, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dbService } from "@/services/databaseService";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface Booking {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierCategory: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export const ClientDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // In a real app, we would fetch actual bookings from Firestore
        // For now, let's simulate some sample data
        const mockBookings: Booking[] = [
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
          }
        ];
        
        // In a real implementation, we'd fetch from Firestore
        // const userBookings = await dbService.query<Booking>(
        //   "bookings",
        //   where("userId", "==", user.id)
        // );
        
        setBookings(mockBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load your bookings");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
          ) : bookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
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
                        {booking.status === "pending" && (
                          <Button className="flex-1 md:w-full bg-red-100 text-red-800 hover:bg-red-200 flex items-center justify-center gap-1">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No upcoming bookings</h3>
              <p className="text-gray-500 mb-4">You don't have any upcoming bookings yet</p>
              <Link to="/suppliers">
                <Button className="wedding-btn">Browse Suppliers</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">No past bookings</h3>
            <p className="text-gray-500 mb-4">You don't have any past bookings yet</p>
            <Link to="/suppliers">
              <Button className="wedding-btn">Browse Suppliers</Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : bookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No bookings found</h3>
              <p className="text-gray-500 mb-4">You haven't booked any services yet</p>
              <Link to="/suppliers">
                <Button className="wedding-btn">Browse Suppliers</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
