import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SectionProps = { children: ReactNode; className?: string; tone?: "espresso" | "mahogany" } & ComponentPropsWithoutRef<"section">;

export function Section({ children, className = "", tone = "espresso", ...props }: SectionProps) {
  return <section className={`section section--${tone} ${className}`.trim()} {...props}>{children}</section>;
}
