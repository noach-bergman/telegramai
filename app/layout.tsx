import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telegram News Collector",
  description: "Collect Telegram channel posts into separate pages"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>{children}</body>
    </html>
  );
}
