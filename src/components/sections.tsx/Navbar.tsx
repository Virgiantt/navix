'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Link as ScrollLink, Element } from "react-scroll";
import { InteractiveHoverButton } from '../magicui/interactive-hover-button';


export const Navbar = () => {
  return (
    <Element
      name="top"
      className="overflow-hidden rounded-[6px] top-5 sticky md:mx-auto z-50 xl:w-4/5 2xl:w-[68%] bg-lochmara-200 flex items-center justify-between py-4 px-4 md:px-8 mx-6"
    >
      {/* Logo - Added priority loading */}
      <Link href="/" className="hover:opacity-90 transition-opacity">
        <Image
          src="/logo_navix_long.png"
          alt="Navix"
          width={1000}
          height={1000}
          className="w-28"
          priority
        />
      </Link>

      {/* Navigation - Added mobile menu trigger */}
      <div className="absolute right-1/2 translate-x-1/2 transform">
        <div className="hidden md:flex gap-x-10 items-center text-gray-700 font-medium text-lg cursor-pointer">
          <Link href="/#showcase" className="hover:text-lochmara-500 transition-colors">
            Showcase
          </Link>
          <ScrollLink
            to="process"
            smooth={true}
            duration={500}
            className="hover:text-lochmara-500 transition-colors"
          >
            Process
          </ScrollLink>
          <ScrollLink
            to="services"
            smooth={true}
            duration={500}
            className="hover:text-lochmara-500 transition-colors"
          >
            Services
          </ScrollLink>
          <ScrollLink
            to="guarentees"
            smooth={true}
            duration={500}
            className="hover:text-lochmara-500 transition-colors"
          >
            Guarantees
          </ScrollLink>
        </div>
      </div>

      {/* CTA Section - Added hover states */}
      <div className="flex items-center gap-x-4">
        <div className="hover:text-lochmara-500 transition-colors">
          <a href="tel:50699724" className="hidden lg:flex items-center gap-2">
        
            <span className="px-4 py-2 rounded-md hover:bg-lochmara-100 transition-colors">
              (+216) 50 699 724
            </span>
          </a>
        </div>
        <Link href="/meeting" className="hover:scale-105 transition-transform">
          <InteractiveHoverButton className='
           hover:shadow-[1px_1px_var(--color-primary),2px_2px_var(--color-primary),3px_3px_var(--color-primary),4px_4px_var(--color-primary),5px_5px_0px_0px_var(--color-primary)]
    dark:hover:shadow-[1px_1px_var(--color-primary-foreground),2px_2px_var(--color-primary-foreground),3px_3px_var(--color-primary-foreground),4px_4px_var(--color-primary-foreground),5px_5px_0px_0px_var(--color-primary-foreground)]'>Book a Call</InteractiveHoverButton>
        </Link>
      </div>
    </Element>
  );
};