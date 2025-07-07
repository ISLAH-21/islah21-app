import { ThemeProvider } from "next-themes";
import { DM_Sans } from "next/font/google";
import "./global.css";

const dm_sans = DM_Sans({
  subsets: ["latin"],
});

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
        <ThemeProvider
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
          <div className="root">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
