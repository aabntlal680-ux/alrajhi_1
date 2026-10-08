import { useEffect, useMemo, useRef, useState } from "react";
import type { PageId } from "../data";
import { NOTIFICATIONS, SERVICES } from "../data";
import {
  IconBell,
  IconCard,
  IconChart,
  IconCoins,
  IconGear,
  IconGlobe,
  IconHome,
  IconMenu,
  IconMoon,
  IconSun,
  IconPayments,
  IconPlus,
  IconSearch,
  IconTransfer,
  IconUser,
  IconWallet,
  IconX,
  LogoMark,
} from "../icons";

type Theme = "light" | "dark";

type Props = {
  current: PageId;
  onNavigate: (p: PageId) => void;
  theme: Theme;
  onToggleTheme: () => void;
  children: React.ReactNode;
};

const NAV: {
  id: PageId | "transfers";
  label: string;
  icon?: React.ReactNode;
  children?: { id: PageId; label: string; icon?: React.ReactNode; dot?: string }[];
}[] = [
  { id: "home", label: "الرئيسية", icon: <IconHome size={18} /> },
  {
    id: "transfers",
    label: "التحويلات",
    icon: <IconTransfer size={18} />,
    children: [
      { id: "intl-transfer", label: "تحويل دولي", icon: <IconGlobe size={18} /> },
      { id: "local-transfer", label: "تحويل محلي", dot: "#2dd4bf" },
      { id: "new-beneficiary", label: "تحويل مستفيد جديد", icon: <IconPlus size={16} /> },
    ],
  },
  { id: "accounts", label: "الحسابات", icon: <IconWallet size={18} /> },
  { id: "cards", label: "البطاقات", icon: <IconCard size={18} /> },
  { id: "payments", label: "المدفوعات", icon: <IconPayments size={18} /> },
  { id: "financing", label: "التمويل", icon: <IconCoins size={18} /> },
  { id: "eservices", label: "الخدمات الإلكترونية", icon: <IconGear size={18} /> },
  { id: "reports", label: "التقارير", icon: <IconChart size={18} /> },
  { id: "settings", label: "الإعدادات", icon: <IconGear size={18} /> },
];

