/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Marquee } from "@/components/magicui/marquee";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";
import ScrollFloat from "../TextAnimations/ScrollFloat/ScrollFloat";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useTranslations } from "../../hooks/useTranslations";
import { FaArrowRight, FaDesktop, FaMobile, FaVideo, FaImage } from "react-icons/fa";

// Enhanced skeleton component with shimmer effect
const SkeletonCard = ({ isLarge = false }: { isLarge?: boolean }) => (
  <div className={`relative overflow-hidden group ${isLarge ? 'aspect-[3/4]' : 'aspect-square'} rounded-xl mx-2 my-4`}>
    <div className="bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 w-full h-full relative animate-pulse">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
    </div>
    <div className="absolute bottom-0 left-0 p-4 w-full">
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    </div>
  </div>
);

// Enhanced project interface
interface ProjectData {
  src: string;
  name: string;
  slug: string;
  aspectRatio: 'desktop' | 'mobile' | 'square';
  category?: string;
  client?: string;
  contentType: 'image' | 'video' | 'ui' | 'brand';
  hasValidImage: boolean;
}

export function Projects() {
  const { t, locale } = useTranslations();
  const isRTL = locale === 'ar';

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced project fetching with better content detection and proper Sanity image URLs
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const query = `*[_type == "project"] | order(_createdAt desc)[0...20] {
          title,
          "slug": slug.current,
          categories,
          client->{name},
          featuredImage{
            asset->{
              _id,
              url,
              metadata
            }
          },
          content[]{
            _type,
            _type == "videoBlock" => {
              url,
              orientation,
              "thumbnail": thumbnail.asset->{_id, url}
            },
            _type == "galleryBlock" => {
              images[0]{
                asset->{_id, url, metadata}
              }
            },
            _type == "uiBlock" => {
              screens[0]{
                asset->{_id, url, metadata},
                device
              }
            },
            _type == "brandBlock" => {
              assets[0]{
                asset->{_id, url, metadata}
              }
            }
          }
        }`;
        
        const result = await client.fetch(query);
        
        const processedProjects: ProjectData[] = result.map((p: any) => {
          const content = p.content?.[0];
          let src = "";
          let hasValidImage = false;
          let aspectRatio: 'desktop' | 'mobile' | 'square' = 'square';
          let contentType: 'image' | 'video' | 'ui' | 'brand' = 'image';
          
          // First try to use featuredImage
          if (p.featuredImage?.asset) {
            try {
              src = urlFor(p.featuredImage.asset).width(800).height(800).url();
              hasValidImage = true;
              const metadata = p.featuredImage.asset.metadata;
              if (metadata?.dimensions) {
                const ratio = metadata.dimensions.width / metadata.dimensions.height;
                aspectRatio = ratio > 1.2 ? 'desktop' : ratio < 0.8 ? 'mobile' : 'square';
              }
            } catch  {
              console.warn('Failed to process featuredImage for project:', p.title);
            }
          }
          
          // If no featuredImage, try content blocks
          if (!hasValidImage && content) {
            contentType = content._type?.replace('Block', '') || 'image';
            
            try {
              switch (content._type) {
                case "videoBlock":
                  if (content.thumbnail?.asset) {
                    src = urlFor(content.thumbnail.asset).width(800).height(600).url();
                    hasValidImage = true;
                  }
                  aspectRatio = content.orientation === "vertical" ? 'mobile' : 'desktop';
                  break;
                case "uiBlock":
                  if (content.screens?.[0]?.asset) {
                    src = urlFor(content.screens[0].asset).width(800).height(800).url();
                    hasValidImage = true;
                    aspectRatio = content.screens[0].device === "mobile" ? 'mobile' : 'desktop';
                  }
                  break;
                case "galleryBlock":
                case "brandBlock":
                  const asset = content.images?.[0]?.asset || content.assets?.[0]?.asset;
                  if (asset) {
                    src = urlFor(asset).width(800).height(800).url();
                    hasValidImage = true;
                    const metadata = asset.metadata;
                    if (metadata?.dimensions) {
                      const ratio = metadata.dimensions.width / metadata.dimensions.height;
                      aspectRatio = ratio > 1.2 ? 'desktop' : ratio < 0.8 ? 'mobile' : 'square';
                    }
                  }
                  break;
              }
            } catch  {
              console.warn('Failed to process content image for project:', p.title);
            }
          }
          
          return {
            src,
            name: p.title || "Project",
            slug: p.slug,
            aspectRatio,
            category: p.categories?.[0],
            client: p.client?.name,
            contentType,
            hasValidImage
          };
        });

        setProjects(processedProjects);
      } catch (err) {
        setError("Failed to load projects");
        console.error("Project fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Enhanced project card with better animations and aspect ratio handling
  const ProjectCard = ({ 
    project, 
    index 
  }: { 
    project: ProjectData; 
    index: number;
  }) => {
    
    const getAspectClass = () => {
      switch (project.aspectRatio) {
        case 'mobile': return 'aspect-[9/16]';
        case 'desktop': return 'aspect-[16/10]';
        default: return 'aspect-square';
      }
    };

    const getContentIcon = () => {
      switch (project.contentType) {
        case 'video': return <FaVideo className="text-red-500" />;
        case 'ui': return project.aspectRatio === 'mobile' ? <FaMobile className="text-blue-500" /> : <FaDesktop className="text-blue-500" />;
        case 'brand': return <FaImage className="text-purple-500" />;
        default: return <FaImage className="text-gray-500" />;
      }
    };

    // If no valid image, show skeleton
    if (!project.hasValidImage) {
      return <SkeletonCard isLarge={project.aspectRatio !== 'square'} />;
    }

    return (
      <motion.figure
        className={`relative cursor-pointer overflow-hidden ${getAspectClass()} rounded-xl mx-2 my-4`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Link href={`/${locale}/projects/${project.slug}`}>
          <div className="relative h-full w-full">
            {/* Image */}
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image
                width={800}
                height={800}
                quality={90}
                src={project.src}
                alt={project.name}
                className="object-cover w-full h-full"
                priority={index < 6}
                onError={(e) => {
                  console.warn('Image failed to load:', project.src);
                  // Hide the image container if it fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              {/* Top content - Category and type icon */}
              <div className="flex items-center justify-between">
                {project.category && (
                  <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    {project.category}
                  </span>
                )}
                <div className="text-white/80">
                  {getContentIcon()}
                </div>
              </div>

              {/* Bottom content - Title and client */}
              <div className="text-white">
                <h3 className="text-lg md:text-xl font-semibold mb-1 line-clamp-2">
                  {project.name}
                </h3>
                
                {project.client && (
                  <p className="text-sm text-white/80 mb-2 opacity-70">
                    {project.client}
                  </p>
                )}

                {/* View project button */}
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>View Project</span>
                  <FaArrowRight className="text-xs" />
                </div>
              </div>
            </div>

            {/* Border effect */}
            <div className="absolute inset-0 border-2 border-lochmara-500 rounded-xl opacity-0" />
          </div>
        </Link>
      </motion.figure>
    );
  };

  // Create rows for marquee with mixed aspect ratios
  const createMarqueeRows = () => {
    const shuffled = [...projects].sort(() => 0.5 - Math.random());
    const firstRow = shuffled.slice(0, Math.ceil(shuffled.length / 3));
    const secondRow = shuffled.slice(Math.ceil(shuffled.length / 3), Math.ceil(shuffled.length * 2 / 3));
    const thirdRow = shuffled.slice(Math.ceil(shuffled.length * 2 / 3));
    
    return { firstRow, secondRow, thirdRow };
  };

  const { firstRow, secondRow, thirdRow } = createMarqueeRows();

  // Enhanced skeleton rows
  const skeletonRow = Array(6).fill(0).map((_, i) => (
    <SkeletonCard key={i} isLarge={i % 3 === 0} />
  ));

  return (
    <section className="w-full bg-white py-16 md:mx-auto 2xl:w-4/5 md:px-16 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lochmara-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="mx-auto mb-12 px-6 md:px-0 relative">
        <ScrollFloat
          animationDuration={1}
          ease='back.inOut(2)'
          scrollStart='center bottom+=20%'
          scrollEnd='bottom bottom-=40%'
          stagger={0.03}
          textClassName="text-3xl md:text-5xl md:text-center font-bold"
          containerClassName="flex items-center justify-center"
        >
          {t("Projects.title")}
        </ScrollFloat>
        <motion.p 
          className={`text-center py-4 md:w-1/2 mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed ${isRTL ? 'text-center' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {t("Projects.subtitle")}
        </motion.p>
      </div>

      <div className="w-full h-[800px] flex items-center justify-center overflow-hidden py-8 relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              className="flex w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Marquee vertical className="[--duration:80s]">
                {skeletonRow}
              </Marquee>
              <Marquee vertical className="[--duration:70s]" reverse>
                {skeletonRow}
              </Marquee>
              <Marquee vertical className="[--duration:90s] hidden md:flex">
                {skeletonRow}
              </Marquee>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <p className="text-red-500 mb-4 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-lochmara-500 hover:bg-lochmara-600 text-white px-6 py-3 rounded-full transition-colors duration-300 font-medium"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              className="flex w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Marquee
                vertical
                pauseOnHover
                className="[--duration:80s]"
              >
                {firstRow.map((project, index) => (
                  <ProjectCard
                    key={`${project.slug}-1`}
                    project={project}
                    index={index}
                  />
                ))}
              </Marquee>
              <Marquee
                vertical
                pauseOnHover
                reverse
                className="[--duration:70s]"
              >
                {secondRow.map((project, index) => (
                  <ProjectCard
                    key={`${project.slug}-2`}
                    project={project}
                    index={index}
                  />
                ))}
              </Marquee>
              <Marquee
                vertical
                pauseOnHover
                className="[--duration:90s] hidden md:flex"
              >
                {thirdRow.map((project, index) => (
                  <ProjectCard
                    key={`${project.slug}-3`}
                    project={project}
                    index={index}
                  />
                ))}
              </Marquee>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View all projects CTA */}
      {!isLoading && !error && projects.length > 0 && (
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            href={`/${locale}/projects`}
            className="group inline-flex items-center gap-3 bg-lochmara-500 hover:bg-lochmara-600 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium"
          >
            <span>{t("Projects.viewAll")}</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      )}
    </section>
  );
}