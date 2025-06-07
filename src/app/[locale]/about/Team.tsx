"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PiLinkedinLogo, PiTwitterLogo } from "react-icons/pi";
import { useTranslations } from "@/hooks/useTranslations";

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

interface TeamMemberProps {
  image: string;
  name: string;
  role: string;
  description: string;
  social: SocialLinks;
  index: number;
  isRTL: boolean;
}

const SocialIcon: React.FC<{ href: string; icon: React.ReactNode }> = ({
  href,
  icon,
}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-gray-900 transition-colors"
  >
    {icon}
  </Link>
);

const TeamMember: React.FC<TeamMemberProps> = ({
  image,
  name,
  role,
  description,
  social,
  isRTL,
}) => (
  <motion.div className="flex flex-col h-full">
    <div className="relative overflow-hidden group aspect-square">
      <motion.div transition={{ duration: 0.4 }} className="h-full">
        <div className="relative h-full w-full">
          <Image
            fill
            src={image}
            alt={name}
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0  bg-opacity-20"
      />
    </div>
    <div className={`pt-6 space-y-3 flex-1 ${isRTL ? "text-right" : "text-left"}`}>
      <h3 className="font-medium text-xl">{name}</h3>
      <p className="text-gray-600 font-medium">{role}</p>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      <div className={`flex gap-4 pt-4 ${isRTL ? "justify-end" : "justify-start"}`}>
        {social.linkedin && (
          <SocialIcon
            href={social.linkedin}
            icon={<PiLinkedinLogo size={20} />}
          />
        )}
        {social.twitter && (
          <SocialIcon
            href={social.twitter}
            icon={<PiTwitterLogo size={20} />}
          />
        )}
      </div>
    </div>
  </motion.div>
);

const Team = () => {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  const teamMembers: Omit<TeamMemberProps, "index" | "isRTL">[] = [
    {
      name: t("About.team.members.houssem.name"),
      role: t("About.team.members.houssem.role"),
      image: "/images/Houssem_img.jpeg",
      description: t("About.team.members.houssem.description"),
      social: {
        linkedin: "https://www.linkedin.com",
        twitter: "https://twitter.com",
        website: "https://website.com",
      },
    },
    {
      name: t("About.team.members.sabri.name"),
      role: t("About.team.members.sabri.role"),
      image: "/images/sabri_img1.jpeg",
      description: t("About.team.members.sabri.description"),
      social: {
        linkedin: "https://www.linkedin.com",
        twitter: "https://twitter.com",
        website: "https://website.com",
      },
    },
  ];

  return (
    <div className="py-10" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <p className={`text-sm uppercase tracking-wider text-gray-500 mb-6 ${isRTL ? "text-right" : ""}`}>
            {t("About.team.title")}
          </p>
          <p className={`text-[#7b7b7b] max-w-3xl text-lg ${isRTL ? "text-right" : ""}`}>
            <span className="font-bold text-gray-500">
              {t("About.team.description")}
            </span>
            <br />
            {t("About.team.descriptionBold")}
          </p>
        </motion.div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 ${isRTL ? "text-right" : ""}`}>
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} index={index} isRTL={isRTL} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;