
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Heart } from "lucide-react";

export const ClientDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-wedding-900">Client Dashboard</h1>
      <p className="text-gray-600">Welcome to your wedding planning hub!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 text-wedding-600" size={20} />
              My Bookings
            </CardTitle>
            <CardDescription>View and manage your appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming bookings</p>
              <p className="text-sm mt-2">Start browsing suppliers to book services</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="mr-2 text-wedding-600" size={20} />
              Messages
            </CardTitle>
            <CardDescription>Chat with your suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No active conversations</p>
              <p className="text-sm mt-2">Start a chat with a supplier</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Heart className="mr-2 text-wedding-600" size={20} />
              Favorite Suppliers
            </CardTitle>
            <CardDescription>Your saved wedding professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No favorites yet</p>
              <p className="text-sm mt-2">Start browsing and save your favorites</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
