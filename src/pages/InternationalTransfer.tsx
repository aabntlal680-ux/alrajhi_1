import { useEffect, useMemo, useRef, useState } from "react";
import {
  CURRENCIES,
  calcFee,
  formatMoney,
  type Beneficiary,
} from "../data";
import { getAllBeneficiaries, getLastSavedBeneficiaryId } from "../utils/demoStorage";
import {
  IconBank,
  IconCalendar,
  IconCheck,
  IconChevron,
  IconClock,
  IconFile,
  IconGlobe,
  IconInfo,
  IconPrint,
  IconSend,
  IconTransfer,
  IconX,
  UaeFlag,
} from "../icons";

type Props = {
  onToast: (msg: string, type?: "ok" | "err" | "info") => void;
};

const MIN_AMOUNT = 1;

function FlagFor({ code }: { code: string }) {
  if (code === "AE" || code === "AED") return <UaeFlag />;
  const map: Record<string, string> = {
    KW: "🇰🇼",
    SA: "🇸🇦",
    US: "🇺🇸",
    GB: "🇬🇧",
    EU: "🇪🇺",
  };
  return <span className="text-lg leading-none">{map[code] ?? "🏳️"}</span>;
}

export default function InternationalTransfer({ onToast }: Props) {
  const beneficiaries = useMemo(() => getAllBeneficiaries(), []);
  const internationalBeneficiaries = useMemo(
    () => beneficiaries.filter((item) => item.countryCode !== "SA"),
    [beneficiaries]
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [beneficiaryId, setBeneficiaryId] = useState(() => {
    const last = getLastSavedBeneficiaryId();
    return internationalBeneficiaries.some((item) => item.id === last)
      ? last
      : internationalBeneficiaries[0]?.id ?? "";
  });
  const [amount, setAmount] = useState(2500);
  const [amountStr, setAmountStr] = useState("2,500.00");
  const [currency, setCurrency] = useState("AED");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [curOpen, setCurOpen] = useState(false);
  const [benOpen, setBenOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [demoCodeOpen, setDemoCodeOpen] = useState(false);
  const [demoCode, setDemoCode] = useState("");
  const [simulationResult, setSimulationResult] = useState<"success" | "failed" | null>(null);
  const [busy, setBusy] = useState(false);
  const [refNo, setRefNo] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const curRef = useRef<HTMLDivElement>(null);
  const benRef = useRef<HTMLDivElement>(null);

  const beneficiary = (beneficiaries.find((item) => item.id === beneficiaryId) ??
    internationalBeneficiaries[0]) as Beneficiary;
  const cur = CURRENCIES.find((item) => item.code === currency) ?? CURRENCIES[0];
  const fee = useMemo(() => calcFee(amount), [amount]);
  const sent = Math.max(amount - fee, 0);
  const received = sent * cur.rate;

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (curRef.current && !curRef.current.contains(event.target as Node)) setCurOpen(false);
      if (benRef.current && !benRef.current.contains(event.target as Node)) setBenOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const displayDate = date.replace(/-/g, "/");

  const applyAmount = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, "");
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return;
    setAmount(n);
    setAmountStr(
      n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  };

  const startSend = () => {
    if (amount < MIN_AMOUNT) {
      onToast(`الحد الأدنى للمبلغ هو ${formatMoney(MIN_AMOUNT)} ريال`, "err");
      return;
    }
    if (amount <= 0) {
      onToast("يرجى إدخال مبلغ صحيح", "err");
      return;
    }
    setConfirmOpen(true);
  };

  const goReview = () => {
    setConfirmOpen(false);
    setStep(2);
    onToast("انتقلت إلى مراجعة بيانات التحويل.", "info");
  };

  const requestDemoCode = () => {
    setDemoCode("");
    setDemoCodeOpen(true);
  };

  const submitDemoCode = () => {
    const code = demoCode.trim().toUpperCase();
    if (code !== "DEMO-SUCCESS" && code !== "DEMO-FAIL") {
      onToast("استخدم رمزًا صالح: DEMO-SUCCESS أو DEMO-FAIL.", "err");
      return;
    }

    const result = code === "DEMO-SUCCESS" ? "success" : "failed";
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setDemoCodeOpen(false);
      setDemoCode("");
      setSimulationResult(result);
      setRefNo(`SIM-${Date.now().toString().slice(-10)}`);
      setStep(3);
      onToast(
        result === "success"
          ? "اكتملت عملية التحقق بنجاح؛."
          : "عملية تحقق فاشلة؛.",
        "info"
      );
    }, 500);
  };

  const resetAll = () => {
    setStep(1);
    setSimulationResult(null);
    setDemoCode("");
    setDemoCodeOpen(false);
    setRefNo("");
    setCancelOpen(false);
    onToast("جاري التحقق.", "info");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="overflow-hidden rounded-2xl bg-[#0a2c72] text-white shadow-lg shadow-[#0a2c72]/20">
            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                  <IconGlobe size={26} />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold lg:text-[22px]">تحويل دولي ·</h1>
                  <p className="text-[12.5px] text-blue-100/90"> جاري التقدم</p>
                </div>
              </div>

              <ol className="flex min-w-0 flex-1 items-center justify-end gap-2 lg:max-w-[560px]">
                {[
                  { n: 1, label: "بيانات التحويل" },
                  { n: 2, label: "مراجعة العملية" },
                  { n: 3, label: "نتيجة العملية" },
                ].map((s, i) => (
                  <li key={s.n} className="flex min-w-0 items-center gap-2">
                    {i > 0 && <div className={`step-line ${step >= s.n ? "opacity-100" : "opacity-40"}`} />}
                    <button
                      onClick={() => {
                        if (s.n < step) setStep(s.n as 1 | 2 | 3);
                      }}
                      className="flex shrink-0 flex-col items-center gap-1"
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${
                          step === s.n
                            ? "bg-white text-[#0a2c72] ring-4 ring-white/20"
                            : step > s.n
                            ? "bg-[#4da3ff] text-white"
                            : "bg-white/15 text-white"
                        }`}
                      >
                        {step > s.n ? <IconCheck size={16} /> : s.n}
                      </span>
                      <span className="hidden text-[11px] font-semibold whitespace-nowrap sm:block">
                        {s.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {step === 1 && (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <header className="mb-3 flex items-center justify-between">
                    <h2 className="text-[15px] font-extrabold text-[#1a5fbf]">تفاصيل التحويل</h2>
                    <span className="text-[#1a5fbf]">
                      <IconFile size={18} />
                    </span>
                  </header>
                  <div className="space-y-3 text-[13px]">
                    <div className="relative" ref={benRef}>
                      <div className="text-[12px] text-slate-500">اسم المستفيد</div>
                      <button
                        onClick={() => setBenOpen((v) => !v)}
                        className="mt-0.5 w-full text-right text-[13.5px] font-bold text-[#0a2c72] hover:text-blue-700"
                      >
                        {beneficiary.name}
                      </button>
                      {benOpen && (
                        <div className="absolute top-full right-0 z-20 mt-1 w-full min-w-[260px] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
                          {internationalBeneficiaries.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => {
                                setBeneficiaryId(b.id);
                                setCurrency(b.currency === "SAR" ? "AED" : b.currency);
                                setBenOpen(false);
                              }}
                              className="block w-full px-3 py-2.5 text-right text-sm hover:bg-blue-50"
                            >
                              <div className="font-bold">{b.name}</div>
                              <div className="text-[11px] text-slate-500">{b.bank}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-500">رقم الحساب / الإقامة</div>
                      <div className="mt-0.5 font-bold tracking-wider text-[#0a2c72]">{beneficiary.idNumber}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-500">الجنسية</div>
                      <div className="mt-0.5 font-bold text-[#0a2c72]">{beneficiary.nationality}</div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <header className="mb-3 flex items-center justify-between">
                    <h2 className="text-[15px] font-extrabold text-[#1a5fbf]">بيانات التحويل</h2>
                    <span className="text-[#1a5fbf]">
                      <IconTransfer size={18} />
                    </span>
                  </header>
                  <div className="space-y-3 text-[13px]">
                    <div>
                      <div className="flex items-center gap-1 text-[12px] text-slate-500">
                        المبلغ
                        <IconInfo size={13} className="text-blue-400" />
                      </div>
                      <input
                        value={amountStr}
                        onChange={(e) => setAmountStr(e.target.value)}
                        onBlur={() => applyAmount(amountStr)}
                        className="mt-0.5 w-full border-0 bg-transparent text-[15px] font-extrabold text-[#0a2c72] outline-none"
                      />
                      <div className="-mt-1 text-[11px] text-slate-400">SAR</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-500">نوع التحويل</div>
                      <div className="mt-0.5 flex items-center justify-between font-bold text-[#0a2c72]">
                        <span>تحويل دولي</span>
                        <IconChevron size={16} className="text-slate-400" />
                      </div>
                    </div>
                    <div className="relative" ref={curRef}>
                      <div className="text-[12px] text-slate-500">العملة</div>
                      <button
                        onClick={() => setCurOpen((v) => !v)}
                        className="mt-0.5 flex w-full items-center justify-between font-bold text-[#0a2c72]"
                      >
                        <span>
                          {cur.name} ({cur.code})
                        </span>
                        <IconChevron size={16} className="text-slate-400" />
                      </button>
                      {curOpen && (
                        <div className="absolute top-full right-0 z-20 mt-1 max-h-64 w-full min-w-[240px] overflow-auto rounded-xl border border-slate-100 bg-white shadow-xl">
                          {CURRENCIES.map((c) => (
                            <button
                              key={c.code}
                              onClick={() => {
                                setCurrency(c.code);
                                setCurOpen(false);
                              }}
                              className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-blue-50 ${
                                c.code === currency ? "bg-blue-50 font-bold" : ""
                              }`}
                            >
                              <span>
                                {c.flag} {c.name}
                              </span>
                              <span className="text-xs text-slate-400">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <header className="mb-3 flex items-center justify-between">
                    <h2 className="text-[15px] font-extrabold text-[#1a5fbf]">معلومات الحوالة</h2>
                    <span className="text-[#1a5fbf]"><IconFile size={18} /></span>
                  </header>
                  <div className="space-y-3 text-[13px]">
                    <div>
                      <div className="text-[12px] text-slate-500">نوع الرسوم</div>
                      <div className="mt-0.5 font-bold text-[#0a2c72]">قيمة تقديرية</div>
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-1 text-[12px] text-slate-500">
                        تاريخ العملية
                        <IconCalendar size={13} className="text-[#1a5fbf]" />
                      </div>
                      <button onClick={() => setCalOpen(true)} className="mt-0.5 font-bold text-[#0a2c72]">
                        {displayDate}
                      </button>
                    </div>
                    <div>
                      <div className="mb-1 text-[12px] text-slate-500">حالة العملية</div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[12px] font-bold text-blue-700">
                        {simulationResult === "success" ? "نجاح" : simulationResult === "failed" ? "فشل " : "قيد التقدم "}
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-start justify-between gap-3 px-4 pt-4">
                    <div>
                      <div className="flex items-center gap-2 text-[15px] font-extrabold text-[#1a5fbf]">
                        حالة سيناريو الاختبار <IconClock size={18} />
                      </div>
                      <div className="mt-1 text-[13px] font-bold text-[#0a2c72]">
                        {simulationResult === "success" ? "تم عرض نتيجة نجاح" : simulationResult === "failed" ? "تم عرض نتيجة فشل " : "لم يتم التحقق"}
                      </div>
                      <div className="text-[12px] text-slate-500">تحت المعالجه.</div>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">محاكاة</span>
                  </div>
                  <div className="mt-3 bg-blue-50/60 px-4 py-3">
                    <div className="grid grid-cols-1 gap-3 text-[13px] md:grid-cols-4 md:items-center">
                      <div>
                        <div className="text-[11px] text-slate-500">بند الرسوم</div>
                      </div>
                      <div className="font-extrabold text-[#0a2c72]">
                        <div className="text-[11px] font-medium text-slate-500">القيمة الافتراضية</div>
                        {formatMoney(fee)} SAR
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">التحصيل</div>
                      </div>
                      <div className="text-slate-600">
                        <div className="text-[11px] text-slate-500">ملاحظة</div>
                      </div>
                    </div>
                  </div>
                </section>

              <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <h3 className="mb-3 flex items-center gap-2 text-[15px] font-extrabold text-[#1a5fbf]">
                  تفاصيل العملية والمعلومات
                  <IconFile size={16} />
                </h3>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div>
                    <div className="text-[12px] text-slate-500">الحد الأقصى للتحويل</div>
                    <div className="mt-1 font-extrabold text-[#0a2c72]">غير محدد</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-slate-500">الحد الأدنى للتحويل</div>
                    <div className="mt-1 font-extrabold text-[#0a2c72]">{formatMoney(MIN_AMOUNT)} SAR</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[12px] text-slate-500">
                      المصرف المستفيد
                      <IconBank size={13} className="text-[#1a5fbf]" />
                    </div>
                    <div className="mt-1 font-extrabold text-[#0a2c72]">{beneficiary.bank}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-slate-500">الدولة المستفيدة</div>
                    <div className="mt-1 flex items-center gap-2 font-extrabold text-[#0a2c72]">
                      {beneficiary.country}
                      <FlagFor code={beneficiary.countryCode} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-[13px] text-[#0a2c72]">
                  سعر صرف : 1 SAR = {cur.rate} {cur.code} · المبلغ المتوقع{" "}
                  <b>
                    {formatMoney(received)} {cur.code}
                  </b>
                </div>
              </section>
            </>
          )}

          {step === 2 && (
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-extrabold text-[#0a2c72]">مراجعة العمليه</h2>
              <p className="mt-1 text-sm text-slate-500">راجع بيانات العملية؛</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["المستفيد", beneficiary.name],
                  ["المصرف", beneficiary.bank],
                  ["الدولة", beneficiary.country],
                  ["المبلغ", `${formatMoney(amount)} SAR`],
                  ["الرسوم", `${formatMoney(fee)} SAR`],
                  ["المبلغ المرسل", `${formatMoney(sent)} SAR`],
                  ["العملة", `${cur.name} (${cur.code})`],
                  ["المبلغ المستلم", `${formatMoney(received)} ${cur.code}`],
                  ["التاريخ", displayDate],
                  ["الحساب ", "حساب  · **** 0000"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-slate-50 px-4 py-3">
                    <div className="text-[12px] text-slate-500">{k}</div>
                    <div className="mt-0.5 font-bold text-[#0a2c72]">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={requestDemoCode}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0a2c72] px-6 py-3 font-bold text-white hover:bg-[#0d3a8a]"
                >
                  تاكيد الرمز
                  <IconSend size={18} />
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-[#0a2c72] px-6 py-3 font-bold text-[#0a2c72]"
                >
                  العودة للتعديل
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section id="receipt-print" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex flex-col items-center text-center">
                <div className={`check-pop flex h-16 w-16 items-center justify-center rounded-full text-white ${simulationResult === "failed" ? "bg-red-600" : "bg-emerald-500"}`}>
                  {simulationResult === "failed" ? <IconX size={30} /> : <IconCheck size={32} />}
                </div>
                <h2 className={`mt-3 text-xl font-extrabold ${simulationResult === "failed" ? "text-red-700" : "text-emerald-700"}`}>
                  {simulationResult === "failed" ? "فشل العملية" : "نجاح العملية"}
                </h2>
                <p className="text-sm text-slate-500">تقرير العملية الجارية</p>
                <div className="mt-2 rounded-full bg-blue-50 px-4 py-1 text-sm font-bold text-[#1a5fbf]">
                  رقم المرجعي: {refNo}
                </div>
              </div>

              {simulationResult === "failed" && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
                  <div className="font-extrabold">سبب الفشل </div>
                  <p>رسوم غير مكتملة</p>
                </div>
              )}

              <div className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-100">
                {[
                  ["المستفيد", beneficiary.name],
                  ["المصرف", beneficiary.bank],
                  ["الدولة", beneficiary.country],
                  ["المبلغ", `${formatMoney(amount)} SAR`],
                  ["الرسوم التقديرية", `${formatMoney(fee)} SAR`],
                  ["المبلغ", `${formatMoney(sent)} SAR`],
                  ["العملة المقابلة", `${formatMoney(received)} ${cur.code}`],
                  ["تاريخ العمليه", displayDate],
                  ["الحالة", simulationResult === "failed" ? "فشل " : "نجاح "],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className={`text-left font-bold ${simulationResult === "failed" && ["المستفيد ", "المصرف ", "الحالة"].includes(label) ? "text-red-700" : "text-[#0a2c72]"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0a2c72] px-5 py-2.5 font-bold text-white"
                >
                  <IconPrint size={16} /> طباعة تقرير 
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setSimulationResult(null);
                    setRefNo("");
                  }}
                  className="rounded-xl px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-50"
                >
                  اختبار جديد
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="w-full shrink-0 xl:w-[280px]">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 xl:sticky xl:top-4">
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-[#1a5fbf]">ملخص التحويل</h2>
              <span className="text-[#1a5fbf]">
                <IconTransfer size={18} />
              </span>
            </header>
            <div className="space-y-3 text-[13.5px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">المبلغ</span>
                <span className="font-extrabold text-[#0a2c72]">{formatMoney(amount)} SAR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">رسوم</span>
                <span className="font-extrabold text-[#0a2c72]">{formatMoney(fee)} SAR</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-slate-500">الصافي</span>
                <span className="font-extrabold text-[#0a2c72]">{formatMoney(sent)} SAR</span>
              </div>
            </div>
            <button
              onClick={startSend}
              disabled={step === 3}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a2c72] py-3 text-[14.5px] font-extrabold text-white shadow-md shadow-[#0a2c72]/25 hover:bg-[#0d3a8a] disabled:opacity-50"
            >
              بدء المحاكاة
              <IconSend size={18} />
            </button>
            <button
              onClick={() => setCancelOpen(true)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0a2c72] bg-white py-3 text-[14.5px] font-extrabold text-[#0a2c72] hover:bg-slate-50"
            >
              إعادة ضبط
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#0a2c72]">
                <IconX size={12} />
              </span>
            </button>
          </div>
        </aside>
      </div>

      {calOpen && (
        <Modal onClose={() => setCalOpen(false)} title=" تاريخ التحويل">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={() => setCalOpen(false)}
            className="mt-4 w-full rounded-xl bg-[#0a2c72] py-2.5 font-bold text-white"
          >
            تأكيد التاريخ
          </button>
        </Modal>
      )}

      {confirmOpen && (
        <Modal onClose={() => setConfirmOpen(false)} title="تأكيد بيانات التحويل">
          <p className="text-sm leading-6 text-slate-600">
            المبلغ المحول{" "}
            <b>
              {formatMoney(amount)} SAR
            </b>{" "}
            والمستفيد <b>{beneficiary.name}</b>.
          </p>
          <div className="mt-4 flex gap-2">
            <button onClick={goReview} className="flex-1 rounded-xl bg-[#0a2c72] py-2.5 font-bold text-white">
              متابعة المحاكاة
            </button>
            <button
              onClick={() => setConfirmOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 font-bold"
            >
              رجوع
            </button>
          </div>
        </Modal>
      )}

      {demoCodeOpen && (
        <Modal onClose={() => !busy && setDemoCodeOpen(false)} title="اختيار نتيجة تجريبية">
          <p className="text-sm leading-6 text-slate-600">
            هذه خانة رمز اختبار وليست كلمة مرور. لا تدخل أي كلمة مرور أو بيانات دخول حقيقية؛ الرمز لا يُحفظ ولا يُرسل إلى أي جهة.
          </p>
          <label htmlFor="simulation-code" className="mt-4 block text-sm font-bold text-[#0a2c72]">
            رمز السيناريو
          </label>
          <input
            id="simulation-code"
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={demoCode}
            onChange={(event) => setDemoCode(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitDemoCode();
            }}
            placeholder="DEMO-SUCCESS أو DEMO-FAIL"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left font-mono outline-none focus:ring-2 focus:ring-blue-200"
            dir="ltr"
            disabled={busy}
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => setDemoCode("DEMO-SUCCESS")}
              className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-800 disabled:opacity-50"
            >
              تجربة نجاح
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setDemoCode("DEMO-FAIL")}
              className="rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-800 disabled:opacity-50"
            >
              تجربة فشل
            </button>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={submitDemoCode}
            className="mt-3 w-full rounded-xl bg-[#0a2c72] py-2.5 font-bold text-white disabled:opacity-50"
          >
            {busy ? "جاري عرض النتيجة التجريبية..." : "عرض نتيجة المحاكاة"}
          </button>
        </Modal>
      )}

      {cancelOpen && (
        <Modal onClose={() => setCancelOpen(false)} title="إعادة ضبط المحاكاة">
          <p className="text-sm text-slate-600">هل تريد إعادة بيانات هذا السيناريو إلى البداية؟</p>
          <div className="mt-4 flex gap-2">
            <button onClick={resetAll} className="flex-1 rounded-xl bg-red-600 py-2.5 font-bold text-white">
              نعم، إعادة الضبط
            </button>
            <button onClick={() => setCancelOpen(false)} className="flex-1 rounded-xl border py-2.5 font-bold">
              لا
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#0a2c72]">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100">
            <IconX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
