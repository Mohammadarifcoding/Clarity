import React from "react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-36 pb-28 bg-gradient-radial">
      {/* Background Glow */}

      <div className="container-custom relative grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE – Content */}
        <div className="max-w-xl">
          <div className="badge mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-(--color-green) rounded-full animate-pulse-glow"></div>
            <span>AI-Powered Meeting Intelligence</span>
          </div>

          <h1 className="mb-6 leading-tight">
            Turn meetings into
            <br />
            <span className="text-(--color-green)">actionable insights</span>
          </h1>

          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Record, transcribe, and query conversations with AI precision.
            Extract decisions, tasks, and clarity instantly.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Start Free Trial</button>
            <button className="btn-secondary">Watch Demo</button>
          </div>

          {/* Micro Social Proof */}
          <div className="mt-10 text-sm text-gray-500">
            Trusted by 1,200+ teams worldwide
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
