"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { restaurantAddress, restaurantDirectionsUrl, restaurantEmail, restaurantHoursSummary, restaurantPhone } from "@/lib/restaurant-contact";

const navItems = [
  { label: "Home", href: "#home" }, { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "#story" }, { label: "Wine", href: "#wine" },
  { label: "Private Dining", href: "#private-dining" }, { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const defaultDishes = [
  { name: "Pork & Beef Khinkali", description: "Traditional Georgian dumplings filled with pork and beef.", price: "$3.50", image: "/media/menu/14-khinkali-so-svininoy-i-govyadinoy.jpg", position: "50% 50%" },
  { name: "Chkmeruli", description: "Roasted chicken served in a rich, creamy garlic sauce.", price: "$26.95", image: "/media/menu/22-chkmeruli.jpg", position: "50% 50%" },
  { name: "Adjarian Khachapuri", description: "Boat-shaped bread filled with cheese and topped with egg.", price: "$21.50", image: "/media/menu/31-khachapuri-po-adzharski.jpg", position: "50% 50%" },
  { name: "Pkhali & Eggplant Roll Assortment", description: "Assorted vegetable-and-walnut pkhali with eggplant rolls.", price: "$21.95", image: "/media/menu/53-assorti-pkhali-s-ruletikami-iz-baklazhanov.jpg", position: "50% 50%" },
] as const;

const defaultGallery = [
  { src: "/media/hero-feast.png", alt: "Georgian feast with khinkali, khachapuri, and amber wine", className: "gallery__item--feast" },
  { src: "/media/khinkali-craft.png", alt: "Hands shaping traditional khinkali", className: "gallery__item--craft" },
  { src: "/media/qvevri-cellar.png", alt: "Amber wine and traditional qvevri vessels in a candlelit cellar", className: "gallery__item--wine" },
  { src: "/media/gallery-materials.png", alt: "Georgian tableware, linen, walnuts, and pomegranates", className: "gallery__item--materials" },
  { src: "/media/experience-hospitality.png", alt: "Guests welcomed in the warm Georgiano dining room", className: "gallery__item--hospitality" },
] as const;

function ArrowIcon() { return <span aria-hidden="true">↗</span>; }

export type HomepageData = {
  sections?: Partial<Record<"HERO" | "STORY" | "WINE" | "EXPERIENCE" | "PRIVATE_DINING" | "CONTACT", { eyebrow: string | null; headline: string | null; supportingText: string | null; mediaUrl: string | null; mediaAlt: string | null }>>;
  dishes?: { name: string; description: string; price: string; image: string; position: string }[];
  gallery?: { src: string; alt: string; className: string }[];
  settings?: { place: string; address: string | null; phone: string | null; email: string | null; hours: string | null; directionsUrl: string | null };
};

export function Homepage({ data }: { data?: HomepageData }) {
  const dishes = data?.dishes?.length ? data.dishes : defaultDishes;
  const gallery = data?.gallery?.length ? data.gallery : defaultGallery;
  const heroContent = data?.sections?.HERO;
  const storyContent = data?.sections?.STORY;
  const wineContent = data?.sections?.WINE;
  const experienceContent = data?.sections?.EXPERIENCE;
  const privateContent = data?.sections?.PRIVATE_DINING;
  const directionsUrl = data?.settings?.directionsUrl || restaurantDirectionsUrl;
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDish, setActiveDish] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    if (!sessionStorage.getItem("georgiano-intro-played")) {
      const frame = window.requestAnimationFrame(() => setShowIntro(true));
      sessionStorage.setItem("georgiano-intro-played", "true");
      const timer = window.setTimeout(() => setShowIntro(false), 1450);
      return () => { window.cancelAnimationFrame(frame); window.clearTimeout(timer); };
    }
  }, [reduceMotion]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || lightbox !== null ? "hidden" : "";
    if (menuOpen) closeButtonRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, lightbox]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); setLightbox(null); } };
    window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close);
  }, []);

  const reveal = reduceMotion ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } };

  return <>
    <AnimatePresence>{showIntro && <motion.div className="intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.42 }} aria-hidden="true"><motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65 }}><BrandLogo priority /></motion.div></motion.div>}</AnimatePresence>

    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-header__logo" href="#home" aria-label="Georgiano home"><BrandLogo priority /></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">{navItems.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}</nav>
        <Link className="nav-reserve" href="/reserve">Reserve a Table</Link>
        <button className="menu-toggle" type="button" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><span /><span /></button>
      </div>
    </header>

    <AnimatePresence>{menuOpen && <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="mobile-menu__top"><BrandLogo /><button ref={closeButtonRef} type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}>Close</button></div>
      <nav aria-label="Mobile navigation">{navItems.map((item, index) => <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.045 }}><Link href={item.href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}</Link></motion.div>)}<Link className="button mobile-menu__reserve" href="/reserve" onClick={() => setMenuOpen(false)}>Reserve a Table</Link></nav>
    </motion.div>}</AnimatePresence>

    <main>
      <section className="hero" id="home">
        <Image className="hero__image" src={heroContent?.mediaUrl || "/media/hero-feast.png"} alt={heroContent?.mediaAlt || "A candlelit Georgian feast prepared for sharing"} fill loading="eager" fetchPriority="high" sizes="100vw" />
        <div className="hero__veil" /><div className="page-shell hero__content">
          <motion.p className="eyebrow" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.6 }}>{heroContent?.eyebrow || "North Hollywood · California"}</motion.p>
          <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.18, duration: 0.8 }}>{heroContent?.headline || <>The Art of<br />Georgian Hospitality.</>}</motion.h1>
          <motion.p className="hero__copy" initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.28, duration: 0.75 }}>{heroContent?.supportingText || "Discover authentic Georgian flavors, timeless traditions, and an unforgettable dining experience in the heart of North Hollywood."}</motion.p>
          <motion.div className="hero__actions" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.36, duration: 0.7 }}><Link className="button" href="/reserve">Reserve a Table</Link><Link className="text-link" href="/menu">Explore Our Menu <ArrowIcon /></Link></motion.div>
        </div>
        <a className="scroll-cue" href="#story"><span>Scroll to discover</span><i /></a>
      </section>

      <section className="story section-pad" id="story"><div className="page-shell story__grid">
        <motion.div className="story__image image-reveal" {...reveal}><Image src={storyContent?.mediaUrl || "/media/khinkali-craft.png"} alt={storyContent?.mediaAlt || "Hands shaping traditional khinkali"} fill sizes="(max-width: 768px) 92vw, 52vw" /><span className="image-caption">The craft of gathering</span></motion.div>
        <motion.div className="story__copy" {...reveal}><p className="eyebrow">{storyContent?.eyebrow || "Our Story"}</p><h2>{storyContent?.headline || <>Rooted in Tradition.<br /><em>Crafted for Today.</em></>}</h2><p className="dropcap">{storyContent?.supportingText || "At Georgiano, the richness of Georgian cuisine meets a contemporary dining experience. Discover timeless flavors, meaningful traditions, and the warmth of gathering around the table."}</p><span className="ornament" aria-hidden="true">G</span></motion.div>
      </div></section>

      <section className="signature section-pad" aria-labelledby="signature-title"><div className="page-shell">
        <motion.div className="section-heading section-heading--split" {...reveal}><div><p className="eyebrow">A signature selection</p><h2 id="signature-title">A Taste Worth<br /><em>Remembering.</em></h2></div><p>Discover four beloved Georgian dishes, prepared for sharing and rooted in the generous spirit of the Georgian table.</p></motion.div>
        <div className="dish-stage"><div className="dish-stage__visual"><AnimatePresence mode="wait"><motion.div key={activeDish} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.55 }} className="dish-stage__image"><Image src={dishes[activeDish].image} alt={`${dishes[activeDish].name} served at Georgiano`} fill sizes="(max-width: 768px) 100vw, 62vw" style={{ objectPosition: dishes[activeDish].position }} /></motion.div></AnimatePresence><span className="dish-stage__number">0{activeDish + 1}</span></div>
          <div className="dish-list" role="tablist" aria-label="Signature dishes">{dishes.map((dish, index) => <button key={dish.name} className={activeDish === index ? "is-active" : ""} type="button" role="tab" aria-selected={activeDish === index} onClick={() => setActiveDish(index)}><span><strong>{dish.name}</strong><small>{dish.description}</small></span><b>{dish.price}</b></button>)}<Link className="text-link dish-list__cta" href="/menu">View Full Menu <ArrowIcon /></Link></div>
        </div>
      </div></section>

      <section className="wine" id="wine"><Image src={wineContent?.mediaUrl || "/media/qvevri-cellar.png"} alt={wineContent?.mediaAlt || "Traditional qvevri and amber wine in a candlelit cellar"} fill sizes="100vw" /><div className="wine__veil" /><div className="page-shell wine__content"><motion.div {...reveal}><p className="eyebrow">{wineContent?.eyebrow || "Georgian Wine"}</p><h2>{wineContent?.headline || <>An Ancient Tradition.<br /><em>An Extraordinary Experience.</em></>}</h2><p>{wineContent?.supportingText || "For thousands of years, wine has been part of Georgia’s language of welcome. Qvevri, earth, time, and the table come together in every amber glass."}</p><Link className="text-link" href="/menu">Explore Our Menu <ArrowIcon /></Link></motion.div></div></section>

      <section className="experience section-pad" aria-labelledby="experience-title"><div className="page-shell"><motion.div className="experience__heading" {...reveal}><p className="eyebrow">{experienceContent?.eyebrow || "The Georgiano Experience"}</p><h2 id="experience-title">{experienceContent?.headline || <>More Than<br /><em>a Dinner.</em></>}</h2></motion.div><div className="experience__composition"><motion.div className="experience__visual" {...reveal}><Image src={experienceContent?.mediaUrl || "/media/experience-hospitality.png"} alt={experienceContent?.mediaAlt || "Guests sharing an evening in the Georgiano dining room"} fill sizes="(max-width: 768px) 100vw, 46vw" /><span>Welcome, linger, celebrate</span></motion.div><div className="experience__rail">{["Cuisine", "Wine", "Hospitality"].map((item, index) => <motion.div className="experience__item" key={item} {...reveal}><span>0{index + 1}</span><h3>{item}</h3><p>{index === 0 ? "Generous flavors shaped by fire, craft, and season." : index === 1 ? "An ancient culture poured with curiosity and care." : "The unmistakable warmth of a Georgian table."}</p></motion.div>)}</div></div></div></section>

      <section className="private-dining section-pad" id="private-dining"><div className="page-shell private-dining__grid"><motion.div className="private-dining__copy" {...reveal}><p className="eyebrow">{privateContent?.eyebrow || "Private Dining"}</p><h2>{privateContent?.headline || <>Your Moments.<br /><em>Our Table.</em></>}</h2><p>{privateContent?.supportingText || "Gather for birthdays, anniversaries, family celebrations, corporate dinners, and private occasions—surrounded by the warmth of Georgian hospitality."}</p><Link className="button" href="/private-dining">Plan Your Event</Link></motion.div><motion.div className="private-dining__visual" {...reveal}><Image src={privateContent?.mediaUrl || "/media/private-dining-table.png"} alt={privateContent?.mediaAlt || "An elegant Georgian table set for a private gathering"} fill sizes="(max-width: 768px) 100vw, 56vw" /><blockquote>“The table is where every celebration begins.”</blockquote></motion.div></div></section>

      <section className="gallery section-pad" id="gallery" aria-labelledby="gallery-title"><div className="page-shell"><motion.div className="section-heading" {...reveal}><p className="eyebrow">Gallery</p><h2 id="gallery-title">A Glimpse<br /><em>of the Table.</em></h2></motion.div><div className="gallery__grid">{gallery.map((image, index) => <motion.button className={`gallery__item ${image.className}`} key={image.src} type="button" onClick={() => setLightbox(index)} aria-label={`Open image ${index + 1} in gallery`} {...reveal}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 55vw" /><span>View <ArrowIcon /></span></motion.button>)}</div></div></section>

      <section className="visit" id="contact"><Image src="/media/visit-entrance.png" alt="A warmly lit restaurant entrance in North Hollywood" fill sizes="100vw" /><div className="visit__veil" /><div className="page-shell visit__content"><motion.div {...reveal}><p className="eyebrow">Location & Contact</p><h2>Visit Georgiano.</h2><p className="visit__place">{data?.settings?.place || "North Hollywood, California"}</p><dl className="visit__details"><div><dt>Address</dt><dd>{data?.settings?.address || restaurantAddress}</dd></div><div><dt>Hours</dt><dd>{data?.settings?.hours || restaurantHoursSummary}</dd></div><div><dt>Phone</dt><dd><a href={`tel:${(data?.settings?.phone || restaurantPhone).replace(/[^+\d]/g, "")}`}>{data?.settings?.phone || restaurantPhone}</a></dd></div><div><dt>Email</dt><dd><a href={`mailto:${data?.settings?.email || restaurantEmail}`}>{data?.settings?.email || restaurantEmail}</a></dd></div></dl><div className="visit__actions"><Link className="button" href={directionsUrl} target="_blank" rel="noreferrer">Get Directions</Link><Link className="button" href="/reserve">Reserve a Table</Link></div></motion.div></div></section>
    </main>

    <footer className="footer"><div className="page-shell footer__top"><div><BrandLogo /><p>Georgian cuisine, wine, and hospitality in North Hollywood.</p></div><nav aria-label="Footer navigation">{navItems.slice(1).map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}</nav><div className="footer__reserve"><p>Join us at the table.</p><Link className="button" href="/reserve">Reserve a Table</Link></div></div><div className="page-shell footer__bottom"><span>© 2026 Georgiano</span><div><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms & Conditions</Link></div></div></footer>

    <AnimatePresence>{lightbox !== null && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Gallery image"><button type="button" onClick={() => setLightbox(null)} aria-label="Close gallery">Close</button><div className="lightbox__image"><Image src={gallery[lightbox].src} alt={gallery[lightbox].alt} fill sizes="94vw" /></div></motion.div>}</AnimatePresence>
  </>;
}
