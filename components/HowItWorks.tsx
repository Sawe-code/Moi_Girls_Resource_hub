import { steps } from "@/constants";

const HowItWorks = () => {
  return (
    <section className="mt-20">
      <div className="text-center">
        <h3>How It Works</h3>
        <p className="text-light-200 text-sm mt-2">
          Access official Moi Girls exam resources in three simple steps.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="glass border border-dark-200 rounded-lg p-8 card-shadow transition duration-300 hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="text-gradient text-4xl font-bold">
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