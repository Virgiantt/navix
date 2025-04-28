import React from 'react'
import { InfiniteMovingLogos } from './ui/inifinite_logo'
import { NumberTicker } from './magicui/number-ticker'

const Trusted = () => {
  return (
    <div className="md:flex items-center justify-between gap-y-4 my-10 gap-x-28 mx-auto">
    <div className="md:w-2/5">
      <h1 className="text-2xl font-medium text-gray-600 w-4/5">
        Trusted by fast brands
      </h1>
      <div className="flex my-6 gap-x-5 w-full">
        <div>
          <h1 className="text-3xl md:text-5xl text-lochmara-500">
            <NumberTicker value={100} />+
            <p className="text-gray-500 text-sm md:text-md">
              Happy clients
            </p>
          </h1>
        </div>
        <div className="w-px bg-gray-300 self-stretch" />
        <div className="flex-1 min-w-0 ">
          <h1 className="text-3xl md:text-5xl text-lochmara-500 whitespace-nowrap overflow-hidden">
            <NumberTicker value={30} />+
            <p className="text-gray-500 text-sm md:text-md">
              Projects completed 
            </p>
          </h1>
        </div>
      </div>
    </div>
    <section className="overflow-hidden mt-10 md:w-4/5">
<InfiniteMovingLogos 
speed="normal"
direction="left"
items={[
{ logo: "/HouseProtein.png", name: "HouseProtein" , link: "https://www.house-protein.tn/" },
{ logo: "/logo_Houssem.jpeg", name: "Houssem Consulting", link: "www.shtc-maghreb.tn" },
{ logo: "/logo_Rayen.png", name: "Rayen el maamoun portfolio", link: "https://www.rayenelmaamoun.com/" },
{ logo: "/HFD_FX.jpeg", name: "HFD_FX", link: "/" },


]}/>
    </section>
  </div>
  )
}

export default Trusted
