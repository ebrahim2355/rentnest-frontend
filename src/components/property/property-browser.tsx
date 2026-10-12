"use client";

import { Loader2, RotateCcw, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import Button from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form-field";
import { COMMON_AMENITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const textKeys = ["searchTerm", "location", "minPrice", "maxPrice"] as const;

type TextKey = (typeof textKeys)[number];
type TextValues = Record<TextKey, string>;

const sortOptions = [
  { label: "Newest first", value: "" },
  { label: "Rent: low to high", value: "rent:asc" },
  { label: "Rent: high to low", value: "rent:desc" },
  { label: "Oldest first", value: "createdAt:asc" },
];

interface PropertyBrowserProps {
  categories: Category[];
  children: ReactNode;
}

const PropertyBrowser = ({ categories, children }: PropertyBrowserProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [text, setText] = useState<TextValues>({
    searchTerm: searchParams.get("searchTerm") ?? "",
    location: searchParams.get("location") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  });
  const latestText = useRef(text);

  const selectedAmenities = (searchParams.get("amenities") ?? "").split(",").filter(Boolean);
  const activeCount = [...searchParams.keys()].filter((key) => key !== "page").length;

  const applyChanges = (changes: Record<string, string>) => {
    const current = window.location.search.replace(/^\?/, "");
    const params = new URLSearchParams(current);

    Object.entries(changes).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("page");

    const query = params.toString();

    if (query === current) {
      return;
    }

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const handleTextChange = (key: TextKey, value: string) => {
    const next = { ...latestText.current, [key]: value };

    latestText.current = next;
    setText(next);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const changes: Record<string, string> = {};

      textKeys.forEach((textKey) => {
        changes[textKey] = latestText.current[textKey].trim();
      });

      applyChanges(changes);
    }, 450);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const toggleAmenity = (amenity: string) => {
    const next = selectedAmenities.includes(amenity) ? selectedAmenities.filter((item) => item !== amenity) : [...selectedAmenities, amenity];

    applyChanges({ amenities: next.join(",") });
  };

  const clearFilters = () => {
    const empty = { searchTerm: "", location: "", minPrice: "", maxPrice: "" };

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    latestText.current = empty;
    setText(empty);
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside>
        <div className="flex items-center justify-between lg:hidden">
          <Button variant="outline" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters}>
            <SlidersHorizontal className="size-4" />
            Filters
            {activeCount > 0 && <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{activeCount}</span>}
          </Button>
          {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        </div>

        <div className={cn("mt-4 space-y-5 rounded-xl border bg-card p-5 lg:sticky lg:top-24 lg:mt-0 lg:block", showFilters ? "block" : "hidden")}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              Filters
              {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
            </h2>
            {activeCount > 0 && (
              <button type="button" onClick={clearFilters} className="flex cursor-pointer items-center gap-1 text-xs font-medium text-primary hover:underline">
                <RotateCcw className="size-3" />
                Clear all
              </button>
            )}
          </div>

          <Field label="Search" htmlFor="filter-search">
            <Input id="filter-search" placeholder="Title, area or keyword" value={text.searchTerm} onChange={(event) => handleTextChange("searchTerm", event.target.value)} />
          </Field>

          <Field label="Location" htmlFor="filter-location">
            <Input id="filter-location" placeholder="e.g. Dhanmondi" value={text.location} onChange={(event) => handleTextChange("location", event.target.value)} />
          </Field>

          <Field label="Property type" htmlFor="filter-type">
            <Select id="filter-type" value={searchParams.get("type") ?? ""} onChange={(event) => applyChanges({ type: event.target.value })}>
              <option value="">All types</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Min rent" htmlFor="filter-min">
              <Input id="filter-min" type="number" min={0} inputMode="numeric" placeholder="0" value={text.minPrice} onChange={(event) => handleTextChange("minPrice", event.target.value)} />
            </Field>
            <Field label="Max rent" htmlFor="filter-max">
              <Input id="filter-max" type="number" min={0} inputMode="numeric" placeholder="Any" value={text.maxPrice} onChange={(event) => handleTextChange("maxPrice", event.target.value)} />
            </Field>
          </div>

          <Field label="Bedrooms" htmlFor="filter-bedrooms">
            <Select id="filter-bedrooms" value={searchParams.get("bedrooms") ?? ""} onChange={(event) => applyChanges({ bedrooms: event.target.value })}>
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((count) => (
                <option key={count} value={count}>
                  {count}+ bedrooms
                </option>
              ))}
            </Select>
          </Field>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Amenities</legend>
            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map((amenity) => {
                const selected = selectedAmenities.includes(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleAmenity(amenity)}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium capitalize transition",
                      selected ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:border-primary hover:text-primary"
                    )}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Field label="Sort by" htmlFor="filter-sort">
            <Select id="filter-sort" value={searchParams.get("sort") ?? ""} onChange={(event) => applyChanges({ sort: event.target.value })}>
              {sortOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </aside>

      <section aria-live="polite" className={cn("min-w-0 transition-opacity", isPending && "opacity-60")}>
        {children}
      </section>
    </div>
  );
};

export default PropertyBrowser;
