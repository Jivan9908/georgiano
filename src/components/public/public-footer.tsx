import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

const footerNav = [
  ["Menu", "/menu"], ["Our Story", "/#story"], ["Wine", "/#wine"],
  ["Private Dining", "/private-dining"], ["Gallery", "/#gallery"], ["Contact", "/contact"],
] as const;

export function PublicFooter() {
  return <footer className="footer"><div className="page-shell footer__top"><div><BrandLogo /><p>Georgian cuisine, wine, and hospitality in North Hollywood.</p></div><nav aria-label="Footer navigation">{footerNav.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav><div className="footer__reserve"><p>Join us at the table.</p><Link className="button" href="/reserve">Reserve a Table</Link></div></div><div className="page-shell footer__bottom"><span>© 2026 Georgiano</span><div><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms &amp; Conditions</Link></div></div></footer>;
}
