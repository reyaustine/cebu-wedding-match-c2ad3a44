
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Package } from "lucide-react";

export const PlannerDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-wedding-900">Wedding Planner Dashboard</h1>
      <p className="text-gray-600">Coordinate events and connect clients with suppliers</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 text-wedding-600" size={20} />
              Upcoming Events
            </CardTitle>
            <CardDescription>Weddings and consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming events</p>
              <p className="text-sm mt-2">Add new events to your calendar</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 text-wedding-600" size={20} />
              Clients
            </CardTitle>
            <CardDescription>Couples you're working with</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No active clients</p>
              <p className="text-sm mt-2">Add clients to your roster</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="mr-2 text-wedding-600" size={20} />
              Supplier Network
            </CardTitle>
            <CardDescription>Your trusted wedding professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No suppliers in network</p>
              <p className="text-sm mt-2">Connect with verified suppliers</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
