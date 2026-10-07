import { useMemo, useState } from "react";
import { ACCOUNTS, BENEFICIARIES, BILLS, TRANSACTIONS, formatMoney } from "../data";
import {
  IconBank,
  IconCard,
  IconCheck,
  IconCopy,
  IconDownload,
  IconEye,
  IconEyeOff,
  IconFile,
  IconGear,
  IconLock,
  IconPhone,
  IconPlus,
  IconSend,
  IconShield,
  IconTransfer,
  IconUser,
} from "../icons";

function Card({
  title,
  icon,
  children,
  extra,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-[#0a2c72]">
          {title}
          {icon}
        </h2>
        {extra}
      </header>
      {children}
    </section>
  );
}

export function LocalTransfer({ onToast }: { onToast: (m: string, t?: "ok" | "err" | "info") => void }) {
  const locals = BENEFICIARIES.filter((b) => b.countryCode === "SA");
  const [ben, setBen] = useState(locals[0]?.id ?? "");
  const [amount, setAmount] = useState("3,500.00");
  const [note, setNote] = useState("");
  const selected = locals.find((b) => b.id === ben) ?? locals[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px] animate-fade-in">
      <div className="space-y-4">
        <div className="rounded-2xl bg-[#0a2c72] p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <IconTransfer size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold">تحويل محلي</h1>
              <p className="text-sm text-blue-100">تحويل بين البنوك داخل المملكة عبر سريع</p>
            </div>
          </div>
        </div>
        <Card title="بيانات المستفيد">
          <label className="text-xs text-slate-500">المستفيد</label>
          <select
            value={ben}
            onChange={(e) => setBen(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold outline-none"
          >
            {locals.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.bank}
              </option>
            ))}
          </select>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <div className="text-xs text-slate-500">الآيبان</div>
              <div className="font-mono font-bold">{selected?.iban}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">المصرف</div>
              <div className="font-bold">{selected?.bank}</div>
            </div>
          </div>
        </Card>
        <Card title="تفاصيل المبلغ">
          <label className="text-xs text-slate-500">المبلغ (ريال سعودي)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-lg font-black text-[#0a2c72] outline-none"
          />
          <label className="mt-3 block text-xs text-slate-500">الغرض / الملاحظات</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="مثال: سداد إيجار"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
          />
        </Card>
      </div>
      <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 h-fit">
        <h3 className="font-extrabold text-[#1a5fbf]">ملخص التحويل</h3>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>المبلغ</span>
            <b>{amount} SAR</b>
          </div>
          <div className="flex justify-between">
            <span>الرسوم</span>
            <b>0.00 SAR</b>
          </div>
        </div>
        <button
          onClick={() => onToast("تم إرسال التحويل المحلي بنجاح", "ok")}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a2c72] py-3 font-bold text-white"
        >
          إرسال التحويل <IconSend size={16} />
        </button>
      </aside>
    </div>
  );
}

