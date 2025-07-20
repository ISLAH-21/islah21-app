import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { DM_Sans, Inter } from "next/font/google";

import "./global.css";

const _dm_sans = DM_Sans({
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Islah21 Alumni Directory",
  description: "Official alumni directory of Islah21",
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
          <div className="root">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
