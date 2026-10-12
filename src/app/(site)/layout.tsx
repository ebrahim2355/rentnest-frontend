import type { ReactNode } from "react";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
