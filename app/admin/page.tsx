import Link from "next/link";

const stats = [
  { label: "Total Students", value: "1,248" },
  { label: "Total Papers", value: "186" },
  { label: "Total Bundles", value: "14" },
  { label: "Total Revenue", value: "KES 248,500" },
];

const recentPayments = [
  {
    id: "1",
    name: "Mercy Chebet",
    item: "KCSE Papers Bundle",
    amount: "KES 250",
    date: "06 Mar 2026",
  },
  {
    id: "2",
    name: "Shanique Ngaira",
    item: "Form 4 Chemistry Mock",
    amount: "KES 50",
    date: "05 Mar 2026",
  },
  {
    id: "3",
    name: "Asisi Joy",
    item: "Revision Bundle",
    amount: "KES 350",
    date: "04 Mar 2026",
  },
];

const recentUsers = [
  { id: "1", name: "Marion ChepChumba", email: "marion@gmail.com" },
  { id: "2", name: "Brian Sawe", email: "brian@gmail.com" },
  { id: "3", name: "Edwin Waweru", email: "edwin@gmail.com" },
];

const latestPapers = [
  { id: "1", title: "Form 4 Biology Mock", subject: "Biology" },
  { id: "2", title: "KCSE Mathematics Paper 2", subject: "Mathematics" },
  { id: "3", title: "English End Term Exam", subject: "English" },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-light-200 text-sm">Welcome back,</p>
            <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-light-200 mt-4 max-w-2xl text-sm leading-relaxed">
              Manage examination resources, monitor payments, and oversee
              student access from one central control panel.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/papers"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Add New Paper
            </Link>

            <Link href="/admin/bundles" className="cta-secondary text-sm">
              Create Bundle
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
              <h3>Recent Payments</h3>
              <p className="text-light-200 text-sm mt-1">
                Latest completed transactions
              </p>
            </div>

            <Link
              href="/admin/payments"
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Student
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Item
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Amount
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="bg-white">
                    <td className="rounded-l-xl border-y border-l border-border-dark px-4 py-4 text-sm text-light-100">
                      {payment.name}
                    </td>
                    <td className="border-y border-border-dark px-4 py-4 text-sm text-light-200">
                      {payment.item}
                    </td>
                    <td className="border-y border-border-dark px-4 py-4 text-sm font-semibold text-primary">
                      {payment.amount}
                    </td>
                    <td className="rounded-r-xl border-y border-r border-border-dark px-4 py-4 text-sm text-light-200">
                      {payment.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div>
            <h3>Quick Actions</h3>
            <p className="text-light-200 text-sm mt-1">
              Administrative shortcuts
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <Link
              href="/admin/papers"
              className="rounded-xl border border-border-dark bg-white px-5 py-4 text-sm font-semibold text-light-100 transition hover:border-primary hover:text-primary"
            >
              Upload New Paper
            </Link>

            <Link
              href="/admin/bundles"
              className="rounded-xl border border-border-dark bg-white px-5 py-4 text-sm font-semibold text-light-100 transition hover:border-primary hover:text-primary"
            >
              Create Revision Bundle
            </Link>

            <Link
              href="/admin/users"
              className="rounded-xl border border-border-dark bg-white px-5 py-4 text-sm font-semibold text-light-100 transition hover:border-primary hover:text-primary"
            >
              View Registered Students
            </Link>

            <Link
              href="/admin/payments"
              className="rounded-xl border border-border-dark bg-white px-5 py-4 text-sm font-semibold text-light-100 transition hover:border-primary hover:text-primary"
            >
              Review Payments
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3>Recent Users</h3>
              <p className="text-light-200 text-sm mt-1">
                Newly registered student accounts
              </p>
            </div>

            <Link
              href="/admin/users"
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-border-dark bg-white p-5"
              >
                <p className="text-light-100 font-semibold">{user.name}</p>
                <p className="text-light-200 text-sm mt-1">{user.email}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3>Latest Papers</h3>
              <p className="text-light-200 text-sm mt-1">
                Recently uploaded examination resources
              </p>
            </div>

            <Link
              href="/admin/papers"
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {latestPapers.map((paper) => (
              <div
                key={paper.id}
                className="rounded-xl border border-border-dark bg-white p-5"
              >
                <p className="text-light-100 font-semibold">{paper.title}</p>
                <p className="text-light-200 text-sm mt-1">{paper.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
