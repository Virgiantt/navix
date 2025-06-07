import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Space_Grotesk } from "next/font/google";

const font = Space_Grotesk({
  subsets: ["latin"],
});

const locales = ['en', 'fr', 'ar'] as const;
type Locale = typeof locales[number];

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Validate locale with proper typing
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get messages using the proper next-intl server function
  const messages = await getMessages();

  return (
    <html lang={locale} >
      <body className={`${font.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}