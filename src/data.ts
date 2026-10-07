export type PageId =
  | "home"
  | "intl-transfer"
  | "local-transfer"
  | "new-beneficiary"
  | "accounts"
  | "cards"
  | "payments"
  | "financing"
  | "eservices"
  | "reports"
  | "settings";

export type Currency = {
  code: string;
  name: string;
  flag: string;
  rate: number;
};

export type Beneficiary = {
  id: string;
  name: string;
  idNumber: string;
  nationality: string;
  country: string;
  countryCode: string;
  bank: string;
  iban: string;
  currency: string;
};

export type Account = {
  id: string;
  name: string;
  type: string;
  number: string;
  iban: string;
  balance: number;
  currency: string;
  color: string;
};

export type Tx = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  type: "in" | "out";
  status: "success" | "pending" | "failed";
};

export const CURRENCIES: Currency[] = [
  { code: "AED", name: "درهم إماراتي", flag: "🇦🇪", rate: 0.9793 },
  { code: "USD", name: "دولار أمريكي", flag: "🇺🇸", rate: 0.2667 },
  { code: "EUR", name: "يورو", flag: "🇪🇺", rate: 0.2458 },
  { code: "GBP", name: "جنيه إسترليني", flag: "🇬🇧", rate: 0.2104 },
  { code: "KWD", name: "دينار كويتي", flag: "🇰🇼", rate: 0.0821 },
  { code: "BHD", name: "دينار بحريني", flag: "🇧🇭", rate: 0.1004 },
  { code: "QAR", name: "ريال قطري", flag: "🇶🇦", rate: 0.971 },
  { code: "OMR", name: "ريال عماني", flag: "🇴🇲", rate: 0.1026 },
  { code: "EGP", name: "جنيه مصري", flag: "🇪🇬", rate: 13.12 },
  { code: "INR", name: "روبية هندية", flag: "🇮🇳", rate: 22.18 },
];

export const BENEFICIARIES: Beneficiary[] = [
  {
    id: "b1",
    name: "كرامة سالم عوض آل عفيدر الراشدي",
    idNumber: "XXXXXXXXX",
    nationality: "الإمارات العربية المتحدة",
    country: "الإمارات",
    countryCode: "AE",
    bank: "بنك أبوظبي التجاري (الإمارات)",
    iban: "AE070331234567890123456",
    currency: "AED",
  },
  {
    id: "b2",
    name: "أحمد محمد عبدالله الكعبي",
    idNumber: "784199012345678",
    nationality: "الإمارات العربية المتحدة",
    country: "الإمارات",
    countryCode: "AE",
    bank: "بنك الإمارات دبي الوطني",
    iban: "AE450260001234567890123",
    currency: "AED",
  },
  {
    id: "b3",
    name: "فاطمة حسن علي المطيري",
    idNumber: "2841234567",
    nationality: "الكويت",
    country: "الكويت",
    countryCode: "KW",
    bank: "بنك الكويت الوطني",
    iban: "KW81CBKU0000000000001234560101",
    currency: "KWD",
  },
  {
    id: "b4",
    name: "يوسف عبدالرحمن الشمري",
    idNumber: "1098765432",
    nationality: "المملكة العربية السعودية",
    country: "السعودية",
    countryCode: "SA",
    bank: "البنك الأهلي السعودي",
    iban: "SA0380000000608010167519",
    currency: "SAR",
  },
];

export const ACCOUNTS: Account[] = [
  {
    id: "a1",
    name: "الحساب الجاري",
    type: "جاري",
    number: "358 **** **** 4412",
    iban: "SA03 8000 0000 6080 1016 7519",
    balance: 2450780.55,
    currency: "SAR",
    color: "from-[#0a2c72] to-[#1a5fbf]",
  },
  {
    id: "a2",
    name: "حساب الادخار",
    type: "ادخار",
    number: "358 **** **** 8821",
    iban: "SA35 8000 0000 6080 2219 3340",
    balance: 520340.0,
    currency: "SAR",
    color: "from-[#0e6b4a] to-[#22a06b]",
  },
  {
    id: "a3",
    name: "حساب الرواتب",
    type: "رواتب",
    number: "358 **** **** 1109",
    iban: "SA12 8000 0000 6080 0091 2287",
    balance: 18450.75,
    currency: "SAR",
    color: "from-[#7a4a12] to-[#d4a017]",
  },
];

