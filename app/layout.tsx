import { Providers } from "./providers";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Finance Dashboard",
  description:
    "Track and manage your income, expenses, savings, and financial goals with multilingual (AR/EN) support and a clean analytics dashboard.",
  keywords: [
    "personal finance",
    "budget tracker",
    "expense tracker",
    "income manager",
    "financial goals",
    "AR EN dashboard",
    "money management",
    "finance app",
  ],
  authors: [{ name: "Mahmoud Alshukri" }],
  creator: "Mahmoud Alshukri",
  metadataBase: new URL("https://your-domain.com"),

  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Personal Finance Dashboard",
    description:
      "Track income, expenses, savings, and goals — with multilingual AR/EN support.",
    url: "https://your-domain.com",
    siteName: "Personal Finance Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Personal Finance Dashboard – OG Image",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Personal Finance Dashboard",
    description:
      "Track income, expenses, savings, and goals — with multilingual AR/EN support.",
    images: ["/og-image.png"],
    creator: "@yourTwitterHandle",
  },

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
