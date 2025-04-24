
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { MobilePage } from "@/components/layout/MobilePage";
import { SupplierCategories } from "@/components/SupplierCategories";

const SupplierDirectory = () => {
  return (
    <MobilePage 
      title="Find Suppliers"
      backButton={true}
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
