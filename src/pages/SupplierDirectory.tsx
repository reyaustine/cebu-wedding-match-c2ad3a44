import { MobilePage } from "@/components/layout/MobilePage";
import { SupplierCategories } from "@/components/SupplierCategories";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SupplierDirectory = () => {
  return (
    <MobilePage 
      title="Find Suppliers"
      rightAction={
        <Button size="icon" variant="ghost" className="rounded-full">
          <Search size={20} />
        </Button>
      }
    >
      <SupplierCategories />
    </MobilePage>
  );
};

export default SupplierDirectory;
