/*
	Installed from https://reactbits.dev/ts/tailwind/
*/

import React, { useEffect, useMemo, useRef, ReactNode, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1.2, // Increased duration for smoother animation
  ease = "power2.out", // Better easing for more natural movement
  scrollStart = "center bottom+=30%", // Start animation earlier
  scrollEnd = "bottom bottom-=20%", // End animation later
  stagger = 0.08 // Increased stagger for more dramatic effect
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    
    // Check if text contains Arabic characters
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    
    if (hasArabic) {
      // Split by words for Arabic text to maintain letter connections
      // Add extra spans for better animation granularity
      return text.split(/(\s+)/).map((segment, index) => (
        <span className="inline-block word-segment" key={index} data-word={segment.trim()}>
          {segment}
        </span>
      ));
    } else {
      // Split by characters for non-Arabic text (original behavior)
      return text.split("").map((char, index) => (
        <span className="inline-block char-segment" key={index}>
          {char === " " ? "\u00A0" : char}
        </span>
      ));
    }
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    const segments = el.querySelectorAll(".inline-block");
    const hasArabic = /[\u0600-\u06FF]/.test(el.textContent || "");

    // Enhanced animation with more dramatic effects
    gsap.fromTo(
      segments,
      {
        willChange: "opacity, transform",
        opacity: 0,
        y: hasArabic ? 80 : 120, // Less dramatic for Arabic words
        scaleY: hasArabic ? 1.8 : 2.3,
        scaleX: hasArabic ? 0.8 : 0.7,
        rotationX: hasArabic ? 15 : 25, // Add 3D rotation
        transformOrigin: "50% 0%",
        filter: "blur(8px)" // Add blur effect
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        y: 0,
        scaleY: 1,
        scaleX: 1,
        rotationX: 0,
        filter: "blur(0px)",
        stagger: {
          amount: hasArabic ? stagger * 1.5 : stagger, // Slower stagger for Arabic
          from: "start"
        },
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: 1.2, // Smoother scrubbing
          anticipatePin: 1,
          // Add markers for debugging (remove in production)
          // markers: true
        },
      }
    );

    // Add a subtle hover effect
    const handleMouseEnter = () => {
      gsap.to(segments, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.01
      });
    };

    const handleMouseLeave = () => {
      gsap.to(segments, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.01
      });
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger
  ]);

  return (
    <h2
      ref={containerRef}
      className={`my-5 overflow-hidden cursor-default ${containerClassName}`}
      style={{ perspective: "1000px" }} // Enable 3D transforms
    >
      <span
        className={`inline-block text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] ${textClassName}`}
      >
        {splitText}
      </span>
    </h2>
  );
};

export default ScrollFloat;
