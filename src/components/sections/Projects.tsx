/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useTranslations } from "../../hooks/useTranslations";
import { FaArrowRight, FaDesktop, FaMobile, FaVideo, FaImage } from "react-icons/fa";

// Lazy load heavy animation components
const Marquee = dynamic(() => import("@/components/magicui/marquee").then(mod => ({ default: mod.Marquee })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg" />
});

const ScrollFloat = dynamic(() => import("../TextAnimations/ScrollFloat/ScrollFloat"), {
  ssr: false,
  loading: () => <div className="h-16 bg-gray-200 animate-pulse rounded-md mb-4" />
});

// Lightweight skeleton component
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

// Project interface
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

// Lightweight project card without heavy animations
const LightProjectCard = ({ 
  project, 
  index,
  locale
}: { 
  project: ProjectData; 
  index: number;
  locale: string;
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

  if (!project.hasValidImage) {
    return <SkeletonCard isLarge={project.aspectRatio !== 'square'} />;
  }

  return (
    <figure className={`relative cursor-pointer overflow-hidden ${getAspectClass()} rounded-xl mx-2 my-4 opacity-0 animate-fadeIn`} 
            style={{ animationDelay: `${index * 100}ms` }}>
      <Link href={`/${locale}/projects/${project.slug}`}>
        <div className="relative h-full w-full">
          <div className="relative h-full w-full overflow-hidden rounded-xl">
            <Image
              width={800}
              height={800}
              quality={90}
              src={project.src}
              alt={project.name}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              priority={index < 6}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
          </div>

          <div className="absolute inset-0 p-4 flex flex-col justify-between">
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

            <div className="text-white">
              <h3 className="text-lg md:text-xl font-semibold mb-1 line-clamp-2">
                {project.name}
              </h3>
              
              {project.client && (
                <p className="text-sm text-white/80 mb-2 opacity-70">
                  {project.client}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm font-medium">
                <span>View Project</span>
                <FaArrowRight className="text-xs" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </figure>
  );
};

export function Projects() {
  const { t, locale } = useTranslations();
  const isRTL = locale === 'ar';

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useHeavyAnimations, setUseHeavyAnimations] = useState(false);

  // Load heavy animations after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setUseHeavyAnimations(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simplified project fetching
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const query = `*[_type == "project"] | order(_createdAt desc)[0...15] {
          title,
          "slug": slug.current,
          categories,
          client->{name},
          featuredImage{
            asset->{_id, url, metadata}
          },
          content[0]{
            _type,
            _type == "videoBlock" => {
              "thumbnail": thumbnail.asset->{_id, url}
            },
            _type == "galleryBlock" => {
              images[0]{asset->{_id, url, metadata}}
            },
            _type == "uiBlock" => {
              screens[0]{asset->{_id, url, metadata}, device}
            },
            _type == "brandBlock" => {
              assets[0]{asset->{_id, url, metadata}}
            }
          }
        }`;
        
        const result = await client.fetch(query);
        
        const processedProjects: ProjectData[] = result.map((p: any) => {
          // Simplified processing logic
          let src = "";
          let hasValidImage = false;
          const aspectRatio: 'desktop' | 'mobile' | 'square' = 'square';
          const contentType: 'image' | 'video' | 'ui' | 'brand' = 'image';
          
          if (p.featuredImage?.asset) {
            try {
              src = urlFor(p.featuredImage.asset).width(600).height(600).url();
              hasValidImage = true;
            } catch {
              console.warn('Failed to process image for:', p.title);
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

  // Simple grid layout as fallback
  const SimpleProjectGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6">
      {projects.slice(0, 12).map((project, index) => (
        <LightProjectCard
          key={project.slug}
          project={project}
          index={index}
          locale={locale}
        />
      ))}
    </div>
  );

  return (
    <section className="w-full bg-white py-16 md:mx-auto 2xl:w-4/5 md:px-16 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto mb-12 px-6 md:px-0 relative">
        {useHeavyAnimations ? (
          <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse rounded-md mb-4" />}>
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
          </Suspense>
        ) : (
          <h2 className="text-3xl md:text-5xl md:text-center font-bold flex items-center justify-center">
            {t("Projects.title")}
          </h2>
        )}
        
        <p className={`text-center py-4 md:w-1/2 mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed ${isRTL ? 'text-center' : ''}`}>
          {t("Projects.subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6">
          {Array(8).fill(0).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-lochmara-500 hover:bg-lochmara-600 text-white px-6 py-3 rounded-full transition-colors duration-300 font-medium"
          >
            Try Again
          </button>
        </div>
      ) : useHeavyAnimations ? (
        <Suspense fallback={<SimpleProjectGrid />}>
          <div className="w-full h-[800px] flex items-center justify-center overflow-hidden py-8 relative">
            <Marquee vertical className="[--duration:80s]">
              {projects.slice(0, 5).map((project, index) => (
                <LightProjectCard key={`${project.slug}-1`} project={project} index={index} locale={locale} />
              ))}
            </Marquee>
            <Marquee vertical reverse className="[--duration:70s]">
              {projects.slice(5, 10).map((project, index) => (
                <LightProjectCard key={`${project.slug}-2`} project={project} index={index} locale={locale} />
              ))}
            </Marquee>
            <Marquee vertical className="[--duration:90s] hidden md:flex">
              {projects.slice(10, 15).map((project, index) => (
                <LightProjectCard key={`${project.slug}-3`} project={project} index={index} locale={locale} />
              ))}
            </Marquee>
          </div>
        </Suspense>
      ) : (
        <SimpleProjectGrid />
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/projects`}
            className="group inline-flex items-center gap-3 bg-lochmara-500 hover:bg-lochmara-600 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium"
          >
            <span>{t("Projects.viewAll")}</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      )}
    </section>
  );
}