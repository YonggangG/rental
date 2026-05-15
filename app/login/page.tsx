import { LanguageSwitch } from '@/components/LanguageSwitch';
import { getLocale, t } from '@/lib/i18n';
import { loginAction } from './actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const locale = getLocale(sp);
  const m = t(locale);
  const hasError = sp.error === '1';
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <div className="card">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{m.signIn}</h1>
            <p className="mt-2 text-sm text-slate-600">{m.signInHelp}</p>
          </div>
          <LanguageSwitch locale={locale} />
        </div>
        {hasError ? <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{m.invalidLogin}</p> : null}
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="lang" value={locale} />
          <label className="block text-sm font-medium">{m.email}<input className="mt-1 w-full rounded-xl border p-3" name="email" type="email" required /></label>
          <label className="block text-sm font-medium">{m.password}<input className="mt-1 w-full rounded-xl border p-3" name="password" type="password" required /></label>
          <button className="btn w-full" type="submit">{m.signIn}</button>
        </form>
      </div>
    </main>
  );
}
