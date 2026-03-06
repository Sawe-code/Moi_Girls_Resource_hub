import Image from "next/image";
import { reasons } from "@/constants";

const WhyChooseUs = () => {
  return (
    <section className="mt-20">
      <div className="text-center max-w-2xl mx-auto">
        <h3>Why Choose This Portal</h3>
        <p className="text-light-200 text-sm mt-2">
          Official Moi Girls revision resources designed to support structured
          learning and academic excellence.
        </p>
      </div>

      <div className="events mt-12">
        {reasons.map((item) => (
          <div
            key={item.title}
            className="glass border border-dark-200 rounded-xl p-7 card-shadow transition duration-300 hover:border-primary/40"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Image src={item.icon} alt="" width={28} height={28} />
            </div>

            <h4 className="text-light-100 text-lg font-semibold mt-5">
              {item.title}
            </h4>

            <p className="text-light-200 text-sm mt-3 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
