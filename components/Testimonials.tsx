"use client";

import { testimonials } from "@/constants";

const Testimonials = () => {
  const Stars = ({ count }: { count: number }) => {
    return <div className="testimonial-stars">{"★".repeat(count)}</div>;
  };

  const items = [...testimonials, ...testimonials];

  return (
    <section className="testimonials">
      <div className="text-center max-w-2xl mx-auto">
        <h3>Testimonials</h3>
        <p className="text-light-200 text-sm mt-2">
          Feedback from students, teachers, and parents using the portal.
        </p>
      </div>

      <div className="testimonials-track">
        <div className="testimonials-marquee">
          {items.map((t, idx) => (
            <article key={`${t.name}-${idx}`} className="testimonial-card">
              <Stars count={t.stars} />

              <p className="testimonial-quote">“{t.quote}”</p>

              <div className="mt-4">
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
