
import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { SupplierCategories } from "@/components/SupplierCategories";
import { Testimonials } from "@/components/Testimonials";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { TrustSection } from "@/components/TrustSection";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <HeroSection />
        <TrustSection />
        <HowItWorks />
        <FeatureHighlights />
        <SupplierCategories />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
