import { Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 text-lg font-bold tracking-tight", className)}>
      <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Home className="size-4" />
      </span>
      RentNest
    </Link>
  );
};

export default Logo;
