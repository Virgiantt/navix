'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import WordPullUp from '../magicui/word-pull-up';
import { useTranslations } from '../../hooks/useTranslations';

interface FAQItemProps {
    question: string;
    answer: string;
    isRTL: boolean;
    }

const FAQItem : React.FC<FAQItemProps> = ({ question, answer, isRTL }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-6 flex items-center justify-between ${isRTL ? 'text-right' : 'text-left'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <span className="text-xl font-medium">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center justify-center flex-shrink-0 ml-4"
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div 
              className={`pb-6 text-neutral-600 ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Faq = () => {
    const { t, locale } = useTranslations();
    const isRTL = locale === 'ar';
    
    const faqData = [
        {
          question: t('FAQ.questions.services.question'),
          answer: t('FAQ.questions.services.answer')
        },
        {
          question: t('FAQ.questions.different.question'),
          answer: t('FAQ.questions.different.answer')
        },
        {
          question: t('FAQ.questions.international.question'),
          answer: t('FAQ.questions.international.answer')
        },
        {
          question: t('FAQ.questions.pricing.question'),
          answer: t('FAQ.questions.pricing.answer')
        },
        {
          question: t('FAQ.questions.workflow.question'),
          answer: t('FAQ.questions.workflow.answer')
        },
        {
          question: t('FAQ.questions.timeline.question'),
          answer: t('FAQ.questions.timeline.answer')
        }
      ];

  return (
    <div className="mx-auto 2xl:w-4/5 md:px-16 px-6 py-16 pb-32">
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
        <WordPullUp words={t('FAQ.title')}/>
      </div>
      <div className="space-y-2">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isRTL={isRTL}
          />
        ))}
      </div>
    </div>
  );
};

export default Faq;