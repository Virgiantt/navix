import { BoxReveal } from "@/components/magicui/box-reveal";
import { AnimatedShinyTextDemo } from "@/components/magicui/demo/animated_shiny_text_demo";
import { CoverDemo } from "@/components/magicui/demo/cover-demo";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Navbar } from "@/components/sections.tsx/Navbar";
import { PiCheckBold } from "react-icons/pi";

export default function Home() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
        <Navbar />
        <main className="md:pb-10 container">
          <div className="md:px-0 mx-6 xl:w-4/5 2xl:w-[68%] md:mx-auto mt-14">
            <AnimatedShinyTextDemo />
          </div>
          <h1>
            <CoverDemo />
          </h1>
          <p
            className="md:text-center text-xl 
      md:text-2xl my-6 md:my-10 
       text-gray-500"
          >
            Schedule a call with us to discuss your busniss growth goals and how
            Navix can help you achieve them.
          </p>
          <div className="flex md:justify-center items-center gap-x-4">
            {/* Primary Button */}
            <InteractiveHoverButton
              className="
    bg-primary text-primary-foreground
    border border-primary
    hover:bg-primary-foreground hover:text-primary
    hover:border-primary
    py-3 px-10 md:px-16 md:text-xl
    hover:shadow-[1px_1px_var(--color-primary),2px_2px_var(--color-primary),3px_3px_var(--color-primary),4px_4px_var(--color-primary),5px_5px_0px_0px_var(--color-primary)]
    dark:hover:shadow-[1px_1px_var(--color-primary-foreground),2px_2px_var(--color-primary-foreground),3px_3px_var(--color-primary-foreground),4px_4px_var(--color-primary-foreground),5px_5px_0px_0px_var(--color-primary-foreground)]
  "
            >
              Book a Call
            </InteractiveHoverButton>

            {/* Secondary Button (Reversed) */}
            <InteractiveHoverButton
              className="
 
      py-3 px-10 md:px-16 md:text-xl
      hover:shadow-[1px_1px_var(--color-primary),2px_2px_var(--color-primary),3px_3px_var(--color-primary),4px_4px_var(--color-primary),5px_5px_0px_0px_var(--color-primary)]
      dark:hover:shadow-[1px_1px_var(--color-primary-foreground),2px_2px_var(--color-primary-foreground),3px_3px_var(--color-primary-foreground),4px_4px_var(--color-primary-foreground),5px_5px_0px_0px_var(--color-primary-foreground)]
    "
            >
              Showcase
            </InteractiveHoverButton>
          </div>
          <div
            className="grid grid-cols-2 
          md:grid-cols-4 gap-4 items-center 
          text-left md:justify-items-center 
          md:mx-auto mt-10 md:mt-16"
          >
            <BoxReveal boxColor={"var(--color-lochmara-500)"} duration={0.5}>
              <p className="md:text-xl font-semibold flex gap-x-2 md:gap-x-4 items-center">
                <PiCheckBold className="text-xl text-lochmara-500" />
                Video Production & Editing
              </p>
            </BoxReveal>
            <BoxReveal boxColor={"var(--color-lochmara-500)"} duration={0.5}>
              <p className="md:text-xl font-semibold flex gap-x-2 md:gap-x-4 items-center">
                <PiCheckBold className="text-xl text-lochmara-500" />
                Full-Stack Web Development
              </p>
            </BoxReveal>
            <BoxReveal boxColor={"var(--color-lochmara-500)"} duration={0.5}>
              <p className="md:text-xl font-semibold flex gap-x-2 md:gap-x-4 items-center">
                <PiCheckBold className="text-xl text-lochmara-500" />
                Data-Driven Marketing Strategy
              </p>
            </BoxReveal>
            <BoxReveal boxColor={"var(--color-lochmara-500)"} duration={0.5}>
              <p className="md:text-xl font-semibold flex gap-x-2 md:gap-x-4 items-center">
                <PiCheckBold className="text-xl text-lochmara-500" />
                Targeted Media Buying
              </p>
            </BoxReveal>
            <BoxReveal boxColor={"var(--color-lochmara-500)"} duration={0.5}>
              <p className="md:text-xl font-semibold flex gap-x-2 md:gap-x-4 items-center">
                <PiCheckBold className="text-xl text-lochmara-500" />
                Automated Email Campaigns
              </p>
            </BoxReveal>
          </div>
          <div></div>
        </main>
      </div>
    </div>
  );
}