export function NewBeneficiary({ onToast }: { onToast: (m: string, t?: "ok" | "err" | "info") => void }) {
  const [form, setForm] = useState({
    name: "",
    iban: "",
    bank: "",
    country: "الإمارات",
    idn: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mx-auto max-w-3xl space-y-4 animate-fade-in">
      <div className="rounded-2xl bg-[#0a2c72] p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <IconPlus size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">تحويل مستفيد جديد</h1>
            <p className="text-sm text-blue-100">إضافة مستفيد ثم تنفيذ التحويل</p>
          </div>
        </div>
      </div>
      <Card title="بيانات المستفيد الجديد">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["name", "الاسم الكامل"],
            ["idn", "رقم الهوية / الإقامة"],
            ["iban", "رقم الآيبان"],
            ["bank", "اسم المصرف"],
          ].map(([k, l]) => (
            <label key={k} className="text-sm">
              <span className="text-xs text-slate-500">{l}</span>
              <input
                value={(form as Record<string, string>)[k]}
                onChange={(e) => set(k, e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>
          ))}
          <label className="text-sm">
            <span className="text-xs text-slate-500">الدولة</span>
            <select
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
            >
              {["الإمارات", "الكويت", "قطر", "البحرين", "عُمان", "مصر", "الأردن", "الولايات المتحدة"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          onClick={() => {
            if (!form.name || !form.iban) return onToast("يرجى تعبئة الاسم والآيبان", "err");
            onToast("تم حفظ المستفيد بنجاح ويمكن التحويل إليه", "ok");
          }}
          className="mt-4 rounded-xl bg-[#0a2c72] px-6 py-3 font-bold text-white"
        >
          حفظ المستفيد
        </button>
      </Card>
    </div>
  );
}

export function AccountsPage() {
  const [show, setShow] = useState(true);
  const [copied, setCopied] = useState("");
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-[#0a2c72]">الحسابات</h1>
        <button onClick={() => setShow((v) => !v)} className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-100">
          {show ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {ACCOUNTS.map((a) => (
          <div key={a.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className={`rounded-xl bg-gradient-to-l ${a.color} p-4 text-white`}>
              <div className="text-sm text-white/80">{a.name}</div>
              <div className="mt-2 text-2xl font-black">
                {show ? formatMoney(a.balance) : "••••••"} {a.currency}
              </div>
              <div className="mt-3 font-mono text-xs tracking-wider">{a.number}</div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">IBAN</span>
              <button
                className="inline-flex items-center gap-1 font-mono text-xs font-bold"
                onClick={() => {
                  navigator.clipboard?.writeText(a.iban.replace(/\s/g, ""));
                  setCopied(a.id);
                }}
              >
                {a.iban} <IconCopy size={14} />
                {copied === a.id && <span className="text-emerald-600">تم النسخ</span>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardsPage({ onToast }: { onToast: (m: string, t?: "ok" | "err" | "info") => void }) {
  const [frozen, setFrozen] = useState(false);
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-extrabold text-[#0a2c72]">البطاقات</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#071e52] to-[#1a5fbf] p-6 text-white shadow-xl min-h-[200px]">
          <div className="text-sm text-blue-100">مدى بلاتينية</div>
          <div className="mt-8 font-mono text-xl tracking-[0.25em]">4580  ••••  ••••  2291</div>
          <div className="mt-8 flex justify-between text-sm">
            <div>
              <div className="text-[10px] text-blue-200">حامل البطاقة</div>
              عميل المصرف
            </div>
            <div>
              <div className="text-[10px] text-blue-200">تنتهي</div>
              08/28
            </div>
          </div>
          {frozen && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-black">
              البطاقة موقوفة مؤقتاً
            </div>
          )}
        </div>
        <Card title="إدارة البطاقة" icon={<IconCard size={16} />}>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setFrozen((v) => !v);
                onToast(frozen ? "تم إعادة تفعيل البطاقة" : "تم إيقاف البطاقة مؤقتاً", "ok");
              }}
              className="rounded-xl bg-slate-50 py-3 text-sm font-bold"
            >
              {frozen ? "تفعيل" : "إيقاف مؤقت"}
            </button>
            <button onClick={() => onToast("تم إرسال الرقم السري للجوال المسجّل", "info")} className="rounded-xl bg-slate-50 py-3 text-sm font-bold">
              عرض الرقم السري
            </button>
            <button onClick={() => onToast("تم تحديد حد يومي جديد", "ok")} className="rounded-xl bg-slate-50 py-3 text-sm font-bold">
              تعديل الحدود
            </button>
            <button onClick={() => onToast("تم تعطيل الشراء عبر الإنترنت", "info")} className="rounded-xl bg-slate-50 py-3 text-sm font-bold">
              الشراء الإلكتروني
            </button>
          </div>
          <div className="mt-4 rounded-xl bg-blue-50 p-3 text-sm">
            الحد المتاح اليوم: <b>12,450.00 SAR</b>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function PaymentsPage({ onToast }: { onToast: (m: string, t?: "ok" | "err" | "info") => void }) {
  const [paid, setPaid] = useState<string[]>([]);
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-extrabold text-[#0a2c72]">المدفوعات</h1>
      <Card title="الفواتير المستحقة (سداد)" icon={<IconFile size={16} />}>
        <div className="divide-y divide-slate-100">
          {BILLS.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <div className="font-bold text-[#0a2c72]">{b.name}</div>
                <div className="text-xs text-slate-500">
                  مرجع {b.ref} · الاستحقاق {b.due}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-extrabold">{formatMoney(b.amount)} SAR</div>
                {paid.includes(b.id) ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <IconCheck size={12} /> مدفوعة
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setPaid((p) => [...p, b.id]);
                      onToast(`تم سداد فاتورة ${b.name}`, "ok");
                    }}
                    className="rounded-xl bg-[#0a2c72] px-4 py-2 text-sm font-bold text-white"
                  >
                    سداد
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function FinancingPage() {
  const products = [
    { t: "تمويل شخصي", d: "حتى 2,000,000 ريال · موافقة فورية", r: "من 3.49%" },
    { t: "تمويل سيارات", d: "سيارات جديدة ومستعملة", r: "من 2.99%" },
    { t: "التمويل العقاري", d: "مدعوم وغير مدعوم", r: "حسب مبادرة الإسكان" },
  ];
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-extrabold text-[#0a2c72]">التمويل</h1>
      <div className="grid gap-3 md:grid-cols-3">
        {products.map((p) => (
          <div key={p.t} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="text-lg font-extrabold text-[#0a2c72]">{p.t}</div>
            <p className="mt-1 text-sm text-slate-500">{p.d}</p>
            <div className="mt-4 text-sm font-bold text-[#1a5fbf]">{p.r}</div>
            <button className="mt-4 w-full rounded-xl bg-[#0a2c72] py-2.5 text-sm font-bold text-white">قدّم الآن</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EServicesPage({ onToast }: { onToast: (m: string, t?: "ok" | "err" | "info") => void }) {
  const items = [
    { t: "شهادة الآيبان", i: <IconBank /> },
    { t: "طلب دفتر شيكات", i: <IconFile /> },
    { t: "تحديث الهوية", i: <IconUser /> },
    { t: "إثبات راتب", i: <IconDownload /> },
    { t: "تفعيل خدمة الرسائل", i: <IconPhone /> },
    { t: "إدارة الأجهزة الموثوقة", i: <IconShield /> },
  ];
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-extrabold text-[#0a2c72]">الخدمات الإلكترونية</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x) => (
          <button
            key={x.t}
            onClick={() => onToast(`تم فتح خدمة: ${x.t}`, "info")}
            className="flex items-center justify-between rounded-2xl bg-white p-4 text-right shadow-sm ring-1 ring-slate-100 hover:ring-blue-200"
          >
            <span className="font-bold text-[#0a2c72]">{x.t}</span>
            <span className="text-[#1a5fbf]">{x.i}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReportsPage() {
  const [from, setFrom] = useState("2026-09-01");
  const [to, setTo] = useState("2026-09-29");
  const rows = useMemo(() => TRANSACTIONS, []);
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-extrabold text-[#0a2c72]">التقارير وكشوف الحساب</h1>
      <Card title="تصفية الفترة" extra={<button className="text-xs font-bold text-[#1a5fbf]">تصدير Excel</button>}>
        <div className="flex flex-wrap gap-3">
          <label className="text-sm">
            من
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mr-2 rounded-lg border px-2 py-1" />
          </label>
          <label className="text-sm">
            إلى
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mr-2 rounded-lg border px-2 py-1" />
          </label>
        </div>
      </Card>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-[#0a2c72] text-white">
            <tr>
              <th className="p-3 text-right font-bold">العملية</th>
              <th className="p-3 text-right font-bold">التاريخ</th>
              <th className="p-3 text-right font-bold">المبلغ</th>
              <th className="p-3 text-right font-bold">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="p-3">
                  <div className="font-bold">{t.title}</div>
                  <div className="text-xs text-slate-500">{t.subtitle}</div>
                </td>
                <td className="p-3">{t.date}</td>
                <td className={`p-3 font-extrabold ${t.amount > 0 ? "text-emerald-600" : ""}`}>{formatMoney(t.amount)}</td>
                <td className="p-3">{t.status === "pending" ? "قيد المعالجة" : "مكتمل"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SettingsPage({ onToast }: { onToast: (m: string, t?: "ok" | "err" | "info") => void }) {
  const [twofa, setTwofa] = useState(true);
  return (
    <div className="mx-auto max-w-3xl space-y-4 animate-fade-in">
      <h1 className="text-xl font-extrabold text-[#0a2c72]">الإعدادات</h1>
      <Card title="الملف الشخصي" icon={<IconUser size={16} />}>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <div className="text-xs text-slate-500">الاسم</div>
            <div className="font-bold">عميل المصرف</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">الجوال</div>
            <div className="font-bold" dir="ltr">
              +966 5X XXX 4412
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">البريد</div>
            <div className="font-bold">client@email.com</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">اللغة</div>
            <div className="font-bold">العربية</div>
          </div>
        </div>
      </Card>
      <Card title="الأمان" icon={<IconLock size={16} />}>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
          <div>
            <div className="font-bold">التحقق بخطوتين</div>
            <div className="text-xs text-slate-500">حماية إضافية عند الدخول والتحويل</div>
          </div>
          <button
            onClick={() => {
              setTwofa((v) => !v);
              onToast(twofa ? "تم إيقاف التحقق بخطوتين" : "تم تفعيل التحقق بخطوتين", "ok");
            }}
            className={`h-7 w-12 rounded-full ${twofa ? "bg-emerald-500" : "bg-slate-300"} relative`}
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${twofa ? "left-0.5" : "right-0.5"}`} />
          </button>
        </div>
        <button onClick={() => onToast("تم إرسال رابط تغيير كلمة المرور", "info")} className="mt-3 text-sm font-bold text-[#1a5fbf]">
          تغيير كلمة المرور
        </button>
      </Card>
      <Card title="تفضيلات التطبيق" icon={<IconGear size={16} />}>
        <p className="text-sm text-slate-500">واجهة مصرف الراجحي التجريبية · الوضع الفاتح · الاتجاه من اليمين لليسار.</p>
      </Card>
    </div>
  );
}


