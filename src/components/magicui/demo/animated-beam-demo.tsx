"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import Image from "next/image";


const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-border  p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);
  const div8Ref = useRef<HTMLDivElement>(null);
  const div9Ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className={cn(
        "relative flex xl:h-[500px] w-full items-center justify-center overflow-hidden  p-10 ",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full flex-row items-stretch justify-between gap-10 max-w-lg">
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref} className="bg-lochmara-200">
          <Image
              src={"/images/ads.png"}
              width={10000}
              height={10000}
              className="w-8 h-8 object-contain"
              alt="image"
            />
          </Circle>
          <Circle ref={div2Ref} className="bg-lochmara-200">
          <Image
              src={"/images/adobe.png"}
              width={10000}
              height={10000}
              className="w-8 h-8 object-contain"
              alt="image"
            />
          </Circle>
          <Circle ref={div3Ref} className="bg-lochmara-200">
          <Image
              src={"/images/meta.png"}
              width={10000}
              height={10000}
              className="w-8 h-8 object-contain"
              alt="image"
            />
          </Circle>
          <Circle ref={div4Ref} className="bg-lochmara-200">
          <Image
              src={"/images/figma.png"}
              width={10000}
              height={10000}
              className="w-8 h-8 object-contain"
              alt="image"
            />
          </Circle>
          <Circle ref={div5Ref} className="bg-lochmara-200">
          <Image
              src={"/images/notion.png"}
              width={10000}
              height={10000}
              className="w-8 h-8 object-contain"
              alt="image"
            />
          </Circle>
          <Circle ref={div8Ref} className="bg-lochmara-200">
          <Image
              src={"/images/shopify.png"}
              width={10000}
              height={10000}
              className="w-8 h-8 object-contain"
              alt="image"
            />
          </Circle>
          <Circle ref={div9Ref} className="bg-lochmara-200">
          <Image
              src={"/images/analyses.png"}
              width={10000}
              height={10000}
              className="w-8 h-8 object-contain"
              alt="image"
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-16 bg-lochmara-200">
          <Image
          src={'/logo_navix.png'}
          height={1000}
          width={1000}
          alt="logo"
          />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref} className="bg-lochmara-200">
            <Icons.user />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
      />
         <AnimatedBeam
        containerRef={containerRef}
        fromRef={div8Ref}
        toRef={div6Ref}
      />
         <AnimatedBeam
        containerRef={containerRef}
        fromRef={div9Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
      />
    </div>
  );
}

const Icons = {

  user: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};