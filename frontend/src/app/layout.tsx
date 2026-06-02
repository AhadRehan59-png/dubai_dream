import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchCurrentUser } from "@/lib/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dream Dubai - Win Amazing Prizes",
  description:
    "Participate in lucky draws and win Electronics, Cash, Auto, Gold, Lifestyle prizes and more. Buy tokens, enter draws, and become a winner!",
  keywords: ["raffle", "lucky draw", "Dubai", "prizes", "win", "tokens"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await fetchCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Header
          user={
            user
              ? { firstName: user.firstName, email: user.email, role: user.role }
              : null
          }
        />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
