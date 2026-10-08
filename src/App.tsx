import { useCallback, useEffect, useState } from "react";
import Layout from "./components/Layout";
import type { PageId } from "./data";
import Home from "./pages/Home";
import InternationalTransfer from "./pages/InternationalTransfer";
import {
  AccountsPage,
  CardsPage,
  EServicesPage,
  FinancingPage,
  LocalTransfer,
  NewBeneficiary,
  PaymentsPage,
  ReportsPage,
  SettingsPage,
} from "./pages/BankPages";

type Toast = { id: number; msg: string; type: "ok" | "err" | "info" };
export type Theme = "light" | "dark";
const THEME_KEY = "alrajhi-prototype:theme:v1";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    return window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export default function App() {
  const [page, setPage] = useState<PageId>("home");
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // The theme still applies for this session if browser storage is disabled.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const onToast = useCallback((msg: string, type: "ok" | "err" | "info" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, msg, type }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3200);
  }, []);

  return (
    <>
      <Layout current={page} onNavigate={setPage} theme={theme} onToggleTheme={toggleTheme}>
        {page === "home" && <Home onNavigate={setPage} />}
        {page === "intl-transfer" && <InternationalTransfer onToast={onToast} />}
        {page === "local-transfer" && <LocalTransfer onToast={onToast} />}
        {page === "new-beneficiary" && (
          <NewBeneficiary onToast={onToast} onSaved={setPage} />
        )}
        {page === "accounts" && <AccountsPage />}
        {page === "cards" && <CardsPage onToast={onToast} />}
        {page === "payments" && <PaymentsPage onToast={onToast} />}
        {page === "financing" && <FinancingPage />}
        {page === "eservices" && <EServicesPage onToast={onToast} />}
        {page === "reports" && <ReportsPage />}
        {page === "settings" && (
          <SettingsPage onToast={onToast} theme={theme} onToggleTheme={toggleTheme} />
        )}
      </Layout>

      <div className="pointer-events-none fixed bottom-4 left-4 z-[80] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg animate-slide-in ${
              toast.type === "ok" ? "bg-emerald-600" : toast.type === "err" ? "bg-red-600" : "bg-[#0a2c72]"
            }`}
          >
            {toast.msg}
          </div>
        ))}
      </div>
    </>
  );
}
