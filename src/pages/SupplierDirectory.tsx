
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { SupplierCategories } from "@/components/SupplierCategories";

const SupplierDirectory = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white p-4 border-b">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              className="w-full h-12 pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-wedding-500 focus:border-transparent"
            />
          </div>
          <Button size="icon" variant="outline" className="h-12 w-12 rounded-xl border-gray-200">
            <Filter size={20} />
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <SupplierCategories />
      </div>
    </div>
  );
};

export default SupplierDirectory;
