import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 text-xl font-black">
              <span className="text-pink">D</span> DREAM DUBAI
            </div>
            <p className="text-sm text-muted">
              The UAE&apos;s premier lucky draw platform. Win amazing prizes with
              fair and transparent draws.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/how-it-works" className="hover:text-white">How it works</Link></li>
              <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
              <li><Link href="/winners" className="hover:text-white">Winners</Link></li>
              <li><Link href="/dashboard/tickets" className="hover:text-white">My Tickets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/categories/electronics" className="hover:text-white">Electronics</Link></li>
              <li><Link href="/categories/cash" className="hover:text-white">Cash</Link></li>
              <li><Link href="/categories/auto" className="hover:text-white">Auto</Link></li>
              <li><Link href="/categories/gold" className="hover:text-white">Gold</Link></li>
              <li><Link href="/categories/lifestyle" className="hover:text-white">Lifestyle</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Dream Dubai · Made by Ahad Rehan
        </div>
      </div>
    </footer>
  );
}
