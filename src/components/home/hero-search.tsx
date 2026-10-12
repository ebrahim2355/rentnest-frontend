"use client";

import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Button from "@/components/ui/button";
import { buildQuery } from "@/lib/http";

const budgets = [
  { label: "Any budget", value: "" },
  { label: "Up to $300", value: "300" },
  { label: "Up to $600", value: "600" },
  { label: "Up to $1,000", value: "1000" },
  { label: "Up to $2,000", value: "2000" },
];

const HeroSearch = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/properties${buildQuery({ location: location.trim(), maxPrice })}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-lg sm:flex-row sm:items-center">
      <label className="flex flex-1 items-center gap-2 rounded-lg px-3">
        <MapPin className="size-5 shrink-0 text-primary" />
        <span className="sr-only">Location</span>
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Where do you want to live?"
          className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </label>
      <label className="sm:w-44 sm:border-l sm:pl-3">
        <span className="sr-only">Budget</span>
        <select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="h-11 w-full cursor-pointer rounded-lg bg-transparent px-2 text-sm text-foreground focus:outline-none">
          {budgets.map((budget) => (
            <option key={budget.label} value={budget.value} className="bg-card">
              {budget.label}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" size="lg" className="sm:px-8">
        <Search className="size-4" />
        Search
      </Button>
    </form>
  );
};

export default HeroSearch;
