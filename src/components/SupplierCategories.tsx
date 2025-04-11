
import { Camera, UtensilsCrossed, Flower2, Palette, Users, Music, Sparkles, Wine } from "lucide-react";
import { Link } from "react-router-dom";

export const SupplierCategories = () => {
  const categories = [
    {
      icon: <Camera className="h-8 w-8 text-wedding-600" />,
      name: "Photography",
      count: 24
    },
    {
      icon: <UtensilsCrossed className="h-8 w-8 text-wedding-600" />,
      name: "Catering",
      count: 18
    },
    {
      icon: <Flower2 className="h-8 w-8 text-wedding-600" />,
      name: "Flowers & Decor",
      count: 15
    },
    {
      icon: <Palette className="h-8 w-8 text-wedding-600" />,
      name: "Wedding Gowns",
      count: 22
    },
    {
      icon: <Users className="h-8 w-8 text-wedding-600" />,
      name: "Coordinators",
      count: 12
    },
    {
      icon: <Music className="h-8 w-8 text-wedding-600" />,
      name: "Music & Entertainment",
      count: 10
    },
    {
      icon: <Sparkles className="h-8 w-8 text-wedding-600" />,
      name: "Hair & Makeup",
      count: 20
    },
    {
      icon: <Wine className="h-8 w-8 text-wedding-600" />,
      name: "Venues",
      count: 8
    }
  ];

  return (
    <section className="py-16 bg-wedding-50">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wedding-900">Find Suppliers By Category</h2>
          <div className="w-24 h-1 bg-gold-400 mx-auto mt-4"></div>
          <p className="mt-6 text-gray-700 max-w-2xl mx-auto">
            Browse our extensive collection of verified wedding professionals across various categories.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to="/suppliers"
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="p-3 bg-wedding-100 rounded-full mb-3">
                {category.icon}
              </div>
              <h3 className="text-lg font-medium text-wedding-800">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} suppliers</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/suppliers" className="wedding-btn inline-flex items-center gap-2">
            View All Categories
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
