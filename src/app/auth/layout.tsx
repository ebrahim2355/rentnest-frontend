import { KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import Logo from "@/components/layout/logo";
import ThemeToggle from "@/components/layout/theme-toggle";

const sideImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80";

const points = [
  { icon: Sparkles, text: "Browse verified rental listings" },
  { icon: KeyRound, text: "Send requests and track them in one place" },
  { icon: ShieldCheck, text: "Pay securely with Stripe" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen flex-1 lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</div>
      </div>

      <div className="relative hidden lg:block">
        <Image src={sideImage} alt="" fill preload sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-x-10 bottom-12 text-white">
          <h2 className="text-3xl font-bold tracking-tight text-balance">A simpler way to rent a home</h2>
          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li key={point.text} className="flex items-center gap-3 text-sm">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-white/15">
                  <point.icon className="size-4" />
                </span>
                {point.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
