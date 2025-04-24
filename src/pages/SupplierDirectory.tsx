
import { NavBar } from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useState } from "react";
import { Search, MapPin, Star } from "lucide-react";

interface Supplier {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  isVerified: boolean;
  image: string;
}

const SupplierDirectory = () => {
  // Dummy data for suppliers
  const dummySuppliers: Supplier[] = [
    {
      id: 1,
      name: "Cebu Elegant Gowns",
      category: "Wedding Gowns",
      location: "Cebu City",
      rating: 4.9,
      isVerified: true,
      image: "https://images.unsplash.com/photo-1535970891991-95f75200e8e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    },
    {
      id: 2,
      name: "Moments Photography",
      category: "Photography",
      location: "Mandaue City",
      rating: 4.8,
      isVerified: true,
      image: "https://images.unsplash.com/photo-1559638753-d8138989c164?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    },
    {
      id: 3,
      name: "Divine Blooms",
      category: "Flowers & Decor",
      location: "Cebu City",
      rating: 4.7,
      isVerified: true,
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    },
    {
      id: 4,
      name: "Cebu Wedding Planners",
      category: "Coordinators",
      location: "Cebu City",
      rating: 4.9,
      isVerified: true,
      image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    },
    {
      id: 5,
      name: "Taste Catering Services",
      category: "Catering",
      location: "Lapu-Lapu City",
      rating: 4.6,
      isVerified: false,
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    },
    {
      id: 6,
      name: "Cebu Rhythms",
      category: "Music & Entertainment",
      location: "Cebu City",
      rating: 4.5,
      isVerified: true,
      image: "https://images.unsplash.com/photo-1576328077645-2dd68934d2b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    },
  ];

  const [suppliers, setSuppliers] = useState(dummySuppliers);
  const [priceRange, setPriceRange] = useState([0]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Filter suppliers based on verified status
  const filteredSuppliers = verifiedOnly 
    ? suppliers.filter(supplier => supplier.isVerified)
    : suppliers;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow bg-gray-50">
        <div className="container px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-wedding-800 mb-6">
            Find Your Wedding Suppliers
          </h1>
          <p className="text-gray-600 mb-8">
            Browse our directory of verified wedding professionals in Cebu City.
          </p>

          {/* Search and filters */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  type="search" 
                  placeholder="Search suppliers..." 
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-48">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="flowers">Flowers & Decor</SelectItem>
                    <SelectItem value="gowns">Wedding Gowns</SelectItem>
                    <SelectItem value="coordinators">Coordinators</SelectItem>
                    <SelectItem value="music">Music & Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="cebu">Cebu City</SelectItem>
                    <SelectItem value="mandaue">Mandaue City</SelectItem>
                    <SelectItem value="lapu">Lapu-Lapu City</SelectItem>
                    <SelectItem value="talisay">Talisay City</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="wedding-btn">Search</Button>
            </div>

            <Separator className="my-4" />

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-grow">
                <Label className="mb-2 block">Price Range</Label>
                <div className="px-2">
                  <Slider
                    defaultValue={[0]}
                    max={100000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>₱0</span>
                  <span>₱{priceRange[0].toLocaleString()}</span>
                  <span>₱100,000+</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="verified" 
                  checked={verifiedOnly}
                  onCheckedChange={setVerifiedOnly}
                />
                <Label htmlFor="verified" className="flex items-center gap-1">
                  Verified suppliers only
                  <VerifiedBadge size="sm" />
                </Label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img
                    src={supplier.image}
                    alt={supplier.name}
                    className="w-full h-full object-cover"
                  />
                  {supplier.isVerified && (
                    <div className="absolute top-3 right-3 bg-white p-1 rounded-full">
                      <VerifiedBadge />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-wedding-800 mb-1">{supplier.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{supplier.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{supplier.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-gold-500 fill-gold-500" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full wedding-btn mt-4">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No results state */}
          {filteredSuppliers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-wedding-300 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-serif font-medium text-wedding-800 mb-2">No suppliers found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SupplierDirectory;
