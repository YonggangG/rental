export function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-slate-700"><span>{label}</span><div className="mt-1">{children}</div></label>; }
export const inputClass = 'w-full rounded-xl border border-slate-300 px-3 py-2 text-sm';
