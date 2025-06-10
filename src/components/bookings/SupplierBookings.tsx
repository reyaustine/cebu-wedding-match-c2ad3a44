
import { useState, useEffect } from "react";
import { dbService } from "@/services/databaseService";
import { useAuth } from "@/contexts/AuthContext";
import { Booking } from "@/types/supplier";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, MessageSquare, CheckCircle, XCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { where, orderBy, Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";

export const SupplierBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const bookingsData = await dbService.query<Booking>(
          'bookings',
          where('supplierId', '==', user.id),
          orderBy('createdAt', 'desc')
        );
        
        // Convert timestamps to Date objects
        const processedBookings = bookingsData.map(booking => ({
          ...booking,
          date: booking.date instanceof Timestamp ? booking.date.toDate() : booking.date,
          createdAt: booking.createdAt instanceof Timestamp ? booking.createdAt.toDate() : booking.createdAt,
          updatedAt: booking.updatedAt instanceof Timestamp ? booking.updatedAt.toDate() : booking.updatedAt,
          completedAt: booking.completedAt instanceof Timestamp ? booking.completedAt.toDate() : booking.completedAt
        }));
        
        setBookings(processedBookings);
        setFilteredBookings(processedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Filter bookings based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter(booking => booking.status === activeTab)
      );
    }
  }, [activeTab, bookings]);

  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await dbService.update('bookings', bookingId, { 
        status: newStatus,
        updatedAt: new Date(),
        ...(newStatus === 'completed' ? { completedAt: new Date() } : {})
      });
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus, updatedAt: new Date() } 
            : booking
        )
      );
      
      toast.success(`Booking ${newStatus} successfully`);
    } catch (error) {
      console.error(`Error updating booking status:`, error);
      toast.error("Failed to update booking status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'confirmed': return "bg-blue-100 text-blue-800";
      case 'completed': return "bg-green-100 text-green-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper function to safely format dates
  const formatDate = (date: Date | Timestamp | undefined) => {
    if (!date) return "";
    
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'MMM dd, yyyy');
    }
    
    return format(date, 'MMM dd, yyyy');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-wedding-900">Bookings</h1>
        <p className="text-gray-600">Manage your client bookings and appointments</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredBookings.length > 0 ? (
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.clientName}</TableCell>
                      <TableCell>{booking.packageName}</TableCell>
                      <TableCell>{formatDate(booking.date)}</TableCell>
                      <TableCell>₱{booking.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Info size={16} className="mr-1" /> View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Booking Details</DialogTitle>
                                <DialogDescription>
                                  Booking #{booking.id.substring(0, 6)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500">Client</h4>
                                    <p>{booking.clientName}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500">Package</h4>
                                    <p>{booking.packageName}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500">Date</h4>
                                    <p>{formatDate(booking.date)}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                                    <p>₱{booking.amount.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <Badge className={getStatusColor(booking.status)}>
                                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500">Created</h4>
                                    <p>{formatDate(booking.createdAt)}</p>
                                  </div>
                                </div>
                                {booking.notes && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                                    <p className="text-sm">{booking.notes}</p>
                                  </div>
                                )}
                              </div>
                              <DialogFooter>
                                <Link to={`/messages?clientId=${booking.clientId}`}>
                                  <Button variant="outline" className="gap-2">
                                    <MessageSquare size={16} />
                                    Message Client
                                  </Button>
                                </Link>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {booking.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-1 text-green-600"
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              >
                                <CheckCircle size={16} /> Confirm
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="gap-1 text-red-600"
                                  >
                                    <XCircle size={16} /> Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The client will be notified about the cancellation.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Back</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Cancel Booking
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}

                          {booking.status === 'confirmed' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-1 text-green-600"
                                onClick={() => handleStatusChange(booking.id, 'completed')}
                              >
                                <CheckCircle size={16} /> Complete
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="gap-1 text-red-600"
                                  >
                                    <XCircle size={16} /> Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The client will be notified about the cancellation.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Back</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Cancel Booking
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 p-10 text-center">
              <Calendar className="w-12 h-12 mx-auto text-wedding-300" />
              <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
              <p className="mt-2 text-gray-500">
                {activeTab === "all" 
                  ? "You have no bookings yet. Create packages to start receiving bookings."
                  : `You don't have any ${activeTab} bookings.`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
