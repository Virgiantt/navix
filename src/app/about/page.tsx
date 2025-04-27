import MainLayout from '@/components/main-layout'
import React from 'react'
import Culture from './culture'
import Team from './Team'
import { BoxReveal } from '@/components/magicui/box-reveal'

const page = () => {
  return (
    <MainLayout>
      <div className='container '>
      <div className="mx-auto flex items-center">
          <div className="max-w-5xl">
            <h1 className="text-4xl xl:text-6xl 2xl:text-7xl font-bold mb-8">
                <BoxReveal boxColor={"#4083b7"} duration={0.5}>
              Not just a team,
               </BoxReveal>
                <BoxReveal boxColor={"#4083b7"} duration={0.5}>
                but your growth partners..
                </BoxReveal>
            </h1>
            <p className="text-medium md:text-xl text-gray-600">
            we turn struggling businesses into success stories through powerful design, smart media buying, and high-converting marketing strategies.
</p>
          </div>
        </div>
        <Culture />
        <Team />
      </div>
    </MainLayout>
  )
}

export default page
