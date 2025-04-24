"use client";
import { Link as ScrollLink, Element } from "react-scroll";

import Image from "next/image";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function Home() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
        <Element
          name="top"
          className="overflow-hidden rounded-[6px] top-5 sticky md:mx-auto z-50 xl:w-4/5 2xl:w-[68%]
      bg-lochmara-200 flex  items-center justify-between py-4 px-4 md:px-8 mx-6"
        >
          <Link href="/">
            <Image
              src="/logo_navix_long.png"
              alt="Navix"
              width={1000}
              height={1000}
              className="w-28"
            />
          </Link>
          <div className="absolute right-1/2 translate-x-1/2 transform">
            <div className="hidden md:flex gap-x-10 items-center text-gray-700 font-medium text-lg cursor-pointer">
              <Link href="/#showcase" className="hover:text-lochmara-500">
                Showcase
              </Link>
              <ScrollLink
                to="process"
                smooth={true}
                duration={500}
                className="hover:text-lochmara-500"
              >
                Process
              </ScrollLink>
              <ScrollLink
                to="services"
                smooth={true}
                duration={500}
                className="hover:text-lochmara-500"
              >
                Services
              </ScrollLink>
              <ScrollLink
                to="guarentees"
                smooth={true}
                duration={500}
                className="hover:text-lochmara-500"
              >
                Guarentees
              </ScrollLink>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hover:text-lochmara-500">
           <a href="tel:50699724" className="hidden lg:flex">
            <button className="px-4 py-2 flex items-center gap-x-3  rounded-md">
 (+216) 50 699 724
            </button>
           </a>
           <InteractiveHoverButton className="">Hover Me</InteractiveHoverButton>
            </div>
          </div>
        </Element>
      </div>
    </div>
  );
}
