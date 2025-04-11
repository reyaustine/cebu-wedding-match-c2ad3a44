
import { Link } from "react-router-dom";

export const CallToAction = () => {
  return (
    <section className="py-16 bg-wedding-600 text-white">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Ready to Plan Your Dream Wedding?</h2>
          <p className="mt-6 text-lg text-white/90">
            Join TheWeddingMatch today to find trusted suppliers for your special day in Cebu.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-wedding-600 hover:bg-wedding-50 font-medium py-3 px-8 rounded-md transition-colors duration-300 text-lg"
            >
              Create Account
            </Link>
            <Link
              to="/suppliers"
              className="bg-transparent border border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-md transition-colors duration-300 text-lg"
            >
              Browse Suppliers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
