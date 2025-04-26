'use client'

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";
import {
  PiArrowArcLeft,
  PiArrowArcRight,
  PiGlobe,
  PiLinkedinLogo,
  PiTwitterLogo,
} from "react-icons/pi";


interface Social {
    linkedin: string;
    twitter: string;
    website?: string;
  }



interface Founder {
    name: string;
    role: string;
    image: string;
    description: string;
    social: Social;
  }


const founders: Founder[] = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      image: "/images/image-1.jpg",
      description:
        "Leading our vision with over a decade of experience in AI and business strategy",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        website: "https://website.com",
      },
    },
    {
      name: "Jamie Lee",
      role: "CTO",
      image: "/images/image-2.jpg",
      description:
        "Expert in AI technologies, driving innovation and technical excellence across our projects",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        website: "https://website.com",
      },
    },
    {
      name: "Morgan Smith",
      role: "Marketing Director",
      image: "/images/image-3.jpg",
      description:
        "Crafting impactful marketing strategies that resonate with our clients and their audiences",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    {
      name: "Taylor Brown",
      role: "Lead Developer",
      image: "/images/image-4.jpg",
      description:
        "Creating innovative solutions with our expert development team",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    {
      name: "Chris White",
      role: "Head of Design",
      image: "/images/image-4.jpg",
      description:
        "Driving creative direction and design excellence across all our projects",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    {
      name: "Emily Green",
      role: "Product Manager",
      image: "/images/image-5.jpg",
      description:
        "Leading product development and strategy with a focus on user experience",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    {
      name: "Ethan Black",
      role: "Data Scientist",
      image: "/images/image-6.jpg",
      description:
        "Applying advanced data science techniques to drive insights and innovation",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    {
      name: "Ava Brown",
      role: "Customer Success",
      image: "/images/image-7.jpg",
      description:
        "Ensuring our clients receive the best possible service and support",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    {
      name: "Noah White",
      role: "Business Development",
      image: "/images/image-1.jpg",
      description:
        "Building relationships and driving growth through strategic partnerships",
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
  ];





const Founders = () => {

    const [startIndex, setStartIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);
    const [isMobile, setIsMobile] = useState(false);


    const container = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0,
          },
        },
        exit: {
          opacity: 0,
          transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
            duration: 0.2,
          },
        },
      };
    
      const item = {
        hidden: {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            duration: 0.5,
            bounce: 0.4,
          },
        },
        exit: {
          opacity: 0,
          y: -20,
          scale: 0.95,
          transition: {
            duration: 0.3,
          },
        },
      };

      



    useEffect(() => {
        const handleResize = () => {
          const mobile = window.innerWidth < 768;
          setIsMobile(mobile);
          setItemsToShow(mobile ? 2 : 4);
          setStartIndex((prev) => {
            const maxStart = founders.length - (mobile ? 2 : 4);
            return prev > maxStart ? maxStart : prev;
          });
        };
    
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, [founders.length]);


      const next = () => {
        setStartIndex((prev) => {
          const nextIndex = prev + 1;
          const maxStart = founders.length - itemsToShow;
          return nextIndex > maxStart ? 0 : nextIndex;
        });
      };
    
      const prev = () => {
        setStartIndex((prev) => {
          const nextIndex = prev - 1;
          return nextIndex < 0 ? founders.length - itemsToShow : nextIndex;
        });
      };
    
      type PanInfo = {
        offset: {
          x: number;
          y: number;
        };
        velocity: {
          x: number;
        };
      };

      const handleDragEnd = (_event: never, info: PanInfo) => {
        const swipeThreshold = 50;
        if (
          info.offset.x < -swipeThreshold &&
          startIndex < founders.length - itemsToShow
        ) {
          next();
        } else if (info.offset.x > swipeThreshold && startIndex > 0) {
          prev();
        }
      };
    
      const visibleFounders = founders.slice(startIndex, startIndex + itemsToShow);

      


    return ( 
        <div
        className="px-6 
      mx-auto 2xl:w-4/5 md:px-16
      
      py-16 md:py-32"
      >
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Trusted by 400+ Business Owners
            </h2>
            <p className="text-gray-600">
              Meet the passionate experts driving our AI solutions.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <motion.button onClick={prev}>
              <PiArrowArcLeft className="text-black border rounded-full flex items-center justify-center text-5xl p-3 hover:bg-black/10 transition-colors" />
            </motion.button>
            <motion.button onClick={next}>
              <PiArrowArcRight className="text-black border rounded-full flex items-center justify-center text-5xl p-3 hover:bg-black/10 transition-colors" />
            </motion.button>
          </div>
        </div>
  
        <div className="relative max-w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
              key={startIndex}
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
              drag={isMobile ? "x" : false}
              dragSnapToOrigin
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              style={{
                touchAction: "none",
                x: 0,
              }}
            >
              {visibleFounders.map((founder, index) => (
                <motion.div
                  key={`${founder.name}-${index}`}
                  variants={item}
                  className="md:mb-0 mb-8"
                >
                  <div className="bg-gray-100 aspect-square mb-4 overflow-hidden">
                    <Image
                      priority
                      width={500}
                      height={500}
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{founder.name}</h3>
                  <p className="text-[#7b7b7b] text-sm mb-2">{founder.role}</p>
                  <p className="text-gray-700 text-sm mb-4">
                    {founder.description}
                  </p>
                  <div className="flex gap-4">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <PiLinkedinLogo className="w-5 h-5 text-[#7b7b7b] hover:text-gray-900 cursor-pointer" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <PiTwitterLogo className="w-5 h-5 text-[#7b7b7b] hover:text-gray-900 cursor-pointer" />
                    </motion.div>
                    {founder.social.website && (
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <PiGlobe className="w-5 h-5 text-[#7b7b7b] hover:text-gray-900 cursor-pointer" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    
);
}
 
export default Founders;