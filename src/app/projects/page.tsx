import { BoxReveal } from '@/components/magicui/box-reveal'
import MainLayout from '@/components/main-layout'
import React from 'react'
import ProjectHero from './hero'

const page = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
    <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
  <MainLayout>
    <div className='container '>
    <div className="mx-auto flex items-center">
  <div className="max-w-5xl">
    <h1 className="text-4xl xl:text-6xl 2xl:text-7xl font-bold mb-8">
      <BoxReveal boxColor={"#4083b7"} duration={0.5}>
        Projects that speak,
      </BoxReveal>
      <BoxReveal boxColor={"#4083b7"} duration={0.5}>
        results that matter.
      </BoxReveal>
    </h1>
    <p className="text-medium md:text-xl text-gray-600">
      Each project we take on is built around one goal: growth. From boosting ROAS through paid ads to designing landing pages that convert — here’s a glimpse of what we’ve achieved for our partners.
    </p>
  </div>
</div>
 <ProjectHero />


    </div>
  </MainLayout>
    
      </div>
    </div>
  )
}

export default page
