"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import HydrationSafeIcon from "@/components/ui/HydrationSafeIcon";

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  required,
  minLength,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-black px-4 py-3 pr-12 text-white outline-none focus:border-pink"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-white"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <HydrationSafeIcon icon={EyeOff} size={18} />
        ) : (
          <HydrationSafeIcon icon={Eye} size={18} />
        )}
      </button>
    </div>
  );
}
