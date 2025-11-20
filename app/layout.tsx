import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Logo from "@/public/logo.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "League of Ceki",
  description:
    "Enter the ultimate battleground of strategy and skill. Compete, dominate, and rise through the ranks in the League of Ceki — where legends are made, scores define greatness, and every round counts.",
  openGraph: {
    title: "League of Ceki",
    description:
      "Enter the ultimate battleground of strategy and skill. Compete, dominate, and rise through the ranks in the League of Ceki — where legends are made, scores define greatness, and every round counts.",
    url: "https://games-lemon-six.vercel.app/",
    siteName: "League of Ceki",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "League of Ceki - Championship Arena",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "League of Ceki",
    description:
      "Compete, dominate, and rise through the ranks in the League of Ceki — where every round counts.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen bg-zinc-50 font-sans dark:bg-black grid place-items-center`}
      >
        <div>
          <Image alt="logo" src={Logo} height={200} className="mx-auto mb-4" />
          {children}
        </div>
      </body>
    </html>
  );
}
