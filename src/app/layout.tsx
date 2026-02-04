import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { getAuthContext } from "@/lib/guards";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Profile - Connect with Recruiters",
  description: "Create your digital career profile. Recruiters scan your QR to view your profile instantly.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { studentId, hasProfile } = await getAuthContext();

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-neutral-900`}>
        <Header isAuthenticated={!!studentId} hasProfile={hasProfile} />
        <main className="min-h-[calc(100vh-4rem)] animate-page-fade">{children}</main>
      </body>
    </html>
  );
}
