"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/utils";

interface CountdownTimerProps {
  endDate: string;
  className?: string;
}

export default function CountdownTimer({ endDate, className }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState("--:--:--");

  useEffect(() => {
    setMounted(true);
    const update = () => setCountdown(formatCountdown(new Date(endDate)));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!mounted) {
    return (
      <span className={className} suppressHydrationWarning>
        CLOSING IN --:--:--
      </span>
    );
  }

  if (countdown === "CLOSED") {
    return <span className={className}>DRAW CLOSED</span>;
  }

  return (
    <span className={className} suppressHydrationWarning>
      CLOSING IN {countdown}
    </span>
  );
}
