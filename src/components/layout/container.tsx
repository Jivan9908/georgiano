import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  size?: "reading" | "default" | "wide";
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Container<T extends ElementType = "div">({ as, children, className = "", size = "default", ...props }: ContainerProps<T>) {
  const Component = as ?? "div";
  return <Component className={`container container--${size} ${className}`.trim()} {...props}>{children}</Component>;
}
