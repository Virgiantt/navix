import type { Metadata } from "next";

import "./globals.css";
import { DataProvider } from "@/components/context/DataContext";
import ChatWidget from "@/components/ChatWidget";



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
    <DataProvider>
      {children}
      <ChatWidget />
    </DataProvider>
  );
}
