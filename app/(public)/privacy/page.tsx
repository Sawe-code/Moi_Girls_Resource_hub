const PrivacyPage = () => {
  return (
    <main className="py-10">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <p className="text-light-200 text-sm">Legal</p>
        <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
          Privacy Policy
        </h1>
        <p className="text-light-200 mt-3 text-sm">Last updated: March 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-light-200">
          <div>
            <h2 className="text-light-100 font-semibold">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              We may collect your name, email address, phone number, payment
              references, and account activity when you use the platform.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">
              2. How We Use Information
            </h2>
            <p className="mt-2">
              Your information is used to create accounts, process payments,
              grant access to purchased materials, and improve platform support.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">3. Payments</h2>
            <p className="mt-2">
              Payments are processed through M-Pesa. The platform does not store
              M-Pesa PINs or sensitive payment authentication details.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">4. Data Protection</h2>
            <p className="mt-2">
              We take reasonable steps to protect user data from unauthorized
              access, misuse, or disclosure.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">
              5. Sharing of Information
            </h2>
            <p className="mt-2">
              We do not sell or rent personal data. Information may only be
              shared where required by law or for necessary platform operations.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">6. Your Rights</h2>
            <p className="mt-2">
              You may request correction of your account information or contact
              the school about privacy concerns.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">
              7. Changes to this Policy
            </h2>
            <p className="mt-2">
              This policy may be updated from time to time. Continued use of the
              platform means you accept the updated policy.
            </p>
          </div>

          <div>
            <h2 className="text-light-100 font-semibold">8. Contact</h2>
            <p className="mt-2">
              For privacy-related questions, contact{" "}
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

export default PrivacyPage;
