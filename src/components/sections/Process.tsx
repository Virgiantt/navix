"use client";
import React from "react";

import { FlipWords } from "../ui/flip-words";
// import Image from "next/image";

import BoxRevealDemo from "../magicui/demo/Box-reveal-demo";
import { AnimatedBeamMultipleOutputDemo } from "../magicui/demo/animated-beam-demo";

const Process = () => {
  const words = [
    "Agile",
    "Strategic",
    "Measurable",
    "End-to-End",
  ];
  return (
    <section id="process">
      <main className="md:px-0 mx-6 md:mx-auto">
      <h1 className="text-3xl md:text-5xl md:text-center font-medium flex flex-wrap items-center justify-center gap-x-2 mx-auto">
  <span className="whitespace-nowrap">Our</span>
  <span className="text-lochmara-500 inline-flex min-h-[4rem] items-center relative">
    {/* <Image
      src="/quote.svg"
      alt="squiggle"
      width={20}
      height={20}
      className="w-6"
    /> */}
    <FlipWords 
      words={words} 
      className="text-lochmara-500 px-2 text-center whitespace-nowrap" 
    />
    {/* <Image
      src="/quote.svg"
      alt="star"
      width={20}
      height={20}
      className="w-6"
    /> */}
  </span>
  <span className="whitespace-nowrap">Process</span>
</h1>
        <p className="text-center py-2 md:w-1/2 mx-auto text-xl md:text-2xl text-gray-500">
        We blend design, video storytelling, and performance marketing to drive growth at every stage.
</p>
<div className="flex flex-col md:flex-row items-center justify-center w-full md:w-1/2 mx-auto">
<div className="w-full md:w-1/2 md:order-1">
<AnimatedBeamMultipleOutputDemo />
</div>
<div className="w-full md:w-1/2 order-1 md:order-2 md:ml-0"> 
    <BoxRevealDemo />
</div>
</div>
      </main>
      </section>
  );
};

export default Process;
