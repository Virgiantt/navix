'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';

// Inline translations object
const translations = {
  en: {
    projectImpact: "Project Impact",
    projectSummaryDescription: "This project demonstrates our commitment to delivering measurable results through innovative digital solutions. Every element was carefully crafted to enhance user experience and drive business growth.",
    keyTakeaways: "Key Takeaways",
    takeaways: {
      measurable: "Measurable results that directly impact business objectives",
      scalable: "Scalable solutions designed for long-term growth",
      enhanced: "Enhanced user experience through thoughtful design and development"
    },
    readyToStart: "Ready to Start Your Project?",
    readyDescription: "Let's discuss how we can help you achieve similar results for your business.",
    bookCall: "Book a Call"
  },
  fr: {
    projectImpact: "Impact du Projet",
    projectSummaryDescription: "Ce projet démontre notre engagement à fournir des résultats mesurables grâce à des solutions numériques innovantes. Chaque élément a été soigneusement conçu pour améliorer l'expérience utilisateur et stimuler la croissance de l'entreprise.",
    keyTakeaways: "Points Clés",
    takeaways: {
      measurable: "Résultats mesurables qui impactent directement les objectifs commerciaux",
      scalable: "Solutions évolutives conçues pour une croissance à long terme",
      enhanced: "Expérience utilisateur améliorée grâce à une conception et un développement réfléchis"
    },
    readyToStart: "Prêt à Commencer Votre Projet ?",
    readyDescription: "Discutons de la façon dont nous pouvons vous aider à obtenir des résultats similaires pour votre entreprise.",
    bookCall: "Réserver un Appel"
  },
  ar: {
    projectImpact: "تأثير المشروع",
    projectSummaryDescription: "يُظهر هذا المشروع التزامنا بتقديم نتائج قابلة للقياس من خلال الحلول الرقمية المبتكرة. تم تصميم كل عنصر بعناية لتعزيز تجربة المستخدم ودفع نمو الأعمال.",
    keyTakeaways: "النقاط الرئيسية",
    takeaways: {
      measurable: "نتائج قابلة للتقييس تؤثر مباشرة على أهداف العمل",
      scalable: "حلول قابلة للتطوير مصممة للنمو طويل المدى",
      enhanced: "تجربة مستخدم محسّنة من خلال التصميم والتطوير المدروس"
    },
    readyToStart: "مستعد لبدء مشروعك؟",
    readyDescription: "دعنا نناقش كيف يمكننا مساعدتك في تحقيق نتائج مماثلة لعملك.",
    bookCall: "احجز مكالمة"
  }
};

export default function ProjectSummarySection() {
  const params = useParams();
  const locale = params.locale as string;
  const t = translations[locale as keyof typeof translations] || translations.en;
  const isRTL = locale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Project Summary */}
      <div className="mt-20 max-w-5xl mx-auto">
        <h2 className={`text-3xl font-bold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>{t.projectImpact}</h2>
        <div className="prose prose-lg max-w-none">
          <p className={`text-xl text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t.projectSummaryDescription}
          </p>

          <div className="mt-12 bg-blue-50 p-6 md:p-8 rounded-2xl">
            <h3 className={`text-xl font-bold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t.keyTakeaways}</h3>
            <ul className="space-y-3">
              <li className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`bg-lochmara-500 rounded-full p-1 mt-1 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className={isRTL ? 'text-right' : ''}>
                  {t.takeaways.measurable}
                </span>
              </li>
              <li className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`bg-lochmara-500 rounded-full p-1 mt-1 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className={isRTL ? 'text-right' : ''}>{t.takeaways.scalable}</span>
              </li>
              <li className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`bg-lochmara-500 rounded-full p-1 mt-1 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className={isRTL ? 'text-right' : ''}>
                  {t.takeaways.enhanced}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">
          {t.readyToStart}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {t.readyDescription}
        </p>
        <Link
          href={`/${locale}/meeting`}
          className="inline-block py-3 px-8 md:px-12 text-lg md:text-xl
          bg-[#121212] text-white rounded-[6px] border-2 border-black
          hover:bg-[#abcbff] transition-all duration-300
          hover:shadow-[1px_1px_#000,2px_2px_#000,3px_3px_#000,4px_4px_#000,5px_5px_0_0_#000]
          transform hover:-translate-y-1 max-md:text-base"
        >
          {t.bookCall}
        </Link>
      </div>
    </div>
  );
}