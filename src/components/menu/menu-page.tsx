"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  menuCategories,
  menuItems,
  type MenuItem,
} from "@/lib/menu/georgiano-menu-data";

const siteNav = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/#story" },
  { label: "Wine", href: "/#wine" },
  { label: "Private Dining", href: "/#private-dining" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
] as const;

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatMenuPrice(priceCents: number | null) {
  return priceCents === null ? "—" : priceFormatter.format(priceCents / 100);
}

function MenuTags({ item }: { item: MenuItem }) {
  const tags = [...item.dietary, ...item.allergens.map((allergen) => `Contains ${allergen}`)];
  if (tags.length === 0) return null;

  return <ul className="menu-tags" aria-label="Dietary and allergen information">
    {tags.map((tag) => <li key={tag}>{tag}</li>)}
  </ul>;
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const soldOut = item.status === "sold-out";
  const featured = item.featured && Boolean(item.image);
  const price = formatMenuPrice(item.priceCents);

  return <article className={`menu-item-card ${featured ? "menu-item-card--featured" : ""} ${soldOut ? "is-sold-out" : ""}`}>
    <div className="menu-item-card__image">
      {item.image ? <Image
        src={item.image}
        alt={item.imageAlt || item.name}
        fill
        loading="lazy"
        sizes={featured ? "(max-width: 48rem) calc(100vw - 2.5rem), (max-width: 72rem) calc(100vw - 4rem), 52vw" : "(max-width: 48rem) calc(100vw - 2.5rem), (max-width: 72rem) 46vw, 30vw"}
      /> : <span className="menu-item-card__monogram" aria-hidden="true">G</span>}
      {featured ? <span className="menu-item-card__feature-label">Featured selection</span> : null}
      {soldOut ? <span className="availability availability--sold-out">Sold Out</span> : null}
    </div>
    <div className="menu-item-card__copy">
      <div className="menu-item__title">
        <h3>{item.name}</h3>
        <span className="menu-item__price" aria-label={item.priceCents === null ? "Price not listed" : `Price ${price}`}>{price}</span>
      </div>
      <p>{item.description}</p>
      <MenuTags item={item} />
    </div>
  </article>;
}

