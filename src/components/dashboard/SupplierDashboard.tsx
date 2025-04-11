
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Package, MessageSquare, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SupplierDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-wedding-900">Supplier Dashboard</h1>
          <p className="text-gray-600">Manage your wedding services business</p>
        </div>
        <Button className="wedding-btn">Create New Package</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
                <h3 className="text-3xl font-bold mt-1">0</h3>
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
                <h3 className="text-3xl font-bold mt-1">0</h3>
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
                <h3 className="text-3xl font-bold mt-1">0</h3>
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
                <h3 className="text-3xl font-bold mt-1">₱0</h3>
              </div>
              <DollarSign className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled events and appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-gray-500">
              <p>No upcoming bookings</p>
              <p className="text-sm mt-2">Create packages to start receiving bookings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest client communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-gray-500">
              <p>No messages</p>
              <p className="text-sm mt-2">Messages from clients will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
