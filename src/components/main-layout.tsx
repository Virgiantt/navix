import { ReactNode } from 'react';
import Navbar from './sections/Navbar';
import Footer from './sections/Footer';


export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 md:pt-10">{children}</main>
      <Footer />
    </div>
  );
}