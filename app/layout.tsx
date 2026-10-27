import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCartBar } from "@/components/MobileCartBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EL Print | Custom T-shirt printing in Singapore",
    template: "%s | EL Print",
  },
  description:
    "Custom printed T-shirts, hoodies and jackets in Singapore. DTG with no minimum, silkscreen, embroidery, heat transfer, sublimation, banners and stickers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <MobileCartBar />
        <Footer />
      </body>
    </html>
  );
}
