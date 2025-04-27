import React from 'react'
import { AnimatedShinyTextDemo } from '../magicui/demo/animated_shiny_text_demo'
import { CoverDemo } from '../magicui/demo/cover-demo'
import { InteractiveHoverButton } from '../magicui/interactive-hover-button'
import We_Offer from '../What-We-Offer'
import Trusted from '../Trusted'

const Hero = () => {
  return (
    <main className="md:pb-10 container">
    <div className="md:px-0 mx-6 xl:w-4/5 2xl:w-[68%] md:mx-auto ">
      <AnimatedShinyTextDemo />

      <h1>
        <CoverDemo />
      </h1>
      <p
        className="md:text-center text-xl 
md:text-2xl my-6 md:my-10 
 text-gray-500"
      >
        Schedule a call with us to discuss your busniss growth goals and
        how Navix can help you achieve them.
      </p>
      <div className="flex md:justify-center items-center gap-x-4 max-md:w-full max-md:grid max-md:grid-cols-2">
  {/* Primary Button */}
  <InteractiveHoverButton
    className="sm:text-base bg-primary text-primary-foreground
    py-3 px-10 md:px-16 md:text-xl max-md:w-full max-md:px-2
    hover:bg-primary-foreground hover:text-primary hover:border-primary
    hover:shadow-[1px_1px_var(--color-primary),2px_2px_var(--color-primary),3px_3px_var(--color-primary),4px_4px_var(--color-primary),5px_5px_0px_0px_var(--color-primary)]
    dark:hover:shadow-[1px_1px_var(--color-primary-foreground),2px_2px_var(--color-primary-foreground),3px_3px_var(--color-primary-foreground),4px_4px_var(--color-primary-foreground),5px_5px_0px_0px_var(--color-primary-foreground)]"
  >
    <span className="max-md:text-sm">Book a Call</span>
  </InteractiveHoverButton>

  {/* Secondary Button */}
  <InteractiveHoverButton
    className="py-3 px-10 md:px-16 md:text-xl max-md:w-full max-md:px-2
    hover:shadow-[1px_1px_var(--color-primary),2px_2px_var(--color-primary),3px_3px_var(--color-primary),4px_4px_var(--color-primary),5px_5px_0px_0px_var(--color-primary)]
    dark:hover:shadow-[1px_1px_var(--color-primary-foreground),2px_2px_var(--color-primary-foreground),3px_3px_var(--color-primary-foreground),4px_4px_var(--color-primary-foreground),5px_5px_0px_0px_var(--color-primary-foreground)]"
  >
    <span className="max-md:text-sm">Showcase</span>
  </InteractiveHoverButton>
</div>
      <We_Offer />
      <Trusted />
    </div>
  </main>
  )
}

export default Hero
