import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { getAuthContext } from "@/lib/guards";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "BPDC Career Profile - Your Digital Profile in One Scan",
  description: "Create your career profile with photo and resume. Recruiters at BPDC events scan your QR code to view your profile instantly.",
  openGraph: {
    title: "BPDC Career Profile - Your Digital Profile in One Scan",
    description: "Create your career profile with photo and resume. Recruiters at BPDC events scan your QR code to view your profile instantly.",
    url: "/",
    siteName: "BPDC Career Profile",
    images: [
      {
        url: "/bpdc.jpg",
        width: 1200,
        height: 630,
        alt: "BPDC Career Profile",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BPDC Career Profile - Your Digital Profile in One Scan",
    description: "Create your career profile with photo and resume. Recruiters scan your QR code to view your profile instantly.",
    images: ["/bpdc.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <SessionProvider>
          <Header isAuthenticated={!!studentId} hasProfile={hasProfile} />
          <main className="min-h-[calc(100vh-4rem)] animate-page-fade">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
