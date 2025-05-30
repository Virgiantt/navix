import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CategoryProvider } from "@/components/context/CategoryContext";

const font =Space_Grotesk({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Navix Agency",
  description: "Where your ideas come to life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
           <CategoryProvider>
           {children}
           </CategoryProvider>
     
      </body>
    </html>
  );
}
