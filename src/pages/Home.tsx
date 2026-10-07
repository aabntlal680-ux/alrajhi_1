import { ACCOUNTS, TRANSACTIONS, formatMoney, type PageId } from "../data";
import {
  IconCard,
  IconEye,
  IconEyeOff,
  IconGlobe,
  IconPayments,
  IconSend,
  IconTransfer,
  IconWallet,
} from "../icons";
import { useState } from "react";

export default function Home({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const [hidden, setHidden] = useState(false);
  const total = ACCOUNTS.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-l from-[#071e52] via-[#0a2c72] to-[#1a5fbf] p-5 text-white shadow-lg">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm text-blue-100">إجمالي الأرصدة</div>
            <div className="mt-1 flex items-center gap-3">
              <div className="text-3xl font-black">
                {hidden ? "••••••••" : formatMoney(total)} <span className="text-lg">SAR</span>
              </div>
              <button onClick={() => setHidden((v) => !v)} className="rounded-lg bg-white/10 p-2">
                {hidden ? <IconEye size={18} /> : <IconEyeOff size={18} />}
              </button>
            </div>
            <div className="mt-1 text-xs text-blue-100/80">آخر تحديث: اليوم · 09:41 ص</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { l: "تحويل دولي", i: <IconGlobe size={16} />, p: "intl-transfer" as PageId },
              { l: "تحويل محلي", i: <IconTransfer size={16} />, p: "local-transfer" as PageId },
              { l: "مدفوعات", i: <IconPayments size={16} />, p: "payments" as PageId },
            ].map((b) => (
              <button
                key={b.l}
                onClick={() => onNavigate(b.p)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold hover:bg-white/25"
              >
                {b.i}
                {b.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {ACCOUNTS.map((a) => (
          <button
            key={a.id}
            onClick={() => onNavigate("accounts")}
            className={`rounded-2xl bg-gradient-to-l ${a.color} p-4 text-right text-white shadow-md`}
          >
            <div className="flex items-center justify-between text-white/80">
              <span className="text-xs">{a.type}</span>
              <IconWallet size={18} />
            </div>
            <div className="mt-3 text-sm font-semibold">{a.name}</div>
            <div className="mt-1 text-xl font-black">
              {hidden ? "••••••" : formatMoney(a.balance)} {a.currency}
            </div>
            <div className="mt-2 font-mono text-[11px] tracking-wider text-white/70">{a.number}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-extrabold text-[#0a2c72]">آخر العمليات</h2>
            <button onClick={() => onNavigate("reports")} className="text-xs font-bold text-[#1a5fbf]">
              عرض الكل
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {TRANSACTIONS.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      t.type === "in" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-[#1a5fbf]"
                    }`}
                  >
                    {t.type === "in" ? "↓" : "↑"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0a2c72]">{t.title}</div>
                    <div className="text-xs text-slate-500">
                      {t.subtitle} · {t.date}
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className={`font-extrabold ${t.amount > 0 ? "text-emerald-600" : "text-[#0a2c72]"}`}>
                    {t.amount > 0 ? "+" : ""}
                    {formatMoney(t.amount)}
                  </div>
                  <div
                    className={`text-[11px] ${
                      t.status === "pending" ? "text-amber-600" : t.status === "failed" ? "text-red-600" : "text-slate-400"
                    }`}
                  >
                    {t.status === "pending" ? "قيد المعالجة" : t.status === "failed" ? "فشل" : "مكتمل"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-3 font-extrabold text-[#0a2c72]">أسعار الصرف</h2>
            {[
              ["USD", "3.750"],
              ["EUR", "4.068"],
              ["AED", "1.021"],
              ["GBP", "4.753"],
            ].map(([c, r]) => (
              <div key={c} className="flex items-center justify-between py-1.5 text-sm">
                <span className="font-bold text-[#0a2c72]">{c}</span>
                <span className="text-slate-500">{r} SAR</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-[#0a2c72] p-4 text-white">
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <IconCard size={16} /> بطاقة مدى بلاتينية
            </div>
            <div className="mt-3 font-mono tracking-widest">4580 •••• •••• 2291</div>
            <div className="mt-4 flex justify-between text-xs text-blue-100">
              <span>صالحة حتى 08/28</span>
              <span>متاحة</span>
            </div>
            <button
              onClick={() => onNavigate("cards")}
              className="mt-4 w-full rounded-xl bg-white/15 py-2 text-sm font-bold"
            >
              إدارة البطاقة
            </button>
          </div>
          <button
            onClick={() => onNavigate("intl-transfer")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white p-4 font-bold text-[#0a2c72] shadow-sm ring-1 ring-slate-100"
          >
            <IconSend size={18} /> بدء تحويل سريع
          </button>
        </section>
      </div>
    </div>
  );
}
