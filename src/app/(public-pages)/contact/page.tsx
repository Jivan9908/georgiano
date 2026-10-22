import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/public/contact-form";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { restaurantAddress, restaurantDirectionsUrl, restaurantEmail, restaurantHours, restaurantMapEmbedUrl, restaurantPhone } from "@/lib/restaurant-contact";

export const metadata: Metadata = { title: "Contact", description: "Contact Georgiano in North Hollywood, California." };

export default async function ContactPage() {
  let settings: Awaited<ReturnType<typeof import("@/lib/server/repositories/settings-repository").getRestaurantSettings>> = null;
  if (process.env.DATABASE_URL) { try { settings = await (await import("@/lib/server/repositories/settings-repository")).getRestaurantSettings(); } catch { settings = null; } }
  const address = restaurantAddress;
  const phone = restaurantPhone;
  const email = restaurantEmail;
  const directionsUrl = restaurantDirectionsUrl;
  const social = settings?.instagramUrl || settings?.facebookUrl;
  return <><PublicHeader currentPath="/contact" /><main className="public-page"><section className="contact-hero"><Image src="/media/visit-entrance.png" alt="The warmly lit entrance to Georgiano" fill priority sizes="100vw" /><div className="public-hero__veil" /><div className="page-shell public-hero__content"><p className="eyebrow">Georgiano · North Hollywood</p><h1>Come<br /><em>Find Us.</em></h1><p>We look forward to welcoming you to the Georgian table.</p></div></section><section className="contact-details"><div className="page-shell contact-grid"><div><p className="eyebrow">Visit Georgiano</p><h2>{settings?.city || "North Hollywood"},<br />{settings?.state || "California"}.</h2><p>We are located at {address}.</p><dl className="detail-list"><div><dt>Address</dt><dd>{address}</dd></div><div><dt>Phone</dt><dd><a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a></dd></div><div><dt>Email</dt><dd><a href={`mailto:${email}`}>{email}</a></dd></div><div><dt>Hours</dt><dd><ul className="contact-hours">{restaurantHours.map(({ day, hours }) => <li key={day}><span>{day}</span><span>{hours}</span></li>)}</ul></dd></div><div><dt>Social</dt><dd>{social || "To be confirmed"}</dd></div><div><dt>Directions</dt><dd><a href={directionsUrl} target="_blank" rel="noreferrer">Open directions</a></dd></div></dl></div><div><p className="eyebrow">Send a note</p><h2>How can we help?</h2><ContactForm /></div></div></section><section className="contact-map" aria-labelledby="contact-map-title"><div className="page-shell"><div className="contact-map__heading"><div><p className="eyebrow">Find your way</p><h2 id="contact-map-title">Find Georgiano.</h2><p>{address}</p></div><a className="button" href={directionsUrl} target="_blank" rel="noreferrer">Open in Google Maps <span aria-hidden="true">↗</span></a></div><div className="contact-map__frame"><iframe title="Map showing the location of Georgiano Restaurant" src={restaurantMapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div></div></section></main><PublicFooter /></>;
}
