import { useEffect, useMemo, useRef, useState } from "react";
import {
  BENEFICIARIES,
  CURRENCIES,
  calcFee,
  formatMoney,
  type Beneficiary,
} from "../data";
import {
  IconBank,
  IconCalendar,
  IconCheck,
  IconChevron,
  IconClock,
  IconDownload,
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

const MIN_AMOUNT = 1000000;

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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [beneficiaryId, setBeneficiaryId] = useState(BENEFICIARIES[0].id);
  const [amount, setAmount] = useState(1000000);
  const [amountStr, setAmountStr] = useState("1,000,000.00");
  const [currency, setCurrency] = useState("AED");
  const [date, setDate] = useState("2026-09-29");
  const [curOpen, setCurOpen] = useState(false);
  const [benOpen, setBenOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [feePaid, setFeePaid] = useState(false);
  const [refNo, setRefNo] = useState("RJ-20260929-88421");
  const [cancelOpen, setCancelOpen] = useState(false);
  const curRef = useRef<HTMLDivElement>(null);
  const benRef = useRef<HTMLDivElement>(null);

  const beneficiary = BENEFICIARIES.find((b) => b.id === beneficiaryId) as Beneficiary;
  const cur = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];
  const fee = useMemo(() => calcFee(amount), [amount]);
  const sent = Math.max(amount - fee, 0);
  const received = sent * cur.rate;
  const incomplete = !feePaid && step === 1;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (curRef.current && !curRef.current.contains(e.target as Node)) setCurOpen(false);
      if (benRef.current && !benRef.current.contains(e.target as Node)) setBenOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!pinOpen || busy) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9" && pin.length < 4) setPin((p) => (p + e.key).slice(0, 4));
      if (e.key === "Backspace") setPin((p) => p.slice(0, -1));
      if (e.key === "Enter") submitPin();
      if (e.key === "Escape") setPinOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinOpen, pin, busy]);

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
      onToast(`الحد الأدنى للتحويل هو ${formatMoney(MIN_AMOUNT)} ريال`, "err");
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
    onToast("تم الانتقال إلى المراجعة والتأكيد", "info");
  };

  const requestPin = () => {
    setPin("");
    setPinOpen(true);
  };

  const submitPin = () => {
    if (pin.length < 4) {
      onToast("يرجى إدخال الرقم السري المكوّن من 4 خانات", "err");
      return;
    }
    if (pin !== "1234" && pin !== "0000") {
      onToast("الرقم السري غير صحيح. للتجربة استخدم 1234", "err");
      setPin("");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setPinOpen(false);
      setFeePaid(true);
      setRefNo("RJ-" + Date.now().toString().slice(-10));
      setStep(3);
      onToast("تم تنفيذ التحويل بنجاح", "ok");
    }, 1400);
  };

  const payFees = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setFeePaid(true);
      onToast("تم تحصيل الرسوم بنجاح", "ok");
    }, 900);
  };

  const resetAll = () => {
    setStep(1);
    setFeePaid(false);
    setCancelOpen(false);
    onToast("تم إلغاء العملية", "info");
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
                  <h1 className="text-xl font-extrabold lg:text-[22px]">تحويل دولي</h1>
                  <p className="text-[12.5px] text-blue-100/90">إجراء تحويل مالي إلى خارج المملكة</p>
                </div>
              </div>

              <ol className="flex min-w-0 flex-1 items-center justify-end gap-2 lg:max-w-[560px]">
                {[
                  { n: 1, label: "بيانات التحويل" },
                  { n: 2, label: "المراجعة والتأكيد" },
                  { n: 3, label: "إصدار الإيصال" },
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
                          {BENEFICIARIES.filter((b) => b.countryCode !== "SA").map((b) => (
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
                      <div className="text-[12px] text-slate-500">رقم الهوية / الإقامة</div>
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
                    <h2 className="text-[15px] font-extrabold text-[#1a5fbf]">معلومات إضافية</h2>
                    <span className="text-[#1a5fbf]">
                      <IconFile size={18} />
                    </span>
                  </header>
                  <div className="space-y-3 text-[13px]">
                    <div>
                      <div className="text-[12px] text-slate-500">نوع الرسوم</div>
                      <div className="mt-0.5 font-bold text-[#0a2c72]">رسوم خدمات تفعيل عملية تحويل</div>
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-1 text-[12px] text-slate-500">
                        تاريخ التحويل
                        <IconCalendar size={13} className="text-[#1a5fbf]" />
                      </div>
                      <button
                        onClick={() => setCalOpen(true)}
                        className="mt-0.5 font-bold text-[#0a2c72]"
                      >
                        {displayDate}
                      </button>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-[12px] text-slate-500">
                        حالة التحويل
                        <IconX size={12} className="text-slate-400" />
                      </div>
                      {incomplete ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fde8ea] px-3 py-1 text-[12px] font-bold text-[#d32f2f]">
                          لم يتم إكمالها
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e53935] text-white">
                            <IconX size={10} />
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-700">
                          جاهز للإرسال
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <IconCheck size={10} />
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                <div className="flex items-start justify-between gap-3 px-4 pt-4">
                  <div>
                    <div className="flex items-center gap-2 text-[15px] font-extrabold text-[#1a5fbf]">
                      حالة التحويل
                      <IconClock size={18} />
                    </div>
                    <div className={`mt-1 text-[13px] font-bold ${incomplete ? "text-[#d32f2f]" : "text-emerald-700"}`}>
                      {incomplete ? (
                        <span className="inline-flex items-center gap-1">
                          لم يتم إكمال عملية التحويل
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e53935] text-white">
                            <IconX size={10} />
                          </span>
                        </span>
                      ) : (
                        "تم استكمال إجراءات الرسوم — يمكن إرسال التحويل"
                      )}
                    </div>
                    <div className="text-[12px] text-slate-500">
                      {incomplete
                        ? "يتم استكمال إجراءات التحويل"
                        : "الرسوم محصّلة وجاهزة للمتابعة"}
                    </div>
                  </div>
                  {incomplete && (
                    <button
                      onClick={payFees}
                      disabled={busy}
                      className="rounded-xl bg-[#0a2c72] px-3 py-2 text-xs font-bold text-white hover:bg-[#0d3a8a] disabled:opacity-60"
                    >
                      {busy ? "جاري التحصيل..." : "تحصيل الرسوم"}
                    </button>
                  )}
                </div>

                <div className={`mt-3 ${incomplete ? "bg-[#fff5f6]" : "bg-emerald-50/60"} px-4 py-3`}>
                  <div className="hidden grid-cols-4 gap-3 text-[12px] font-bold text-[#1a5fbf] md:grid">
                    <div>نوع الرسوم</div>
                    <div>المبلغ</div>
                    <div>الحالة</div>
                    <div>ملاحظات</div>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-3 text-[13px] md:grid-cols-4 md:items-center">
                    <div>
                      <div className="text-[11px] text-slate-400 md:hidden">نوع الرسوم</div>
                      رسوم خدمات تفعيل عملية تحويل
                    </div>
                    <div className="font-extrabold text-[#0a2c72]">
                      <div className="text-[11px] font-medium text-slate-400 md:hidden">المبلغ</div>
                      {formatMoney(fee)} SAR
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 md:hidden">الحالة</div>
                      {incomplete ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fde8ea] px-3 py-1 text-[12px] font-bold text-[#d32f2f]">
                          لم يتم تحصيلها
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e53935] text-white">
                            <IconX size={10} />
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-bold text-emerald-700">
                          تم تحصيلها
                          <IconCheck size={12} />
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600">
                      <div className="text-[11px] text-slate-400 md:hidden">ملاحظات</div>
                      الرسوم المستحقة لتفعيل عملية تحويل إلى دولة {beneficiary.country}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <h3 className="mb-3 flex items-center gap-2 text-[15px] font-extrabold text-[#1a5fbf]">
                  تفاصيل الرسوم والمعلومات
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
                  سعر الصرف التقريبي: 1 SAR = {cur.rate} {cur.code} · المبلغ المستلم المتوقع{" "}
                  <b>
                    {formatMoney(received)} {cur.code}
                  </b>
                </div>
              </section>
            </>
          )}

          {step === 2 && (
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-extrabold text-[#0a2c72]">المراجعة والتأكيد</h2>
              <p className="mt-1 text-sm text-slate-500">يرجى التأكد من صحة البيانات قبل إرسال التحويل</p>
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
                  ["الحساب المصدر", "الحساب الجاري · **** 4412"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-slate-50 px-4 py-3">
                    <div className="text-[12px] text-slate-500">{k}</div>
                    <div className="mt-0.5 font-bold text-[#0a2c72]">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={requestPin}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0a2c72] px-6 py-3 font-bold text-white hover:bg-[#0d3a8a]"
                >
                  تأكيد وإرسال
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
                <div className="check-pop flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <IconCheck size={32} />
                </div>
                <h2 className="mt-3 text-xl font-extrabold text-[#0a2c72]">تم تنفيذ التحويل بنجاح</h2>
                <p className="text-sm text-slate-500">إيصال التحويل الدولي · مصرف الراجحي</p>
                <div className="mt-2 rounded-full bg-blue-50 px-4 py-1 text-sm font-bold text-[#1a5fbf]">
                  رقم المرجع: {refNo}
                </div>
              </div>
              <div className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-100">
                {[
                  ["المستفيد", beneficiary.name],
                  ["المصرف المستفيد", beneficiary.bank],
                  ["IBAN", beneficiary.iban],
                  ["المبلغ الإجمالي", `${formatMoney(amount)} SAR`],
                  ["الرسوم", `${formatMoney(fee)} SAR`],
                  ["المبلغ المرسل", `${formatMoney(sent)} SAR`],
                  ["المبلغ المستلم", `${formatMoney(received)} ${cur.code}`],
                  ["تاريخ التنفيذ", displayDate],
                  ["الحالة", "مكتمل"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-bold text-[#0a2c72]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0a2c72] px-5 py-2.5 font-bold text-white"
                >
                  <IconPrint size={16} /> طباعة الإيصال
                </button>
                <button
                  onClick={() => onToast("تم تجهيز ملف PDF للإيصال", "ok")}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#0a2c72] px-5 py-2.5 font-bold text-[#0a2c72]"
                >
                  <IconDownload size={16} /> تنزيل PDF
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setFeePaid(false);
                  }}
                  className="rounded-xl px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-50"
                >
                  تحويل جديد
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
                <span className="text-slate-500">المبلغ الإجمالي</span>
                <span className="font-extrabold text-[#0a2c72]">{formatMoney(amount)} SAR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">الرسوم</span>
                <span className="font-extrabold text-[#0a2c72]">{formatMoney(fee)} SAR</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-slate-500">المبلغ المرسل</span>
                <span className="font-extrabold text-[#0a2c72]">{formatMoney(sent)} SAR</span>
              </div>
            </div>
            <button
              onClick={startSend}
              disabled={step === 3}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a2c72] py-3 text-[14.5px] font-extrabold text-white shadow-md shadow-[#0a2c72]/25 hover:bg-[#0d3a8a] disabled:opacity-50"
            >
              إرسال التحويل
              <IconSend size={18} />
            </button>
            <button
              onClick={() => setCancelOpen(true)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0a2c72] bg-white py-3 text-[14.5px] font-extrabold text-[#0a2c72] hover:bg-slate-50"
            >
              إلغاء
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#0a2c72]">
                <IconX size={12} />
              </span>
            </button>
          </div>
        </aside>
      </div>

      {calOpen && (
        <Modal onClose={() => setCalOpen(false)} title="اختيار تاريخ التحويل">
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
            سيتم تحويلك إلى خطوة المراجعة والتأكيد قبل التنفيذ النهائي. المبلغ الإجمالي{" "}
            <b>
              {formatMoney(amount)} SAR
            </b>{" "}
            والمستفيد <b>{beneficiary.name}</b>.
          </p>
          <div className="mt-4 flex gap-2">
            <button onClick={goReview} className="flex-1 rounded-xl bg-[#0a2c72] py-2.5 font-bold text-white">
              متابعة
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

      {pinOpen && (
        <Modal onClose={() => !busy && setPinOpen(false)} title="أدخل الرقم السري">
          <p className="text-sm text-slate-500">للتجربة استخدم الرقم 1234</p>
          <div className="mt-4 flex justify-center gap-2" dir="ltr">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-12 w-12 rounded-xl border-2 text-center text-xl font-black leading-[46px] ${
                  pin[i] ? "border-[#0a2c72] bg-blue-50" : "border-slate-200"
                }`}
              >
                {pin[i] ? "•" : ""}
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2" dir="ltr">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK"].map((k) => (
              <button
                key={k}
                disabled={busy}
                onClick={() => {
                  if (k === "⌫") setPin((p) => p.slice(0, -1));
                  else if (k === "OK") submitPin();
                  else if (pin.length < 4) setPin((p) => p + k);
                }}
                className="rounded-xl bg-slate-50 py-3 font-bold hover:bg-blue-50 disabled:opacity-50"
              >
                {k}
              </button>
            ))}
          </div>
          {busy && <div className="mt-3 text-center text-sm text-blue-700">جاري تنفيذ التحويل...</div>}
        </Modal>
      )}

      {cancelOpen && (
        <Modal onClose={() => setCancelOpen(false)} title="إلغاء التحويل">
          <p className="text-sm text-slate-600">هل تريد إلغاء عملية التحويل الحالية؟</p>
          <div className="mt-4 flex gap-2">
            <button onClick={resetAll} className="flex-1 rounded-xl bg-red-600 py-2.5 font-bold text-white">
              نعم، إلغاء
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
