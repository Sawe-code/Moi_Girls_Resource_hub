import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <main className="py-10">
          <section className="mx-auto max-w-xl">
            <div className="glass rounded-2xl border border-border-dark p-8 card-shadow">
              <p className="text-light-200 text-sm">Account Recovery</p>
              <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
                Reset Password
              </h1>
              <p className="text-light-200 mt-4 text-sm leading-relaxed">
                Loading reset form...
              </p>
            </div>
          </section>
        </main>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
};

export default ResetPasswordPage;
