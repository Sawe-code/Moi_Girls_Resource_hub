import Image from "next/image";
import Link from "next/link";
import ExploreBtn from "@/components/ExploreBtn";
import SearchBar from "@/components/SearchBar";
import FeaturedPapers from "@/components/FeaturedPapers";
import PopularBundles from "@/components/PopularBundles";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main>
      <section id="home" className="relative overflow-hidden text-center py-14">
        <Image
          src="/images/hero1.png"
          alt="Moi Girls High School Eldoret"
          fill
          priority
          className="object-cover object-center opacity-10"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background/80" />

        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <div className="flex-center gap-3">
            <Image
              src="/icons/logo.png"
              alt="Moi Girls crest"
              width={34}
              height={34}
            />
            <span className="pill">Official Resource Portal</span>
          </div>

          <h1 className="mt-6 tracking-tight">
            Moi Girls High School, Eldoret <br className="max-sm:hidden" />
            Exam Resource Hub
          </h1>

          <p className="subheading">
            Verified KCSE past papers, mocks, and marking schemes — organized
            for faster revision and better results.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ExploreBtn />
            <Link href="/pricing" className="cta-secondary">
              View Pricing
            </Link>
          </div>

          <p className="text-light-200 text-xs mt-6">
            Secure M-Pesa payments • Instant access • Student-friendly bundles
          </p>
        </div>
      </section>

      <section className="mt-14">
        <div className="text-center">
          <h3>Explore Our Resources</h3>
          <p className="text-light-200 text-sm mt-2">
            Search by subject, year, form, or exam type.
          </p>
        </div>

        <SearchBar />
      </section>

      <FeaturedPapers />
      <PopularBundles />
      <HowItWorks />
      <WhyChooseUs />
      <Stats />
      <Testimonials />
      <FAQ />
    </main>
  );
}
