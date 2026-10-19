import type { Metadata } from "next";
import Image from "next/image";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { ReservationFlow } from "@/components/public/reservation-flow";

export const metadata: Metadata = { title: "Reserve a Table", description: "Preview the Georgiano table reservation experience in North Hollywood." };

export default function ReservePage() {
  return <><PublicHeader currentPath="/reserve" /><main className="public-page"><section className="public-hero public-hero--reserve"><Image src="/media/hero-feast.png" alt="A generous Georgian table prepared for guests" fill priority sizes="100vw" /><div className="public-hero__veil" /><div className="page-shell public-hero__content"><p className="eyebrow">The Georgian table awaits</p><h1>Reserve<br /><em>Your Table.</em></h1><p>Plan an evening of generous plates, Georgian wine, and warm hospitality in North Hollywood.</p><span>Development reservation experience · no live availability</span></div></section><div className="page-shell reservation-wrap"><aside><p className="eyebrow">Good to know</p><h2>A place to gather.</h2><p>This Stage 4 experience demonstrates the intended reservation journey. Dates and times are visual placeholders and no information is sent or stored.</p><dl className="detail-list"><div><dt>Location</dt><dd>North Hollywood, California</dd></div><div><dt>Time zone</dt><dd>America/Los_Angeles</dd></div><div><dt>Status</dt><dd>Demo availability only</dd></div></dl></aside><ReservationFlow /></div></main><PublicFooter /></>;
}
