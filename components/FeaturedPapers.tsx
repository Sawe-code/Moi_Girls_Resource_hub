import Link from "next/link";
import { FeaturedPapersProps } from "@/types";

const FeaturedPapers = ({ papers, loading, error }: FeaturedPapersProps) => {
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

      {loading && <p className="text-light-200 text-sm mt-6">Loading...</p>}

      {error && <p className="text-red-500 text-sm mt-6">{error}</p>}

      {!loading && !error && papers.length === 0 && (
        <div className="mt-8 glass rounded-2xl border border-border-dark p-8 card-shadow text-center">
          <p className="text-light-100 font-semibold">
            No featured papers found
          </p>
          <p className="text-light-200 text-sm mt-2">
            Check back later or contact our support team for assistance.
          </p>
        </div>
      )}

      {!loading && !error && papers.length > 0 && (
        <div className="events mt-8">
          {papers.map((paper) => (
            <div
              key={paper._id}
              className="glass border border-dark-200 rounded-xl p-6 card-shadow transition duration-300 hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="pill">{paper.subject}</span>

                {paper.isFree ? (
                  <span className="text-primary text-xs font-semibold">
                    FREE
                  </span>
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

                {paper.isFree ? (
                  <a
                    href={paper.fileUrl}
                    download
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[6px] px-4 py-2 text-sm transition sm:px-6 sm:py-3"
                  >
                    DownLoad
                  </a>
                ) : (
                  <Link
                    href={`/papers/${paper._id}`}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[6px] px-4 py-2 text-sm transition sm:px-6 sm:py-3"
                  >
                    Pay to Access
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedPapers;
