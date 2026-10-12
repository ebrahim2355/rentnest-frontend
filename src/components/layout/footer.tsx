import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";

const Footer = () => {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            RentNest connects tenants with trusted landlords. Browse verified listings, send a rental request and pay securely online.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/properties" className="transition hover:text-primary">
                Browse properties
              </Link>
            </li>
            <li>
              <Link href="/auth/register" className="transition hover:text-primary">
                List your property
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="transition hover:text-primary">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" />
              Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              support@rentnest.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              +880 1700 000000
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">© 2026 RentNest. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
