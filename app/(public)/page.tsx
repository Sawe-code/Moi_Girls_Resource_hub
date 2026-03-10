"use client";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Paper, Bundle } from "@/types";

export default function Home() {
  const router = useRouter();

  const [papers, setPapers] = useState<Paper[]>([]);
  const [papersLoading, setPapersLoading] = useState(false);
  const [papersError, setPapersError] = useState("");

  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [bundlesLoading, setBundlesLoading] = useState(false);
  const [bundlesError, setBundlesError] = useState("");

  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchFeaturedPapers = async () => {
      setPapersLoading(true);
      setPapersError("");

      try {
        const res = await fetch(
          `/api/papers?search=${encodeURIComponent(search)}`,
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch papers");
        }

        if (data.papers) {
          setPapers(data.papers);
        } else {
          setPapers([]);
        }
      } catch (error) {
        if (error instanceof Error) {
          setPapersError(error.message);
        } else {
          setPapersError("Something went wrong");
        }
      } finally {
        setPapersLoading(false);
      }
    };
    const fetchBundles = async () => {
      setBundlesLoading(true);
      setBundlesError("");

      try {
        const res = await fetch("/api/bundles");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch bundles");
        }

        if (Array.isArray(data.bundles)) {
          setBundles(data.bundles);
        } else {
          setBundles([]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setBundlesError(err.message);
        } else {
          setBundlesError("Something went wrong");
        }
      } finally {
        setBundlesLoading(false);
      }
    };

    fetchFeaturedPapers();
    fetchBundles();
  }, []);

  const handleSearchSubmit = () => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      router.push("/papers");
      return;
    }
    router.push(`/papers?search=${encodeURIComponent(trimmedSearch)}`);
  };

  const featuredPapers = papers.slice(0, 3);
  const popularBundles = bundles.slice(0, 3);

  return (
    <main>
      <section
        id="home"
        className="relative overflow-hidden text-center py-16 md:py-20"
      >
        <Image
          src="/images/hero1.png"
          alt="Moi Girls High School Eldoret"
          fill
          priority
          className="object-cover object-center opacity-10"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/30 to-background/50" />

        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <div className="flex-center gap-3">
            <Image
              src="/icons/moi.png"
              alt="Moi Girls crest"
              width={46}
              height={46}
              className="rounded-full object-cover"
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

        <SearchBar
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchSubmit}
        />
      </section>

      <FeaturedPapers
        papers={featuredPapers}
        loading={papersLoading}
        error={papersError}
      />
      <PopularBundles
        bundles={popularBundles}
        loading={bundlesLoading}
        error={bundlesError}
      />
      <HowItWorks />
      <WhyChooseUs />
      <Stats />
      <Testimonials />
      <FAQ />
    </main>
  );
}
