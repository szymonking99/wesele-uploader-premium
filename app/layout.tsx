import "./globals.css";
import React from "react";

export const metadata = {
  title: "Paulina & Szymon - Zdjęcia z wesela",
  description: "Prześlij zdjęcia z wesela 06.06.2026"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
