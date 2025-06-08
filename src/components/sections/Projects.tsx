/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Marquee } from "@/components/magicui/marquee";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import ScrollFloat from "../TextAnimations/ScrollFloat/ScrollFloat";
import { client } from "@/sanity/lib/client";
import { useTranslations } from "../../hooks/useTranslations";

// Skeleton component for loading state
const SkeletonCard = () => (
  <div className="relative overflow-hidden group animate-pulse">
    <div className="bg-gray-200 aspect-square rounded-xl w-full" />
    <div className="absolute bottom-0 left-0 p-4 w-full">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
    </div>
  </div>
);

export function Projects() {
  const { t, locale } = useTranslations();
  const isRTL = locale === 'ar';

  const [projects, setProjects] = useState<{ src: string; name: string, slug: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from Sanity
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        // Optimized query for minimal data
        const query = `*[_type == "project"] | order(_createdAt desc)[0...15] {
          title,
          "slug": slug.current,
          "src": content[0]{
            _type,
            _type == "galleryBlock" => {images[0]{asset->{url}}},
            _type == "uiBlock" => {screens[0]{asset->{url}}},
            _type == "brandBlock" => {assets[0]{asset->{url}}}
          }.images.asset.url
        }`;
        
        const result = await client.fetch(query);
        

        setProjects(result.map((p: any) => ({
          src: p.src || "/images/fallback.jpg",
          name: p.title || "Project",
          slug: p.slug
        })));
      } catch (err) {
        setError("Failed to load projects");
        console.error("Project fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const ReviewCard = ({ src, name, onClick }: { 
    src: string; 
    name: string; 
    onClick: () => void 
  }) => (
    <motion.figure
      className="relative cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative">
        <Image
          width={500}
          height={500}
          quality={90} 
 
        
          src={src}
          alt={name}
          className="object-cover w-full"
          priority
        />
        <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
          <h3 className="text-white text-xl font-semibold">{name}</h3>
        </div>
      </div>
    </motion.figure>
  );

  // Create rows for marquee
  const firstRow = projects.slice(0, projects.length);
  const secondRow = projects.slice(3, projects.length);
  const thirdRow = projects.slice(6, projects.length);

  // Skeleton rows
  const skeletonRow = Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />);

  return (
    <section className="w-full bg-white py-16 md:mx-auto 2xl:w-4/5 md:px-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto mb-8 px-6 md:px-0">
        <ScrollFloat
          animationDuration={1}
          ease='back.inOut(2)'
          scrollStart='center bottom+=20%'
          scrollEnd='bottom bottom-=40%'
          stagger={0.03}
          textClassName="text-3xl md:text-5xl md:text-center font-medium"
          containerClassName="flex items-center justify-center"
        >
          {t("Projects.title")}
        </ScrollFloat>
        <p className={`text-center py-2 md:w-1/2 mx-auto text-xl md:text-2xl text-gray-500 ${isRTL ? 'text-center' : ''}`}>
          {t("Projects.subtitle")}
        </p>
      </div>

      <div className="w-full h-[800px] flex items-center justify-center overflow-hidden py-8">
        {isLoading ? (
          // Skeleton state
          <>
            <Marquee vertical className="[--duration:60s]">
              {skeletonRow}
            </Marquee>
            <Marquee vertical className="[--duration:60s]">
              {skeletonRow}
            </Marquee>
            <Marquee vertical className="[--duration:60s] hidden md:flex">
              {skeletonRow}
            </Marquee>
          </>
        ) : error ? (
          // Error state
          <div className="text-center py-16 text-red-500">
            {error} - <button 
              onClick={() => window.location.reload()}
              className="text-lochmara-500 underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          // Success state
          <>
            <Marquee
              vertical
              pauseOnHover
              className="[--duration:60s]"
              paused={selectedProject !== null}
            >
              {firstRow.map((project, index) => (
                <ReviewCard
                  key={index}
                  src={project.src}
                  name={project.name}
                  onClick={() => window.location.href = `/projects/${project.slug}`}
                />
              ))}
            </Marquee>
            <Marquee
              vertical
              pauseOnHover
              className="[--duration:60s]"
              paused={selectedProject !== null}
            >
              {secondRow.map((project, index) => (
                <ReviewCard
                  key={index}
                  src={project.src}
                  name={project.name}
                  onClick={() => window.location.href = `/projects/${project.slug}`}
                />
              ))}
            </Marquee>
            <Marquee
              vertical
              pauseOnHover
              className="[--duration:60s] hidden md:flex"
              paused={selectedProject !== null}
            >
              {thirdRow.map((project, index) => (
                <ReviewCard
                  key={index}
                  src={project.src}
                  name={project.name}
                  onClick={() => window.location.href = `/projects/${project.slug}`}
                />
              ))}
            </Marquee>
          </>
        )}
      </div>
    </section>
  );
}