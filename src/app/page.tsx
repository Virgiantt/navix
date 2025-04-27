import LetsMakeThingsHappenSection from "@/components/LetsMakeThingsHappen";
import { ScrollBasedVelocityDemo } from "@/components/magicui/demo/scroll-based-velocity-demo";
import MainLayout from "@/components/main-layout";
import Faq from "@/components/sections/Faq";

import Founders from "@/components/sections/founders";
import Guarentees from "@/components/sections/Guarentees";
import Hero from "@/components/sections/Hero";

import Process from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";

import Services from "@/components/sections/Services";

export default function Home() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
        <MainLayout>
          <Hero />
          <Services />
          <Projects />
          <div className="pb-20 pt-10">
            <ScrollBasedVelocityDemo />
          </div>
          <Process />
          <Founders />
          <Guarentees />
          <LetsMakeThingsHappenSection />
          <Faq />
        </MainLayout>
      </div>
    </div>
  );
}
