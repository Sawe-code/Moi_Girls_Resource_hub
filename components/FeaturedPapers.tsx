import React from "react";
import { dummyPapers } from "@/constants";
import Link from "next/link";

const FeaturedPapers = () => {
  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3>Featured Papers</h3>
          <p className="text-light-200 text-sm mt-1">
            Official Moi Girls past papers and mock examinations
          </p>
        </div>

        <Link href="/papers" className="text-primary text-sm hover:underline">
          View all →
        </Link>
      </div>

      <div className="events mt-8">
        {dummyPapers.map((paper) => (
          <div
            key={paper.id}
            className="glass border border-dark-200 rounded-xl p-6 card-shadow transition duration-300 hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="pill">{paper.subject}</span>

              {paper.isFree ? (
                <span className="text-primary text-xs font-semibold">FREE</span>
              ) : (
                <span className="text-light-200 text-xs flex items-center gap-1">
                  🔒 Locked
                </span>
              )}
            </div>

            <h4 className="text-light-100 text-lg font-semibold mt-4 line-clamp-2">
              {paper.title}
            </h4>

            <div className="flex flex-wrap gap-3 mt-3 text-light-200 text-sm">
              <span>{paper.form}</span>
              <span>•</span>
              <span>{paper.year}</span>
              <span>•</span>
              <span>{paper.type}</span>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              {paper.isFree ? (
                <span className="text-primary font-semibold text-sm">
                  KES 0
                </span>
              ) : (
                <span className="text-light-100 font-semibold text-sm">
                  KES {paper.price}
                </span>
              )}

              <Link
                href={`/papers/${paper.id}`}
                className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap text-primary-foreground font-semibold rounded-[6px] px-3 py-1 text-sm transition sm:px-2 sm:py-1"
              >
                {paper.isFree ? "Download" : "Pay to Access"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedPapers;
