import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "NextStep - Career Coach",
  description: "Psychology-grounded career assessment and job search optimization tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Navigation />
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
