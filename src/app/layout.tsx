import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextStep - Career Profile",
  description: "Discover what's really wrong at work and find something better. Psychology-grounded career assessment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
