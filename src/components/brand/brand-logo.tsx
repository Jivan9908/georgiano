import Image from "next/image";

type BrandLogoProps = { className?: string; priority?: boolean };

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      className={className}
      src="/brand/georgiano-logo-transparent.png"
      alt="Georgiano — Georgian Cuisine"
      width={2061}
      height={763}
      priority={priority}
      loading="eager"
      sizes="(max-width: 768px) 82vw, 528px"
    />
  );
}
