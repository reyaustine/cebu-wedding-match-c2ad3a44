
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, CheckCircle, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-wedding-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform management and verification center</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-3xl font-bold mt-1">0</h3>
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
                <h3 className="text-3xl font-bold mt-1">0</h3>
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
                <h3 className="text-3xl font-bold mt-1">0</h3>
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
                <h3 className="text-3xl font-bold mt-1">0</h3>
              </div>
              <LineChart className="text-wedding-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
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
    </div>
  );
};
