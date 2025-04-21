import { Lexend } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import { ProvidersWrapper } from "@/components/ProvidersWrapper";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} antialiased`}>
        <ReduxProvider>
          <ProvidersWrapper>{children}</ProvidersWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
