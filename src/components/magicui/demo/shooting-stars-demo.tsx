import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import Image from "next/image";

const features = [
  {
    icon: "/icons/fast.svg",
    title: "Rapid Execution",
    description: "90% of projects launched within 14 days using our proven agile workflow",
  },
  {
    icon: "/icons/design.svg",
    title: "Full-Stack Development",
    description: "Conversion-optimized websites built with modern tech stacks (Next.js, Tailwind, Shopify)",
  },
  {
    icon: "/icons/scalable.svg",
    title: "Growth-Ready Infrastructure",
    description: "Auto-scaling solutions handling 10x traffic spikes without downtime",
  },
  {
    icon: "/icons/team.svg",
    title: "Cross-Disciplinary Teams",
    description: "Dedicated squads of developers, strategists & creatives working in sync",
  },
  {
    icon: "/icons/safe.svg",
    title: "Enterprise-Grade Security",
    description: "GDPR/CCPA compliant solutions with daily vulnerability scans",
  },
  {
    icon: "/icons/analytics.svg",
    title: "Real-Time Performance Tracking",
    description: "Live dashboards monitoring ROAS, LTV & conversion metrics",
  },
  {
    icon: "/icons/flexible.svg",
    title: "Dynamic CMS Solutions",
    description: "Easy-to-update sites with Sanity/Contentful integration",
  },
  {
    icon: "/icons/support.svg",
    title: "Priority Response",
    description: "24/7 support with 2-hour SLA for critical issues",
  },
  {
    icon: "/icons/money.svg",
    title: "ROI-First Pricing",
    description: "Flexible plans scaling with your growth - no lock-in contracts",
  },
];

export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="mt-20 py-10 md:py-20  bg-neutral-900 flex flex-col items-center justify-center relative w-full px-6 md:px-0">
      <h2 className="relative flex-col  z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 via-white to-white flex items-center gap-2 ">
        Our guarantees to you.
        <p className="md:text-center   mx-auto  text-xl md:text-2xl text-gray-200">
        We ensure the highest quality of work, with the fastest delivery times.
        </p>
      </h2>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 z-40 xl:w-4/5 2xl:w-[68%] mx-auto ">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col   p-10 bg-neutral-800 rounded-xl cursor-pointer"
          >
            <button
              className="
                     w-16 p-4 
                     animate-shine flex items-center justify-center rounded-md  bg-gradient-to-br  
                        from-neutral-700 to-neutral-800 
                    font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <Image
                src={feature.icon}
                width={10000}
                height={10000}
                alt="icon"
                className="w-8 h-8"
              />
            </button>

            <h3 className="text-xl font-bold mt-4 text-white">
              {feature.title}
            </h3>
            <p className=" text-gray-200">{feature.description}</p>
          </div>
        ))}
      </div>

      <ShootingStars />
      <StarsBackground />
    </div>
  );
}