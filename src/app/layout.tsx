import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CarePoint Patient Portal",
  description:
    "Modern patient appointment booking and health management platform",
  keywords: [
    "healthcare",
    "appointments",
    "patient portal",
    "medical",
    "booking",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
