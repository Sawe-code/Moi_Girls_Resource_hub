const TermsPage = () => {
  return (
    <main className="py-10">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <p className="text-light-200 text-sm">Legal</p>
        <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
          Terms of Use
        </h1>
        <p className="text-light-200 mt-3 text-sm">Last updated: March 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-light-200">
          <div>
            <h2 className="text-light-100 font-semibold">
              1. Use of the Platform
            </h2>
            <p className="mt-2">
              Moi Girls High School Resource Hub provides papers, mock exams,
              and revision materials for personal educational use only.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">2. Accounts</h2>
            <p className="mt-2">
              Users are responsible for keeping their login details secure and
              for all activity under their account.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">
              3. Content Ownership
            </h2>
            <p className="mt-2">
              All materials on this platform belong to Moi Girls High School,
              Eldoret unless otherwise stated. Users may not copy, resell,
              redistribute, or share the materials publicly.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">
              4. Payments and Access
            </h2>
            <p className="mt-2">
              Some resources require payment through M-Pesa. Access is granted
              only after successful payment confirmation.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">5. Misuse</h2>
            <p className="mt-2">
              The school may suspend or terminate access where misuse, fraud, or
              unauthorized sharing of resources is detected.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">6. Liability</h2>
            <p className="mt-2">
              The platform is provided for academic support. The school is not
              responsible for exam outcomes or temporary technical
              interruptions.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">
              7. Changes to Terms
            </h2>
            <p className="mt-2">
              These terms may be updated from time to time. Continued use of the
              platform means you accept the updated terms.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">8. Contact</h2>
            <p className="mt-2">
              For questions about these terms, contact{" "}
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

export default TermsPage;
