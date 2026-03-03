import React from "react";
import { stats } from "@/constants";

const Stats = () => {
  return (
    <section className="mt-20">
      <div className="glass border border-dark-200 rounded-lg card-shadow py-12 px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((item) => (
            <div key={item.label}>
              <div className="text-light-100 text-4xl md:text-5xl font-bold">
                {item.value}
              </div>
              <p className="text-light-200 text-sm mt-3">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
