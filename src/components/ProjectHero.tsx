'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { urlFor } from '@/sanity/lib/image';
import { Project } from '@/sanity/schemaTypes/ProjectType';
import { FaCalendarAlt, FaExternalLinkAlt, FaArrowRight, FaPlay } from 'react-icons/fa';
import { BoxReveal } from '@/components/magicui/box-reveal';

interface ProjectHeroProps {
  project: Project;
  locale: string;
  translations: {
    project: {
      resultsTitle: string;
      client: string;
      format: string;
      viewProject: string;
      liveProject: string;
      timeline: string;
    };
  };
}

const ProjectHero: React.FC<ProjectHeroProps> = ({ project, locale, translations }) => {
  const isRTL = locale === 'ar';
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : "en-US", 
      {
        year: "numeric",
        month: "short",
      }
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.section
      className="relative min-h-[85vh] flex items-center py-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content Side */}
          <motion.div 
            className={`${isRTL ? 'lg:order-2' : 'lg:order-1'} space-y-8`}
            variants={itemVariants}
          >
            {/* Categories */}
            <motion.div 
              className="flex flex-wrap gap-3"
              variants={itemVariants}
            >
              {project.categories?.map((category, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-lochmara-50/80 text-lochmara-700 rounded-full text-sm font-medium 
                           border border-lochmara-200/50 backdrop-blur-sm"
                >
                  {category}
                </span>
              ))}
            </motion.div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
                <BoxReveal boxColor={"#4083b7"} duration={0.5}>
                  <span className="text-gray-900 dark:text-white">
                    {project.title}
                  </span>
                </BoxReveal>
                <BoxReveal boxColor={"#4083b7"} duration={0.7}>
                  <span className="block text-lochmara-600 dark:text-lochmara-400">
                    {translations.project.resultsTitle}
                  </span>
                </BoxReveal>
              </h1>
            </div>

            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
              variants={itemVariants}
            >
              {project.description}
            </motion.p>

            {/* Client & Meta Info */}
            <motion.div 
              className="flex flex-wrap gap-6 items-center"
              variants={itemVariants}
            >
              {/* Client */}
              <div className="flex items-center gap-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm 
                            rounded-2xl p-4 border border-white/20 dark:border-gray-700/20 shadow-lg">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-lochmara-200 shadow-md">
                  {project.client?.logo?.asset?.url && (
                    <Image
                      src={urlFor(project.client.logo).url()}
                      alt={project.client?.name || "Client logo"}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {project.client?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {translations.project.client}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              {project.timeline && (
                <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm 
                              rounded-2xl p-4 border border-white/20 dark:border-gray-700/20 shadow-lg">
                  <FaCalendarAlt className="text-lochmara-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(project.timeline.start)} - {formatDate(project.timeline.end)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {translations.project.timeline}
                    </p>
                  </div>
                </div>
              )}

              {/* Format */}
              {project.format && (
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl px-4 py-3 
                              border border-white/20 dark:border-gray-700/20 shadow-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {translations.project.format}:{" "}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {project.format}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              {project.projectUrl && (
                <Link
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-lochmara-500 hover:bg-lochmara-600 
                           text-white px-6 py-3 rounded-full transition-all duration-300 
                           shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium"
                >
                  <span>{translations.project.viewProject}</span>
                  <FaExternalLinkAlt className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </Link>
              )}
              
              <button className="group inline-flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm 
                               text-gray-900 dark:text-white px-6 py-3 rounded-full border border-gray-200/30 
                               dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 
                               shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium">
                <FaPlay className="text-lochmara-600" />
                <span>Watch Demo</span>
                <FaArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
            </motion.div>
          </motion.div>

          {/* Featured Image Side */}
          <motion.div 
            className={`${isRTL ? 'lg:order-1' : 'lg:order-2'} relative`}
            variants={itemVariants}
          >
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/60 dark:bg-gray-800/60 
                            backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-2xl">
                {project.featuredImage?.asset?.url ? (
                  <Image
                    src={urlFor(project.featuredImage).url()}
                    alt={project.featuredImage.alt || project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-lochmara-100 dark:bg-lochmara-900 rounded-full 
                                    flex items-center justify-center">
                        <FaPlay className="text-lochmara-600 dark:text-lochmara-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Featured Image</p>
                    </div>
                  </div>
                )}
                
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
              </div>

              {/* Floating accent elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-lochmara-400 rounded-full shadow-lg opacity-80" />
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-lochmara-300 rounded-full shadow-lg opacity-60" />
              
              {/* Project stats overlay */}
              <motion.div 
                className="absolute -bottom-6 left-6 right-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm 
                         rounded-2xl p-6 shadow-xl border border-white/50 dark:border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-lochmara-600 dark:text-lochmara-400">
                      {project.content?.length || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Content Blocks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-lochmara-600 dark:text-lochmara-400">
                      {project.categories?.length || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Categories</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProjectHero;