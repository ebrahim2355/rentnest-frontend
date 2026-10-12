import { ArrowRight, ClipboardCheck, CreditCard, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import CategoryList, { CategoryListSkeleton } from "@/components/home/category-list";
import FeaturedProperties from "@/components/home/featured-properties";
import HeroSearch from "@/components/home/hero-search";
import PropertyGridSkeleton from "@/components/property/property-grid-skeleton";
import { buttonStyles } from "@/components/ui/button";

const heroImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

const steps = [
  {
    icon: Search,
    title: "Find a place",
    description: "Search by location, budget, property type and the amenities you care about.",
  },
  {
    icon: ClipboardCheck,
    title: "Send a request",
    description: "Pick your move-in date and how long you want to stay. The landlord approves or rejects it.",
  },
  {
    icon: CreditCard,
    title: "Pay and move in",
    description: "Once approved, pay securely with Stripe and your rental becomes active right away.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10">
          <Image src={heroImage} alt="" fill preload sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/40" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Trusted rentals with secure online payment
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Find a home you will <span className="text-primary">love to rent</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Browse apartments, houses and studios from landlords across the country. Send a request in a minute and pay when it is approved.
            </p>
            <div className="mt-8">
              <HeroSearch />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured properties</h2>
            <p className="mt-1 text-muted-foreground">The newest places listed on RentNest.</p>
          </div>
          <Link href="/properties" className={buttonStyles("outline", "md")}>
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <Suspense fallback={<PropertyGridSkeleton count={6} />}>
          <FeaturedProperties />
        </Suspense>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Browse by property type</h2>
            <p className="mt-1 text-muted-foreground">Pick the kind of place that fits your life.</p>
          </div>
          <Suspense fallback={<CategoryListSkeleton />}>
            <CategoryList />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight">How RentNest works</h2>
          <p className="mt-1 text-muted-foreground">Three simple steps from searching to moving in.</p>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <step.icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-muted-foreground">Step {index + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary p-8 text-primary-foreground sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Do you own a property?</h2>
            <p className="mt-2 max-w-xl opacity-90">List it on RentNest for free, manage rental requests from one dashboard and get paid online.</p>
          </div>
          <Link href="/auth/register" className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-card px-6 font-medium text-foreground transition hover:opacity-90">
            Become a landlord
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
