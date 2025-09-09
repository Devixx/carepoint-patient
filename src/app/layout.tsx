import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import ChatWidget from "./components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "CarePoint Patient Portal",
  description:
    "Modern patient portal for booking appointments and managing health records",
  keywords: ["healthcare", "patient portal", "appointments", "medical records"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <ChatWidget />
      </body>
    </html>
  );
}
