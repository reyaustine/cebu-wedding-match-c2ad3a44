
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Santos",
      role: "Bride",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
      quote: "TheWeddingMatch helped me find my dream wedding coordinator and caterer. The verification system gave me peace of mind, and both suppliers exceeded my expectations!"
    },
    {
      name: "Ramon Diaz",
      role: "Wedding Photographer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
      quote: "As a verified supplier on TheWeddingMatch, I've connected with quality clients who value my work. The platform has significantly expanded my client base in Cebu."
    },
    {
      name: "Joanna Cruz",
      role: "Wedding Planner",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
      quote: "I appreciate how this platform elevates trusted wedding professionals. The booking system is streamlined, and it's easy to showcase our portfolio to potential clients."
    },
    {
      name: "Carlos Rivera",
      role: "Groom",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
      quote: "We were worried about wedding scams until we found TheWeddingMatch. The verified suppliers were professional, and the in-app messaging made communication easy."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wedding-900">Trusted By Couples & Suppliers</h2>
          <div className="w-24 h-1 bg-gold-400 mx-auto mt-4"></div>
          <p className="mt-6 text-gray-700 max-w-2xl mx-auto">
            Hear from couples and suppliers who have found success through our platform.
          </p>
        </div>

        <div className="mt-12">
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-wedding-50 p-6 rounded-lg h-full flex flex-col">
                    <div className="flex-grow">
                      <p className="italic text-gray-700">"{testimonial.quote}"</p>
                    </div>
                    <div className="mt-6 flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h4 className="font-medium text-wedding-800">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-wedding-500 text-white hover:bg-wedding-600 hover:text-white" />
            <CarouselNext className="right-2 bg-wedding-500 text-white hover:bg-wedding-600 hover:text-white" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
