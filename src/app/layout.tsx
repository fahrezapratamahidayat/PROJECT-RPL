"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  ``;
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <NextTopLoader
            color="#fff"
            initialPosition={0.08}
            crawlSpeed={200}
            height={2}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            zIndex={1600}
            showAtBottom={false}
          />
        </ThemeProvider>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
