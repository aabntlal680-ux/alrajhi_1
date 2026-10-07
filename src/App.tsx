import { useCallback, useState } from "react";
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

export default function App() {
  const [page, setPage] = useState<PageId>("intl-transfer");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const onToast = useCallback((msg: string, type: "ok" | "err" | "info" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <>
      <Layout current={page} onNavigate={setPage}>
        {page === "home" && <Home onNavigate={setPage} />}
        {page === "intl-transfer" && <InternationalTransfer onToast={onToast} />}
        {page === "local-transfer" && <LocalTransfer onToast={onToast} />}
        {page === "new-beneficiary" && <NewBeneficiary onToast={onToast} />}
        {page === "accounts" && <AccountsPage />}
        {page === "cards" && <CardsPage onToast={onToast} />}
        {page === "payments" && <PaymentsPage onToast={onToast} />}
        {page === "financing" && <FinancingPage />}
        {page === "eservices" && <EServicesPage onToast={onToast} />}
        {page === "reports" && <ReportsPage />}
        {page === "settings" && <SettingsPage onToast={onToast} />}
      </Layout>

      <div className="pointer-events-none fixed bottom-4 left-4 z-[80] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg animate-slide-in ${
              t.type === "ok" ? "bg-emerald-600" : t.type === "err" ? "bg-red-600" : "bg-[#0a2c72]"
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
