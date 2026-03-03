import Image from "next/image";
import { reasons } from "@/constants";

const WhyChooseUs = () => {
  return (
    <section className="mt-20">
      <div className="text-center">
        <h3>Why Choose This Portal</h3>
        <p className="text-light-200 text-sm mt-2">
          Official Moi Girls revision resources designed for academic
          excellence.
        </p>
      </div>

      <div className="events mt-12">
        {reasons.map((item) => (
          <div
            key={item.title}
            className="glass border border-dark-200 rounded-lg p-7 card-shadow transition duration-300 hover:-translate-y-1 hover:border-primary/50"
          >
            <span className="pill flex items-center justify-center w-fit">
              <Image src={item.icon} alt="" width={36} height={36} />
            </span>

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
