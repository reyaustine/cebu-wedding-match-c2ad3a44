
import { Search, CheckCircle, Calendar, MessageSquare } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-wedding-600" />,
      title: "Find Suppliers",
      description: "Browse our directory of verified wedding professionals in Cebu."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-wedding-600" />,
      title: "Verify Credentials",
      description: "Check supplier verification badges and reviews from real clients."
    },
    {
      icon: <Calendar className="h-10 w-10 text-wedding-600" />,
      title: "Request Booking",
      description: "Send booking requests to suppliers with your event details."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-wedding-600" />,
      title: "Communicate",
      description: "Chat directly with suppliers to discuss your wedding needs."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wedding-900">How It Works</h2>
          <div className="w-24 h-1 bg-gold-400 mx-auto mt-4"></div>
          <p className="mt-6 text-gray-700 max-w-2xl mx-auto">
            Finding and booking trusted wedding suppliers in Cebu has never been easier.
            Our platform ensures a secure and transparent process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute -top-5 w-10 h-10 rounded-full bg-wedding-100 flex items-center justify-center border-2 border-wedding-200">
                <span className="font-bold text-wedding-600">{index + 1}</span>
              </div>
              <div className="mt-6 mb-4">{step.icon}</div>
              <h3 className="text-xl font-serif font-semibold text-wedding-800">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
