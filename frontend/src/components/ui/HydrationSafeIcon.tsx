"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface HydrationSafeIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export default function HydrationSafeIcon({
  icon: Icon,
  size = 16,
  className,
}: HydrationSafeIconProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className={className}
        style={{ width: size, height: size, display: "inline-block" }}
        aria-hidden
      />
    );
  }

  return <Icon size={size} className={className} />;
}
