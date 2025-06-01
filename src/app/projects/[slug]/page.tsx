/* eslint-disable @typescript-eslint/no-explicit-any */
// app/projects/[slug]/page.tsx
import { BoxReveal } from "@/components/magicui/box-reveal";
import MainLayout from "@/components/main-layout";
import { fetchProjectBySlug } from "@/services/projectService";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaCalendarAlt, FaExternalLinkAlt, FaHome, FaImage } from "react-icons/fa";
import { FaChartLine, FaMobile, FaBrush, FaVideo } from "react-icons/fa";
import Link from "next/link";
import InstagramEmbed from "@/components/InstagramEmbed";

import AIRecommendations from "@/components/AIRecommendations";


interface Params {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    return notFound();
  }


  const formatDate = (dateString?: string) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Render different content blocks
  const renderContentBlock = (block: any) => {
    switch (block._type) {
    // app/projects/[slug]/page.tsx
case "videoBlock":
  // Try to detect if it's an Instagram URL
  if (block.url.includes('instagram.com')) {
    return (
      <div key={block._key} className="my-16 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FaVideo className="text-lochmara-500 text-xl" />
        <h2 className="text-2xl font-bold">Video Showcase</h2>
      </div>
      <InstagramEmbed url={block.url} />
      {block.caption && (
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-center">
          {block.caption}
        </p>
      )}
    </div>
    );
  }
  
  // Handle direct video files
  return (
    <div key={block._key} className="my-16 w-full max-w-6xl mx-auto">
    <div className="flex items-center gap-3 mb-6">
      <FaVideo className="text-lochmara-500 text-xl" />
      <h2 className="text-2xl font-bold">Video Showcase</h2>
    </div>
    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
      <video
        src={block.url}
        controls
        className="w-full h-full object-cover"
      />
    </div>
    {block.caption && (
      <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-center">
        {block.caption}
      </p>
    )}
  </div>
  );

      case "galleryBlock":
        return (
          <div key={block._key} className="my-16 w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FaImage className="text-lochmara-500 text-xl" />
              <h2 className="text-2xl font-bold">
                {block.title || "Image Gallery"}
              </h2>
            </div>
            <div
              className={`grid gap-6 ${
                block.layout === "grid"
                  ? "grid-cols-1 md:grid-cols-3"
                  : block.layout === "fullscreen"
                    ? "grid-cols-1"
                    : ""
              }`}
            >
              {block.images?.map((image: any, idx: number) => (
                <div
                  key={idx}
                  className="relative h-96 rounded-xl overflow-hidden shadow-lg"
                >
                  <Image
                    src={urlFor(image).url()}
                    alt={image.alt || `Project image ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "metricsBlock":
        return (
          <div key={block._key} className="my-16 bg-blue-50 p-8 rounded-2xl w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <FaChartLine className="text-lochmara-500 text-xl" />
              <h2 className="text-2xl font-bold">
                {block.title || "Key Results"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {block.metrics?.map((metric: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl shadow-md text-center"
                >
                  <div className="text-4xl font-bold text-lochmara-400 mb-2">
                    {metric.value}
                  </div>
                  <div className="text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "uiBlock":
        return (
          <div key={block._key} className="my-16 w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FaMobile className="text-lochmara-500 text-xl" />
              <h2 className="text-2xl font-bold">UI Showcase</h2>
              {block.prototype && (
                <Link

                  href={block.prototype}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-2 text-lochmara-500 hover:underline"
                >
                  View Prototype <FaExternalLinkAlt />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {block.screens?.map((screen: any, idx: number) => (
                <div
                  key={idx}
                  className="relative h-96 rounded-xl overflow-hidden shadow-lg border-2 border-gray-100"
                >
                  <Image
                    src={urlFor(screen).url()}
                    alt={screen.alt || `UI Screen ${idx + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "brandBlock":
        return (
          <div key={block._key} className="my-16 w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FaBrush className="text-lochmara-500 text-xl" />
              <h2 className="text-2xl font-bold">Brand Assets</h2>
              {block.styleGuide && (
                <Link
                  href={block.styleGuide}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-2 text-lochmara-500 hover:underline"
                >
                  View Style Guide <FaExternalLinkAlt />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {block.assets?.map((asset: any, idx: number) => (
                <div
                  key={idx}
                  className="relative h-64 rounded-xl overflow-hidden shadow-lg bg-white p-4"
                >
                  <Image
                    src={urlFor(asset).url()}
                    alt={asset.alt || `Brand Asset ${idx + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] overflow-x-hidden">
        <MainLayout>
          <div className="container mx-auto px-4 py-20 max-w-7xl">
            <nav className="mb-8">
              <ol className="flex items-center gap-2 text-gray-600">
                <li>
                  <Link href="/" className="flex items-center gap-1 hover:text-lochmara-400">
                    <FaHome className="text-sm" />
                    <span>Home</span>
                  </Link>
                </li>
                <li className="mx-1">/</li>
                <li>
                  <Link href="/projects" className="hover:text-lochmara-400">
                    Projects
                  </Link>
                </li>
                <li className="mx-1">/</li>
                <li className="font-medium text-lochmara-500 truncate max-w-xs md:max-w-md">
                  {project.title}
                </li>
              </ol>
            </nav>
            
            {/* Hero Section */}
            <div className="mb-20">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.categories?.map((category, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl xl:text-6xl 2xl:text-7xl font-bold mb-6">
                  <BoxReveal boxColor={"#4083b7"} duration={0.5}>
                    {project.title},
                  </BoxReveal>
                  <BoxReveal boxColor={"#4083b7"} duration={0.5}>
                    results that matter.
                  </BoxReveal>
                </h1>

                {/* Fixed description container */}
                <div className="max-w-3xl mb-8">
                  <p className="text-base md:text-xl text-gray-600 whitespace-pre-line break-words">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-md">
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
                      <h3 className="font-bold text-lg">
                        {project.client?.name}
                      </h3>
                      <p className="text-gray-600 text-sm">Client</p>
                    </div>
                  </div>

                  {project.timeline && (
                    <div className="flex items-center gap-3 text-gray-600 text-sm md:text-base">
                      <FaCalendarAlt className="text-lochmara-500" />
                      <span>
                        {formatDate(project.timeline.start)} -{" "}
                        {formatDate(project.timeline.end)}
                      </span>
                    </div>
                  )}

                  {project.format && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      Format:{" "}
                      <span className="font-bold">{project.format}</span>
                    </div>
                  )}
                  {project.projectUrl && (
                    <Link
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-lochmara-500 text-white px-4 py-2 rounded-full hover:bg-lochmara-600 transition-colors text-sm"
                    >
                      View Project <FaExternalLinkAlt className="text-xs" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="w-full">
              {project.content?.map((block) => renderContentBlock(block))}
            </div>
            <AIRecommendations projectId={project._id} />
            {/* Project Summary */}
            <div className="mt-20 max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Project Impact</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700">
                  This project demonstrates our commitment to delivering
                  exceptional results through innovative solutions. Our approach
                  combines strategic thinking with creative execution to drive
                  measurable outcomes.
                </p>

                <div className="mt-12 bg-blue-50 p-6 md:p-8 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Key Takeaways</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-lochmara-500 rounded-full p-1 mr-3 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span>
                        Delivered measurable results within the timeline
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-lochmara-500 rounded-full p-1 mr-3 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span>Created a scalable solution for future growth</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-lochmara-500 rounded-full p-1 mr-3 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span>
                        Enhanced user experience and engagement metrics
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Ready to start your project?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Let&apos;s collaborate to create something extraordinary. Our
                team is ready to bring your vision to life.
              </p>
              <Link
                href="/meeting"
                className="inline-block py-3 px-8 md:px-12 text-lg md:text-xl
                bg-[#121212] text-white rounded-[6px] border-2 border-black
                hover:bg-[#abcbff] transition-all duration-300
                hover:shadow-[1px_1px_#000,2px_2px_#000,3px_3px_#000,4px_4px_#000,5px_5px_0_0_#000]
                transform hover:-translate-y-1 max-md:text-base"
              >
                Book a Call
              </Link>
            </div>
          </div>
        </MainLayout>
      </div>
    </div>
  );
}