import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Providers from "../components/providers/tanstack-providers";

import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Islah21 App",
  description: "Official app for Islah21",
  keywords: "Islah21, alumni, directory",
  authors: { name: "Hengker" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" enableSystem={false}>
          <Providers>
            <div className="root">{children}</div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
