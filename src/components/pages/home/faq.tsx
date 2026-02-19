"use client";
import faqs from "@/src/data/faq";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const Faq = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4">
            Frequently asked{" "}
            <span className="font-normal text-(--color-green)">questions</span>
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about Clarity
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-(--color-green) transition-all duration-300"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-lg pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-(--color-green) transition-transform duration-300 shrink-0 ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
