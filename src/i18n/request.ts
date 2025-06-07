import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !['en', 'fr', 'ar'].includes(locale)) {
    locale = 'en'; // fallback to English
  }
 
  return {
    locale,
    messages: (await import(`../../public/messages/${locale}.json`)).default
  };
});