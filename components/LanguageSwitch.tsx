import type { Locale } from '@/lib/i18n';

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const next = locale === 'en' ? 'zh' : 'en';
  return (
    <a className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700" href={`?lang=${next}`}>
      {locale === 'en' ? '中文' : 'English'}
    </a>
  );
}
