import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { CyberLayout } from "@/components/layout/CyberLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CyberCloud | Futuristic Storage",
  description: "A cyberpunk-inspired cloud storage platform with physics-based interactions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <CyberLayout>{children}</CyberLayout>
        </Providers>
      </body>
    </html>
  );
}
