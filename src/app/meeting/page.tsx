"use client"
import MainLayout from '@/components/main-layout'
import { motion } from 'framer-motion'
import React from 'react'
import { PiCheckCircle } from 'react-icons/pi'
import Calendly from './calendly';
const checkItemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  
const page = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
    <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
  <MainLayout>
  <div className="md:px-0 px-6 xl:w-4/5 2xl:w-[68%] justify-between md:mt-14 md:flex mx-auto  ">
  <div className="md:w-2/5">
  <h1 className="text-4xl font-semibold pt-10">Let&apos;s Meet</h1>
  <p className="text-lg text-gray-500 py-4">
    We are always excited to connect with ambitious brands and discuss new growth opportunities.
    Feel free to book a strategy session with us.
  </p>

  {[
    {
      title: "Growth Strategy + Media Buying",
      description:
        "Scale your business with powerful paid advertising strategies across Facebook, Instagram, and Google.",
    },
    {
      title: "Free Discovery Call",
      description:
        "Let’s talk about your goals and challenges — and see how we can build a custom plan for your brand’s growth.",
    },
    {
      title: "Ongoing Support + Optimization",
      description:
        "We continuously monitor, optimize, and scale your campaigns to maximize results and profitability.",
    },
  ].map((item, index) => (
    <motion.div
      key={index}
      variants={checkItemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.3 }}
      className="flex gap-x-4 py-4"
    >
      <PiCheckCircle className="rounded-md text-[#3d80d7] text-2xl flex-shrink-0" />
      <ul>
        <h3 className="text-lg font-bold text-gray-700">
          {item.title}
        </h3>
        <div className="text-gray-400">{item.description}</div>
      </ul>
    </motion.div>
  ))}
</div>


    <div className="md:w-1/2">
      <Calendly />
      </div>
      </div>
  </MainLayout>
    
      </div>
    </div>
  )
}

export default page
