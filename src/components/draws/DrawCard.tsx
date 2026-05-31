import Link from "next/link";
import ImageGallery from "@/components/ui/ImageGallery";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { Info } from "lucide-react";

export interface DrawCardProps {
  id: string;
  campaignCode: string;
  title: string;
  description: string;
  prizeValue: number;
  prizeCurrency: string;
  tokenPrice: number;
  imageUrl: string;
  imageUrls?: string[];
  badge?: string | null;
  ticketMultiplier?: number;
  drawDate: string;
  endDate: string;
  status: string;
  soldTokens: number;
  totalTokens: number;
  category?: { name: string; slug: string };
}

export default function DrawCard({
  id,
  campaignCode,
  title,
  prizeValue,
  prizeCurrency,
  tokenPrice,
  imageUrl,
  imageUrls = [],
  badge,
  ticketMultiplier = 1,
  drawDate,
  endDate,
  status,
  soldTokens,
  totalTokens,
}: DrawCardProps) {
  const isActive = status === "ACTIVE" || status === "SOLD_OUT";
  const progress = Math.min((soldTokens / totalTokens) * 100, 100);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-card border border-border/30">
      {isActive && (
        <div className="absolute left-0 top-0 z-10 rounded-br-2xl bg-red px-4 py-2 text-xs font-bold tracking-wider text-white">
          <CountdownTimer endDate={endDate} />
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_1.2fr_0.8fr] gap-0">
        <div className="relative m-4">
          <ImageGallery
            images={imageUrls.length > 0 ? imageUrls : [imageUrl]}
            alt={title}
            showThumbnails={imageUrls.length > 1}
          />
          {badge && (
            <div className="absolute left-7 top-7 z-10 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-black">
              {badge}
            </div>
          )}
          {ticketMultiplier > 1 && (
            <div className="absolute left-7 top-16 z-10 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-black">
              {ticketMultiplier}x TICKETS
            </div>
          )}
        </div>

        {/* Prize Details */}
        <div className="flex flex-col justify-center p-6 lg:p-8">
          <div className="mb-2 text-4xl font-black text-pink lg:text-5xl">Win</div>
          <h2 className="mb-4 text-3xl font-black leading-tight text-white lg:text-4xl">
            {prizeCurrency} {formatNumber(prizeValue)} {title.replace(/^AED\s[\d,]+\s/, "")}
          </h2>
          <p className="mb-6 line-clamp-2 text-sm text-muted">{title}</p>

          <div className="mt-auto space-y-2 text-sm text-white/70">
            <p>Draw Date: {formatDate(new Date(drawDate))} or earlier</p>
            <p>Campaign: {campaignCode}</p>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>{soldTokens} / {totalTokens} tokens sold</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink to-blue transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col justify-center p-6 lg:p-8">
          <div className="rounded-3xl bg-[#111] p-6">
            <div className="mb-4 text-center">
              <span className="text-lg font-bold text-pink">
                {formatCurrency(tokenPrice)}
              </span>
              <span className="text-sm text-muted"> per token*</span>
            </div>

            <Link
              href={`/draw/${id}`}
              className="block w-full rounded-full bg-blue py-4 text-center text-sm font-black tracking-wide text-white transition hover:bg-blue/80 hover:scale-[1.02] active:scale-[0.98]"
            >
              BUY &amp; ENTER TO WIN
            </Link>

            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-muted">
              <Info size={12} />
              *EasyPaisa, JazzCash, Card &amp; Bank Transfer
            </p>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/draw/${id}`}
                className="flex-1 rounded-full border border-border py-2 text-center text-xs text-muted transition hover:border-white/30 hover:text-white"
              >
                More info
              </Link>
              <Link
                href="/how-it-works"
                className="flex-1 rounded-full border border-border py-2 text-center text-xs text-muted transition hover:border-white/30 hover:text-white"
              >
                How it works?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
