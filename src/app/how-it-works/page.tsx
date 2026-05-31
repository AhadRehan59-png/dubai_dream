import Link from "next/link";
import { Ticket, Wallet, Trophy, Bell, Shield, Clock } from "lucide-react";

const steps = [
  {
    icon: Ticket,
    title: "Choose a Prize",
    description: "Browse categories like Electronics, Cash, Auto, Gold, and Lifestyle. Pick a draw that excites you.",
  },
  {
    icon: Wallet,
    title: "Buy Tokens",
    description: "Purchase tokens at a fixed price. Each token gives you one entry into the lucky draw.",
  },
  {
    icon: Shield,
    title: "Get Your Token Number",
    description: "Every purchase generates a unique token number. Track all your entries in your dashboard.",
  },
  {
    icon: Clock,
    title: "Wait for the Draw",
    description: "Draws run automatically when all tokens are sold or the countdown ends.",
  },
  {
    icon: Trophy,
    title: "Winner Selected",
    description: "Our secure random system selects one winner fairly from all purchased tokens.",
  },
  {
    icon: Bell,
    title: "Get Notified",
    description: "Winners receive email and SMS notifications. All participants are notified of results.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-white">How It Works</h1>
        <p className="mt-4 text-lg text-muted">
          Simple, fair, and transparent lucky draws
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="rounded-2xl border border-border/30 bg-card p-6"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink/10 text-pink">
              <step.icon size={24} />
            </div>
            <div className="mb-2 text-xs font-bold text-pink">STEP {i + 1}</div>
            <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
            <p className="text-sm text-muted">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-border/30 bg-card p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-white">Ready to Win?</h2>
        <p className="mb-6 text-muted">
          Join thousands of participants and try your luck today.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-blue px-8 py-3 font-bold text-white transition hover:bg-blue/80"
        >
          BROWSE ACTIVE DRAWS
        </Link>
      </div>
    </div>
  );
}