export const TRANSACTIONS: Tx[] = [
  {
    id: "t1",
    title: "تحويل دولي - أبوظبي التجاري",
    subtitle: "كرامة سالم عوض آل عفيدر الراشدي",
    amount: -1000000,
    date: "2026/09/29",
    type: "out",
    status: "pending",
  },
  {
    id: "t2",
    title: "راتب شهري",
    subtitle: "شركة النور للتجارة",
    amount: 18500,
    date: "2026/09/27",
    type: "in",
    status: "success",
  },
  {
    id: "t3",
    title: "سداد فاتورة الكهرباء",
    subtitle: "الشركة السعودية للكهرباء",
    amount: -412.3,
    date: "2026/09/26",
    type: "out",
    status: "success",
  },
  {
    id: "t4",
    title: "تحويل محلي",
    subtitle: "يوسف عبدالرحمن الشمري",
    amount: -3500,
    date: "2026/09/25",
    type: "out",
    status: "success",
  },
  {
    id: "t5",
    title: "مشتريات مدى",
    subtitle: "كارفور - الرياض",
    amount: -286.9,
    date: "2026/09/24",
    type: "out",
    status: "success",
  },
  {
    id: "t6",
    title: "استرداد ضريبة",
    subtitle: "هيئة الزكاة والضريبة",
    amount: 1240,
    date: "2026/09/22",
    type: "in",
    status: "success",
  },
];

export const SERVICES = [
  { id: "intl-transfer", title: "تحويل دولي", group: "التحويلات" },
  { id: "local-transfer", title: "تحويل محلي", group: "التحويلات" },
  { id: "new-beneficiary", title: "تحويل مستفيد جديد", group: "التحويلات" },
  { id: "accounts", title: "الحسابات", group: "الحسابات" },
  { id: "cards", title: "البطاقات", group: "البطاقات" },
  { id: "payments", title: "المدفوعات", group: "المدفوعات" },
  { id: "sadad", title: "سداد الفواتير", group: "المدفوعات" },
  { id: "gov", title: "المدفوعات الحكومية", group: "المدفوعات" },
  { id: "financing", title: "التمويل", group: "التمويل" },
  { id: "eservices", title: "شهادة الآيبان", group: "الخدمات الإلكترونية" },
  { id: "cheque", title: "طلب دفتر شيكات", group: "الخدمات الإلكترونية" },
  { id: "reports", title: "كشف الحساب", group: "التقارير" },
  { id: "settings", title: "الإعدادات", group: "الإعدادات" },
];

export const NOTIFICATIONS = [
  {
    id: "n1",
    title: "رسوم تحويل غير محصّلة",
    body: "يلزم تحصيل رسوم تفعيل التحويل الدولي إلى الإمارات بقيمة 1,260.00 ريال.",
    time: "منذ 12 دقيقة",
    unread: true,
  },
  {
    id: "n2",
    title: "تم إيداع الراتب",
    body: "تم إيداع مبلغ 18,500.00 ريال في حسابك الجاري.",
    time: "أمس",
    unread: true,
  },
  {
    id: "n3",
    title: "تحديث أمني",
    body: "يرجى تفعيل التحقق بخطوتين لحماية حسابك.",
    time: "منذ يومين",
    unread: false,
  },
];

export const BILLS = [
  { id: "bill1", name: "الشركة السعودية للكهرباء", ref: "3012458891", amount: 412.3, due: "2026/10/05" },
  { id: "bill2", name: "المياه الوطنية", ref: "88214511", amount: 96.5, due: "2026/10/08" },
  { id: "bill3", name: "stc", ref: "0551234567", amount: 199.0, due: "2026/10/02" },
  { id: "bill4", name: "موبايلي", ref: "0569876543", amount: 150.0, due: "2026/10/12" },
];

export function formatMoney(n: number, digits = 2) {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return n < 0 ? `-${formatted}` : formatted;
}

export function calcFee(amount: number) {
  const fee = Math.round(amount * 0.00126 * 100) / 100;
  return Math.max(fee, 0);
}
