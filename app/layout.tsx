import Navbar from "@/components/nav";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Awesome Prometheus Toolkit",
  description: "Awesome Prometheus Toolkit Dashboard, a project for Last9",
};

// console.log('layout', new Date().getSeconds())

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log('layout inside', new Date().getSeconds())
  return (
    <html lang="en">
      <body className={`min-h-screen flex justify-center bg-[#FFFFFF] ${inter.className}`}>
        <div className="container mx-auto">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