export default function Layout({ current, onNavigate, theme, onToggleTheme, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const t = q.trim();
    if (!t) return SERVICES.slice(0, 6);
    return SERVICES.filter((s) => s.title.includes(t) || s.group.includes(t));
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [current]);

  const unread = notifs.filter((n) => n.unread).length;

  const goService = (id: string) => {
    const map: Record<string, PageId> = {
      "intl-transfer": "intl-transfer",
      "local-transfer": "local-transfer",
      "new-beneficiary": "new-beneficiary",
      accounts: "accounts",
      cards: "cards",
      payments: "payments",
      sadad: "payments",
      gov: "payments",
      financing: "financing",
      eservices: "eservices",
      cheque: "eservices",
      reports: "reports",
      settings: "settings",
    };
    onNavigate(map[id] ?? "home");
    setQ("");
    setSearchOpen(false);
  };

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#e9eef6] text-[#12305a]" dir="rtl">
      <header className="relative z-40 flex h-[64px] shrink-0 items-center gap-3 bg-[#0a2c72] px-3 text-white shadow-lg shadow-[#0a2c72]/30 sm:px-5">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="القائمة"
        >
          <IconMenu />
        </button>

        <div className="flex items-center gap-2.5">
          <LogoMark size={38} />
          <div className="hidden leading-tight sm:block">
            <div className="text-[17px] font-extrabold tracking-wide">مصرف الراجحي</div>
            <div className="text-[10px] text-blue-200/80">تصوّر غير رسمي · واجهة تجريبية</div>
          </div>
        </div>

        <div className="mx-auto hidden min-w-0 flex-1 justify-center sm:flex" ref={searchRef}>
          <div className="relative w-full max-w-[520px]">
            <IconSearch className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-blue-100" size={18} />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="البحث في الخدمات والمعاملات..."
              className="h-10 w-full rounded-full border border-white/15 bg-[#1a4a9c] pr-11 pl-4 text-[13.5px] text-white outline-none placeholder:text-blue-100/80 focus:ring-2 focus:ring-blue-300/50"
            />
            {searchOpen && (
              <div className="absolute top-[46px] right-0 left-0 overflow-hidden rounded-2xl border border-slate-100 bg-white text-[#12305a] shadow-2xl">
                <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">اقتراحات الخدمات</div>
                {results.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-400">لا توجد نتائج مطابقة</div>
                ) : (
                  results.map((s) => (
                    <button
                      key={s.id + s.title}
                      onClick={() => goService(s.id)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-right hover:bg-blue-50"
                    >
                      <span className="text-sm font-semibold">{s.title}</span>
                      <span className="text-[11px] text-slate-400">{s.group}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mr-auto flex items-center gap-1.5 sm:gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/90 hover:bg-white/10 sm:hidden"
            onClick={() => setMobileSearch(true)}
            aria-label="بحث"
          >
            <IconSearch size={20} />
          </button>
          <button
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/90 hover:bg-white/10"
            aria-label={theme === "dark" ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
            title={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
          >
            {theme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
          </button>
          <button
            onClick={() => onNavigate("settings")}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/90 hover:bg-white/10"
            aria-label="الإعدادات"
          >
            <IconGear size={20} />
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white/90 hover:bg-white/10"
              aria-label="التنبيهات"
            >
              <IconBell size={20} />
              {unread > 0 && (
                <span className="notif-pulse absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e53935] px-1 text-[9px] font-bold">
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute top-12 left-0 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-100 bg-white text-[#12305a] shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="font-bold">التنبيهات</span>
                  <button
                    className="text-xs text-blue-600"
                    onClick={() => setNotifs((n) => n.map((x) => ({ ...x, unread: false })))}
                  >
                    تعيين الكل كمقروء
                  </button>
                </div>
                {notifs.map((n) => (
                  <div key={n.id} className={`border-b border-slate-50 px-4 py-3 ${n.unread ? "bg-blue-50/60" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-bold">{n.title}</div>
                      {n.unread && <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">{n.body}</div>
                    <div className="mt-1 text-[11px] text-slate-400">{n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setUserOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl py-1 pr-1 pl-2 hover:bg-white/10"
          >
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-[12.5px] font-bold">مرحباً بك</div>
              <div className="text-[11px] text-blue-100/90">عميل المصرف</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <IconUser size={20} />
            </div>
          </button>
        </div>
      </header>

      <div role="note" className="flex shrink-0 flex-wrap items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs leading-5 text-amber-950">
        <span className="font-extrabold">تصوّر تجريبي غير رسمي:</span>
        <span>ليس تابعًا للمصرف ولا يتصل بأنظمته؛ لا تُنفّذ أي حوالات أو مدفوعات هنا. استخدم بيانات اصطناعية فقط، ولا تدخل كلمات مرور أو بيانات مصرفية حقيقية.</span>
      </div>

      <div className="flex min-h-0 flex-1">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`fixed top-[64px] right-0 z-50 flex h-[calc(100%-64px)] w-[250px] shrink-0 flex-col bg-[#0a2c72] text-white transition-transform duration-300 lg:static lg:z-0 lg:h-auto lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 lg:hidden">
            <span className="font-bold">القائمة</span>
            <button onClick={() => setSidebarOpen(false)}>
              <IconX />
            </button>
          </div>
          <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-6 pt-3">
            {NAV.map((item) => {
              if (item.children) {
                return (
                  <div key={item.id} className="pt-1">
                    <div className="mb-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-[13.5px] text-blue-100/90">
                      <span className="font-semibold">{item.label}</span>
                      <span className="opacity-80">{item.icon}</span>
                    </div>
                    <div className="space-y-1">
                      {item.children.map((ch) => {
                        const active = current === ch.id;
                        return (
                          <button
                            key={ch.id}
                            onClick={() => onNavigate(ch.id)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13.5px] transition ${
                              active ? "bg-[#1e6ad6] font-bold shadow-md shadow-black/10" : "hover:bg-white/10"
                            }`}
                          >
                            <span>{ch.label}</span>
                            {ch.dot ? (
                              <span className="h-2.5 w-2.5 rounded-full" style={{ background: ch.dot }} />
                            ) : (
                              <span className="opacity-90">{ch.icon}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as PageId)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13.5px] transition ${
                    active ? "bg-[#1e6ad6] font-bold shadow-md shadow-black/10" : "hover:bg-white/10"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="opacity-90">{item.icon}</span>
                </button>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-4 text-[11px] text-blue-100/70">
            نموذج واجهة غير رسمي · تجريبي
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5">{children}</main>
      </div>

      {mobileSearch && (
        <div className="fixed inset-0 z-[60] bg-black/40 p-3 sm:hidden" onClick={() => setMobileSearch(false)}>
          <div className="rounded-2xl bg-white p-3 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <IconSearch className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" size={18} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="البحث في الخدمات والمعاملات..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="mt-2 max-h-[50vh] overflow-auto">
              {results.length === 0 ? (
                <div className="px-2 py-6 text-center text-sm text-slate-400">لا توجد نتائج مطابقة</div>
              ) : (
                results.map((s) => (
                  <button
                    key={s.id + s.title}
                    onClick={() => {
                      goService(s.id);
                      setMobileSearch(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right hover:bg-blue-50"
                  >
                    <span className="text-sm font-semibold">{s.title}</span>
                    <span className="text-[11px] text-slate-400">{s.group}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {userOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-start bg-black/20 p-4 pt-16" onClick={() => setUserOpen(false)}>
          <div
            className="w-[280px] overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0a2c72] p-4 text-white">
              <div className="text-sm font-bold">عميل المصرف</div>
              <div className="text-xs text-blue-100">**** **** 4412</div>
            </div>
            <button
              className="w-full px-4 py-3 text-right text-sm hover:bg-slate-50"
              onClick={() => {
                setUserOpen(false);
                onNavigate("settings");
              }}
            >
              الملف الشخصي والإعدادات
            </button>
            <button
              className="w-full border-t border-slate-100 px-4 py-3 text-right text-sm text-red-600 hover:bg-red-50"
              onClick={() => setUserOpen(false)}
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
