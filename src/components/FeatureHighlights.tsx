
import { Sparkles, Calendar, MessageSquare, PackageOpen, ShieldCheck } from "lucide-react";

export const FeatureHighlights = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-wedding-600" />,
      title: "Verified Supplier Profiles",
      description: "Browse suppliers that have been thoroughly verified for legitimacy and quality.",
      forRole: "Clients"
    },
    {
      icon: <Calendar className="h-10 w-10 text-wedding-600" />,
      title: "All-in-One Business Hub",
      description: "Manage bookings, chat with clients, and track your business growth in one dashboard.",
      forRole: "Suppliers"
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-wedding-600" />,
      title: "Secure In-App Messaging",
      description: "Chat directly with suppliers or clients with file sharing and read receipts.",
      forRole: "Everyone"
    },
    {
      icon: <PackageOpen className="h-10 w-10 text-wedding-600" />,
      title: "Dynamic Package Builder",
      description: "Create and showcase your service packages with customizable pricing and details.",
      forRole: "Suppliers"
    },
    {
      icon: <Sparkles className="h-10 w-10 text-wedding-600" />,
      title: "Smart Booking System",
      description: "Send booking requests, manage your calendar, and keep track of all your events.",
      forRole: "Everyone"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wedding-900">
            One Platform, Complete Wedding Service Management
          </h2>
          <div className="w-24 h-1 bg-gold-400 mx-auto mt-4"></div>
          <p className="mt-6 text-gray-700 max-w-3xl mx-auto">
            TheWeddingMatch is designed to be the only tool suppliers need to run their business and the only platform 
            clients need to find trusted wedding professionals in Cebu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-3 bg-wedding-100 rounded-full inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif font-semibold text-wedding-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <span className="inline-block bg-wedding-100 text-wedding-700 px-3 py-1 rounded-full text-sm font-medium">
                For {feature.forRole}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
