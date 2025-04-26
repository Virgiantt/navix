import React from 'react'
import { BoxReveal } from './magicui/box-reveal'
import { PiCheckBold } from 'react-icons/pi'

const We_Offer = () => {
  return (
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
  )
}

export default We_Offer
