// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "code-for-humans — Entiende cualquier código al instante",
  description:
    "Pega cualquier fragmento de código y recibe una explicación adaptada a tu nivel: niño, junior o senior.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
