"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type TabId = "projects" | "clients";
type CategoryId =
  | "all"
  | "branding"
  | "uxui"
  | "development"
  | "strategy"
  | "marketing"
  | "VideoEditing"
  | "analytics";

interface TabCounts {
  projects: number;
  clients: number;
}

interface CategoryCount {
  projects: number;
  clients: number;
}

interface CategoryCounts {
  [key: string]: CategoryCount;
}

interface Project {
  id: number;
  name: string;
  video: string;
  title: string;
  description: string;
  category: CategoryId;
  size: string;
  imageHeight: string;
}

interface Client {
  id: number;
  name: string;
  image: string;
  description: string;
  category: CategoryId;
}

const ProjectHero = () => {
  const [activeTab, setActiveTab] = useState<TabId>("projects");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const clients: Client[] = [
    {
      id: 1,
      name: "House Protein",
      image: "HouseProtein.png",
      description:
        "House Protein is a sports nutrition store in Bizerte, Tunisia, offering a wide range of supplements, proteins, amino acids, and energy products to enhance performance and help you reach your fitness goals.",
      category: "branding",
    },
    {
      id: 2,
      name: "Houssem Consulting",
      image: "logo_Houssem.jpeg",
      description:
        "Houssem Consulting is a startup specializing in product management with Mitutoyo, a leading brand in precision measurement, and offering innovative solutions across the industrial sector in North Africa.",
      category: "development",
    },
    {
      id: 3,
      name: "Rayen el Maamoun",
      image: "logo_Rayen.png",
      description:
        "Rayen El Maamoun is a talented filmmaker and video editor with over 20,000 followers. He specializes in crafting visually stunning films, bringing a creative touch to every project. With a keen eye for detail and storytelling, Rayen has established himself as a skilled professional in the filmmaking industry.",
      category: "development",
    }, {
      id: 4,
      name: "HFD_FX",
      image: "HFD_FX.jpeg",
      description:
        "HFD_FX is a content creator on Instagram and TikTok, dedicated to making e-commerce easier and more accessible by sharing the best tips, tools, and strategies for success.",
      category: "VideoEditing",
    },


  ];

  const projects: Project[] = [
    // {
    //   id: 1,
    //   name: "Sony",
    //   video:
    //     "https://videos.pexels.com/video-files/6572598/6572598-hd_1920_1080_25fps.mp4",
    //   title: "Innovating the future of entertainment",
    //   description:
    //     "Partnered with sony to introduce a new line of cameras, focusing on user experience and accessibility. And shot this promo video.",
    //   category: "branding",
    //   size: "col-span-12 md:col-span-4 row-span-1",
    //   imageHeight: "h-80",
    // },
    // {
    //   id: 2,
    //   name: "Adidas",
    //   video:
    //     "https://videos.pexels.com/video-files/4126123/4126123-uhd_2732_1440_25fps.mp4",
    //   title: "Innovation meets sustainability",
    //   description:
    //     "Until now, Qwant has been the search engine that knows nothing about you—and that hasn't changed. But there are some new developments.",
    //   category: "development",
    //   size: " col-span-12 md:col-span-4",
    //   imageHeight: "h-48",
    // },
    // {
    //   id: 3,
    //   name: "Tokyo Roast",
    //   video:
    //     "https://videos.pexels.com/video-files/2909914/2909914-uhd_2732_1440_24fps.mp4",
    //   title: "Craftsmanship in every cup",
    //   description:
    //     "Primary designs innovative, patient-centered medical offices. We crafted a brand for them that is as warm as it is modern, seamlessly bridging the gap between in-person and digital experiences.",
    //   category: "uxui",
    //   size: "col-span-12 md:col-span-4",
    //   imageHeight: "h-48",
    // },
    // {
    //   id: 4,
    //   name: "Spotify",
    //   video:
    //     "https://videos.pexels.com/video-files/5077471/5077471-uhd_1440_2732_25fps.mp4",
    //   title: "Music streaming reimagined",
    //   description:
    //     "Spotify is a leading music streaming service, with a focus on user experience and data analytics. We collaborated with Spotify to develop a new brand identity and marketing strategy.",
    //   category: "strategy",
    //   size: "col-span-12 row-span-2",
    //   imageHeight: "h-[600px]",
    // },
    // {
    //   id: 5,
    //   name: "Ecomworld",
    //   video:
    //     "https://videos.pexels.com/video-files/5585939/5585939-hd_1920_1080_25fps.mp4",
    //   title: "All-in-one ecommerce platform",
    //   description:
    //     "Ecomworld is an all in one platform for ecommerce businesses to set up their own storefronts. We build out the back-end technology to make it extremely scalable.",
    //   category: "branding",
    //   size: "col-span-12 md:col-span-6 row-span-1",
    //   imageHeight: "h-80",
    // },
    // {
    //   id: 6,
    //   name: "Toyota",
    //   video:
    //     "https://videos.pexels.com/video-files/4419251/4419251-hd_1920_1080_25fps.mp4",
    //   title: "Driving innovation forward",
    //   description:
    //     "Toyota is a global leader in the automotive industry, with a focus on innovation and sustainability. We worked with Toyota to develop a new digital platform for their e-commerce business.",
    //   category: "uxui",
    //   size: "col-span-12 md:col-span-6 row-span-1",
    //   imageHeight: "h-80",
    // },
    // {
    //   id: 7,
    //   name: "Visa",
    //   video:
    //     "https://videos.pexels.com/video-files/3945147/3945147-uhd_2732_1440_25fps.mp4",
    //   title: "Digital wallet experience",
    //   description:
    //     "Partnered with Visa to design a new digital wallet experience, focusing on user-centered design and accessibility.",
    //   category: "strategy",
    //   size: "col-span-12 md:col-span-3 row-span-1",
    //   imageHeight: "h-44",
    // },
    // {
    //   id: 8,
    //   name: "Tesla",
    //   video:
    //     "https://videos.pexels.com/video-files/27421705/12140050_2730_1440_30fps.mp4",
    //   title: "Automating the future",
    //   description:
    //     "Collaborated on enhancing Tesla's data analytics dashboard, providing deeper insights into user listening patterns and preferences.",
    //   category: "analytics",
    //   size: "col-span-12 md:col-span-3 row-span-1",
    //   imageHeight: "h-44",
    // },
    // {
    //   id: 9,
    //   name: "Nike",
    //   video:
    //     "https://videos.pexels.com/video-files/8533114/8533114-uhd_2560_1440_25fps.mp4",
    //   title: "Steps Towards Sustainability",
    //   description:
    //     "Developing a marketing campaign that brings Nike's commitment to sustainability to the forefront of their brand narrative.",
    //   category: "marketing",
    //   size: "col-span-12 md:col-span-6 row-span-2",
    //   imageHeight: "h-96",
    // },
  ];

  const { tabCounts, categoryCounts } = useMemo(() => {
    const projectCount = projects.length;
    const clientCount = clients.length;

    const categoryCount: CategoryCounts = {
      all: { projects: projectCount, clients: clientCount },
      branding: {
        projects: projects.filter((p) => p.category === "branding").length,
        clients: clients.filter((c) => c.category === "branding").length,
      },
      uxui: {
        projects: projects.filter((p) => p.category === "uxui").length,
        clients: clients.filter((c) => c.category === "uxui").length,
      },
      development: {
        projects: projects.filter((p) => p.category === "development").length,
        clients: clients.filter((c) => c.category === "development").length,
      },
      strategy: {
        projects: projects.filter((p) => p.category === "strategy").length,
        clients: clients.filter((c) => c.category === "strategy").length,
      },
      marketing: {
        projects: projects.filter((p) => p.category === "marketing").length,
        clients: clients.filter((c) => c.category === "marketing").length,
      },
      VideoEditing: {
        projects: projects.filter((p) => p.category === "VideoEditing").length,
        clients: clients.filter((c) => c.category === "VideoEditing").length,
      },
      analytics: {
        projects: projects.filter((p) => p.category === "analytics").length,
        clients: clients.filter((c) => c.category === "analytics").length,
      },
    };

    return {
      tabCounts: {
        projects: projectCount,
        clients: clientCount,
      } as TabCounts,
      categoryCounts: categoryCount,
    };
  }, []);

  const tabs = [
    { id: "projects" as const, name: "Projects", count: tabCounts.projects },
    { id: "clients" as const, name: "Clients", count: tabCounts.clients },
  ];

  const categories = [
    { id: "all" as const, name: "All", count: categoryCounts.all[activeTab] },
    {
      id: "branding" as const,
      name: "Branding",
      count: categoryCounts.branding[activeTab],
    },
    {
      id: "uxui" as const,
      name: "UX/UI",
      count: categoryCounts.uxui[activeTab],
    },
    {
      id: "development" as const,
      name: "Development",
      count: categoryCounts.development[activeTab],
    },
    {
      id: "strategy" as const,
      name: "Strategy",
      count: categoryCounts.strategy[activeTab],
    },
    {
      id: "marketing" as const,
      name: "Marketing",
      count: categoryCounts.marketing[activeTab],
    },
    {
      id: "VideoEditing" as const,
      name: "VideoEditing",
      count: categoryCounts.VideoEditing[activeTab],
    },
    {
      id: "analytics" as const,
      name: "Analytics",
      count: categoryCounts.analytics[activeTab],
    },
  ];

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
                .filter(
                  (client) =>
                    activeCategory === "all" ||
                    client.category === activeCategory
                )
                .map((client) => (
                  <motion.div
                    layout
                    key={client.id}
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
                        src={`/${client.image}`}
                        alt={client.name}
                        className="object-contain w-full h-full  "
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{client.name}</h3>
                    <p className="text-[#7b7b7b] leading-relaxed">
                      {client.description}
                    </p>
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
                .filter(
                  (project) =>
                    activeCategory === "all" ||
                    project.category === activeCategory
                )
                .map((project) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${project.size}`}
                  >
                    <div className={`relative ${project.imageHeight} mb-4 `}>
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      >
                        <source src={project.video} type="video/mp4" />
                      </video>
                    </div>
                    <h3 className="text-sm font-bold mb-2 text-gray-600">
                      / {project.name}
                    </h3>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-600">{project.description}</p>
                  </motion.div>
                ))}
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
        {categories.map((category) => (
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