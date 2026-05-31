import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ImageGallery from "@/components/ui/ImageGallery";
import CountdownTimer from "@/components/ui/CountdownTimer";
import PurchaseForm from "@/components/draws/PurchaseForm";
import LoginRequiredPanel from "@/components/draws/LoginRequiredPanel";
import { formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DrawDetailPage({ params }: Props) {
  const { id } = await params;

  const draw = await prisma.draw.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!draw) notFound();

  const user = await getCurrentUser();
  const imageUrls = draw.images.map((img: { url: string }) => img.url);
  const isActive = draw.status === "ACTIVE" || draw.status === "SOLD_OUT";
  const progress = Math.min((draw.soldTokens / draw.totalTokens) * 100, 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/30">
        {isActive && (
          <div className="absolute left-0 top-0 z-10 rounded-br-2xl bg-red px-4 py-2 text-xs font-bold tracking-wider text-white">
            <CountdownTimer endDate={draw.endDate.toISOString()} />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-0">
          <div className="relative m-4">
            {draw.badge && (
              <div className="absolute left-3 top-3 z-10 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-black">
                {draw.badge}
              </div>
            )}
            <ImageGallery
              images={imageUrls.length > 0 ? imageUrls : [draw.imageUrl]}
              alt={draw.title}
            />
          </div>

          <div className="flex flex-col p-6 lg:p-10">
            <div className="mb-1 text-sm text-pink">{draw.category.name}</div>
            <div className="mb-2 text-5xl font-black text-pink">Win</div>
            <h1 className="mb-4 text-4xl font-black text-white">
              {draw.prizeCurrency} {formatNumber(draw.prizeValue)} {draw.title}
            </h1>
            <p className="mb-6 text-muted">{draw.description}</p>

            <div className="mb-6 space-y-1 text-sm text-white/70">
              <p>Draw Date: {formatDate(draw.drawDate)} or earlier</p>
              <p>Campaign: {draw.campaignCode}</p>
              <p>Status: <span className="text-pink">{draw.status}</span></p>
            </div>

            <div className="mb-6">
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>{draw.soldTokens} / {draw.totalTokens} tokens sold</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink to-blue"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {isActive ? (
              user ? (
                <PurchaseForm
                  drawId={draw.id}
                  tokenPrice={draw.tokenPrice}
                  maxTokens={draw.totalTokens - draw.soldTokens}
                  title={draw.title}
                />
              ) : (
                <LoginRequiredPanel drawId={draw.id} title={draw.title} />
              )
            ) : (
              <div className="rounded-2xl bg-[#111] p-6 text-center">
                <p className="text-muted">This draw is no longer accepting entries.</p>
                <Link href="/winners" className="mt-4 inline-block text-pink hover:underline">
                  View Results
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
