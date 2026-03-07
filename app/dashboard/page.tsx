import Link from "next/link";

const stats = [
  { label: "Papers Purchased", value: "12" },
  { label: "Bundles Owned", value: "3" },
  { label: "Downloads", value: "18" },
  { label: "Recent Purchases", value: "4" },
];

const recentPurchases = [
  {
    id: "1",
    title: "Form 4 Chemistry Mock Term 2",
    type: "Paper",
    amount: "KES 50",
    date: "06 Mar 2026",
  },
  {
    id: "2",
    title: "KCSE Past Papers Collection",
    type: "Bundle",
    amount: "KES 250",
    date: "04 Mar 2026",
  },
];

const libraryPreview = [
  {
    id: "1",
    title: "Form 4 Mathematics Paper 1",
    subject: "Mathematics",
    year: "2023",
  },
  {
    id: "2",
    title: "Biology Mock Examination",
    subject: "Biology",
    year: "2024",
  },
  {
    id: "3",
    title: "English End Term Exam",
    subject: "English",
    year: "2022",
  },
];

const StudentDashboard = () => {
  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-light-200 text-sm">Welcome back,</p>
            <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
              Continue With Your Revision
            </h1>
            <p className="text-light-200 mt-4 max-w-2xl text-sm leading-relaxed">
              Access your purchased resources, download past papers, and keep
              track of your revision materials from one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/library"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Open My Library
            </Link>

            <Link href="/papers" className="cta-secondary text-sm">
              Browse Papers
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="glass rounded-2xl border border-border-dark p-6 card-shadow"
          >
            <p className="text-light-200 text-sm">{item.label}</p>
            <p className="mt-3 text-primary text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3>My Library</h3>
              <p className="text-light-200 text-sm mt-1">
                Quick access to your purchased resources
              </p>
            </div>

            <Link
              href="/dashboard/library"
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {libraryPreview.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-border-dark bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-light-100 font-semibold">{item.title}</p>
                  <p className="text-light-200 text-sm mt-1">
                    {item.subject} • {item.year}
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div>
            <h3>Recent Purchases</h3>
            <p className="text-light-200 text-sm mt-1">
              Your latest paid resources
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {recentPurchases.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border-dark bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-light-100 font-semibold">{item.title}</p>
                    <p className="text-light-200 text-sm mt-1">{item.type}</p>
                  </div>

                  <span className="pill">{item.amount}</span>
                </div>

                <p className="text-light-200 text-sm mt-4">
                  Purchased on {item.date}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/purchases"
            className="mt-6 inline-flex text-primary text-sm font-semibold hover:underline"
          >
            View purchase history →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
