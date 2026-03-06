import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 glass border-t border-dark-200">
      <div className="mx-auto container sm:px-10 px-5 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/icons/moi.png"
                alt="Moi Girls crest"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <p className="text-light-100 text-lg font-bold italic leading-snug">
                Moi Girls High School, Eldoret
              </p>
            </div>

            <p className="text-light-200 text-sm mt-4 leading-relaxed">
              Official portal for verified past papers, mock examinations, and
              structured revision resources with secure payments and instant
              access.
            </p>
          </div>

          <div>
            <p className="text-light-100 font-semibold">Quick Links</p>
            <ul className="mt-4 space-y-3 list-none">
              <li className="text-light-200 text-sm">
                <Link href="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li className="text-light-200 text-sm">
                <Link href="/papers" className="hover:text-primary transition">
                  Papers
                </Link>
              </li>
              <li className="text-light-200 text-sm">
                <Link href="/pricing" className="hover:text-primary transition">
                  Pricing
                </Link>
              </li>
              <li className="text-light-200 text-sm">
                <Link href="/login" className="hover:text-primary transition">
                  Login
                </Link>
              </li>
              <li className="text-light-200 text-sm">
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-light-100 font-semibold">Support</p>
            <ul className="mt-4 space-y-3 list-none">
              <li className="text-light-200 text-sm">
                <Link href="/faq" className="hover:text-primary transition">
                  FAQs
                </Link>
              </li>
              <li className="text-light-200 text-sm">
                <Link href="/contact" className="hover:text-primary transition">
                  Academic Office
                </Link>
              </li>
              <li className="text-light-200 text-sm">
                <Link href="/terms" className="hover:text-primary transition">
                  Terms of Use
                </Link>
              </li>
              <li className="text-light-200 text-sm">
                <Link href="/privacy" className="hover:text-primary transition">
                  Privacy Policy
                </Link>
              </li>
              <li className="text-light-200 text-sm">
                <Link href="/refunds" className="hover:text-primary transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-light-100 font-semibold">Contact</p>
            <address className="mt-4 space-y-3 text-light-200 text-sm not-italic">
              <p>Eldoret, Kenya</p>
              <p>
                Email:{" "}
                <span className="text-light-100">
                  info@moigirlseldoret.ac.ke
                </span>
              </p>
              <p>
                Phone: <span className="text-light-100">+254 700 000 000</span>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-dark-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-light-200 text-xs">
            © {year} Moi Girls High School, Eldoret. All rights reserved.
          </p>
          <p className="text-light-200 text-xs">
            For personal revision use • Do not redistribute
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
