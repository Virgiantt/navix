"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useData } from "@/components/context/DataContext";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Project, SanityImage } from "@/sanity/schemaTypes/ProjectType";

type TabId = "projects" | "clients";


interface CategoryCount {
  projects: number;
  clients: number;
}

interface CategoryCounts {
  [key: string]: CategoryCount;
}



// interface Client {
//   id: number;
//   name: string;
//   image: string;
//   description: string;
//   category: string;
// }

const ProjectHero = () => {
  const [activeTab, setActiveTab] = useState<TabId>("projects");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { categories,clients, projects } = useData();

  const getFirstImage = (project: Project): SanityImage | null => {
    for (const block of project.content) {
      if (block._type === "galleryBlock" && block.images.length > 0) {
        return block.images[0];
      }
      if (block._type === "uiBlock" && block.screens.length > 0) {
        return block.screens[0];
      }
      if (block._type === "brandBlock" && block.assets.length > 0) {
        return block.assets[0];
      }
    }
    return null;
  };
  const layoutPattern = [
    { size: "col-span-12 md:col-span-4 row-span-1", imageHeight: "h-80" },
    { size: "col-span-12 md:col-span-4", imageHeight: "h-48" },
    { size: "col-span-12 md:col-span-4", imageHeight: "h-48" },
    { size: "col-span-12 row-span-2", imageHeight: "h-[600px]" },
    { size: "col-span-12 md:col-span-6 row-span-1", imageHeight: "h-80" },
    { size: "col-span-12 md:col-span-6 row-span-1", imageHeight: "h-80" },
    { size: "col-span-12 md:col-span-3 row-span-1", imageHeight: "h-44" },
    { size: "col-span-12 md:col-span-3 row-span-1", imageHeight: "h-44" },
    { size: "col-span-12 md:col-span-6 row-span-2", imageHeight: "h-96" },
  ];
  

  const { tabCounts, categoryCounts } = useMemo(() => {
    const projectCount = projects.length;
    const clientCount = clients.length;
    const categoryCount: CategoryCounts = {
      all: { projects: projectCount, clients: clientCount },
    };
    categories.forEach(category => {
      categoryCount[category.title] = {
        projects: projects.filter(p => 
          p.categories.includes(category.title.toLowerCase() as typeof p.categories[number])
        ).length,
        clients: clients.filter(c => 
          c.category.toLowerCase() === category.title.toLowerCase()
        ).length,
      };
    });
    return {
      tabCounts: {
        projects: projectCount,
        clients: clientCount,
      },
      categoryCounts: categoryCount,
    };
  }, [categories, clients, projects]);

  const tabs = [
    { id: "projects" as const, name: "Projects", count: tabCounts.projects },
    { id: "clients" as const, name: "Clients", count: tabCounts.clients },
  ];

  const filterCategories = useMemo(() => [
    { id: "all", name: "All", count: categoryCounts.all[activeTab] },
    ...categories.map(category => ({
      id: category.title,
      name: category.title,
      count: categoryCounts[category.title]?.[activeTab] || 0
    })),
  ], [categories, categoryCounts, activeTab]);

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        {activeTab === "clients" ? (
          <motion.div
            layout
            key="clients"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12  gap-10 "
          >
            <AnimatePresence>
            {clients
    .filter(client => 
      activeCategory === "all" || 
      client.category.toLowerCase() === activeCategory.toLowerCase()
    )
                .map((client) => (
                  <motion.div
                    layout
                    key={client._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="col-span-4 mb-12
                    md:mb-0
                    border p-4 "
                  >
                    <div className="relative h-32 mb-6">
                      <Image
                        priority
                        height={100}
                        width={100}
                        src={urlFor(client.logo).url()}
            alt={client.name || client.name}
                        className="object-contain w-full h-full  "
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{client.name}</h3>
                    <p className="text-[#7b7b7b] leading-relaxed">
                      {client.description}
                    </p>
                    <div className="mt-4">
                      <Link
                        href={client.website || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Visit Website
                      </Link> 
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            layout
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-10"
          >
            <AnimatePresence>
            {projects
                .filter(project => 
                  activeCategory === "all" || 
                
                  project.categories.includes(activeCategory.toLowerCase() as typeof project.categories[number])
                )
                .map((project, index) => {
                  const layout = layoutPattern[index % layoutPattern.length];
                  const firstImage = getFirstImage(project);
                  console.log(project.categories, activeCategory)
                  return (
                    <motion.div
                      layout
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`${layout.size}`}
                    >
                      <div className={`relative ${layout.imageHeight} mb-4`}>
                        {firstImage ? (
                          <Image
                            src={urlFor(firstImage).url()}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-bold mb-2 text-gray-600">
                        / {project.client.name}
                      </h3>
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 line-clamp-3">
                        {project.description}
                      </p>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div
      className="
    md:mx-auto   
     2xl:w-4/5 md:px-16

    
    px-6 py-40 "
    >
      {/* Main Navigation */}
      <div className="flex flex-wrap gap-8 mb-12 items-center">
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.id}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`text-2xl md:text-4xl font-bold ${
                activeTab === tab.id
                  ? "border-b-2 border-black"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
              <span className="text-sm ml-1 align-super">{tab.count}</span>
            </motion.button>
            {index < tabs.length - 1 && (
              <div className=" p-2 rounded-full bg-lochmara-500 h-4 w-4 items-center flex justify-center"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-6 mb-12">
      {filterCategories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 ${
              activeCategory === category.id ? "font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
            <span className="text-xs ml-1 align-super text-gray-400">
              {category.count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default ProjectHero;