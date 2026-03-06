import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LightRays from "@/components/LightRays";
import Footer from "@/components/Footer";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moi Girls Resource Portal",
  description: "Moi Girls High School Past Papers & Mock Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} antialiased`}
      >
        <Navbar isLoggedIn={false} />
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#800020"
            raysSpeed={0.15}
            lightSpread={0.6}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.01}
            noiseAmount={0.0}
            distortion={0.0}
          />
        </div>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
