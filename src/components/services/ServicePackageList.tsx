
import { useState, useEffect } from "react";
import { dbService } from "@/services/databaseService";
import { useAuth } from "@/contexts/AuthContext";
import { ServicePackage } from "@/types/supplier";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Package, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { where } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

export const ServicePackageList = () => {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const packagesData = await dbService.query<ServicePackage>(
          'servicePackages',
          where('supplierId', '==', user.id)
        );
        
        // Convert timestamps to Date objects
        const processedPackages = packagesData.map(pkg => ({
          ...pkg,
          createdAt: pkg.createdAt instanceof Timestamp ? pkg.createdAt.toDate() : pkg.createdAt,
          updatedAt: pkg.updatedAt instanceof Timestamp ? pkg.updatedAt.toDate() : pkg.updatedAt
        }));
        
        setPackages(processedPackages);
      } catch (error) {
        console.error("Error fetching service packages:", error);
        toast.error("Failed to load service packages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [user]);

  const handleCreatePackage = () => {
    navigate('/services/new');
  };

  const handleEditPackage = (packageId: string) => {
    navigate(`/services/edit/${packageId}`);
  };

  const handleDeletePackage = async (packageId: string) => {
    try {
      await dbService.delete('servicePackages', packageId);
      setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== packageId));
      toast.success("Package deleted successfully");
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  const togglePackageStatus = async (packageId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    try {
      await dbService.update('servicePackages', packageId, { 
        isActive: newStatus,
        updatedAt: new Date()
      });
      
      // Update local state
      setPackages(prevPackages => 
        prevPackages.map(pkg => 
          pkg.id === packageId 
            ? { ...pkg, isActive: newStatus, updatedAt: new Date() } 
            : pkg
        )
      );
      
      toast.success(`Package ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating package status:", error);
      toast.error("Failed to update package status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
        <p className="mt-4 text-gray-600">Loading service packages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-wedding-900">My Services</h1>
          <p className="text-gray-600">Manage your service packages</p>
        </div>
        <Button className="wedding-btn" onClick={handleCreatePackage}>
          <Plus size={16} className="mr-1" /> Create Package
        </Button>
      </div>

      {packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <div 
                className="h-40 bg-gray-200 relative" 
                style={{ 
                  backgroundImage: pkg.images && pkg.images.length > 0 ? `url(${pkg.images[0]})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-white rounded-full h-8 w-8">
                        <Eye size={14} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{pkg.name}</DialogTitle>
                        <DialogDescription>Package Details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Price</h4>
                          <p className="text-xl font-bold">₱{pkg.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Description</h4>
                          <p>{pkg.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Category</h4>
                          <p>{pkg.category}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Features</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {pkg.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => handleEditPackage(pkg.id)}>
                          Edit Package
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-white rounded-full h-8 w-8"
                    onClick={() => handleEditPackage(pkg.id)}
                  >
                    <Edit size={14} />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white rounded-full h-8 w-8"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Package?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this service package.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold truncate">{pkg.name}</h3>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Switch 
                      checked={pkg.isActive} 
                      onCheckedChange={() => togglePackageStatus(pkg.id, pkg.isActive)} 
                      className="data-[state=checked]:bg-wedding-500"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-wedding-700 font-bold">₱{pkg.price.toLocaleString()}</p>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
                    {pkg.category}
                  </span>
                </div>
                <p className="mt-2 text-gray-600 text-sm line-clamp-2">{pkg.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 p-10 text-center">
          <Package className="w-12 h-12 mx-auto text-wedding-300" />
          <h3 className="mt-4 text-lg font-medium">No packages found</h3>
          <p className="mt-2 text-gray-500">
            Create your first service package to start receiving bookings.
          </p>
          <Button 
            className="mt-6 wedding-btn"
            onClick={handleCreatePackage}
          >
            <Plus size={16} className="mr-1" /> Create First Package
          </Button>
        </div>
      )}
    </div>
  );
};
