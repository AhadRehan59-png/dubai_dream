import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

interface LoginRequiredPanelProps {
  drawId: string;
  title: string;
}

export default function LoginRequiredPanel({ drawId, title }: LoginRequiredPanelProps) {
  const redirect = encodeURIComponent(`/draw/${drawId}`);

  return (
    <div className="rounded-3xl bg-[#111] p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink/10 text-pink">
        <LogIn size={28} />
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">Login Required</h3>
      <p className="mb-6 text-sm text-muted">
        Please login or create an account to purchase tickets for{" "}
        <span className="text-white">{title}</span>.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/auth/login?redirect=${redirect}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue py-3 text-sm font-bold text-white hover:bg-blue/80"
        >
          <LogIn size={18} />
          LOGIN
        </Link>
        <Link
          href={`/auth/register?redirect=${redirect}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-pink py-3 text-sm font-bold text-pink hover:bg-pink/10"
        >
          <UserPlus size={18} />
          SIGN UP
        </Link>
      </div>
    </div>
  );
}
