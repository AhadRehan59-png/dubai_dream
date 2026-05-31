import Link from "next/link";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="mb-4 text-3xl font-black text-white">Your Cart</h1>
      <p className="mb-8 text-muted">
        Select tokens directly from any draw page. Your cart will show pending purchases here.
      </p>
      <Link
        href="/"
        className="inline-block rounded-full bg-blue px-8 py-3 font-bold text-white hover:bg-blue/80"
      >
        BROWSE DRAWS
      </Link>
    </div>
  );
}
