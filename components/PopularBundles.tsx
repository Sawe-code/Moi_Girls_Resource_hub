import React from "react";
import Link from "next/link";
import { bundles } from "@/constants";

const PopularBundles = () => {
  const calcSavePct = (oldPrice: number, price: number) => {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3>Revision Bundles</h3>
          <p className="text-light-200 text-sm mt-1">
            Structured revision packs from official Moi Girls examinations
          </p>
        </div>

        <Link href="/pricing" className="text-primary text-sm hover:underline">
          View pricing →
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bundles.map((b) => {
          const savePct = calcSavePct(b.oldPrice, b.price);

          return (
            <div
              key={b.id}
              className="glass border border-dark-200 rounded-xl p-6 card-shadow transition duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="pill">{b.tag}</span>

                <span className="text-xs text-primary font-semibold">
                  Save {savePct}%
                </span>
              </div>

              <h4 className="mt-4 text-light-100 text-xl font-semibold leading-snug">
                {b.title}
              </h4>

              <p className="mt-2 text-light-200 text-sm">{b.subtitle}</p>

              <div className="mt-5 space-y-2 text-sm text-light-200">
                <p>
                  <span className="text-light-100 font-semibold">
                    {b.papersCount}+
                  </span>{" "}
                  examination papers included
                </p>
                <p>{b.access}</p>
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-light-200 text-xs">One-time payment</p>

                  <div className="flex items-center gap-2">
                    <p className="text-light-100 text-lg font-bold">
                      KES {b.price}
                    </p>

                    <p className="text-light-200 text-sm line-through">
                      KES {b.oldPrice}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/bundles/${b.id}`}
                  className="bg-primary whitespace-nowrap hover:bg-primary/90 text-primary-foreground font-semibold rounded-[6px] px-5 py-2 text-sm transition"
                >
                  View Bundle
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PopularBundles;
