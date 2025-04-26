"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { InteractiveHoverButton } from "../magicui/interactive-hover-button";
import { Link as ScrollLink, Element } from "react-scroll";

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomePage = pathname === "/";
  const [hasScrolled, setHasScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!mobileMenuOpen) {
      const scrollingUp = latest < prevScrollY;
      const shouldShow = scrollingUp || latest < 50;
      setIsVisible(shouldShow);

      if (latest > 50 && !hasScrolled) {
        setHasScrolled(true);
      } else if (latest < 50) {
        setHasScrolled(false);
      }
    }
    setPrevScrollY(latest);
  });

  const menuVariants = {
    open: {
      opacity: 1,
      height: "auto",
    },
    closed: {
      opacity: 0,
      height: 0,
    },
  };

  const navbarVariants = {
    initial: isHomePage
      ? {
          y: -100,
          opacity: 0,
        }
      : {
          y: 0,
          opacity: 1,
        },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.8,
        delay: isHomePage && !hasScrolled ? 1.8 : 0,
      },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Element
      name="top"
      className="overflow-hidden rounded-[6px] top-5 sticky md:mx-auto z-50 xl:w-4/5 2xl:w-[68%]  flex items-center justify-between py-4 px-4 md:px-8 mx-6"
    >
      <AnimatePresence>
        <motion.nav
          key="navbar"
          className="fixed top-0 left-0 right-0 bg-white z-50 py-4 px-6 md:px-10 border-b"
          initial="initial"
          animate={isVisible ? "visible" : "hidden"}
          variants={navbarVariants}
        >
          <div className="mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-1">
              <Image 
                src="/logo_navix.png"
                alt="Navix Marketing Logo"
                width={24}
                height={24}
                className="rounded-full w-6 h-6 object-cover"
              />
              <span className="text-xl font-extrabold text-lochmara-500 uppercase tracking-wider">Navix</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-x-10 items-center">
              {/* <Link href="/#showcase" className="text-gray-700 hover:text-lochmara-500 transition-colors">
                Showcase
              </Link> */}
              <Link href={"/about"}className="text-gray-700 hover:text-lochmara-500 transition-colors">
              About
              </Link>
              <Link href={"/projects"}className="text-gray-700 hover:text-lochmara-500 transition-colors">
              Projects
              </Link>
              <ScrollLink
                to="process"
                smooth={true}
                duration={500}
                className="text-gray-700 hover:text-lochmara-500 transition-colors cursor-pointer"
              >
                Process
              </ScrollLink>
              <ScrollLink
                to="services"
                smooth={true}
                duration={500}
                className="text-gray-700 hover:text-lochmara-500 transition-colors cursor-pointer"
              >
                Services
              </ScrollLink>
              <ScrollLink
                to="guarentees"
                smooth={true}
                duration={500}
                className="text-gray-700 hover:text-lochmara-500 transition-colors cursor-pointer"
              >
                Guarantees
              </ScrollLink>
              {/* <a href="tel:50699724" className="text-gray-700 hover:text-lochmara-500">
                (+216) 50 699 724
              </a> */}
            </div>

            {/* Mobile CTA Button with Blur */}
            <div className="flex items-center gap-x-4">
              
              <Link href="/meeting" className="hover:scale-105 transition-transform md:hidden">
                <InteractiveHoverButton className='
                  backdrop-blur-sm bg-white/30 border border-white/20
                  hover:shadow-[1px_1px_var(--color-primary),2px_2px_var(--color-primary),3px_3px_var(--color-primary),4px_4px_var(--color-primary),5px_5px_0px_0px_var(--color-primary)]
                  dark:hover:shadow-[1px_1px_var(--color-primary-foreground),2px_2px_var(--color-primary-foreground),3px_3px_var(--color-primary-foreground),4px_4px_var(--color-primary-foreground),5px_5px_0px_0px_var(--color-primary-foreground)]'>
                  Book a Call
                </InteractiveHoverButton>
              </Link>
              
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-neutral-500" />
                ) : (
                  <Menu className="w-6 h-6 text-neutral-500" />
                )}
              </button>
            </div>

            {/* Desktop CTA Button */}
            <Link href="/meeting" className="hidden md:block hover:scale-105 transition-transform">
              <InteractiveHoverButton className='
                hover:shadow-[1px_1px_var(--color-primary),2px_2px_var(--color-primary),3px_3px_var(--color-primary),4px_4px_var(--color-primary),5px_5px_0px_0px_var(--color-primary)]
                dark:hover:shadow-[1px_1px_var(--color-primary-foreground),2px_2px_var(--color-primary-foreground),3px_3px_var(--color-primary-foreground),4px_4px_var(--color-primary-foreground),5px_5px_0px_0px_var(--color-primary-foreground)]'>
                Book a Call
              </InteractiveHoverButton>
            </Link>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial="closed"
            animate={mobileMenuOpen ? "open" : "closed"}
            variants={menuVariants}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col space-y-4 pt-4">
              {/* <Link href="/#showcase" className="text-gray-700 hover:text-lochmara-500">
                Showcase
              </Link> */}
              <Link href={"/about"}className="text-gray-700 hover:text-lochmara-500 transition-colors">
              About
              </Link>
              <Link href={"/projects"}className="text-gray-700 hover:text-lochmara-500 transition-colors">
              Projects
              </Link>
              <ScrollLink
                to="process"
                smooth={true}
                duration={500}
                className="text-gray-700 hover:text-lochmara-500 cursor-pointer"
              >
                Process
              </ScrollLink>
              <ScrollLink
                to="services"
                smooth={true}
                duration={500}
                className="text-gray-700 hover:text-lochmara-500 cursor-pointer"
              >
                Services
              </ScrollLink>
              <ScrollLink
                to="guarentees"
                smooth={true}
                duration={500}
                className="text-gray-700 hover:text-lochmara-500 cursor-pointer"
              >
                Guarantees
              </ScrollLink>
              <a href="tel:50699724" className="text-gray-700 hover:text-lochmara-500">
                (+216) 50 699 724
              </a>
            </div>
          </motion.div>
        </motion.nav>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-oppacity-30 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </AnimatePresence>
    </Element>
  );
};

export default Navbar;