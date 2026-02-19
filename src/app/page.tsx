import Hero from "../components/pages/home/hero";
import Features from "../components/pages/home/features";
import Faq from "../components/pages/home/faq";
import Cta from "../components/pages/home/cta";

export default function ClarityHomepage() {
  return (
    <div className="min-h-screen bg-white text-(--color-charcoal) bg-gradient-radial">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-(--color-green)/10 blur-3xl rounded-full"></div>
      <Hero />

      {/* Core Features */}
      <Features />

      {/* FAQ Section */}
      <Faq />

      {/* CTA Section */}
      <Cta />
    </div>
  );
}
