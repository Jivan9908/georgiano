"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/#story" },
  { label: "Wine", href: "/#wine" },
  { label: "Private Dining", href: "/private-dining" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export function PublicHeader({ currentPath }: { currentPath?: string }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return <>
    <header className="public-header">
      <div className="site-header__inner">
        <Link className="site-header__logo" href="/" aria-label="Georgiano home"><BrandLogo priority /></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => <Link key={item.label} className={currentPath === item.href ? "is-current" : undefined} href={item.href} aria-current={currentPath === item.href ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <Link className={`nav-reserve ${currentPath === "/reserve" ? "is-current" : ""}`} href="/reserve" aria-current={currentPath === "/reserve" ? "page" : undefined}>Reserve a Table</Link>
        <button className="menu-toggle" type="button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}><span /><span /></button>
      </div>
    </header>
    <AnimatePresence>{open ? <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="mobile-menu__top"><BrandLogo /><button ref={closeRef} type="button" aria-label="Close navigation" onClick={() => setOpen(false)}>Close</button></div>
      <nav aria-label="Mobile navigation">{navigation.map((item, index) => <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : index * .045 }}><Link href={item.href} aria-current={currentPath === item.href ? "page" : undefined} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</Link></motion.div>)}<Link className="button mobile-menu__reserve" href="/reserve" onClick={() => setOpen(false)}>Reserve a Table</Link></nav>
    </motion.div> : null}</AnimatePresence>
  </>;
}
