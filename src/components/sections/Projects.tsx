'use client'

import { Marquee } from "@/components/magicui/marquee";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import ScrollFloat from "../TextAnimations/ScrollFloat/ScrollFloat";

const projects = [
    {
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
     
    },
    {
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
   
    },{
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
  
    },{
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
     
    },{
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
  
    },{
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
  
    },{
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",

    },
    {
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
     
    },
    {
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
     
    },
    {
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
     
    },
    {
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
     
    },
    {
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
     
    },
    {
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
     
    },
    {
      src: "/images/adidas.jpg",
      name: "Adidas",
      logo: "/images/adidas-logo.png",
      description: "Created Adidas back to school campaign",
     
    },
  ];
  

const firstRow = projects.slice(0, projects.length);
const secondRow = projects.slice(3, projects.length);
const thirdRow = projects.slice(6, projects.length);


const ReviewCard = ({
    src,
    name,
    description,
    onClick,
  }: {
    src: string;
    name: string;
    description: string;
    onClick: () => void;
  }) => {
    return (
      <motion.figure
        className="relative cursor-pointer overflow-hidden group"
        onClick={onClick}
      >
        <div className="relative">
          <Image
            width={500}
            height={500}
            src={src}
            alt="projects"
            className="object-cover w-full"
          />
          <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
            <h3 className="text-white text-xl font-semibold">{name}</h3>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
        </div>
      </motion.figure>
    );
  };



const ProjectDetails = ({
    project,
    onClose,
  }: {
    project: (typeof projects)[0];
    onClose: () => void;
  }) => {
    return (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full  md:w-2/5 bg-white shadow-lg p-6 z-50 cursor-pointer"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
  
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
          <Image
            src={project.src}
            alt={project.name}
            width={500}
            height={300}
            className="w-full rounded-lg mb-6 object-cover h-60"
          />
          <p className="text-gray-600 mb-4">{project.description}</p>
  
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Project Details</h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                Web Design
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                Branding
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                UI/UX
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };


  export function Projects() {
    const [selectedProject, setSelectedProject] = useState<
      (typeof projects)[0] | null
    >(null);
  
    return (
      <section className="w-full bg-white py-16 md:mx-auto 2xl:w-4/5 md:px-16">
        <div className="mx-auto mb-8 px-6 md:px-0">
           <ScrollFloat
  animationDuration={1}
  ease='back.inOut(2)'
  scrollStart='center bottom+=20%'
  scrollEnd='bottom bottom-=40%'
  stagger={0.03}
  textClassName="text-3xl md:text-5xl md:text-center font-medium"
  containerClassName="flex  items-center justify-center"
>
Strategic Campaign Showcase
</ScrollFloat>
                 <p className="text-center py-2 md:w-1/2 mx-auto text-xl md:text-2xl text-gray-500 ">
                 Explore data-driven campaigns where precision targeting met creative execution to boost client revenue by 150%+.
                 </p>
        </div>
  
        <div className="w-full h-[800px] flex items-center justify-center overflow-hidden py-8">
          <Marquee
            vertical
            pauseOnHover
            className="[--duration:60s]"
            paused={selectedProject !== null}
          >
            {firstRow.map((review, index) => (
              <ReviewCard
                key={index}
                {...review}
                onClick={() => setSelectedProject(review)}
              />
            ))}
          </Marquee>
          <Marquee
            vertical
            pauseOnHover
            className="[--duration:60s]"
            paused={selectedProject !== null}
          >
            {secondRow.map((review, index) => (
              <ReviewCard
                key={index}
                {...review}
                onClick={() => setSelectedProject(review)}
              />
            ))}
          </Marquee>
          <Marquee
            vertical
            pauseOnHover
            className="[--duration:60s] hidden md:flex"
            paused={selectedProject !== null}
          >
            {thirdRow.map((review, index) => (
              <ReviewCard
                key={index}
                {...review}
                onClick={() => setSelectedProject(review)}
              />
            ))}
          </Marquee>
        </div>
  
        <AnimatePresence>
          {selectedProject && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setSelectedProject(null)}
              />
              <ProjectDetails
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            </>
          )}
        </AnimatePresence>
      </section>
    );
  }
  