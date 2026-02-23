"use client";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-40 pb-32 bg-gradient-radial">
      <div className="container-custom relative flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Badge */}
        <div className="badge mb-8 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-(--color-green) rounded-full animate-pulse-glow"></div>
          <span>AI-Powered Meeting Intelligence</span>
        </div>

        {/* Heading */}
        <h1 className="mb-6 leading-tight">
          Turn meetings into{" "}
          <span className="text-(--color-green)">actionable insights</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl">
          Record, transcribe, and query conversations with AI precision. Extract
          decisions, tasks, and clarity instantly.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary">Start Free Trial</button>
          <button className="btn-secondary">Watch Demo</button>
        </div>

        {/* Social Proof */}
        <div className="mt-10 text-sm text-gray-500">
          Trusted by 1,200+ teams worldwide
        </div>
      </div>
    </section>
  );
};

export default Hero;
