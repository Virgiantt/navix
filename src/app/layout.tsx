import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/components/context/DataContext";
import ChatWidget from "@/components/ChatWidget";

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
           <DataProvider>
           {children}
           <ChatWidget />
           </DataProvider>
     
      </body>
    </html>
  );
}
