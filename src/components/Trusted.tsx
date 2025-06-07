"use client";
import React from 'react'
import { InfiniteMovingLogos } from './ui/inifinite_logo'
import { NumberTicker } from './magicui/number-ticker'
import { useData } from './context/DataContext';
import { useTranslations } from '../hooks/useTranslations';

const Trusted = () => {
  const { t } = useTranslations();
  const {clients , isLoading} = useData();
  const clientLogos = clients.map(client => ({
    logo: typeof client.logo === "string"
      ? client.logo
      : client.logo?.asset?.url || "",
    name: client.name,
    link: client.website || "#"
  }));
  return (
    <div className="md:flex items-center justify-between gap-y-4 my-10 gap-x-28 mx-auto">
    <div className="md:w-2/5">
      <h1 className="text-2xl font-medium text-gray-600 w-4/5">
        {t("Trusted.title")}
      </h1>
      <div className="flex my-6 gap-x-5 w-full">
        <div>
          <h1 className="text-3xl md:text-5xl text-lochmara-500">
            <NumberTicker value={100} />+
            <p className="text-gray-500 text-sm md:text-md">
              {t("Trusted.stats.happyClients")}
            </p>
          </h1>
        </div>
        <div className="w-px bg-gray-300 self-stretch" />
        <div className="flex-1 min-w-0 ">
          <h1 className="text-3xl md:text-5xl text-lochmara-500 whitespace-nowrap overflow-hidden">
            <NumberTicker value={30} />+
            <p className="text-gray-500 text-sm md:text-md">
              {t("Trusted.stats.projectsCompleted")}
            </p>
          </h1>
        </div>
      </div>
    </div>
    <section className="overflow-hidden mt-10 md:w-4/5">
        {isLoading ? (
          <div className="flex space-x-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl w-32 h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <InfiniteMovingLogos 
            speed="normal"
            direction="left"
            items={clientLogos}
          />
        )}
      </section>
  </div>
  )
}

export default Trusted
