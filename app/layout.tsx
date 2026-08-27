import type { Metadata } from "next";
import "./globals.css";
import "./design.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kasana-program.humastgp.chatgpt.site"),
  title: "KASANA - Exchange & Beasiswa",
  description: "Jelajahi 100 program exchange, student mobility, dan beasiswa nasional maupun internasional melalui KASANA.",
  openGraph: { title: "KASANA - Exchange & Beasiswa", description: "Temukan peluang akademik global dari sumber resmi dalam satu direktori yang rapi.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "KASANA - Exchange & Beasiswa" }] },
  twitter: { card: "summary_large_image", title: "KASANA - Exchange & Beasiswa", description: "Temukan peluang akademik global dari sumber resmi dalam satu direktori yang rapi.", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
