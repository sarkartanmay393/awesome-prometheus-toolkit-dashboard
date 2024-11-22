import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Navbar from "@/components/nav";
import ContextWrapper from "./context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Awesome Prometheus Toolkit",
  description: "Awesome Prometheus Toolkit Dashboard, a project for Last9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ContextWrapper>
        <body
          className={`min-h-screen flex justify-center bg-[#FFFFFF] ${inter.className}`}
        >
          <div className="container mx-auto">
            <Navbar />
            {children}
          </div>
        </body>
      </ContextWrapper>
    </html>
  );
}
