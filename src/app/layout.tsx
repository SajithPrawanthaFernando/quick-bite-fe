import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Header } from "@/components";
import { Footer } from "@/components";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuickBite",
  description: "Your fast and delicious food delivery app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${lexend.variable} 
        
          antialiased
        `}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
