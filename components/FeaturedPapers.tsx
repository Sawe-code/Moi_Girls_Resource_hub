import React from "react";
import { dummyPapers } from "@/constants";
import Link from "next/link";

const FeaturedPapers = () => {
  return (
    <section className="mt-14">
      <div className="flex items-end justify-between">
        <div>
          <h3>Featured Papers</h3>
          <p className="text-light-200 text-sm mt-1">
            Official Moi Girls past papers & mock exams
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
            className="glass border border-dark-200 p-6 rounded-xl card-shadow transition duration-300 hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="flex justify-between items-center">
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

            <div className="mt-6 flex items-center justify-between">
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
                className="bg-primary hover:bg-primary/90 text-black font-semibold rounded-[6px] px-4 py-2 text-sm transition"
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
