import type { Metadata, Viewport } from "next";
import { Great_Vibes, Poppins } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "For You... ❤️",
  description: "A small message from my heart.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="h-full w-full font-poppins selection:bg-soft-rose selection:text-burgundy">
        {children}
      </body>
    </html>
  );
}

