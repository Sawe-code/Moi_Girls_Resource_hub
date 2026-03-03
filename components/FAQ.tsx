"use client";
import { useState } from "react";
import { faqs } from "@/constants";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="mt-20">
      <div className="text-center">
        <h3>Frequently Asked Questions</h3>
        <p className="text-light-200 text-sm mt-2">
          Important information regarding access, payment, and downloads.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={faq.question}
            className="glass border border-dark-200 rounded-lg card-shadow p-6 transition duration-300 hover:border-primary/50"
          >
            <button
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              aria-expanded={activeIndex === index}
              aria-controls={`faq-${index}`}
              className="w-full text-left flex justify-between items-center"
            >
              <span className="text-light-100 font-semibold">
                {faq.question}
              </span>
              <span className="text-primary text-xl">
                {activeIndex === index ? "−" : "+"}
              </span>
            </button>

            {activeIndex === index && (
              <p
                id={`faq-${index}`}
                className="text-light-200 text-sm mt-4 leading-relaxed"
              >
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
