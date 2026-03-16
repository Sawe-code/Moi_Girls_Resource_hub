const RefundsPage = () => {
  return (
    <main className="py-10">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <p className="text-light-200 text-sm">Legal</p>
        <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
          Refund Policy
        </h1>
        <p className="text-light-200 mt-3 text-sm">Last updated: March 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-light-200">
          <div>
            <h2 className="text-light-100 font-semibold">
              1. Digital Products
            </h2>
            <p className="mt-2">
              All papers, bundles, and revision materials provided through this
              platform are digital products delivered through account access.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">
              2. General Refund Rule
            </h2>
            <p className="mt-2">
              Payments are generally non-refundable once access to a paid
              resource has been granted.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">
              3. Refund Exceptions
            </h2>
            <p className="mt-2">
              Refunds may be considered in cases of duplicate payment, verified
              technical failure, or billing errors that prevent access after a
              successful transaction.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">4. Failed Payments</h2>
            <p className="mt-2">
              If an M-Pesa transaction fails or is cancelled, access will not be
              granted. Users may retry payment where necessary.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">
              5. How to Request a Refund
            </h2>
            <p className="mt-2">
              Refund requests should include your name, email address,
              transaction reference, and a brief explanation of the issue.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">6. Processing Time</h2>
            <p className="mt-2">
              Approved refunds may take several business days to process,
              depending on payment handling timelines.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">7. Contact</h2>
            <p className="mt-2">
              For refund-related questions, contact{" "}
              <a
                href="mailto:info@moigirlseldoret.ac.ke"
                className="text-light-100 hover:text-primary transition"
              >
                info@moigirlseldoret.ac.ke
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RefundsPage;
