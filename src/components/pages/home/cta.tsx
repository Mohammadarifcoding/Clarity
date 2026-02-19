import React from "react";

const Cta = () => {
  return (
    <section className="section bg-(--color-charcoal) text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-6">Ready to transform your meetings?</h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join thousands of teams using Clarity to make every meeting count.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="px-8 py-4 bg-(--color-green) text-white rounded-lg font-medium hover:bg-(--color-green-dark) transition-all duration-300 hover:scale-105 shadow-glow">
            Get Started Free
          </button>
          <button className="btn-outline">Contact Sales</button>
        </div>
      </div>
    </section>
  );
};

export default Cta;
