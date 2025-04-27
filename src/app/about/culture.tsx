'use client'

import React from "react";
import { motion } from "framer-motion";

interface Value {
  title: string;
  description: string;
}

const CultureValue: React.FC<Value> = ({ title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} // This ensures the animation only happens once
      transition={{ duration: 0.5 }}
      className="py-6 border-t border-gray-200"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <h3 className="text-lg font-semibold w-full md:w-1/3">{title}</h3>
        <p className="text-[#7b7b7b] w-full md:w-1/2">{description}</p>
      </div>
    </motion.div>
  );
};

const Culture = () => {
  const values = [
    {
      title: "Relentless Execution",
      description:
        "At Navix, we don't just plan—we deliver. Our focus is on results, precision, and making every campaign count. No excuses, only outcomes.",
    },
    {
      title: "Ownership and Responsibility",
      description:
        "When we commit, we own it. Every result—good or bad—is on us. We fix, improve, and scale until success is the only option.",
    },
    {
      title: "Client-First Mentality",
      description:
        "We treat every brand like our own. We listen, understand, and act with your growth as the only goal. Your success is our reputation.",
    },
    {
      title: "Calculated Innovation",
      description:
        "We don't chase trends. We use data, experience, and creativity to find smarter, better, more profitable ways to drive performance.",
    },
    {
      title: "Consistent Growth Mindset",
      description:
        "In a fast-moving world, we adapt fast. We learn, test, evolve, and win—again and again. Stagnation is death; progress is our default.",
    },
  ];
  

  return (
    <div className="min-h-screen bg-white">
      <div
        className=" px-6 py-10
     2xl:w-4/5 md:px-16 "
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-6">
            /Culture
          </p>
          <div className="text-[#7b7b7b] max-w-3xl">
          At Navix, our culture is built on performance, precision, and relentless ambition.
Our values are not just words—they are the operating system behind everything we do.
They guide how we work, how we think, and how we deliver results.
Here&apos;s what defines us:
          </div>
        </motion.div>

        <div className="space-y-2">
          {values.map((value, index) => (
            <CultureValue
              key={index}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Culture;