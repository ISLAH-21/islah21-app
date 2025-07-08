import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { DM_Sans } from "next/font/google";

import "./global.css";

const dm_sans = DM_Sans({
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
      className={`${dm_sans.className} antialiased`}
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
