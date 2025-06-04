import {notFound} from 'next/navigation';

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

  return children;
}