export function MenuPage({ categories = menuCategories, items = menuItems }: { categories?: typeof menuCategories; items?: MenuItem[] }) {
  const publicItems = useMemo(() => items.filter((item) => item.status !== "hidden"), [items]);
  const visibleCategories = useMemo(() => [...categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((category) => publicItems.some((item) => item.categoryId === category.id)), [categories, publicItems]);
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState(visibleCategories[0]?.id ?? "menu");
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const categoryTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = visibleCategories
      .map((category) => document.getElementById(category.id))
      .filter((section): section is HTMLElement => section !== null);
    const updateActiveCategory = () => {
      const activationLine = Math.min(window.innerHeight * .32, 300);
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activationLine) current = section;
        else break;
      }
      if (current) setActiveCategory(current.id);
    };
    updateActiveCategory();
    window.addEventListener("scroll", updateActiveCategory, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveCategory);
  }, [visibleCategories]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) closeButtonRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    const track = categoryTrackRef.current;
    const activeLink = track?.querySelector<HTMLAnchorElement>(`a[href="#${activeCategory}"]`);
    if (!track || !activeLink) return;
    const centeredLeft = activeLink.offsetLeft - (track.clientWidth - activeLink.clientWidth) / 2;
    track.scrollTo({
      left: centeredLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeCategory, reduceMotion]);

  const reveal = reduceMotion ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  };

  const handleCategoryKeyDown = (event: ReactKeyboardEvent<HTMLAnchorElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const links = Array.from(event.currentTarget.closest('nav')?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
    const current = links.indexOf(event.currentTarget);
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : event.key === 'ArrowRight' ? (current + 1) % links.length : (current - 1 + links.length) % links.length;
    links[nextIndex]?.focus();
  };

  const handleCategorySelect = (event: ReactMouseEvent<HTMLAnchorElement>, categoryId: string) => {
    event.preventDefault();
    window.history.pushState(null, "", `#${categoryId}`);
    document.getElementById(categoryId)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    setActiveCategory(categoryId);
  };

  return <>
    <header className="menu-site-header">
      <div className="site-header__inner">
        <Link className="site-header__logo" href="/" aria-label="Georgiano home"><BrandLogo priority /></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">{siteNav.map((item) => <Link className={item.label === "Menu" ? "is-current" : ""} key={item.label} href={item.href} aria-current={item.label === "Menu" ? "page" : undefined}>{item.label}</Link>)}</nav>
        <Link className="nav-reserve" href="/reserve">Reserve a Table</Link>
        <button className="menu-toggle" type="button" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><span /><span /></button>
      </div>
    </header>

    <AnimatePresence>{menuOpen ? <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="mobile-menu__top"><BrandLogo /><button ref={closeButtonRef} type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}>Close</button></div>
      <nav aria-label="Mobile navigation">{siteNav.map((item, index) => <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : index * 0.045 }}><Link href={item.href} aria-current={item.label === "Menu" ? "page" : undefined} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}</Link></motion.div>)}<Link className="button mobile-menu__reserve" href="/reserve">Reserve a Table</Link></nav>
    </motion.div> : null}</AnimatePresence>

    <main className="menu-page">
      <section className="menu-hero">
        <Image src="/media/menu-hero.png" alt="Georgian eggplant and walnut appetizers arranged on handmade ceramic" fill preload sizes="100vw" />
        <div className="menu-hero__veil" />
        <div className="page-shell menu-hero__content">
          <motion.p className="eyebrow" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>Georgiano · North Hollywood</motion.p>
          <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : .08 }}>Our Menu</motion.h1>
          <motion.p initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : .16 }}>Traditional Georgian cooking, generous plates, and dishes made for sharing around the table.</motion.p>
        </div>
      </section>

      <div className="menu-browse">
      <nav className="category-nav" aria-label="Menu categories">
        <div className="category-nav__track" ref={categoryTrackRef}>
          {visibleCategories.map((category, index) => <a key={category.id} href={`#${category.id}`} aria-current={activeCategory === category.id ? "location" : undefined} className={activeCategory === category.id ? "is-active" : ""} onKeyDown={handleCategoryKeyDown} onClick={(event) => handleCategorySelect(event, category.id)}><span>{String(index + 1).padStart(2, "0")}</span>{category.name}</a>)}
        </div>
      </nav>

      <div className="menu-sections">
        {visibleCategories.map((category, categoryIndex) => {
          const categoryItems = publicItems.filter((item) => item.categoryId === category.id).sort((a, b) => a.sortOrder - b.sortOrder);
          return <section className={`menu-category ${categoryIndex % 2 === 1 ? "menu-category--tonal" : ""}`} id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
            <div className="page-shell">
              <motion.header className="menu-category__header" {...reveal}><span>{String(categoryIndex + 1).padStart(2, "0")}</span><div><p className="eyebrow">From the menu</p><h2 id={`${category.id}-title`}>{category.name}</h2><p>{category.introduction}</p></div></motion.header>
              <div className="menu-category__items">{categoryItems.map((item) => <MenuItemCard item={item} key={item.id} />)}</div>
            </div>
          </section>;
        })}
      </div>
      </div>

      <section className="menu-reservation">
        <div className="page-shell"><motion.div {...reveal}><p className="eyebrow">The table is waiting</p><h2>Come Hungry.<br /><em>Stay Awhile.</em></h2><p>Gather around a Georgian table in North Hollywood.</p><Link className="button" href="/reserve">Reserve a Table</Link></motion.div><span className="menu-reservation__mark" aria-hidden="true">G</span></div>
      </section>
    </main>

    <footer className="footer"><div className="page-shell footer__top"><div><BrandLogo /><p>Georgian cuisine, wine, and hospitality in North Hollywood.</p></div><nav aria-label="Footer navigation">{siteNav.slice(1).map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}</nav><div className="footer__reserve"><p>Join us at the table.</p><Link className="button" href="/reserve">Reserve a Table</Link></div></div><div className="page-shell footer__bottom"><span>© 2026 Georgiano</span><div><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms & Conditions</Link></div></div></footer>
  </>;
}
