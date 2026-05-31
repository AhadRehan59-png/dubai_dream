"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/images";
import SafeImage from "@/components/ui/SafeImage";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
  showThumbnails?: boolean;
}

export default function ImageGallery({
  images,
  alt,
  className,
  showThumbnails = true,
}: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [FALLBACK_IMAGE];

  const prev = () => setActive((i) => (i === 0 ? list.length - 1 : i - 1));
  const next = () => setActive((i) => (i === list.length - 1 ? 0 : i + 1));

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#2a2a2a]">
        <SafeImage
          src={list[active]}
          alt={`${alt} ${active + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
        />
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === active ? "w-6 bg-pink" : "w-2 bg-white/50"
                  )}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showThumbnails && list.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {list.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition",
                i === active ? "border-pink" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <SafeImage src={url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
