// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { FakeAuthProvider } from "./contexts/FakeAuthContext";

export const metadata: Metadata = {
  title: "CarePoint Patient Portal",
  description: "Patient booking and health management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <Providers>
          <FakeAuthProvider>{children}</FakeAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
