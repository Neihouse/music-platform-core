import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Music Platform MVP",
  description: "Connect artists and fans through music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <Header />
        <main className="min-h-[calc(100vh-120px)] bg-gray-100">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
