import { steps } from "@/constants";

const HowItWorks = () => {
  return (
    <section className="mt-20">
      <div className="text-center max-w-2xl mx-auto">
        <h3>How It Works</h3>
        <p className="text-light-200 text-sm mt-2">
          Gain secure access to official Moi Girls High School examination
          materials in three structured steps.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="glass border border-dark-200 rounded-xl p-8 card-shadow transition duration-300 hover:border-primary/40"
          >
            {/* Step Number */}
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {step.number}
            </div>

            <h4 className="text-light-100 text-lg font-semibold mt-6">
              {step.title}
            </h4>

            <p className="text-light-200 text-sm mt-3 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
