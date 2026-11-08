import "@yravg/ui/tokens.css";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "yravg HatchSystem",
  description: "Perancah aplikasi web HatchSystem. Belum ada fitur produk.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
