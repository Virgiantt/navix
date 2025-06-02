"use client";
import React from "react";

import Image from "next/image";
import { WordPullUpDemo } from "../magicui/demo/word-pull-up-demo";
const Services = () => {
    const services = [
        {
          icon: "/images/s_6.png", // Web icon remains
          title: "Full-Stack Web Development",
          description:
            "Convert visitors with lightning-fast, responsive websites built using modern frameworks and optimized for conversions",
        },
        {
          icon: "/images/s_1.png", // SEO icon → Media Buying
          title: "Strategic Media Buying",
          description:
            "Precision-targeted ad campaigns across Google/Meta platforms that maximize your advertising ROI",
        },
        {
          icon: "/images/s_5.png", // Content icon → Video Production
          title: "Video Production Suite",
          description:
            "End-to-end video solutions - from concept development to 4K editing and motion graphics",
        },
        {
          icon: "/images/s_3.png", // Social icon → Marketing Strategy
          title: "Growth Marketing Strategy",
          description:
            "Data-driven roadmaps combining SEO, content, and paid media for sustainable business growth",
        },
        {
          icon: "/images/s_4.png", // Email icon remains
          title: "Automated Email Systems",
          description:
            "Convert leads with personalized drip campaigns and AI-driven behavioral triggers",
        },
        {
          icon: "/images/s_2.png", // PPC icon → Analytics
          title: "Performance Analytics",
          description:
            "Real-time campaign dashboards with conversion optimization recommendations",
        },
      ];
      
  return (
    <section id="services" className="container">
      <div className="md:px-0 mx-6 xl:w-4/5 2xl:w-[68%] md:mx-auto">
        <WordPullUpDemo />
        <p className="text-center py-4 md:w-1/2 mx-auto text-xl md:text-2xl text-gray-500 ">
          All of our services are designed to make your busniss stand out
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
            {services.map((service) => (
              <div
                key={service.title}
                className="flex flex-col justify-between h-full space-y-4 text-center bg-lochmara-100 p-4 cursor-pointer hover:scale-105 transition-transform rounded-md"
              >
                <Image
                  src={service.icon}
                  width={10000}
                  height={10000}
                  className="object-contain bg-lochmara-100 p-4 w-full h-40 rounded-md"
                  alt="image"
                />
                <h1 className="text-xl font-medium">{service.title}</h1>
                <p className="text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
};

export default Services;
