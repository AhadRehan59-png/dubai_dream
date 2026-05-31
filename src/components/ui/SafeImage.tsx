"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/images";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}

export default function SafeImage({ src, alt, className, fill }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={cn(fill && "absolute inset-0 h-full w-full object-cover", className)}
      loading="lazy"
      onError={() => {
        if (currentSrc !== FALLBACK_IMAGE) setCurrentSrc(FALLBACK_IMAGE);
      }}
    />
  );
}
