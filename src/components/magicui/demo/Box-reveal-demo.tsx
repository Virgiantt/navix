"use client";

import Link from "next/link";
import { BoxReveal } from "../box-reveal";

const BoxRevealDemo = () => {
  return (
    <div className="h-full w-full items-center justify-center md:ml-10 overflow-hidden pt-8 space-y-2">
      <BoxReveal boxColor={"#3b82f6"} duration={0.5}>
        
        <p className="text-3xl font-semibold">1. Connect</p>
      </BoxReveal>

      <BoxReveal boxColor={"#3b82f6"} duration={0.5}>
        <h2 className="my-2 text-lg text-gray-500">
        Start with a free consultation via
          <Link href={"/meeting"} className="text-[#3b82f6]">
            {" "}
            meeting{" "}
          </Link>
        </h2>
      </BoxReveal>
      <BoxReveal boxColor={"#3b82f6"} duration={0.5}>
        <p className="text-3xl font-semibold">2. Collaborate</p>
      </BoxReveal>

      <BoxReveal boxColor={"#3b82f6"} duration={0.5}>
        <h2 className="my-2 text-lg text-gray-500">
        Together, we set goals and KPIs through collaborative workshops.
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#3b82f6"} duration={0.5}>
        <p className="text-3xl font-semibold">3. Create & Scale</p>
      </BoxReveal>

      <BoxReveal boxColor={"#3b82f6"} duration={0.5}>
        <h2 className="my-2 text-lg text-gray-500"> We execute with weekly updates, so you stay focused on growth.</h2>
      </BoxReveal>
    </div>
  );
}

export default BoxRevealDemo;