"use client";

import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "../theme-provider";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionProvider>
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
        {children}
      </SessionProvider>
    </>
  );
}
